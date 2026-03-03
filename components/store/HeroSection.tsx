// components/store/HeroSection.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Banner {
  id: string
  title: string
  subtitle: string | null
  image: string
  link: string | null
  buttonText: string | null
}

export function HeroSection({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const next = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrent((c) => (c + 1) % banners.length)
    setTimeout(() => setIsAnimating(false), 600)
  }

  const prev = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrent((c) => (c - 1 + banners.length) % banners.length)
    setTimeout(() => setIsAnimating(false), 600)
  }

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [banners.length, isAnimating])

  if (banners.length === 0) {
    return <DefaultHero />
  }

  const banner = banners[current]

  return (
    <section className="relative h-[60vh] min-h-[480px] lg:h-[75vh] lg:min-h-[600px] overflow-hidden">
      {/* Background image */}
      <div
        key={banner.id}
        className={cn(
          'absolute inset-0 transition-opacity duration-700',
          isAnimating ? 'opacity-0' : 'opacity-100'
        )}
      >
        <img
          src={banner.image}
          alt={banner.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b] via-[rgba(10,10,11,0.6)] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent opacity-80" />
      </div>

      {/* Animated grain */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
      />

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className={cn('max-w-xl transition-all duration-700', isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0')}>
          <div className="section-tag mb-4">
            <Sparkles className="w-3 h-3" />
            Nouveauté 2026
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {banner.title.split(' ').map((word, i) => (
              <span key={i} className={i % 3 === 1 ? 'text-gold-gradient' : ''}>
                {word}{' '}
              </span>
            ))}
          </h1>
          {banner.subtitle && (
            <p className="text-[#9898a8] text-lg mb-8 leading-relaxed">
              {banner.subtitle}
            </p>
          )}
          <div className="flex items-center gap-4">
            <Link
              href={banner.link || '/store/products'}
              className="btn-primary group"
            >
              {banner.buttonText || 'Explorer'}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/store/products" className="btn-ghost text-[#9898a8] hover:text-white">
              Voir tout
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-[rgba(212,146,12,0.4)] transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-[rgba(212,146,12,0.4)] transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  'h-1 rounded-full transition-all duration-300',
                  i === current ? 'w-8 bg-[#d4920c]' : 'w-2 bg-white/30 hover:bg-white/50'
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

function DefaultHero() {
  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden flex items-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0b] via-[#111114] to-[#1a1a0a]" />
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(212,146,12,0.6) 0%, transparent 70%)',
            animation: 'float 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -bottom-20 right-20 w-72 h-72 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(212,146,12,0.8) 0%, transparent 70%)',
            animation: 'float 6s ease-in-out infinite reverse',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-tag mb-6">
          <Sparkles className="w-3 h-3" />
          Tech Premium · Burkina Faso
        </div>
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-none max-w-3xl">
          Votre Tech.{' '}
          <span className="text-gold-gradient">Votre Univers.</span>
        </h1>
        <p className="text-[#9898a8] text-xl mb-10 max-w-lg leading-relaxed">
          Les meilleurs produits tech livrés rapidement au Burkina Faso. Qualité premium, prix compétitifs.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/store/products" className="btn-primary">
            Explorer la boutique
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/store/products?featured=true" className="btn-ghost">
            Top ventes
          </Link>
        </div>
      </div>
    </section>
  )
}
