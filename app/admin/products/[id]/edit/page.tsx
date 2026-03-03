// app/admin/products/[id]/edit/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  salePrice: number | null
  sku: string | null
  stock: number
  images: string[]
  featured: boolean
  published: boolean
  categoryId: string
  brand: string | null
  weight: number | null
  dimensions: string | null
  tags: string[]
}

interface Category {
  id: string
  name: string
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    if (params.id) {
      fetchProduct()
      fetchCategories()
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    setSaving(true)
    try {
      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      })

      if (response.ok) {
        router.push('/admin/products')
      } else {
        throw new Error('Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Erreur lors de la mise à jour du produit')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof Product, value: any) => {
    if (!product) return
    setProduct({ ...product, [field]: value })
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4920c]"></div>
          <p className="text-[#6e6e80] text-sm mt-4">Chargement du produit...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-[#e8e8ec] mb-2">Produit non trouvé</h3>
          <button onClick={() => router.push('/admin/products')} className="btn-primary">
            Retour aux produits
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/products')}
            className="btn-ghost"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux produits
          </button>
          <h1 className="text-2xl font-bold text-[#e8e8ec]">Modifier le produit</h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {/* Basic Info */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-white mb-4">Informations de base</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                Nom du produit *
              </label>
              <input
                type="text"
                value={product.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                SKU
              </label>
              <input
                type="text"
                value={product.sku || ''}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                className="input"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
              Description *
            </label>
            <textarea
              value={product.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="input min-h-[120px]"
              required
            />
          </div>
        </div>

        {/* Category */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-white mb-4">Catégorie</h2>
          
          <div>
            <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
              Catégorie *
            </label>
            <select
              value={product.categoryId}
              onChange={(e) => handleInputChange('categoryId', e.target.value)}
              className="input"
              required
            >
              <option value="">Choisir une catégorie...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-white mb-4">Prix</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                Prix de vente *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={product.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                Prix promotionnel
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={product.salePrice || ''}
                onChange={(e) => handleInputChange('salePrice', e.target.value ? parseFloat(e.target.value) : null)}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Stock */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-white mb-4">Stock</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                Quantité en stock *
              </label>
              <input
                type="number"
                min="0"
                value={product.stock}
                onChange={(e) => handleInputChange('stock', parseInt(e.target.value))}
                className="input"
                required
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="published"
                checked={product.published}
                onChange={(e) => handleInputChange('published', e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-[#1a1a1f] text-[#d4920c] focus:ring-[#d4920c]"
              />
              <label htmlFor="published" className="text-sm font-medium text-[#e8e8ec]">
                Publié
              </label>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="featured"
                checked={product.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-[#1a1a1f] text-[#d4920c] focus:ring-[#d4920c]"
              />
              <label htmlFor="featured" className="text-sm font-medium text-[#e8e8ec]">
                Produit vedette
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Mise à jour...' : 'Mettre à jour'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="btn-secondary"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}
