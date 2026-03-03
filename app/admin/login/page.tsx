'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Lock, Mail, Code, Loader2, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [expiresIn, setExpiresIn] = useState(0)

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/admin/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Erreur lors de la demande')
        return
      }

      toast.success('Code OTP envoyé à votre email')
      setStep('otp')
      setExpiresIn(data.expiresIn || 15)

      // Countdown timer
      const interval = setInterval(() => {
        setExpiresIn((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            toast.error('Code OTP expiré')
            setStep('credentials')
            return 0
          }
          return prev - 1
        })
      }, 60000) // Update every minute
    } catch (error) {
      toast.error('Erreur serveur')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Erreur de vérification')
        return
      }

      toast.success('Connexion réussie !')
      // Rediriger vers le dashboard admin
      setTimeout(() => {
        router.push('/admin')
      }, 1000)
    } catch (error) {
      toast.error('Erreur serveur')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080809] to-[#1a1a1f] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[rgba(212,146,12,0.1)] border border-[rgba(212,146,12,0.3)] rounded-lg mb-4">
            <Lock className="w-8 h-8 text-[#d4920c]" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Panel Admin
          </h1>
          <p className="text-[#9898a8]">Connexion sécurisée avec 2FA</p>
        </div>

        {/* Card */}
        <div className="bg-[#1a1a1f] border border-white/10 rounded-lg p-8 backdrop-blur-md">
          {step === 'credentials' ? (
            // Étape 1: Identifiants
            <form onSubmit={handleRequestOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-[#9898a8]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full bg-[#111114] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-[#6e6e80] focus:outline-none focus:border-[#d4920c] transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-[#9898a8]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#111114] border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-white placeholder-[#6e6e80] focus:outline-none focus:border-[#d4920c] transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#9898a8] hover:text-[#e8e8ec]"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#d4920c] hover:bg-[#e8aa1f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Envoyer le code OTP
              </button>

              <p className="text-xs text-center text-[#6e6e80]">
                Un code de vérification sera envoyé à votre email
              </p>
            </form>
          ) : (
            // Étape 2: Vérification OTP
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="bg-[rgba(212,146,12,0.1)] border border-[rgba(212,146,12,0.3)] rounded-lg p-4 text-center">
                <p className="text-sm text-[#9898a8] mb-1">Code envoyé à</p>
                <p className="text-[#e8e8ec] font-semibold">{email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                  Code OTP à 6 chiffres
                </label>
                <div className="relative">
                  <Code className="absolute left-3 top-3 w-5 h-5 text-[#9898a8]" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full bg-[#111114] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white text-center text-2xl tracking-widest placeholder-[#6e6e80] focus:outline-none focus:border-[#d4920c] transition font-mono"
                    required
                  />
                </div>
              </div>

              <div className="bg-[rgba(212,146,12,0.1)] border border-[rgba(212,146,12,0.3)] rounded-lg p-4 text-center">
                <p className="text-xs text-[#9898a8]">
                  Code expire dans <span className="text-[#d4920c] font-semibold">{expiresIn} min</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Vérifier et se connecter
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('credentials')
                  setOtp('')
                  setPassword('')
                  setExpiresIn(0)
                }}
                className="w-full text-[#9898a8] hover:text-[#e8e8ec] font-medium py-2 transition"
              >
                ← Retour
              </button>

              <p className="text-xs text-center text-[#6e6e80]">
                Vérifiez votre email pour le code de vérification
              </p>
            </form>
          )}

          {/* Security Info */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[#6e6e80]">
                <p className="font-semibold text-[#e8e8ec] mb-1">🔒 Sécurité maximale</p>
                <ul className="space-y-1">
                  <li>✓ Authentification 2FA par email</li>
                  <li>✓ Codes OTP expirables (15 min)</li>
                  <li>✓ Toutes les tentatives sont loggées</li>
                  <li>✓ Session limitée à 8 heures</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-[#6e6e80]">
          <p>Besoin d'aide ? <Link href="/auth/login" className="text-[#d4920c] hover:text-[#e8aa1f]">Page utilisateur</Link></p>
        </div>
      </div>
    </div>
  )
}
