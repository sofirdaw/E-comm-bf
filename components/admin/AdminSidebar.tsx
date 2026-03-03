// components/admin/AdminSidebar.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag,
  BarChart2, Settings, Store, LogOut, ChevronRight,
  Ticket, Image as ImageIcon, Megaphone
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    section: 'Principal',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Commandes', href: '/admin/orders', icon: ShoppingCart },
      { label: 'Produits', href: '/admin/products', icon: Package },
      { label: 'Catégories', href: '/admin/categories', icon: Tag },
      { label: 'Utilisateurs', href: '/admin/users', icon: Users },
    ],
  },
  {
    section: 'Marketing',
    items: [
      { label: 'Coupons', href: '/admin/coupons', icon: Ticket },
      { label: 'Banners', href: '/admin/banners', icon: ImageIcon },
      { label: 'Newsletter', href: '/admin/newsletter', icon: Megaphone },
    ],
  },
  {
    section: 'Analytique',
    items: [
      { label: 'Statistiques', href: '/admin/stats', icon: BarChart2 },
      { label: 'Paramètres', href: '/admin/settings', icon: Settings },
    ],
  },
]

interface User {
  name?: string | null
  email?: string | null
  image?: string | null
  role: string
}

export function AdminSidebar({ user }: { user: User }) {
  const pathname = usePathname()

  return (
    <aside className="w-64 shrink-0 flex flex-col bg-[#0d0d10] border-r border-white/5 overflow-y-auto">
      {/* Logo */}
      <div className="p-5 border-b border-white/5">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#e8aa1f] to-[#b07408]" />
            <span className="absolute inset-0 flex items-center justify-center text-[#0a0a0b] font-bold text-sm">E</span>
          </div>
          <div>
            <span className="font-display font-bold text-sm text-white">e-comm</span>
            <span className="font-display font-bold text-sm text-[#d4920c]">bf</span>
            <span className="ml-1.5 badge badge-gold text-[9px] py-0 px-1.5">Admin</span>
          </div>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1a1a1f]">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-[rgba(212,146,12,0.3)] shrink-0">
            {user.image ? (
              <img src={user.image} alt={user.name || ''} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#2a2a30] flex items-center justify-center text-[#d4920c] text-sm font-bold">
                {user.name?.[0]?.toUpperCase() || 'A'}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#e8e8ec] truncate">{user.name}</p>
            <p className="text-xs text-[#6e6e80] truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6">
        {navItems.map((section) => (
          <div key={section.section}>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-[#4a4a5a] mb-2 px-2">
              {section.section}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/admin' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all group',
                      isActive
                        ? 'bg-[rgba(212,146,12,0.1)] text-[#d4920c] border border-[rgba(212,146,12,0.2)]'
                        : 'text-[#9898a8] hover:text-[#e8e8ec] hover:bg-white/5'
                    )}
                  >
                    <item.icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-[#d4920c]' : 'text-current')} />
                    <span className="flex-1">{item.label}</span>
                    {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <Link
          href="/store"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-[#9898a8] hover:text-[#e8e8ec] hover:bg-white/5 transition-all"
        >
          <Store className="w-4 h-4" />
          Voir la boutique
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-[#9898a8] hover:text-[#ef4444] hover:bg-[rgba(239,68,68,0.06)] transition-all text-left"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
