// components/admin/OrderActions.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Truck, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface OrderActionsProps {
  orderId: string
  currentStatus: string
}

export function OrderActions({ orderId, currentStatus }: OrderActionsProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const updateOrderStatus = async (newStatus: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        toast.success(`Commande ${newStatus === 'CONFIRMED' ? 'confirmée' : newStatus === 'CANCELLED' ? 'annulée' : 'expédiée'} avec succès`)
        router.refresh()
      } else {
        const error = await res.json()
        toast.error(error.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      toast.error('Erreur serveur')
    } finally {
      setLoading(false)
    }
  }

  const canConfirm = currentStatus === 'PENDING'
  const canShip = currentStatus === 'CONFIRMED' || currentStatus === 'PROCESSING'
  const canCancel = currentStatus === 'PENDING' || currentStatus === 'CONFIRMED'

  return (
    <div className="flex items-center gap-2">
      {canConfirm && (
        <button
          onClick={() => updateOrderStatus('CONFIRMED')}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] text-[#22c55e] rounded-lg hover:bg-[rgba(34,197,94,0.2)] transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
          Confirmer
        </button>
      )}
      
      {canShip && (
        <button
          onClick={() => updateOrderStatus('SHIPPED')}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-[rgba(212,146,12,0.1)] border border-[rgba(212,146,12,0.3)] text-[#d4920c] rounded-lg hover:bg-[rgba(212,146,12,0.2)] transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
          Expédier
        </button>
      )}
      
      {canCancel && (
        <button
          onClick={() => updateOrderStatus('CANCELLED')}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-[#ef4444] rounded-lg hover:bg-[rgba(239,68,68,0.2)] transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
          Annuler
        </button>
      )}
    </div>
  )
}
