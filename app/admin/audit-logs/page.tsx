// app/admin/audit-logs/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { Loader2, Shield, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface AuditLog {
  id: string
  userId: string
  action: string
  resource: string
  newValue?: string
  oldValue?: string
  ipAddress: string
  userAgent: string
  status: string
  createdAt: string
}

export default function AuditLogsPage() {
  const { user, loading: authLoading } = useAdminAuth()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'login' | 'success' | 'failed'>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (!user) return

    const fetchLogs = async () => {
      try {
        const res = await fetch(`/api/admin/audit-logs?page=${page}&filter=${filter}`)
        if (!res.ok) throw new Error('Erreur lors du chargement')

        const data = await res.json()
        setLogs(data.logs)
        setTotalPages(data.totalPages)
      } catch (error) {
        toast.error('Erreur lors du chargement des logs')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [user, page, filter])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#d4920c]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          📋 Journaux d'audit
        </h1>
        <p className="text-[#9898a8]">
          Historique de toutes les tentatives d'accès et actions administrateur
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#1a1a1f] border border-white/10 rounded-lg p-4">
          <p className="text-[#9898a8] text-sm mb-1">Tentatives d'accès</p>
          <p className="text-3xl font-bold text-white">{logs.length}</p>
        </div>
        <div className="bg-[#1a1a1f] border border-white/10 rounded-lg p-4">
          <p className="text-[#9898a8] text-sm mb-1">Filtre actif</p>
          <p className="text-2xl font-bold text-[#d4920c] capitalize">{filter}</p>
        </div>
        <div className="bg-[#1a1a1f] border border-white/10 rounded-lg p-4">
          <p className="text-[#9898a8] text-sm mb-1">Page</p>
          <p className="text-2xl font-bold text-white">{page} / {totalPages}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'login', 'success', 'failed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f)
              setPage(1)
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f
                ? 'bg-[#d4920c] text-white'
                : 'bg-[#1a1a1f] text-[#9898a8] hover:bg-[#252530]'
            }`}
          >
            {f === 'all' && 'Tous'}
            {f === 'login' && 'Connexions'}
            {f === 'success' && 'Réussis'}
            {f === 'failed' && 'Échoués'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#1a1a1f] border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-[#0f0f12]">
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#9898a8] uppercase">
                  Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#9898a8] uppercase">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#9898a8] uppercase">
                  Ressource
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#9898a8] uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#9898a8] uppercase">
                  IP / Navigateur
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-[#252530] transition">
                  <td className="px-6 py-4 text-sm text-[#e8e8ec]">
                    {formatDistanceToNow(new Date(log.createdAt), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#d4920c] font-medium">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#9898a8]">
                    {log.resource}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {log.status === 'SUCCESS' ? (
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        Succès
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-400">
                        <AlertCircle className="w-4 h-4" />
                        Échoué
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-[#6e6e80]">
                    <div className="font-mono">{log.ipAddress || 'N/A'}</div>
                    <div className="truncate">{log.userAgent || 'N/A'}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {logs.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-12 h-12 text-[#9898a8] mx-auto mb-3 opacity-50" />
          <p className="text-[#9898a8]">Aucun journal d'audit trouvé</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-[#1a1a1f] text-[#9898a8] rounded-lg disabled:opacity-50 hover:bg-[#252530]"
          >
            Précédent
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-2 rounded-lg transition ${
                page === p
                  ? 'bg-[#d4920c] text-white'
                  : 'bg-[#1a1a1f] text-[#9898a8] hover:bg-[#252530]'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-[#1a1a1f] text-[#9898a8] rounded-lg disabled:opacity-50 hover:bg-[#252530]"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  )
}
