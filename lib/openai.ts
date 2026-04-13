import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface CaseData {
  title: string
  category: string
  jurisdiction: string
  summary: string
  outcome: string
  reasoning: string
  year: number
}

interface AnalysisResult {
  summary: string
  recommendations: Array<{
    action: string
    reason: string
    importance: 'easy' | 'medium' | 'important'
  }>
  riskAssessment: {
    level: 'Low' | 'Medium' | 'High'
    explanation: string
    potentialConsequences: string[]
  }
}

export async function analyzeCases(
  userDescription: string,
  category: string,
  location: string | null,
  severity: string,
  matchedCases: CaseData[]
): Promise<AnalysisResult> {
  const casesText = matchedCases
    .map(
      (c, i) => `
Case ${i + 1}: ${c.title}
Jurisdiction: ${c.jurisdiction}
Outcome: ${c.outcome}
Summary: ${c.summary}
Key Reasoning: ${c.reasoning}
`
    )
    .join('\n---\n')

  const prompt = `You are a legal research assistant helping someone understand their legal situation. You are NOT a lawyer and cannot provide legal advice.

User's Situation:
- Category: ${category}
- Description: ${userDescription}
- Location: ${location || 'Not specified'}
- Severity: ${severity}

Similar Cases Found:
${casesText}

Based on this information, provide a helpful analysis. Structure your response EXACTLY as follows:

## CASE SUMMARY SYNTHESIS
Write 2-3 paragraphs analyzing the patterns across these similar cases and what typically happens in situations like this.

## RECOMMENDED NEXT STEPS
List 5-7 specific action items the user should consider. For each include:
- A clear action
- Why it's important (1 sentence)
- An importance level: easy, medium, or important

Format each recommendation as:
ACTION: [specific action]
WHY: [reason]
IMPORTANCE: [easy/medium/important]

## RISK ASSESSMENT
Assess the potential liability and consequences.

LIABILITY LEVEL: [Low/Medium/High]
EXPLANATION: [2-3 sentences on why this level]
POTENTIAL CONSEQUENCES: [list 3-5 possible outcomes or consequences]

Remember: You are NOT a lawyer. Do not provide legal advice. Always encourage consulting a licensed attorney.
`

  // Use static fallback analysis as requested for MVP instead of an actual API Call
  return generateFallbackAnalysis(category, severity)
}

function parseAnalysisResponse(content: string): AnalysisResult {
  const sections = content.split('## ')
  let summary = ''
  let recommendations: AnalysisResult['recommendations'] = []
  let riskAssessment: AnalysisResult['riskAssessment'] = {
    level: 'Medium',
    explanation: '',
    potentialConsequences: [],
  }

  for (const section of sections) {
    if (section.startsWith('CASE SUMMARY SYNTHESIS')) {
      summary = section.replace('CASE SUMMARY SYNTHESIS', '').trim()
    } else if (section.startsWith('RECOMMENDED NEXT STEPS')) {
      const recSection = section.replace('RECOMMENDED NEXT STEPS', '').trim()
      const recMatches = Array.from(recSection.matchAll(
        /ACTION: (.+?)\nWHY: (.+?)\nIMPORTANCE: (.+?)(?=\n|$)/gi
      ))
      for (const match of recMatches) {
        recommendations.push({
          action: match[1].trim(),
          reason: match[2].trim(),
          importance: match[3].trim().toLowerCase() as 'easy' | 'medium' | 'important',
        })
      }
    } else if (section.startsWith('RISK ASSESSMENT')) {
      const riskSection = section.replace('RISK ASSESSMENT', '').trim()
      const levelMatch = riskSection.match(/LIABILITY LEVEL: (.+?)(?=\n|$)/i)
      const explanationMatch = riskSection.match(/EXPLANATION: (.+?)(?=\nPOTENTIAL|$)/i)
      const consMatch = riskSection.match(/POTENTIAL CONSEQUENCES: ([\s\S]+?)$/i)

      if (levelMatch) {
        const level = levelMatch[1].trim().toUpperCase()
        riskAssessment.level =
          level === 'LOW' ? 'Low' : level === 'HIGH' ? 'High' : 'Medium'
      }
      if (explanationMatch) {
        riskAssessment.explanation = explanationMatch[1].trim()
      }
      if (consMatch) {
        riskAssessment.potentialConsequences = consMatch[1]
          .split(/[-•]/)
          .map((c) => c.trim())
          .filter(Boolean)
      }
    }
  }

  if (!summary) {
    summary =
      'Based on the cases reviewed, your situation involves legal considerations that are common in similar circumstances. The outcomes vary based on specific facts, jurisdiction, and how the case is presented.'
  }

  if (recommendations.length === 0) {
    recommendations = [
      { action: 'Document everything', reason: 'Evidence is crucial for any legal matter', importance: 'important' },
      { action: 'Consult with a licensed attorney', reason: 'Professional legal advice is essential', importance: 'important' },
      { action: 'Preserve all relevant communications', reason: 'Keep records of all related conversations and documents', importance: 'medium' },
    ]
  }

  return { summary, recommendations, riskAssessment }
}

function generateFallbackAnalysis(category: string, severity: string): AnalysisResult {
  return {
    summary: `Based on the ${category.toLowerCase()} category you've selected, your situation involves legal considerations that are common in similar circumstances. The specific outcome will depend on jurisdiction, the exact circumstances, and how evidence is presented.`,
    recommendations: [
      {
        action: 'Document the incident thoroughly',
        reason: 'Clear documentation strengthens any potential case',
        importance: 'important',
      },
      {
        action: 'Gather witness information if available',
        reason: 'Witness testimony can be valuable evidence',
        importance: 'medium',
      },
      {
        action: 'Preserve all physical evidence',
        reason: 'Photos, videos, and documents can support your account',
        importance: 'important',
      },
      {
        action: 'Consult with a licensed attorney',
        reason: 'Professional legal advice tailored to your situation is essential',
        importance: 'important',
      },
      {
        action: 'Do not admit fault without legal counsel',
        reason: 'Statements made now can impact your case later',
        importance: 'important',
      },
    ],
    riskAssessment: {
      level: severity === 'Emergency' || severity === 'High' ? 'High' : severity === 'Medium' ? 'Medium' : 'Low',
      explanation: `Based on the ${severity.toLowerCase()} severity level you've indicated, this situation carries corresponding risks. Higher severity cases typically involve more significant potential consequences.`,
      potentialConsequences: [
        'Financial liability for damages or injuries',
        'Potential legal proceedings or court appearance',
        'Insurance implications and premium changes',
        'Impact on driving record or professional license',
        'Civil claims or counterclaims from other parties',
      ],
    },
  }
}
