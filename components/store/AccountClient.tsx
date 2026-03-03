// components/store/AccountClient.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { User, Package, Heart, MapPin, Settings, LogOut, Shield, Camera } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { WishlistTab } from './WishlistTab'

interface UserData {
  id: string
  name: string | null
  email: string | null
  image: string | null
  phone: string | null
  role: string
  createdAt: Date
  _count: { orders: number }
}

export function AccountClient({ user, tab: initialTab = 'profile' }: { user: UserData; tab?: string }) {
  const { data: session, update } = useSession()
  const [activeTab, setActiveTab] = useState(initialTab)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: user.name || '',
    phone: user.phone || '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        await update({ name: form.name })
        toast.success('Profil mis à jour !')
        setEditing(false)
      } else {
        toast.error('Erreur lors de la mise à jour')
      }
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'orders', label: 'Commandes', icon: Package },
    { id: 'wishlist', label: 'Favoris', icon: Heart },
    { id: 'addresses', label: 'Adresses', icon: MapPin },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-60 shrink-0">
          {/* User card */}
          <div className="card p-5 mb-4 text-center">
            <div className="relative w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden border-2 border-[rgba(212,146,12,0.3)]">
              {user.image ? (
                <img src={user.image} alt={user.name || ''} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#222228] flex items-center justify-center text-2xl font-bold text-[#d4920c]">
                  {user.name?.[0]?.toUpperCase() || '?'}
                </div>
              )}
            </div>
            <h3 className="font-display font-semibold text-[#e8e8ec] text-sm">{user.name || 'Utilisateur'}</h3>
            <p className="text-xs text-[#6e6e80] mt-0.5 truncate">{user.email}</p>
            {user.role === 'ADMIN' && (
              <span className="badge badge-gold text-[10px] mt-2">
                <Shield className="w-2.5 h-2.5" /> Admin
              </span>
            )}
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#6e6e80]">
              <span>{user._count.orders} commande{user._count.orders !== 1 ? 's' : ''}</span>
              <span>Depuis {new Date(user.createdAt).getFullYear()}</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-all ${
                  activeTab === tab.id
                    ? 'bg-[rgba(212,146,12,0.1)] text-[#d4920c] border border-[rgba(212,146,12,0.2)]'
                    : 'text-[#9898a8] hover:text-[#e8e8ec] hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                {tab.label}
              </button>
            ))}
            <button
              onClick={() => signOut({ callbackUrl: '/store' })}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-[#ef4444] hover:bg-[rgba(239,68,68,0.06)] transition-all"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Déconnexion
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-white">Mon profil</h2>
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="btn-secondary !py-2 !px-3 text-sm">
                    Modifier
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={handleSave} disabled={saving} className="btn-primary !py-2 !px-3 text-sm">
                      {saving ? 'Enregistrement...' : 'Sauvegarder'}
                    </button>
                    <button onClick={() => setEditing(false)} className="btn-ghost !py-2 !px-3 text-sm">
                      Annuler
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#9898a8] mb-1.5">Nom complet</label>
                  {editing ? (
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
                  ) : (
                    <p className="text-[#e8e8ec]">{user.name || '—'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-[#9898a8] mb-1.5">Email</label>
                  <p className="text-[#e8e8ec]">{user.email}</p>
                  <p className="text-xs text-[#6e6e80]">Non modifiable</p>
                </div>
                <div>
                  <label className="block text-sm text-[#9898a8] mb-1.5">Téléphone</label>
                  {editing ? (
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+226 70 00 00 00" className="input" />
                  ) : (
                    <p className="text-[#e8e8ec]">{user.phone || '—'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-[#9898a8] mb-1.5">Membre depuis</label>
                  <p className="text-[#e8e8ec]">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="card p-6">
              <h2 className="font-display font-semibold text-white mb-4">Mes commandes</h2>
              <div className="text-center py-10 text-[#6e6e80]">
                <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Chargement de vos commandes...</p>
                <a href="/store/orders" className="text-[#d4920c] text-sm hover:underline mt-2 inline-block">
                  Voir toutes mes commandes →
                </a>
              </div>
            </div>
          )}

          {activeTab === 'wishlist' && <WishlistTab />}

          {activeTab === 'addresses' && (
            <div className="card p-6">
              <h2 className="font-display font-semibold text-white mb-4">Mes adresses</h2>
              <div className="text-center py-10 text-[#6e6e80]">
                <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Aucune adresse enregistrée.</p>
                <p className="text-xs mt-1">Ajoutez une adresse lors de votre prochaine commande.</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="card p-6">
              <h2 className="font-display font-semibold text-white mb-6">Paramètres du compte</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.04)]">
                  <h3 className="text-sm font-medium text-[#f87171] mb-1">Zone de danger</h3>
                  <p className="text-xs text-[#6e6e80] mb-3">
                    La suppression de votre compte est irréversible. Toutes vos données seront effacées.
                  </p>
                  <button className="text-xs px-3 py-1.5 rounded-lg border border-[rgba(239,68,68,0.3)] text-[#f87171] hover:bg-[rgba(239,68,68,0.08)] transition-all">
                    Supprimer mon compte
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
