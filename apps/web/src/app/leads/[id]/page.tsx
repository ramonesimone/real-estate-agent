'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { fetchFromApi, type Lead, type Conversation } from '@/lib/api'

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [lead, setLead] = useState<Lead | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([
      fetchFromApi<Lead>(`/api/leads/${id}`),
      fetchFromApi<Conversation[]>(`/api/leads/${id}/conversations`),
    ])
      .then(([leadData, convData]) => {
        setLead(leadData)
        setConversations(convData)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>
  if (!lead) return <div className="p-8 text-gray-500">Lead not found</div>

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <a href="/leads" className="text-sm text-blue-600 hover:underline">&larr; Back to leads</a>

      <div className="bg-white rounded-lg border p-6 grid grid-cols-2 gap-4">
        <h1 className="text-2xl font-bold col-span-2">{lead.name ?? 'Unknown Lead'}</h1>
        <Field label="Phone" value={lead.phone} />
        <Field label="Email" value={lead.email ?? '—'} />
        <Field label="Status" value={lead.status} />
        <Field label="Score" value={`${lead.score}/100`} />
        <Field label="Intent" value={lead.intent ?? '—'} />
        <Field label="Timeline" value={lead.timeline ?? '—'} />
        <Field label="Location" value={lead.location_pref ?? '—'} />
        <Field label="Budget" value={
          lead.budget_min && lead.budget_max
            ? `$${lead.budget_min.toLocaleString()} - $${lead.budget_max.toLocaleString()}`
            : '—'
        } />
        <Field label="Source" value={lead.source} />
        <Field label="Created" value={new Date(lead.created_at).toLocaleString()} />
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b font-semibold">Conversation History</div>
        <div className="divide-y max-h-96 overflow-y-auto">
          {conversations.length === 0 && (
            <p className="p-4 text-gray-400 text-sm">No messages yet</p>
          )}
          {conversations.map((msg) => (
            <div key={msg.id} className={`p-4 ${msg.direction === 'OUTBOUND' ? 'bg-blue-50' : ''}`}>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <span className={msg.direction === 'OUTBOUND' ? 'text-blue-600 font-medium' : 'text-green-600 font-medium'}>
                  {msg.direction === 'OUTBOUND' ? 'Agent' : 'Lead'}
                </span>
                <span>{msg.channel}</span>
                <span>{new Date(msg.timestamp).toLocaleString()}</span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  )
}
