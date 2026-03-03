// components/store/NewsletterSection.tsx
'use client'

import { useState } from 'react'
import { Mail, ArrowRight, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || loading) return

    setLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setSuccess(true)
        setEmail('')
        toast.success('Inscription réussie !')
      } else {
        toast.error('Une erreur est survenue')
      }
    } catch {
      toast.error('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Glow effect */}
        <div className="relative">
          <div className="absolute inset-0 -z-10 blur-3xl opacity-20 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(212,146,12,0.8) 0%, transparent 70%)' }}
          />

          <div className="w-14 h-14 rounded-2xl bg-[rgba(212,146,12,0.1)] border border-[rgba(212,146,12,0.2)] flex items-center justify-center mx-auto mb-6">
            <Mail className="w-6 h-6 text-[#d4920c]" />
          </div>

          <h2 className="font-display text-3xl font-bold text-white mb-3">
            Restez <span className="text-gold-gradient">informé</span>
          </h2>
          <p className="text-[#9898a8] mb-8">
            Recevez en avant-première les meilleures offres, nouvelles sorties et promotions exclusives.
          </p>

          {success ? (
            <div className="flex items-center justify-center gap-2 text-[#22c55e] py-4">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Merci ! Vous êtes abonné(e).</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="input flex-1"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary whitespace-nowrap"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-[#0a0a0b] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    S'abonner
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
          <p className="text-xs text-[#4a4a5a] mt-4">
            Aucun spam. Désabonnement en 1 clic.
          </p>
        </div>
      </div>
    </section>
  )
}
