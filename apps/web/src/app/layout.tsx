import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Real Estate Agent Dashboard',
  description: 'AI-powered lead management for real estate agents',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-white border-b border-gray-200 fixed top-0 inset-x-0 z-50 h-14 flex items-center px-4 gap-6">
          <a href="/dashboard" className="font-bold text-lg text-blue-600">RealEstate AI</a>
          <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</a>
          <a href="/leads" className="text-sm text-gray-600 hover:text-gray-900">Leads</a>
          <a href="/properties" className="text-sm text-gray-600 hover:text-gray-900">Properties</a>
          <a href="/sequences" className="text-sm text-gray-600 hover:text-gray-900">Sequences</a>
        </nav>
        <main className="pt-14 min-h-screen">{children}</main>
      </body>
    </html>
  )
}
