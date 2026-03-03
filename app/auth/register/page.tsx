// app/auth/register/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, UserPlus, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const passwordStrength = (() => {
    const p = form.password
    if (p.length === 0) return 0
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    return score
  })()

  const strengthLabel = ['', 'Faible', 'Moyen', 'Bon', 'Fort']
  const strengthColor = ['', '#ef4444', '#f59e0b', '#22c55e', '#d4920c']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    if (form.password !== form.confirm) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }
    if (form.password.length < 8) {
      toast.error('Le mot de passe doit faire au moins 8 caractères')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Erreur lors de l\'inscription')
        return
      }

      // Auto sign-in
      const signInResult = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      if (signInResult?.ok) {
        toast.success('Compte créé avec succès !')
        router.push('/store')
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    await signIn('google', { callbackUrl: '/store' })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-up">
        <Link href="/store" className="inline-flex items-center gap-2 text-sm text-[#6e6e80] hover:text-[#d4920c] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Retour à la boutique
        </Link>

        <div className="mb-8">
          <Link href="/store" className="flex items-center gap-2 mb-6">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#e8aa1f] to-[#b07408]" />
              <span className="absolute inset-0 flex items-center justify-center text-[#0a0a0b] font-bold text-sm">E</span>
            </div>
            <span className="font-display font-bold text-lg text-white">
              e-comm<span className="text-[#d4920c]">bf</span>
            </span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-white mb-2">
            Créer un compte
          </h1>
          <p className="text-[#9898a8]">Rejoignez des milliers de clients satisfaits</p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/10 bg-[#1a1a1f] hover:bg-[#222228] hover:border-white/15 transition-all text-sm font-medium text-[#e8e8ec] mb-6"
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          S'inscrire avec Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/8" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-[#0a0a0b] text-[#4a4a5a]">ou avec votre email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#9898a8] mb-1.5">Nom complet</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Votre nom"
              required
              className="input"
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9898a8] mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="vous@exemple.com"
              required
              className="input"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9898a8] mb-1.5">Mot de passe</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                className="input !pr-12"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6e6e80] hover:text-[#9898a8] transition-colors"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {form.password && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1 bg-[#232330] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${(passwordStrength / 4) * 100}%`,
                      background: strengthColor[passwordStrength],
                    }}
                  />
                </div>
                <span className="text-xs" style={{ color: strengthColor[passwordStrength] }}>
                  {strengthLabel[passwordStrength]}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9898a8] mb-1.5">Confirmer le mot de passe</label>
            <div className="relative">
              <input
                type="password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder="••••••••"
                required
                className="input !pr-10"
                autoComplete="new-password"
              />
              {form.confirm && form.confirm === form.password && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#22c55e]" />
              )}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6e6e80]">
          Vous avez déjà un compte ?{' '}
          <Link href="/auth/login" className="text-[#d4920c] hover:text-[#e8aa1f] font-medium transition-colors">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
