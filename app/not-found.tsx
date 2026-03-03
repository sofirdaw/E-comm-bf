// app/not-found.tsx
import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[150px] opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(212,146,12,0.8) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative text-center animate-fade-up">
        <p className="font-display text-[160px] font-bold leading-none text-transparent bg-clip-text"
          style={{ backgroundImage: 'linear-gradient(135deg, rgba(212,146,12,0.3) 0%, rgba(212,146,12,0.1) 100%)' }}>
          404
        </p>
        <h1 className="font-display text-2xl font-bold text-white -mt-8 mb-4">
          Page introuvable
        </h1>
        <p className="text-[#9898a8] mb-8 max-w-sm mx-auto">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/store" className="btn-primary">
            <ArrowLeft className="w-4 h-4" />
            Accueil
          </Link>
          <Link href="/store/products" className="btn-secondary">
            <Search className="w-4 h-4" />
            Explorer
          </Link>
        </div>
      </div>
    </div>
  )
}
