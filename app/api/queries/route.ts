import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { analyzeCases } from '@/lib/openai'
import { calculateSimilarity } from '@/lib/utils'
import type { MatchedCase } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const queryId = searchParams.get('id')

    if (queryId) {
      const query = await prisma.query.findUnique({
        where: { id: queryId },
        include: { user: true },
      })

      if (!query) {
        return NextResponse.json({ error: 'Query not found' }, { status: 404 })
      }

      if (query.userId && query.userId !== (session?.user as any)?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }

      return NextResponse.json(query)
    }

    const queries = await prisma.query.findMany({
      where: { userId: session?.user ? (session.user as any).id : undefined },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json(queries)
  } catch (error) {
    console.error('Error fetching queries:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, description, location, incidentDate, severity, contextFlags } = body

    if (!category || !description || !severity) {
      return NextResponse.json(
        { error: 'Category, description, and severity are required' },
        { status: 400 }
      )
    }

    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'

    const query = await prisma.query.create({
      data: {
        userId: null,
        category,
        description,
        location: location || null,
        incidentDate: incidentDate ? new Date(incidentDate) : null,
        severity,
        contextFlags: contextFlags ? JSON.stringify(contextFlags) : null,
        status: 'PROCESSING',
        ipAddress,
      },
    })

    const cases = await prisma.case.findMany({
      where: {
        OR: [
          { category },
          { keywords: { contains: category.toLowerCase() } },
        ],
      },
    })

    const matchedCases: MatchedCase[] = cases
      .map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        jurisdiction: c.jurisdiction,
        summary: c.summary,
        outcome: c.outcome as 'Favorable' | 'Unfavorable' | 'Settled' | 'Ongoing',
        reasoning: c.reasoning,
        year: c.year,
        citations: c.citations,
        similarity: calculateSimilarity(description, c.summary + ' ' + c.reasoning),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10)

    const analysis = await analyzeCases(description, category, location, severity, matchedCases)

    const updatedQuery = await prisma.query.update({
      where: { id: query.id },
      data: {
        matchedCases: JSON.stringify(matchedCases),
        aiSummary: analysis.summary,
        aiRecommendations: JSON.stringify(analysis.recommendations),
        riskAssessment: JSON.stringify(analysis.riskAssessment),
        status: 'COMPLETED',
      },
    })

    return NextResponse.json(updatedQuery)
  } catch (error) {
    console.error('Error creating query:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const queryId = searchParams.get('id')

    if (!queryId) {
      return NextResponse.json({ error: 'Query ID required' }, { status: 400 })
    }

    const query = await prisma.query.findUnique({
      where: { id: queryId },
    })

    if (!query) {
      return NextResponse.json({ error: 'Query not found' }, { status: 404 })
    }

    if (query.userId !== (session?.user as any)?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.query.delete({
      where: { id: queryId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting query:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
