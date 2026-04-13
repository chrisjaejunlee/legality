'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Gavel, AlertTriangle } from 'lucide-react'
import { QueryForm } from '@/components/features/query-form'
import type { QueryFormData } from '@/components/features/query-form'
import { useToast } from '@/components/ui/toast'

export default function NewQueryPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: QueryFormData) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create query')
      }

      const result = await response.json()
      addToast('success', 'Analysis complete!')
      router.push(`/query/${result.id}`)
    } catch (error) {
      addToast('error', 'Failed to process your query. Please try again.')
      setIsLoading(false)
    }
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
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg mb-6">
            <Gavel className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Describe Your Legal Situation
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Tell us what happened, and we will analyze similar cases to provide personalized guidance on next steps.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
          
          <QueryForm onSubmit={handleSubmit} isLoading={isLoading} />

          {isLoading && (
            <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
                <p className="text-lg font-medium text-slate-700">Analyzing your situation...</p>
                <p className="text-sm text-slate-500 mt-1">This may take a few seconds</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">Important Disclaimer</h3>
              <p className="text-sm text-amber-800">
                This service provides educational information only, not legal advice. 
                The analysis is based on similar cases and should not be considered a substitute 
                for consulting a licensed attorney. Laws vary by jurisdiction and your specific circumstances matter.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}