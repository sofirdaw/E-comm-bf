// app/admin/products/new/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Loader2, Upload, Package } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Category {
  id: string
  name: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    categoryId: '',
    stock: '10',
    brand: '',
    sku: '',
    images: [''],
    tags: '',
    featured: false,
    published: true,
  })

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then((d) => setCategories(d.categories || []))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.categoryId || !form.stock) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
          stock: parseInt(form.stock),
          images: form.images.filter(Boolean),
          tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      })

      if (res.ok) {
        toast.success('Produit créé avec succès !')
        router.push('/admin/products')
      } else {
        const d = await res.json()
        toast.error(d.error || 'Erreur lors de la création')
      }
    } finally {
      setLoading(false)
    }
  }

  const addImageField = () => setForm((f) => ({ ...f, images: [...f.images, ''] }))
  const removeImageField = (i: number) => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))
  const updateImage = (i: number, val: string) => {
    const imgs = [...form.images]
    imgs[i] = val
    setForm((f) => ({ ...f, images: imgs }))
  }

  const field = (label: string, required = false) => (
    <label className="block text-sm font-medium text-[#9898a8] mb-1.5">
      {label}{required && <span className="text-[#ef4444] ml-0.5">*</span>}
    </label>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="btn-ghost !px-2">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Nouveau produit</h1>
          <p className="text-[#6e6e80] text-sm">Ajouter un produit à la boutique</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-semibold text-[#e8e8ec] flex items-center gap-2">
            <Package className="w-4 h-4 text-[#d4920c]" />
            Informations de base
          </h2>
          <div>
            {field('Nom du produit', true)}
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Ex: iPhone 16 Pro Max"
              className="input"
            />
          </div>
          <div>
            {field('Description', true)}
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={4}
              placeholder="Description détaillée du produit..."
              className="input resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              {field('Marque')}
              <input
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                placeholder="Apple, Samsung..."
                className="input"
              />
            </div>
            <div>
              {field('SKU')}
              <input
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                placeholder="IPHX16PM-256"
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-semibold text-[#e8e8ec]">Prix & Stock</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              {field('Prix (FCFA)', true)}
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                min={0}
                placeholder="1299000"
                className="input font-mono"
              />
            </div>
            <div>
              {field('Prix soldé (FCFA)')}
              <input
                type="number"
                value={form.salePrice}
                onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                min={0}
                placeholder="1099000"
                className="input font-mono"
              />
            </div>
            <div>
              {field('Stock', true)}
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
                min={0}
                className="input font-mono"
              />
            </div>
          </div>
          <div>
            {field('Catégorie', true)}
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              required
              className="input"
            >
              <option value="" className="bg-[#1a1a1f]">Choisir une catégorie...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#1a1a1f]">{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Images */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-[#e8e8ec]">Images</h2>
            <button type="button" onClick={addImageField} className="btn-ghost text-[#d4920c] !px-2 text-sm">
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </div>
          <div className="space-y-3">
            {form.images.map((img, i) => (
              <div key={i} className="flex gap-2 items-center">
                <div className="w-12 h-12 rounded-lg bg-[#111114] border border-white/5 overflow-hidden shrink-0">
                  {img ? <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} /> : (
                    <div className="w-full h-full flex items-center justify-center opacity-20 text-lg">🖼️</div>
                  )}
                </div>
                <input
                  value={img}
                  onChange={(e) => updateImage(i, e.target.value)}
                  placeholder={`URL de l'image ${i + 1}`}
                  className="input flex-1"
                />
                {form.images.length > 1 && (
                  <button type="button" onClick={() => removeImageField(i)} className="w-9 h-9 rounded-lg flex items-center justify-center text-[#6e6e80] hover:text-[#ef4444] hover:bg-[rgba(239,68,68,0.08)] transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tags & Options */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-semibold text-[#e8e8ec]">Tags & Options</h2>
          <div>
            {field('Tags (séparés par des virgules)')}
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="apple, iphone, flagship, 5g"
              className="input"
            />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 accent-[#d4920c]"
              />
              <span className="text-sm text-[#9898a8]">Mettre en vedette</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="w-4 h-4 accent-[#d4920c]"
              />
              <span className="text-sm text-[#9898a8]">Publié</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {loading ? 'Création...' : 'Créer le produit'}
          </button>
          <Link href="/admin/products" className="btn-secondary">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  )
}
