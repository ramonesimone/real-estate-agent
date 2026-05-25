const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export async function fetchFromApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export interface Lead {
  id: string
  phone: string
  name: string | null
  email: string | null
  source: string
  status: string
  score: number
  intent: string | null
  budget_min: number | null
  budget_max: number | null
  timeline: string | null
  location_pref: string | null
  bedrooms: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  lead_id: string
  channel: string
  direction: string
  message: string
  timestamp: string
}

export interface Property {
  id: string
  title: string
  description: string
  price: number
  type: string
  bedrooms: number
  bathrooms: number
  location: string
  area: string
  amenities: string[]
  images: string[]
  status: string
  created_at: string
}

export interface NurtureSequence {
  id: string
  lead_id: string
  sequence_type: string
  current_step: number
  next_send_at: string
  active: boolean
  lead: Lead
}

export interface DashboardStats {
  totalLeads: number
  statusBreakdown: Record<string, number>
  todayNewLeads: number
  todayMessagesSent: number
  todayLeadsConverted: number
  hotLeads: Lead[]
}
