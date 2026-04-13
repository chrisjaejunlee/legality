'use client'

import { useState } from 'react'
import { Car, Shield, Home, Briefcase, FileText, HelpCircle, ChevronDown, ChevronUp, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { MatchedCase } from '@/types'

interface CaseCardProps {
  caseData: MatchedCase
  onSave?: (id: string) => void
  isSaved?: boolean
  expanded?: boolean
}

export function CaseCard({ caseData, onSave, isSaved = false, expanded = false }: CaseCardProps) {
  const [isExpanded, setIsExpanded] = useState(expanded)

  const categoryIcons: Record<string, React.ReactNode> = {
    'Car Accident': <Car className="w-5 h-5" />,
    'Self-Defense': <Shield className="w-5 h-5" />,
    'Property Dispute': <Home className="w-5 h-5" />,
    'Employment Issue': <Briefcase className="w-5 h-5" />,
    'Contract Issue': <FileText className="w-5 h-5" />,
    Other: <HelpCircle className="w-5 h-5" />,
  }

  const outcomeColors: Record<string, string> = {
    Favorable: 'bg-accent-100 text-accent-700 border-accent-200',
    Unfavorable: 'bg-red-100 text-red-700 border-red-200',
    Settled: 'bg-blue-100 text-blue-700 border-blue-200',
    Ongoing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary-50 text-primary rounded-lg">
                {categoryIcons[caseData.category] || <HelpCircle className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-semibold text-primary leading-tight">{caseData.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                  <MapPin className="w-3 h-3" />
                  <span>{caseData.jurisdiction}</span>
                  <span>•</span>
                  <span>{caseData.year}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={cn(
                  'px-2.5 py-0.5 rounded-full text-xs font-medium border',
                  outcomeColors[caseData.outcome] || 'bg-slate-100 text-slate-700'
                )}
              >
                {caseData.outcome}
              </span>
              <span className="text-xs text-slate-500">
                {caseData.similarity}% similar
              </span>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-base text-slate-600 leading-relaxed">
              {isExpanded ? caseData.summary : truncateText(caseData.summary, 200)}
            </p>
            {caseData.summary.length > 200 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm text-secondary hover:text-secondary-600 font-medium mt-2 flex items-center gap-1"
              >
                {isExpanded ? (
                  <>
                    Show less <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Read more <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>

          {isExpanded && (
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-semibold text-slate-800 mb-2">Key Reasoning</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{caseData.reasoning}</p>
              {caseData.citations && (
                <p className="text-xs text-slate-500 mt-2">
                  <strong>Citation:</strong> {caseData.citations}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Badge variant="default" className="bg-slate-100 text-slate-600">
              Similarity: {caseData.similarity}%
            </Badge>
            {onSave && (
              <button
                onClick={() => onSave(caseData.id)}
                className={cn(
                  'text-sm font-medium transition-colors',
                  isSaved
                    ? 'text-accent-600'
                    : 'text-secondary hover:text-secondary-600'
                )}
              >
                {isSaved ? 'Saved' : 'Save Case'}
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
