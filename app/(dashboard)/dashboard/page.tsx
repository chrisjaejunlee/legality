'use client'

import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PlusCircle, Clock, FileText, Users, ArrowRight, TrendingUp, AlertCircle } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DisclaimerBanner } from '@/components/ui/disclaimer'
import { formatRelativeDate } from '@/lib/utils'

interface RecentQuery {
  id: string
  category: string
  description: string
  severity: string
  status: string
  createdAt: string
}

interface Stats {
  totalQueries: number
  savedCases: number
  lawyerConnections: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [queries, setQueries] = React.useState<RecentQuery[]>([])
  const [stats, setStats] = React.useState<Stats>({ totalQueries: 0, savedCases: 0, lawyerConnections: 0 })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    async function fetchData() {
      if (session?.user) {
        try {
          const response = await fetch('/api/queries')
          if (response.ok) {
            const data = await response.json()
            setQueries(data.slice(0, 5))
          }
        } catch (error) {
          console.error('Error fetching queries:', error)
        }
      }
    }
    fetchData()
  }, [session])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  const isPremium = (session.user as any)?.subscription === 'PREMIUM'

  const severityColors: Record<string, string> = {
    Emergency: 'bg-red-100 text-red-700',
    High: 'bg-orange-100 text-orange-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-green-100 text-green-700',
  }

  return (
    <>
      <DisclaimerBanner />
      <Sidebar>
        <div className="w-full pb-20 lg:pb-8">
          {/* Dashboard Hero Banner */}
          <div className="relative rounded-2xl overflow-hidden mb-8 shadow-sm">
            <div className="absolute inset-0">
               <img src="/images/hero_office.png" alt="Law Office Dashboard" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-slate-900/75 mix-blend-multiply" />
            </div>
            <div className="relative z-10 p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back, {(session.user as any)?.name?.split(' ')[0] || 'there'}!
                  </h1>
                  <p className="text-slate-200 max-w-xl text-lg">
                    Manage your legal queries, review AI assessments, and connect with 
                    specialized attorneys right from your command center.
                  </p>
                </div>
                <Link href="/query/new" className="shrink-0">
                  <Button size="lg" className="w-full md:w-auto bg-white text-slate-900 hover:bg-slate-50 transition-colors shadow-lg hover:shadow-xl">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    New Query
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* 2-Column Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (Main Content) */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-primary">Recent Queries</h2>
                  {queries.length > 0 && (
                    <Link href="/query/history" className="text-sm text-secondary hover:underline font-medium">
                      View all
                    </Link>
                  )}
                </div>

                {queries.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-800 mb-2">No queries yet</h3>
                      <p className="text-slate-500 mb-6">
                        Start by describing your legal situation to get AI-powered insights.
                      </p>
                      <Link href="/query/new">
                        <Button>
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Create Your First Query
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {queries.map((query) => (
                      <Link key={query.id} href={`/query/${query.id}`}>
                        <Card hoverable className="border-slate-200">
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-semibold text-primary">{query.category}</span>
                                  <Badge className={severityColors[query.severity]}>
                                    {query.severity}
                                  </Badge>
                                </div>
                                <p className="text-slate-600 line-clamp-2 leading-relaxed">
                                  {query.description}
                                </p>
                                <p className="text-xs text-slate-400 mt-3 font-medium">
                                  <Clock className="w-3 h-3 inline mr-1" />
                                  {formatRelativeDate(query.createdAt)}
                                </p>
                              </div>
                              <ArrowRight className="w-5 h-5 text-slate-300 flex-shrink-0 mt-2" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column (Sidebar Information) */}
            <div className="space-y-6">
              
              {/* Stats Layout */}
              <div className="grid grid-cols-1 gap-4">
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary-50 rounded-xl flex-shrink-0">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">{queries.length}</p>
                        <p className="text-sm font-medium text-slate-500">Total Queries</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-5 text-center">
                      <div className="w-10 h-10 mx-auto bg-accent-50 rounded-full flex items-center justify-center mb-2">
                        <TrendingUp className="w-5 h-5 text-accent-500" />
                      </div>
                      <p className="text-2xl font-bold text-primary">{stats.savedCases}</p>
                      <p className="text-xs font-medium text-slate-500 line-clamp-1">Saved Cases</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-5 text-center">
                      <div className="w-10 h-10 mx-auto bg-secondary-50 rounded-full flex items-center justify-center mb-2">
                        <Users className="w-5 h-5 text-secondary" />
                      </div>
                      <p className="text-2xl font-bold text-primary">{stats.lawyerConnections}</p>
                      <p className="text-xs font-medium text-slate-500 line-clamp-1">Connections</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {!isPremium && (
                <Card className="bg-gradient-to-br from-primary to-secondary-600 text-white border-0 shadow-md">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Upgrade to Premium</h3>
                    <p className="text-primary-100 text-sm mb-4 leading-relaxed">
                      Get faster responses, cross-region case access, and priority lawyer matching.
                    </p>
                    <Button variant="secondary" className="w-full bg-white text-primary hover:bg-slate-50 font-semibold shadow-sm">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              )}

              <div>
                <h2 className="text-lg font-semibold text-primary mb-3">Quick Actions</h2>
                <div className="grid grid-cols-1 gap-3">
                  <Link href="/lawyers">
                    <Card hoverable className="h-full">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-accent-50 rounded-xl flex-shrink-0">
                          <Users className="w-5 h-5 text-accent-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-primary">Find a Lawyer</h3>
                          <p className="text-sm text-slate-500 truncate">Browse qualified attorneys</p>
                        </div>
                        <ArrowRight className="w-4 h-4 ml-auto text-slate-300 flex-shrink-0" />
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/query/history">
                    <Card hoverable className="h-full">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-secondary-50 rounded-xl flex-shrink-0">
                          <Clock className="w-5 h-5 text-secondary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-primary">Query History</h3>
                          <p className="text-sm text-slate-500 truncate">Review past assessments</p>
                        </div>
                        <ArrowRight className="w-4 h-4 ml-auto text-slate-300 flex-shrink-0" />
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </Sidebar>
    </>
  )
}
