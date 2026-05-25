export enum LeadSource {
  WEBSITE = 'WEBSITE',
  WHATSAPP = 'WHATSAPP',
  REFERRAL = 'REFERRAL',
  OPEN_HOUSE = 'OPEN_HOUSE',
}

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  HOT = 'HOT',
  COLD = 'COLD',
  DEAD = 'DEAD',
  CONVERTED = 'CONVERTED',
}

export enum LeadIntent {
  BUY = 'BUY',
  RENT = 'RENT',
  SELL = 'SELL',
  INVEST = 'INVEST',
}

export enum Timeline {
  IMMEDIATE = 'IMMEDIATE',
  _1_3_MONTHS = '1_3_MONTHS',
  _3_6_MONTHS = '3_6_MONTHS',
  _6_PLUS = '6_PLUS',
}

export enum PropertyType {
  SALE = 'SALE',
  RENT = 'RENT',
}

export enum PropertyStatus {
  AVAILABLE = 'AVAILABLE',
  UNDER_OFFER = 'UNDER_OFFER',
  SOLD = 'SOLD',
}

export enum ConversationChannel {
  WHATSAPP = 'WHATSAPP',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
}

export enum ConversationDirection {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

export enum NurtureSequenceType {
  COLD_NURTURE = 'COLD_NURTURE',
  POST_VIEWING = 'POST_VIEWING',
  SELLER_FOLLOW_UP = 'SELLER_FOLLOW_UP',
}

export interface LeadData {
  id: string
  phone: string
  name?: string | null
  email?: string | null
  source: LeadSource
  status: LeadStatus
  score: number
  intent?: string | null
  budget_min?: number | null
  budget_max?: number | null
  timeline?: string | null
  location_pref?: string | null
  bedrooms?: number | null
  notes?: string | null
  agent_id?: string | null
  created_at: Date
  updated_at: Date
}

export interface QualificationResult {
  intent: LeadIntent | null
  budget_min: number | null
  budget_max: number | null
  timeline: Timeline | null
  location_pref: string | null
}

export function scoreLead(lead: {
  intent?: string | null
  budget_min?: number | null
  budget_max?: number | null
  timeline?: string | null
  location_pref?: string | null
}): number {
  let score = 0
  if (lead.intent) score += 25
  if (lead.budget_min && lead.budget_max) score += 25
  else if (lead.budget_max) score += 15
  const timelineScores: Record<string, number> = {
    IMMEDIATE: 30,
    '1_3_MONTHS': 20,
    '3_6_MONTHS': 10,
    '6_PLUS': 5,
  }
  score += timelineScores[lead.timeline ?? ''] ?? 0
  if (lead.location_pref) score += 20
  return score
}

export const NURTURE_STEP_DELAYS = [3, 7, 14, 21, 30, 45, 60, 75, 90]

export const NURTURE_STEP_PURPOSES: Record<number, string> = {
  1: 'Gentle check-in',
  2: 'Market insight relevant to their area of interest',
  3: 'New listing alert (closest match from property database)',
  4: 'Value content (e.g. "5 things to check before buying a home")',
  5: 'Soft re-engagement question',
  6: 'Social proof (anonymized success story)',
  7: 'Urgency signal (market movement or interest rate update)',
  8: 'Direct offer to help with no pressure',
  9: 'Final graceful close',
}
