'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Trash2, Edit2, Plus, Copy, Gift } from 'lucide-react'

interface Coupon {
  id: string
  code: string
  type: 'PERCENTAGE' | 'FIXED'
  discount: number
  minOrder?: number
  maxUses?: number
  usedCount: number
  expiresAt?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    discount: '',
    minOrder: '',
    maxUses: '',
    expiresAt: '',
    active: true
  })

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/coupons')
      if (response.ok) {
        const data = await response.json()
        setCoupons(Array.isArray(data.coupons) ? data.coupons : [])
      }
    } catch (error) {
      console.error('Error fetching coupons:', error)
      toast.error('Erreur lors du chargement des coupons')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const payload = {
      ...formData,
      discount: parseFloat(formData.discount),
      minOrder: formData.minOrder ? parseFloat(formData.minOrder) : undefined,
      maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
      expiresAt: formData.expiresAt || undefined
    }

    try {
      const url = editingCoupon 
        ? `/api/coupons/${editingCoupon.id}`
        : '/api/coupons'
      
      const method = editingCoupon ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast.success(editingCoupon ? 'Coupon mis à jour' : 'Coupon créé')
        resetForm()
        fetchCoupons()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'PERCENTAGE',
      discount: '',
      minOrder: '',
      maxUses: '',
      expiresAt: '',
      active: true
    })
    setEditingCoupon(null)
    setShowForm(false)
  }

  const editCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      type: coupon.type,
      discount: coupon.discount.toString(),
      minOrder: coupon.minOrder?.toString() || '',
      maxUses: coupon.maxUses?.toString() || '',
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '',
      active: coupon.active
    })
    setShowForm(true)
  }

  const deleteCoupon = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce coupon ?')) return

    try {
      const response = await fetch(`/api/coupons/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Coupon supprimé')
        fetchCoupons()
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Code copié !')
  }

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData({ ...formData, code })
  }

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4920c]"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion des Coupons</h1>
          <p className="text-[#6e6e80] mt-1">Créez et gérez les coupons de réduction</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#d4920c] text-white rounded-lg hover:bg-[#b87a0a] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau coupon
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher un coupon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 bg-[#111114] border border-white/10 rounded-lg text-white placeholder-[#6e6e80] focus:outline-none focus:border-[#d4920c]"
        />
      </div>

      {/* Coupons List */}
      <div className="grid gap-4">
        {filteredCoupons.map((coupon) => (
          <div key={coupon.id} className="bg-[#1a1a1f] border border-white/10 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-mono font-bold text-[#d4920c]">
                    {coupon.code}
                  </span>
                  <button
                    onClick={() => copyToClipboard(coupon.code)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4 text-[#6e6e80]" />
                  </button>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    coupon.active 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {coupon.active ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm text-[#e8e8ec]">
                  <p>
                    {coupon.type === 'PERCENTAGE' 
                      ? `Réduction de ${coupon.discount}%`
                      : `Réduction de ${coupon.discount}F`
                    }
                  </p>
                  
                  {coupon.minOrder && (
                    <p>Min. d'achat: {coupon.minOrder}F</p>
                  )}
                  
                  {coupon.maxUses && (
                    <p>Utilisations: {coupon.usedCount}/{coupon.maxUses}</p>
                  )}
                  
                  {coupon.expiresAt && (
                    <p>Expire: {new Date(coupon.expiresAt).toLocaleDateString('fr-FR')}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => editCoupon(coupon)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-[#6e6e80]" />
                </button>
                <button
                  onClick={() => deleteCoupon(coupon.id)}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1a1f] rounded-xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingCoupon ? 'Modifier le coupon' : 'Nouveau coupon'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                      Code du coupon
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        placeholder="Laisser vide pour générer automatiquement"
                        className="flex-1 px-3 py-2 bg-[#111114] border border-white/10 rounded-lg text-white placeholder-[#6e6e80] focus:outline-none focus:border-[#d4920c]"
                      />
                      <button
                        type="button"
                        onClick={generateRandomCode}
                        className="px-3 py-2 bg-[#d4920c] text-white rounded-lg hover:bg-[#b87a0a] transition-colors"
                      >
                        <Gift className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                      Type de réduction
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'PERCENTAGE' | 'FIXED' })}
                      className="w-full px-3 py-2 bg-[#111114] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#d4920c]"
                    >
                      <option value="PERCENTAGE">Pourcentage (%)</option>
                      <option value="FIXED">Montant fixe (F)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                      Valeur de la réduction {formData.type === 'PERCENTAGE' ? '(%)' : '(F)'}
                    </label>
                    <input
                      type="number"
                      required
                      min={formData.type === 'PERCENTAGE' ? '1' : '0'}
                      max={formData.type === 'PERCENTAGE' ? '50' : undefined}
                      step={formData.type === 'PERCENTAGE' ? '1' : '0.01'}
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      className="w-full px-3 py-2 bg-[#111114] border border-white/10 rounded-lg text-white placeholder-[#6e6e80] focus:outline-none focus:border-[#d4920c]"
                    />
                    {formData.type === 'PERCENTAGE' && (
                      <p className="text-xs text-[#6e6e80] mt-1">Entre 1% et 50%</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                      Montant minimum d'achat (F)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.minOrder}
                      onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                      placeholder="Optionnel"
                      className="w-full px-3 py-2 bg-[#111114] border border-white/10 rounded-lg text-white placeholder-[#6e6e80] focus:outline-none focus:border-[#d4920c]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                      Nombre maximum d'utilisations
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxUses}
                      onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                      placeholder="Illimité si vide"
                      className="w-full px-3 py-2 bg-[#111114] border border-white/10 rounded-lg text-white placeholder-[#6e6e80] focus:outline-none focus:border-[#d4920c]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                      Date d'expiration
                    </label>
                    <input
                      type="date"
                      value={formData.expiresAt}
                      onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                      className="w-full px-3 py-2 bg-[#111114] border border-white/10 rounded-lg text-white placeholder-[#6e6e80] focus:outline-none focus:border-[#d4920c]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded border-white/10 bg-[#111114] text-[#d4920c] focus:ring-[#d4920c]"
                  />
                  <label htmlFor="active" className="text-sm text-[#e8e8ec]">
                    Coupon actif
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#d4920c] text-white rounded-lg hover:bg-[#b87a0a] transition-colors"
                  >
                    {editingCoupon ? 'Mettre à jour' : 'Créer le coupon'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-[#111114] border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
