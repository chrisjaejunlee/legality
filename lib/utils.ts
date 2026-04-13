import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatRelativeDate(date: Date | string): string {
  const now = new Date()
  const d = new Date(date)
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(date)
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'Car Accident': 'car',
    'Self-Defense': 'shield',
    'Property Dispute': 'home',
    'Employment Issue': 'briefcase',
    'Contract Issue': 'file-text',
    Other: 'help-circle',
  }
  return icons[category] || 'help-circle'
}

export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    Emergency: 'bg-red-100 text-red-800 border-red-200',
    High: 'bg-orange-100 text-orange-800 border-orange-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Low: 'bg-green-100 text-green-800 border-green-200',
  }
  return colors[severity] || colors.Medium
}

export function getOutcomeColor(outcome: string): string {
  const colors: Record<string, string> = {
    Favorable: 'bg-accent-100 text-accent-700',
    Unfavorable: 'bg-red-100 text-red-700',
    Settled: 'bg-blue-100 text-blue-700',
    Ongoing: 'bg-yellow-100 text-yellow-700',
  }
  return colors[outcome] || 'bg-gray-100 text-gray-700'
}

export function calculateSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/)
  const words2 = text2.toLowerCase().split(/\s+/)
  const set1 = new Set(words1)
  const set2 = new Set(words2)
  const intersection = new Set([...set1].filter((x) => set2.has(x)))
  const union = new Set([...set1, ...set2])
  return Math.round((intersection.size / union.size) * 100)
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}
