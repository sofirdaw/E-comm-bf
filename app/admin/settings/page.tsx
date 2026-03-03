'use client'

import { useState, useEffect } from 'react'
import { Settings, Save, Store, Mail, Globe, Bell } from 'lucide-react'
import toast from 'react-hot-toast'

interface SettingsData {
  storeName: string
  storeEmail: string
  storePhone: string
  currency: string
  language: string
  freeShippingThreshold: string
  shippingCost: string
  emailNotifications: string
  orderNotifications: string
  stockAlerts: string
  minStockAlert: string
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    storeName: 'e-comm-bf',
    storeEmail: 'contact@ecommbf.com',
    storePhone: '+226 66193424',
    currency: 'XOF',
    language: 'fr',
    freeShippingThreshold: '50000',
    shippingCost: '1000',
    emailNotifications: 'true',
    orderNotifications: 'true',
    stockAlerts: 'true',
    minStockAlert: '5',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Erreur lors du chargement des paramètres')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      
      if (response.ok) {
        toast.success('Paramètres sauvegardés !')
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const Section = ({ title, icon: Icon, children }: any) => (
    <div className="card p-6">
      <h2 className="font-display font-semibold text-white flex items-center gap-2 mb-5">
        <Icon className="w-4 h-4 text-[#d4920c]" />
        {title}
      </h2>
      {children}
    </div>
  )

  return (
    <div className="max-w-2xl space-y-6">
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-[#d4920c] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[#6e6e80]">Chargement des paramètres...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                    <Settings className="w-6 h-6 text-[#d4920c]" />
                    Paramètres
                  </h1>
              <p className="text-[#6e6e80] text-sm mt-0.5">Configuration de la boutique</p>
            </div>
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              <Save className="w-4 h-4" />
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>

          <Section title="Informations de la boutique" icon={Store}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#9898a8] mb-1.5">Nom de la boutique</label>
                  <input value={settings.storeName} onChange={(e) => setSettings({ ...settings, storeName: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="block text-sm text-[#9898a8] mb-1.5">Devise</label>
                  <select value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} className="input">
                    <option value="XOF" className="bg-[#1a1a1f]">FCFA (XOF)</option>
                    {/* <option value="EUR" className="bg-[#1a1a1f]">Euro (EUR)</option> */}
                    <option value="USD" className="bg-[#1a1a1f]">Dollar (USD)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#9898a8] mb-1.5">Email de contact</label>
                <input type="email" value={settings.storeEmail} onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })} className="input" />
              </div>
              <div>
                <label className="block text-sm text-[#9898a8] mb-1.5">Téléphone</label>
                <input value={settings.storePhone} onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })} className="input" />
              </div>
            </div>
          </Section>

          <Section title="Livraison" icon={Globe}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#9898a8] mb-1.5">Seuil livraison gratuite (FCFA)</label>
                  <input
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) => setSettings({ ...settings, freeShippingThreshold: e.target.value })}
                    className="input font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#9898a8] mb-1.5">Coût de livraison (FCFA)</label>
                  <input
                    type="number"
                    value={settings.shippingCost}
                    onChange={(e) => setSettings({ ...settings, shippingCost: e.target.value })}
                    className="input font-mono"
                  />
                </div>
              </div>
            </div>
          </Section>

          <Section title="Notifications" icon={Bell}>
            <div className="space-y-3">
              {[
                { key: 'emailNotifications', label: 'Notifications par email', desc: 'Recevoir des résumés par email' },
                { key: 'orderNotifications', label: 'Nouvelles commandes', desc: 'Alerte à chaque nouvelle commande' },
                { key: 'stockAlerts', label: 'Alertes de stock', desc: 'Alerte quand le stock est faible' },
              ].map(({ key, label, desc }, index) => (
                <div key={`${key}-${index}`} className="flex items-center justify-between p-3 rounded-xl bg-[#1a1a1f]">
                  <div>
                    <p className="text-sm font-medium text-[#e8e8ec]">{label}</p>
                    <p className="text-xs text-[#6e6e80]">{desc}</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, [key]: (settings as any)[key] === 'true' ? 'false' : 'true' })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${(settings as any)[key] === 'true' ? 'bg-[#d4920c]' : 'bg-[#323240]'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${(settings as any)[key] === 'true' ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              ))}

              <div>
                <label className="block text-sm text-[#9898a8] mb-1.5">Stock minimum avant alerte</label>
                <input
                  type="number"
                  value={settings.minStockAlert}
                  onChange={(e) => setSettings({ ...settings, minStockAlert: e.target.value })}
                  min={1}
                  className="input w-28 font-mono"
                />
              </div>
            </div>
          </Section>
        </>
      )}
    </div>
  )
}
