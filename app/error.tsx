'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react'

export default function DatabaseError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Database connection error:', error)
  }, [error])

  const isDatabaseError = error.message.includes('database') || 
                         error.message.includes('prisma') ||
                         error.message.includes('connection')

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          {isDatabaseError ? (
            <WifiOff className="w-10 h-10 text-red-400" />
          ) : (
            <AlertTriangle className="w-10 h-10 text-red-400" />
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">
          {isDatabaseError ? 'Connexion à la base de données' : 'Erreur technique'}
        </h1>
        
        <p className="text-[#6e6e80] mb-8">
          {isDatabaseError 
            ? 'Impossible de se connecter à la base de données. Veuillez vérifier votre connexion ou réessayer plus tard.'
            : 'Une erreur technique est survenue. Nos équipes sont informées et travaillent à résoudre le problème.'
          }
        </p>

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-[#d4920c] text-white py-3 px-4 rounded-lg hover:bg-[#b87a0a] transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </button>
          
          <a
            href="/"
            className="w-full block bg-[#1a1a1f] text-white py-3 px-4 rounded-lg hover:bg-[#232330] transition-colors border border-white/10"
          >
            Retour à l'accueil
          </a>
        </div>

        {error.digest && (
          <p className="text-xs text-[#4a4a5a] mt-6">
            Code d'erreur: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
