export type Severity = 'Emergency' | 'High' | 'Medium' | 'Low'
export type Category = 'Car Accident' | 'Self-Defense' | 'Property Dispute' | 'Employment Issue' | 'Contract Issue' | 'Other'
export type QueryStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
export type SubscriptionTier = 'FREE' | 'PREMIUM'
export type Outcome = 'Favorable' | 'Unfavorable' | 'Settled' | 'Ongoing'

export interface User {
  id: string
  email: string
  name?: string | null
  verified: boolean
  disclaimerAccepted: boolean
  disclaimerAcceptedAt?: Date | null
  subscription?: Subscription | null
  createdAt: Date
  updatedAt: Date
}

export interface Subscription {
  id: string
  userId: string
  tier: SubscriptionTier
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED'
  expiresAt?: Date | null
  createdAt: Date
}

export interface Query {
  id: string
  userId?: string | null
  category: string
  description: string
  location?: string | null
  incidentDate?: Date | null
  severity: Severity
  contextFlags?: string[] | null
  aiSummary?: string | null
  aiRecommendations?: Recommendation[] | null
  riskAssessment?: RiskAssessment | null
  matchedCases?: MatchedCase[] | null
  status: QueryStatus
  ipAddress?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Recommendation {
  action: string
  reason: string
  importance: 'easy' | 'medium' | 'important'
}

export interface RiskAssessment {
  level: 'Low' | 'Medium' | 'High'
  explanation: string
  potentialConsequences: string[]
}

export interface MatchedCase {
  id: string
  title: string
  category: string
  jurisdiction: string
  summary: string
  outcome: Outcome
  reasoning: string
  year: number
  citations?: string | null
  similarity: number
}

export interface Case {
  id: string
  title: string
  category: string
  jurisdiction: string
  summary: string
  outcome: Outcome
  reasoning: string
  year: number
  citations?: string | null
  keywords?: string | null
  severity?: string | null
  createdAt: Date
}

export interface Lawyer {
  id: string
  name: string
  firm: string
  email?: string | null
  phone?: string | null
  specialties: string
  rating: number
  reviewCount: number
  yearsExperience: number
  location: string
  bio?: string | null
  avatarUrl?: string | null
}

export interface LawyerConnection {
  id: string
  userId: string
  lawyerId: string
  lawyer: Lawyer
  connectedAt: Date
}

export interface QueryFormData {
  category: Category
  description: string
  location?: string
  incidentDate?: string
  severity: Severity
  contextFlags?: string[]
}

export interface SignupFormData {
  email: string
  password: string
  name?: string
  verificationId?: string
  disclaimerAccepted: boolean
}

export const CATEGORIES: Category[] = [
  'Car Accident',
  'Self-Defense',
  'Property Dispute',
  'Employment Issue',
  'Contract Issue',
  'Other',
]

export const SEVERITY_LEVELS: Severity[] = ['Emergency', 'High', 'Medium', 'Low']

export const JURISDICTIONS = [
  'Los Angeles County, CA',
  'San Francisco County, CA',
  'Cook County, IL',
  'Harris County, TX',
  'Miami-Dade County, FL',
  'Maricopa County, AZ',
  'New York County, NY',
  'Philadelphia County, PA',
  'King County, WA',
  'Denver County, CO',
  'Suffolk County, MA',
  'Clark County, NV',
  'Other',
]
