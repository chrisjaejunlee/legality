'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Gavel } from 'lucide-react'
import { LawyerCard } from '@/components/features/lawyer-card'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LawyerCardSkeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import { CATEGORIES, JURISDICTIONS } from '@/types'
import type { Lawyer } from '@/types'

export default function LawyersPage() {
  const router = useRouter()
  const { addToast } = useToast()

  const [lawyers, setLawyers] = useState<Lawyer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')

  useEffect(() => {
    async function fetchLawyers() {
      try {
        let url = '/api/lawyers'
        const params = new URLSearchParams()
        if (specialtyFilter) params.append('specialty', specialtyFilter)
        if (locationFilter) params.append('location', locationFilter)
        if (params.toString()) url += `?${params.toString()}`

        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          setLawyers(data)
        }
      } catch (error) {
        addToast('error', 'Failed to load lawyers')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLawyers()
  }, [specialtyFilter, locationFilter])

  const handleConnectLawyer = (lawyerId: string) => {
    addToast('info', 'Contact information available in lawyer profile')
  }

  const filteredLawyers = lawyers.filter((lawyer) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      lawyer.name.toLowerCase().includes(searchLower) ||
      lawyer.firm.toLowerCase().includes(searchLower) ||
      lawyer.specialties.toLowerCase().includes(searchLower)
    )
  })

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

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg mb-4">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Find a Lawyer</h1>
          <p className="text-lg text-slate-600">
            Browse qualified attorneys in your area, filtered by specialty and experience.
          </p>
        </div>

        <Card className="mb-8 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search lawyers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
              >
                <option value="">All Specialties</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
              >
                <option value="">All Locations</option>
                {JURISDICTIONS.map((j) => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-4">
            <LawyerCardSkeleton />
            <LawyerCardSkeleton />
            <LawyerCardSkeleton />
          </div>
        ) : filteredLawyers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">No lawyers found</h3>
              <p className="text-slate-500">Try adjusting your filters or search terms.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredLawyers.map((lawyer) => (
              <LawyerCard
                key={lawyer.id}
                lawyer={lawyer}
                onConnect={handleConnectLawyer}
              />
            ))}
          </div>
        )}

        <div className="mt-10 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl">
          <h3 className="font-semibold text-amber-900 mb-2">Important Notice</h3>
          <p className="text-sm text-amber-800">
            Connecting with a lawyer through Legality does not create an attorney-client relationship. 
            This is an introduction service only. Always verify credentials and consult directly 
            with attorneys before engaging their services.
          </p>
        </div>
      </main>
    </div>
  )
}