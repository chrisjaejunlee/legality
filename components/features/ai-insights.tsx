'use client'

import { useState } from 'react'
import { Brain, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Recommendation, RiskAssessment } from '@/types'

interface AIInsightsProps {
  summary: string
  recommendations: Recommendation[]
  riskAssessment: RiskAssessment
}

export function AIInsights({ summary, recommendations, riskAssessment }: AIInsightsProps) {
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    recommendations: true,
    risk: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const importanceColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    important: 'bg-red-100 text-red-700',
  }

  const riskColors = {
    Low: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: 'text-green-600' },
    Medium: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: 'text-yellow-600' },
    High: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: 'text-red-600' },
  }

  const riskColor = riskColors[riskAssessment.level]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-secondary" />
        <h2 className="text-lg font-semibold text-primary">AI Analysis</h2>
        <Badge variant="info" className="ml-auto">
          Based on similar cases
        </Badge>
      </div>

      <Card>
        <CardHeader
          className="cursor-pointer py-3"
          onClick={() => toggleSection('summary')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="font-medium">Case Summary</span>
            </div>
            {expandedSections.summary ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </CardHeader>
        {expandedSections.summary && (
          <CardContent>
            <div className="prose prose-base max-w-none">
              {summary.split('\n').map((paragraph, i) => (
                <p key={i} className="text-slate-600 leading-relaxed mb-3 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader
          className="cursor-pointer py-3"
          onClick={() => toggleSection('recommendations')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent-500" />
              <span className="font-medium">Recommended Next Steps</span>
            </div>
            {expandedSections.recommendations ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </CardHeader>
        {expandedSections.recommendations && (
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-slate-800">{rec.action}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${importanceColors[rec.importance]}`}>
                        {rec.importance}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{rec.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      <Card className={`${riskColor.bg} ${riskColor.border} border`}>
        <CardHeader
          className="cursor-pointer py-3"
          onClick={() => toggleSection('risk')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${riskColor.icon}`} />
              <span className="font-medium">Risk Assessment</span>
            </div>
            {expandedSections.risk ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </CardHeader>
        {expandedSections.risk && (
          <CardContent>
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-2xl font-bold ${riskColor.text}`}>
                {riskAssessment.level}
              </span>
              <span className={`text-sm ${riskColor.text}`}>
                Liability Risk
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-4">{riskAssessment.explanation}</p>
            <div>
              <h4 className="text-sm font-medium text-slate-800 mb-2">Potential Consequences</h4>
              <ul className="space-y-1">
                {riskAssessment.potentialConsequences.map((consequence, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-slate-400">•</span>
                    {consequence}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <strong>Important:</strong> This analysis is generated by AI based on similar cases and
          should not be considered legal advice. Please consult with a licensed attorney for
          guidance specific to your situation.
        </p>
      </div>
    </div>
  )
}
