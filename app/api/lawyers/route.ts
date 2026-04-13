import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const specialty = searchParams.get('specialty')
    const location = searchParams.get('location')

    const where: any = {}

    if (specialty) {
      where.specialties = { contains: specialty }
    }

    if (location) {
      where.location = { contains: location }
    }

    const lawyers = await prisma.lawyer.findMany({
      where,
      orderBy: [
        { rating: 'desc' },
        { reviewCount: 'desc' },
      ],
      take: 20,
    })

    return NextResponse.json(lawyers)
  } catch (error) {
    console.error('Error fetching lawyers:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { lawyerId } = body

    if (!lawyerId) {
      return NextResponse.json({ error: 'Lawyer ID required' }, { status: 400 })
    }

    const connection = await prisma.lawyerConnection.create({
      data: {
        userId: (session.user as any).id,
        lawyerId,
      },
      include: {
        lawyer: true,
      },
    })

    return NextResponse.json(connection)
  } catch (error) {
    console.error('Error creating connection:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
