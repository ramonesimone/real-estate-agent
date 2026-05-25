'use client'

import { useEffect, useState } from 'react'
import { fetchFromApi, type Lead } from '@/lib/api'

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFromApi<Lead[]>('/api/leads')
      .then(setLeads)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = leads.filter((l) => {
    if (filter && l.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      if (
        !l.name?.toLowerCase().includes(q) &&
        !l.phone.includes(q) &&
        !l.location_pref?.toLowerCase().includes(q)
      ) return false
    }
    return true
  })

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Leads</h1>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search name, phone, location..."
          className="border rounded px-3 py-2 text-sm flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="NEW">NEW</option>
          <option value="CONTACTED">CONTACTED</option>
          <option value="QUALIFIED">QUALIFIED</option>
          <option value="HOT">HOT</option>
          <option value="COLD">COLD</option>
          <option value="DEAD">DEAD</option>
          <option value="CONVERTED">CONVERTED</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium">Intent</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{lead.name ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{lead.phone}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    lead.status === 'HOT' ? 'bg-red-100 text-red-700' :
                    lead.status === 'COLD' ? 'bg-gray-100 text-gray-700' :
                    lead.status === 'CONVERTED' ? 'bg-yellow-100 text-yellow-700' :
                    lead.status === 'NEW' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono">{lead.score}</td>
                <td className="px-4 py-3">{lead.intent ?? '—'}</td>
                <td className="px-4 py-3">{lead.location_pref ?? '—'}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`/leads/${lead.id}`}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-6 text-center text-gray-400">No leads found</p>
        )}
      </div>
    </div>
  )
}
