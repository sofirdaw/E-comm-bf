// app/admin/newsletter/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Mail, Users, TrendingUp, Calendar, Download } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Subscriber {
  id: string
  email: string
  createdAt: string
}

interface NewsletterStats {
  totalSubscribers: number
  recentSubscribers: Subscriber[]
  subscribersThisMonth: number
}

async function getNewsletterStats(): Promise<NewsletterStats> {
  try {
    const response = await fetch('/api/admin/newsletter/stats')
    if (!response.ok) throw new Error('Failed to fetch stats')
    return await response.json()
  } catch (error) {
    console.error('Error fetching newsletter stats:', error)
    return {
      totalSubscribers: 0,
      recentSubscribers: [],
      subscribersThisMonth: 0
    }
  }
}

export default function AdminNewsletterPage() {
  const [stats, setStats] = useState<NewsletterStats>({
    totalSubscribers: 0,
    recentSubscribers: [],
    subscribersThisMonth: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true)
      const data = await getNewsletterStats()
      setStats(data)
      setLoading(false)
    }
    loadStats()
  }, [])

  const exportSubscribers = () => {
    const csvContent = stats.recentSubscribers
      .map(sub => `${sub.email},${sub.createdAt}`)
      .join('\n')
    const blob = new Blob([`Email,Date\n${csvContent}`], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4920c]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
          <Mail className="w-6 h-6 text-[#d4920c]" />
          Newsletter
        </h1>
        <p className="text-[#6e6e80] text-sm mt-0.5">
          Gérez vos abonnés et campagnes email
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[rgba(212,146,12,0.1)] border border-[rgba(212,146,12,0.2)] flex items-center justify-center">
              <Users className="w-6 h-6 text-[#d4920c]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalSubscribers}</p>
              <p className="text-sm text-[#6e6e80]">Total abonnés</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#22c55e]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.subscribersThisMonth}</p>
              <p className="text-sm text-[#6e6e80]">Ce mois</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)] flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#3b82f6]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.recentSubscribers.length}</p>
              <p className="text-sm text-[#6e6e80]">Derniers 7 jours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Subscribers */}
      <div className="card">
        <div className="p-6 border-b border-white/5">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#d4920c]" />
            Abonnés récents
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-medium text-[#6e6e80] uppercase tracking-wider pb-3 pl-6">
                  Email
                </th>
                <th className="text-left text-xs font-medium text-[#6e6e80] uppercase tracking-wider pb-3">
                  Date d'inscription
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats.recentSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pl-6">
                    <span className="text-sm text-[#e8e8ec] font-mono">
                      {subscriber.email}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-sm text-[#6e6e80]">
                      {formatDate(new Date(subscriber.createdAt))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {stats.recentSubscribers.length === 0 && (
            <div className="text-center py-12 text-[#6e6e80] text-sm">
              Aucun abonné récent
            </div>
          )}
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={exportSubscribers}
          className="btn-primary flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Exporter les abonnés
        </button>
      </div>
    </div>
  )
}
