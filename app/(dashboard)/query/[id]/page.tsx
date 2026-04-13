'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Phone, ChevronRight, MapPin, Calendar, Gavel, CheckCircle } from 'lucide-react'
import { CaseCard } from '@/components/features/case-card'
import { AIInsights } from '@/components/features/ai-insights'
import { LawyerCard } from '@/components/features/lawyer-card'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CaseCardSkeleton, LawyerCardSkeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import type { MatchedCase, Recommendation, RiskAssessment, Lawyer } from '@/types'

interface QueryData {
  id: string
  category: string
  description: string
  location: string | null
  incidentDate: string | null
  severity: string
  contextFlags: string | null
  aiSummary: string | null
  aiRecommendations: string | null
  riskAssessment: string | null
  matchedCases: string | null
  status: string
  createdAt: string
}

export default function QueryResultsPage() {
  const router = useRouter()
  const params = useParams()
  const { addToast } = useToast()
  const [query, setQuery] = useState<QueryData | null>(null)
  const [lawyers, setLawyers] = useState<Lawyer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [savedCases, setSavedCases] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'cases' | 'lawyers'>('cases')

  useEffect(() => {
    async function fetchQuery() {
      if (!params.id || typeof params.id !== 'string') return

      try {
        const response = await fetch(`/api/queries?id=${params.id}`)
        if (!response.ok) {
          throw new Error('Query not found')
        }
        const data = await response.json()
        setQuery(data)
      } catch (error) {
        addToast('error', 'Failed to load query results')
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchQuery()
    }
  }, [params.id, router, addToast])

  useEffect(() => {
    async function fetchLawyers() {
      if (!query?.category) return
      try {
        const response = await fetch(`/api/lawyers?specialty=${query.category}`)
        if (response.ok) {
          const data = await response.json()
          setLawyers(data.slice(0, 5))
        }
      } catch (error) {
        console.error('Error fetching lawyers:', error)
      }
    }

    if (query?.category) {
      fetchLawyers()
    }
  }, [query?.category])

  const handleSaveCase = (caseId: string) => {
    setSavedCases((prev) =>
      prev.includes(caseId) ? prev.filter((id) => id !== caseId) : [...prev, caseId]
    )
    addToast('success', savedCases.includes(caseId) ? 'Case removed' : 'Case saved')
  }

  const handleConnectLawyer = (lawyerId: string) => {
    addToast('info', 'Contact information available in lawyer profile')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="h-10 w-32 bg-slate-200 rounded animate-pulse" />
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
          <CaseCardSkeleton />
          <CaseCardSkeleton />
          <LawyerCardSkeleton />
        </div>
      </div>
    )
  }

  if (!query) {
    return null
  }

  const matchedCases: MatchedCase[] = query.matchedCases
    ? JSON.parse(query.matchedCases)
    : []

  const recommendations: Recommendation[] = query.aiRecommendations
    ? JSON.parse(query.aiRecommendations)
    : []

  const riskAssessment: RiskAssessment | null = query.riskAssessment
    ? JSON.parse(query.riskAssessment)
    : null

  const severityColors: Record<string, string> = {
    Emergency: 'bg-red-100 text-red-700 border-red-200',
    High: 'bg-orange-100 text-orange-700 border-orange-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Low: 'bg-green-100 text-green-700 border-green-200',
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Gavel className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Legality</span>
            </Link>
            <Link href="/query/new">
              <Button>New Query</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 pb-32">
        <Link
          href="/query/new"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Start New Query
        </Link>

        <Card className="mb-6 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <Badge className={severityColors[query.severity] + ' px-3 py-1'}>
                {query.severity} Severity
              </Badge>
              <Badge variant="default" className="px-3 py-1">{query.category}</Badge>
              {query.location && (
                <Badge variant="default" className="px-3 py-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {query.location}
                </Badge>
              )}
              {query.incidentDate && (
                <Badge variant="default" className="px-3 py-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(query.incidentDate).toLocaleDateString()}
                </Badge>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              {query.category} Analysis Results
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">{query.description}</p>
          </CardContent>
        </Card>

        {query.aiSummary && riskAssessment && (
          <Card className="mb-8 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-accent-500 to-secondary-500" />
            <CardContent className="p-6 md:p-8">
              <AIInsights
                summary={query.aiSummary}
                recommendations={recommendations}
                riskAssessment={riskAssessment}
              />
            </CardContent>
          </Card>
        )}

        <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1 max-w-md mb-6 shadow-sm">
          <button
            onClick={() => setActiveTab('cases')}
            className={`flex-1 py-3 px-5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'cases'
                ? 'bg-gradient-to-r from-primary to-primary-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Similar Cases ({matchedCases.length})
          </button>
          <button
            onClick={() => setActiveTab('lawyers')}
            className={`flex-1 py-3 px-5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'lawyers'
                ? 'bg-gradient-to-r from-primary to-primary-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Lawyers ({lawyers.length})
          </button>
        </div>

        <div className="space-y-6">
          {activeTab === 'cases' && (
            <div className="space-y-4">
              {matchedCases.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-slate-500">No similar cases found.</p>
                  </CardContent>
                </Card>
              ) : (
                matchedCases.map((caseData) => (
                  <CaseCard
                    key={caseData.id}
                    caseData={caseData}
                    onSave={handleSaveCase}
                    isSaved={savedCases.includes(caseData.id)}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'lawyers' && (
            <div className="grid md:grid-cols-2 gap-4">
              {lawyers.map((lawyer) => (
                <LawyerCard
                  key={lawyer.id}
                  lawyer={lawyer}
                  onConnect={handleConnectLawyer}
                />
              ))}
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg shadow-slate-200/50">
          <div className="max-w-4xl mx-auto px-4 py-4 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="danger"
              onClick={() => window.open('tel:911')}
              className="flex items-center gap-2 shadow-lg"
            >
              <Phone className="w-4 h-4" />
              Call 911
            </Button>
            <Link href="/lawyers">
              <Button variant="primary" className="flex items-center gap-2 shadow-lg">
                Find a Lawyer
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                const url = window.location.href;
                navigator.clipboard.writeText(url);
                addToast('success', 'Link copied to clipboard');
              }}
              className="flex items-center gap-2"
            >
              Share Results
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}