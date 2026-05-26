'use client'

import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { fetchFromApi, type Lead, type DashboardStats } from '../../lib/api'

const STATUS_COLORS: Record<string, string> = {
  NEW: '#3B82F6',
  CONTACTED: '#8B5CF6',
  QUALIFIED: '#10B981',
  HOT: '#EF4444',
  COLD: '#6B7280',
  DEAD: '#374151',
  CONVERTED: '#F59E0B',
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFromApi<DashboardStats>('/api/dashboard/stats')
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>
  if (!stats) return <PlaceholderDashboard />

  const chartData = Object.entries(stats.statusBreakdown).map(([name, value]) => ({
    name,
    value,
    color: STATUS_COLORS[name] ?? '#6B7280',
  }))

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Leads" value={stats.totalLeads} />
        <StatCard label="New Today" value={stats.todayNewLeads} />
        <StatCard label="Messages Sent" value={stats.todayMessagesSent} />
        <StatCard label="Converted Today" value={stats.todayLeadsConverted} />
      </div>

      <div className="bg-white rounded-lg p-4 border">
        <h2 className="font-semibold mb-4">Leads by Status</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value">
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Hot Leads (Score 80+)</h2>
        </div>
        <div className="divide-y">
          {stats.hotLeads.length === 0 && (
            <p className="p-4 text-gray-500 text-sm">No hot leads currently</p>
          )}
          {stats.hotLeads.map((lead) => (
            <div key={lead.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{lead.name ?? 'Unknown'}</p>
                <p className="text-sm text-gray-500">{lead.phone}</p>
                <p className="text-xs text-gray-400">
                  {lead.intent ?? '—'} · {lead.location_pref ?? '—'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-red-100 text-red-700 text-sm font-bold px-2 py-1 rounded">
                  {lead.score}
                </span>
                <a
                  href={`https://wa.me/${lead.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Chat
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

function PlaceholderDashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Total Leads', 'New Today', 'Messages Sent', 'Converted Today'].map((l) => (
          <div key={l} className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">{l}</p>
            <p className="text-2xl font-bold">—</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg border p-8 text-center text-gray-400">
        Connect to the API backend to see live data.
        <br />
        Set <code className="text-sm bg-gray-100 px-1 rounded">NEXT_PUBLIC_API_URL</code> in your environment.
      </div>
    </div>
  )
}
