// components/store/ConfirmPaymentButton.tsx
'use client'

import { useState } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface ConfirmPaymentButtonProps {
  orderId: string
  orderNumber: string
  amount: number
  onConfirm?: () => void
}

export function ConfirmPaymentButton({ orderId, orderNumber, amount, onConfirm }: ConfirmPaymentButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirmPayment = async () => {
    if (!confirm('Êtes-vous sûr d\'avoir effectué le paiement via Orange Money ?')) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/orders/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      })

      if (response.ok) {
        toast.success('Paiement confirmé avec succès !')
        onConfirm?.()
        // Rafraîchir la page pour voir le statut mis à jour
        window.location.reload()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors de la confirmation')
      }
    } catch (error) {
      console.error('Confirm payment error:', error)
      toast.error('Erreur lors de la confirmation du paiement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleConfirmPayment}
      disabled={loading}
      className="w-full btn-primary flex items-center justify-center gap-2 py-3"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Confirmation en cours...
        </>
      ) : (
        <>
          <CheckCircle className="w-4 h-4" />
          Confirmer le paiement
        </>
      )}
    </button>
  )
}
