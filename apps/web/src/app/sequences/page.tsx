'use client'

import { useEffect, useState } from 'react'
import { fetchFromApi, type NurtureSequence } from '@/lib/api'

export default function SequencesPage() {
  const [sequences, setSequences] = useState<NurtureSequence[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFromApi<NurtureSequence[]>('/api/sequences')
      .then(setSequences)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function toggleSequence(id: string, active: boolean) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
    await fetch(`${apiUrl}/api/sequences/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    })
    setSequences((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !active } : s))
    )
  }

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Nurture Sequences</h1>

      <div className="space-y-3">
        {sequences.length === 0 && (
          <p className="text-gray-400 text-center py-8">No active nurture sequences</p>
        )}
        {sequences.map((seq) => (
          <div key={seq.id} className="bg-white rounded-lg border p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{seq.lead.name ?? seq.lead.phone}</p>
              <p className="text-sm text-gray-500">
                {seq.sequence_type} · Step {seq.current_step}/9
              </p>
              <p className="text-xs text-gray-400">
                Next: {new Date(seq.next_send_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                seq.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {seq.active ? 'Active' : 'Paused'}
              </span>
              <button
                onClick={() => toggleSequence(seq.id, seq.active)}
                className={`text-xs px-3 py-1 rounded ${
                  seq.active
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {seq.active ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
