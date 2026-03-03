// app/auth/login/page.tsx
'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, LogIn, Loader2, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

function LoginContent() {
  const router = useRouter()
  const params = useSearchParams()
  const callbackUrl = params.get('callbackUrl') || '/store'
  const error = params.get('error')

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    try {
      const res = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      if (res?.error) {
        toast.error('Email ou mot de passe incorrect')
      } else {
        toast.success('Connexion réussie !')
        router.push(callbackUrl)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    await signIn('google', { callbackUrl })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex">
      {/* Left - Art panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0b] via-[#111108] to-[#1a1800]" />
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-[120px] opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(212,146,12,0.9) 0%, transparent 70%)' }}
        />
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full blur-[100px] opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(212,146,12,0.5) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/store" className="flex items-center gap-2.5">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#e8aa1f] to-[#b07408]" />
              <span className="absolute inset-0 flex items-center justify-center text-[#0a0a0b] font-bold">E</span>
            </div>
            <span className="font-display font-bold text-xl text-white">
              e-comm<span className="text-[#d4920c]">bf</span>
            </span>
          </Link>

          <div>
            <blockquote className="text-4xl font-display font-light text-white leading-tight mb-6 italic">
              "La technologie{' '}
              <span className="text-[#d4920c] not-italic font-semibold">au service</span>
              {' '}de votre quotidien"
            </blockquote>
            <p className="text-[#6e6e80]">
              Rejoignez des milliers d'utilisateurs au Burkina Faso qui font confiance à e-comm-bf pour leurs achats tech.
            </p>
          </div>

          <div className="flex gap-3">
            {[
              { n: '500+', label: 'Clients' },
              { n: '500+', label: 'Produits' },
              { n: '4.9/5', label: 'Note moyenne' },
            ].map((s) => (
              <div key={s.label} className="flex-1 px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-white/5">
                <p className="font-display font-bold text-xl text-[#d4920c]">{s.n}</p>
                <p className="text-xs text-[#6e6e80]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-up">
          <Link
            href="/store"
            className="inline-flex items-center gap-2 text-sm text-[#6e6e80] hover:text-[#d4920c] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la boutique
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              Bienvenue 👋
            </h1>
            <p className="text-[#9898a8]">Connectez-vous à votre compte</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] text-sm text-[#f87171]">
              {error === 'OAuthAccountNotLinked'
                ? 'Cet email est déjà associé à un autre compte. Utilisez votre email/mot de passe.'
                : 'Une erreur est survenue. Veuillez réessayer.'}
            </div>
          )}

          {/* Google OAuth */}
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
            {googleLoading ? 'Connexion...' : 'Continuer avec Google'}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/8" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[#0a0a0b] text-[#4a4a5a]">ou avec votre email</span>
            </div>
          </div>

          {/* Credentials form */}
          <form onSubmit={handleCredentials} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#9898a8] mb-1.5">
                Adresse email
              </label>
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-[#9898a8]">
                  Mot de passe
                </label>
                <Link href="/auth/forgot-password" className="text-xs text-[#d4920c] hover:text-[#e8aa1f] transition-colors">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="input !pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6e6e80] hover:text-[#9898a8] transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6e6e80]">
            Pas encore de compte ?{' '}
            <Link href="/auth/register" className="text-[#d4920c] hover:text-[#e8aa1f] font-medium transition-colors">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <LoginContent />
    </Suspense>
  )
}
