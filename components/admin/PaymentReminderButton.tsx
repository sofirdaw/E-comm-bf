// components/admin/PaymentReminderButton.tsx
'use client'

import { useState } from 'react'
import { Mail, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export function PaymentReminderButton() {
  const [loading, setLoading] = useState(false)

  const sendReminders = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/orders/payment-reminders', {
        method: 'POST',
      })

      if (res.ok) {
        const data = await res.json()
        toast.success(`${data.remindersSent} rappel(s) envoyé(s) avec succès`)
      } else {
        const error = await res.json()
        toast.error(error.error || 'Erreur lors de l\'envoi des rappels')
      }
    } catch (error) {
      toast.error('Erreur serveur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={sendReminders}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.3)] text-[#3b82f6] rounded-lg hover:bg-[rgba(59,130,246,0.2)] transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
      Envoyer les rappels de paiement
    </button>
  )
}
