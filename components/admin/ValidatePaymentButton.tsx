// components/admin/ValidatePaymentButton.tsx
'use client'

import { useState } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface ValidatePaymentButtonProps {
  orderId: string
  orderNumber: string
  amount: number
  onValidationComplete?: () => void
}

export function ValidatePaymentButton({ 
  orderId, 
  orderNumber, 
  amount, 
  onValidationComplete 
}: ValidatePaymentButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleValidatePayment = async () => {
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/validate-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la validation du paiement')
      }

      const result = await response.json()
      
      toast.success(`Paiement de ${result.amount} validé avec succès !`)
      onValidationComplete?.()
    } catch (error: any) {
      console.error('Payment validation error:', error)
      toast.error(error.message || 'Erreur lors de la validation du paiement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleValidatePayment}
      disabled={loading}
      className="btn-success flex items-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Validation...
        </>
      ) : (
        <>
          <CheckCircle className="w-4 h-4" />
          Valider le paiement
        </>
      )}
    </button>
  )
}
