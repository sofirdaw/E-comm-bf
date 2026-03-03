// components/store/Navbar.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { useCartStore } from '@/store/cart'
import {
  ShoppingCart, Search, Menu, X, User, Heart, ChevronDown,
  LogOut, Settings, Package, Shield, Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Boutique', href: '/store/products' },
  { label: 'Smartphones', href: '/store/products?category=smartphones' },
  { label: 'Laptops', href: '/store/products?category=laptops' },
  { label: 'Gaming', href: '/store/products?category=gaming' },
  { label: 'Copieur', href: '/store/products?category=copier' },
  { label: 'Application', href: '/store/products?category=application' },
  { label: 'Desktop', href: '/store/products?category=desktop' },
  { label: 'Souris', href: '/store/products?category=mouse' },
  { label: 'Tablette', href: '/store/products?category=tablet' },
]

export function Navbar() {
  const { data: session } = useSession()
  const { getTotalItems, openCart } = useCartStore()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const totalItems = getTotalItems()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-gradient-to-r from-transparent via-[rgba(212,146,12,0.12)] to-transparent border-b border-[rgba(212,146,12,0.15)] py-2 text-center">
        <p className="text-xs text-[#d4920c] tracking-wide">
          <Zap className="inline w-3 h-3 mr-1" />
          Livraison express à Ouagadougou · Paiement mobile money accepté
        </p>
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[#1a1a1f]/90 border-b border-white/5 shadow-2xl'
            : 'bg-[#0a0a0b]/80 border-b border-white/5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link href="/store" className="flex items-center gap-2.5 mr-4 shrink-0">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#e8aa1f] to-[#b07408] opacity-90" />
                <span className="absolute inset-0 flex items-center justify-center text-[#0a0a0b] font-bold text-sm font-display">E</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-700 text-lg text-white tracking-tight">e-comm</span>
                <span className="font-display font-700 text-lg text-[#d4920c]">bf</span>
              </div>
            </Link>

            {/* Nav links - desktop */}
            <nav className="hidden lg:flex items-center gap-1 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded-lg text-sm text-[#9898a8] hover:text-[#e8e8ec] hover:bg-white/5 transition-all duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex-1 lg:hidden" />

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl text-[#6e6e80] hover:text-[#e8e8ec] hover:bg-white/5 transition-all duration-150"
                aria-label="Rechercher"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              {session && (
                <Link
                  href="/store/account?tab=wishlist"
                  className="p-2.5 rounded-xl text-[#6e6e80] hover:text-[#e8e8ec] hover:bg-white/5 transition-all duration-150"
                  aria-label="Liste de souhaits"
                >
                  <Heart className="w-5 h-5" />
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2.5 rounded-xl text-[#6e6e80] hover:text-[#e8e8ec] hover:bg-white/5 transition-all duration-150"
                aria-label="Panier"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {mounted && totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full bg-[#d4920c] text-[#0a0a0b]">
                      {totalItems > 9 ? '9+' : totalItems}
                    </span>
                  )}
                </div>
              </button>

              {/* User menu */}
              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-xl hover:bg-white/5 transition-all duration-150"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-[rgba(212,146,12,0.3)]">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || ''}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#2a2a30] flex items-center justify-center text-[#d4920c] text-xs font-bold">
                          {session.user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <ChevronDown className={cn('w-3.5 h-3.5 text-[#6e6e80] transition-transform', userMenuOpen && 'rotate-180')} />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-52 card-elevated z-20 py-2 animate-scale-in shadow-2xl border border-white/8">
                        <div className="px-3 pb-2 mb-2 border-b border-white/5">
                          <p className="text-sm font-medium text-[#e8e8ec] truncate">{session.user.name}</p>
                          <p className="text-xs text-[#6e6e80] truncate">{session.user.email}</p>
                        </div>
                        <Link
                          href="/store/orders"
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#9898a8] hover:text-[#e8e8ec] hover:bg-white/5 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Package className="w-4 h-4" />
                          Mes commandes
                        </Link>
                        <Link
                          href="/store/account"
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#9898a8] hover:text-[#e8e8ec] hover:bg-white/5 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Mon compte
                        </Link>
                        {session.user.role === 'ADMIN' && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#d4920c] hover:bg-[rgba(212,146,12,0.08)] transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Shield className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-white/5 mt-2 pt-2">
                          <button
                            onClick={() => { signOut({ callbackUrl: '/store' }); setUserMenuOpen(false) }}
                            className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#ef4444] hover:bg-[rgba(239,68,68,0.08)] w-full text-left transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Déconnexion
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link href="/auth/login" className="btn-primary !py-2 !px-4 text-xs ml-1">
                  Connexion
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 rounded-xl text-[#6e6e80] hover:text-[#e8e8ec] hover:bg-white/5 transition-all"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          {mobileOpen && (
            <div className="lg:hidden border-t border-white/5 py-4 space-y-1 animate-fade-in">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center px-3 py-2.5 rounded-lg text-sm text-[#9898a8] hover:text-[#e8e8ec] hover:bg-white/5 transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 animate-fade-in" onClick={() => setSearchOpen(false)}>
          <div className="max-w-2xl mx-auto pt-24 px-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative animate-scale-in">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6e6e80]" />
              <input
                autoFocus
                type="text"
                placeholder="Rechercher un produit..."
                className="input !pl-12 !py-4 !text-base shadow-2xl"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchOpen(false)
                  if (e.key === 'Enter') {
                    const val = (e.target as HTMLInputElement).value
                    if (val) {
                      window.location.href = `/store/products?q=${encodeURIComponent(val)}`
                      setSearchOpen(false)
                    }
                  }
                }}
              />
              <kbd className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a4a5a] text-xs">ESC</kbd>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
