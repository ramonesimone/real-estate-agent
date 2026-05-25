'use client'

import { useEffect, useState } from 'react'
import { fetchFromApi, type Property } from '@/lib/api'

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchFromApi<Property[]>('/api/properties')
      .then(setProperties)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Properties</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Listing'}
        </button>
      </div>

      {showForm && <AddPropertyForm onAdded={() => { setShowForm(false); setLoading(true); fetchFromApi<Property[]>('/api/properties').then(setProperties).finally(() => setLoading(false)) }} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((p) => (
          <div key={p.id} className="bg-white rounded-lg border overflow-hidden">
            <div className="p-4">
              <h3 className="font-semibold mb-1">{p.title}</h3>
              <p className="text-xs text-gray-500 mb-2">{p.location}, {p.area}</p>
              <p className="text-lg font-bold text-blue-600">${p.price.toLocaleString()}</p>
              <div className="flex gap-3 text-xs text-gray-500 mt-2">
                <span>{p.bedrooms} bed</span>
                <span>{p.bathrooms} bath</span>
                <span>{p.type}</span>
                <span className={`ml-auto font-medium ${
                  p.status === 'AVAILABLE' ? 'text-green-600' :
                  p.status === 'UNDER_OFFER' ? 'text-yellow-600' : 'text-red-600'
                }`}>{p.status}</span>
              </div>
            </div>
          </div>
        ))}
        {properties.length === 0 && (
          <p className="col-span-full text-center text-gray-400 py-8">No properties yet</p>
        )}
      </div>
    </div>
  )
}

function AddPropertyForm({ onAdded }: { onAdded: () => void }) {
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const form = new FormData(e.currentTarget)
    const raw = Object.fromEntries(form.entries()) as Record<string, string>
    const data = {
      ...raw,
      amenities: raw.amenities?.split(',').map((s) => s.trim()) ?? [],
      images: raw.images?.split(',').map((s) => s.trim()) ?? [],
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
      const res = await fetch(`${apiUrl}/api/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) onAdded()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-4 grid grid-cols-2 gap-3 text-sm">
      <input name="title" placeholder="Title" required className="border rounded px-3 py-2 col-span-2" />
      <textarea name="description" placeholder="Description" required className="border rounded px-3 py-2 col-span-2" />
      <input name="price" type="number" placeholder="Price" required className="border rounded px-3 py-2" />
      <select name="type" required className="border rounded px-3 py-2">
        <option value="SALE">Sale</option>
        <option value="RENT">Rent</option>
      </select>
      <input name="bedrooms" type="number" placeholder="Bedrooms" required className="border rounded px-3 py-2" />
      <input name="bathrooms" type="number" placeholder="Bathrooms" required className="border rounded px-3 py-2" />
      <input name="location" placeholder="Location" required className="border rounded px-3 py-2" />
      <input name="area" placeholder="Area" required className="border rounded px-3 py-2" />
      <input name="amenities" placeholder="Amenities (comma separated)" className="border rounded px-3 py-2 col-span-2" />
      <input name="images" placeholder="Image URLs (comma separated)" className="border rounded px-3 py-2 col-span-2" />
      <input name="agent_id" placeholder="Agent ID" className="border rounded px-3 py-2 col-span-2" />
      <button type="submit" disabled={submitting} className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
        {submitting ? 'Saving...' : 'Save Property'}
      </button>
    </form>
  )
}
