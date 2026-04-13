'use client'

import { useState } from 'react'
import { Car, Shield, Home, Briefcase, FileText, HelpCircle, MapPin, Calendar, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Textarea, Select } from '@/components/ui/input'
import { CATEGORIES, SEVERITY_LEVELS } from '@/types'
import { cn } from '@/lib/utils'

export interface QueryFormProps {
  onSubmit: (data: QueryFormData) => void
  isLoading?: boolean
}

export interface QueryFormData {
  category: string
  description: string
  location: string
  incidentDate: string
  severity: string
  contextFlags: string[]
}

const categoryIcons: Record<string, React.ReactNode> = {
  'Car Accident': <Car className="w-5 h-5" />,
  'Self-Defense': <Shield className="w-5 h-5" />,
  'Property Dispute': <Home className="w-5 h-5" />,
  'Employment Issue': <Briefcase className="w-5 h-5" />,
  'Contract Issue': <FileText className="w-5 h-5" />,
  Other: <HelpCircle className="w-5 h-5" />,
}

const severityColors: Record<string, { bg: string; border: string; text: string; ring: string }> = {
  Emergency: {
    bg: 'bg-red-50',
    border: 'border-red-300',
    text: 'text-red-700',
    ring: 'ring-red-500',
  },
  High: {
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    text: 'text-orange-700',
    ring: 'ring-orange-500',
  },
  Medium: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    text: 'text-yellow-700',
    ring: 'ring-yellow-500',
  },
  Low: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    text: 'text-green-700',
    ring: 'ring-green-500',
  },
}

export function QueryForm({ onSubmit, isLoading = false }: QueryFormProps) {
  const [formData, setFormData] = useState<QueryFormData>({
    category: '',
    description: '',
    location: '',
    incidentDate: '',
    severity: '',
    contextFlags: [],
  })
  const [errors, setErrors] = useState<Partial<Record<keyof QueryFormData, string>>>({})
  const [showEmergencyWarning, setShowEmergencyWarning] = useState(false)

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof QueryFormData, string>> = {}

    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }
    if (!formData.description || formData.description.length < 50) {
      newErrors.description = 'Please describe your situation in at least 50 characters'
    }
    if (!formData.severity) {
      newErrors.severity = 'Please select a severity level'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted, data:', formData)
    console.log('Category:', formData.category)
    console.log('Description length:', formData.description.length)
    console.log('Severity:', formData.severity)
    console.log('Disabled check:', !formData.category || formData.description.length < 50 || !formData.severity)
    
    if (formData.severity === 'Emergency') {
      setShowEmergencyWarning(true)
      return
    }
    if (validate()) {
      onSubmit(formData)
    }
  }

  const handleEmergencyConfirm = () => {
    if (validate()) {
      setShowEmergencyWarning(false)
      onSubmit(formData)
    }
  }

  const handleChange = (field: keyof QueryFormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const toggleContextFlag = (flag: string) => {
    setFormData((prev) => ({
      ...prev,
      contextFlags: prev.contextFlags.includes(flag)
        ? prev.contextFlags.filter((f) => f !== flag)
        : [...prev.contextFlags, flag],
    }))
  }

  const contextFlags = [
    { id: 'police', label: 'Police involved' },
    { id: 'insurance', label: 'Insurance involved' },
    { id: 'witnesses', label: 'Witnesses present' },
    { id: 'documentation', label: 'Documentation available' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          What type of legal situation are you facing? <span className="text-danger">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleChange('category', category)}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                formData.category === category
                  ? 'border-primary bg-primary-50 text-primary'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              )}
            >
              {categoryIcons[category]}
              <span className="text-sm font-medium text-center">{category}</span>
            </button>
          ))}
        </div>
        {errors.category && <p className="text-sm text-danger mt-2">{errors.category}</p>}
      </div>

      <Textarea
        label="Describe what happened"
        placeholder="Describe your situation in detail. Include when, where, and who was involved. The more information you provide, the better we can help you find relevant cases and guidance..."
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        error={errors.description}
        required
        className="min-h-[150px] text-lg"
      />
      <p className="text-xs text-slate-500 -mt-3">
        {formData.description.length} / 2000 characters (minimum 50)
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Location"
          placeholder="City, State (optional)"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          icon={<MapPin className="w-4 h-4" />}
        />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">
            Incident date
          </label>
          <input
            type="date"
            value={formData.incidentDate}
            onChange={(e) => handleChange('incidentDate', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border border-slate-200 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          How serious is the situation? <span className="text-danger">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SEVERITY_LEVELS.map((level) => {
            const colors = severityColors[level]
            const isSelected = formData.severity === level
            return (
              <button
                key={level}
                type="button"
                onClick={() => handleChange('severity', level)}
                className={cn(
                  'p-4 rounded-lg border-2 text-center transition-all',
                  colors.bg,
                  isSelected ? `${colors.border} ring-2 ${colors.ring}` : `border-transparent`,
                  colors.text
                )}
              >
                {level === 'Emergency' && <AlertTriangle className="w-5 h-5 mx-auto mb-1" />}
                <span className="font-medium">{level}</span>
              </button>
            )
          })}
        </div>
        {errors.severity && <p className="text-sm text-danger mt-2">{errors.severity}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Additional context (optional)
        </label>
        <div className="flex flex-wrap gap-3">
          {contextFlags.map((flag) => (
            <button
              key={flag.id}
              type="button"
              onClick={() => toggleContextFlag(flag.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                formData.contextFlags.includes(flag.id)
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {flag.label}
            </button>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={isLoading}
      >
        {formData.severity === 'Emergency' ? (
          <>
            <AlertTriangle className="w-5 h-5 mr-2" />
            Get Emergency Guidance
          </>
        ) : (
          'Analyze My Situation'
        )}
      </Button>

      {showEmergencyWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEmergencyWarning(false)} />
          <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-md w-full animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary">Emergency Detected</h3>
            </div>
            <p className="text-slate-600 mb-4">
              You've indicated this is an <strong>emergency</strong> situation. If there is immediate danger,
              please <strong>call 911</strong> first.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-800">
                <strong>For immediate emergencies:</strong> Call 911 or your local emergency number.
                This app provides information only, not emergency response.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="danger" className="flex-1" onClick={() => window.open('tel:911')}>
                Call 911
              </Button>
              <Button variant="secondary" className="flex-1" onClick={handleEmergencyConfirm}>
                Continue with Analysis
              </Button>
            </div>
            <button
              onClick={() => setShowEmergencyWarning(false)}
              className="w-full mt-3 text-sm text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
