// app/admin/products/new-page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Filter, Package } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { ImageUpload } from '@/components/admin/ImageUpload'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  salePrice?: number
  sku: string
  stock: number
  images: string[]
  featured: boolean
  published: boolean
  category?: {
    id: string
    name: string
    slug: string
  } | null
  brand: string
  weight?: number
  dimensions?: string
  tags: string[]
  views: number
  rating: number
  reviewCount: number
  createdAt: string
  updatedAt: string
  categoryId?: string | null
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    salePrice: '',
    sku: '',
    stock: '',
    categoryId: '',
    category: '',
    brand: '',
    weight: '',
    dimensions: '',
    tags: '',
    featured: false,
    published: true,
    images: [] as string[]
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(Array.isArray(data) ? data : [])
      } else {
        console.error('Categories API error:', response.status)
        setCategories([])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        // S'assurer que data est un tableau
        setProducts(Array.isArray(data) ? data : [])
      } else {
        console.error('API response not ok:', response.status)
        setProducts([])
        toast.error('Erreur lors du chargement des produits')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
      toast.error('Erreur lors du chargement des produits')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
      stock: parseInt(formData.stock),
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      // S'assurer que tous les champs sont inclus
      categoryId: formData.categoryId || undefined,
      brand: formData.brand || undefined,
      dimensions: formData.dimensions || undefined,
      images: formData.images || [],
      featured: formData.featured,
      published: formData.published
    }

    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products'

      const method = editingProduct ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast.success(editingProduct ? 'Produit mis à jour' : 'Produit créé')
        resetForm()
        fetchProducts()
        fetchCategories() // Recharger les catégories après création/modification
      } else {
        const error = await response.json()

        // Gérer le cas du SKU dupliqué avec suggestion
        if (error.suggestedSku) {
          toast.error(error.error, {
            duration: 5000,
            icon: '📋',
          })
          // Mettre à jour le champ SKU avec la suggestion
          setFormData(prev => ({
            ...prev,
            sku: error.suggestedSku
          }))
        } else {
          toast.error(error.error || 'Erreur lors de la sauvegarde')
        }
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      salePrice: '',
      sku: '',
      stock: '',
      categoryId: '',
      category: '',
      brand: '',
      weight: '',
      dimensions: '',
      tags: '',
      featured: false,
      published: true,
      images: [] as string[]
    })
    setEditingProduct(null)
    setShowForm(false)
  }

  const editProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      salePrice: product.salePrice?.toString() || '',
      sku: product.sku,
      stock: product.stock.toString(),
      categoryId: product.category?.id || '',
      category: product.category?.name || '',
      brand: product.brand,
      weight: product.weight?.toString() || '',
      dimensions: product.dimensions || '',
      tags: product.tags.join(', '),
      featured: product.featured,
      published: product.published,
      images: product.images
    })
    setShowForm(true)
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Produit supprimé')
        fetchProducts()
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const filtered = (products || []).filter(product => {
    if (!product) return false
    const searchLower = searchTerm.toLowerCase()
    return (
      (product.name && product.name.toLowerCase().includes(searchLower)) ||
      (product.sku && product.sku.toLowerCase().includes(searchLower)) ||
      (product.brand && product.brand.toLowerCase().includes(searchLower))
    )
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4920c]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-[#d4920c]" />
            Produits
          </h1>
          <p className="text-[#6e6e80] text-sm mt-0.5">
            Gérez votre catalogue de produits
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouveau produit
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6e6e80]" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1a1a1f] border border-white/10 rounded-lg text-white placeholder-[#6e6e80] focus:outline-none focus:border-[#d4920c]"
          />
        </div>
      </div>

      {/* Products List */}
      {!showForm && (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-medium text-[#6e6e80] uppercase tracking-wider pb-3 pl-6">
                    Image
                  </th>
                  <th className="text-left text-xs font-medium text-[#6e6e80] uppercase tracking-wider pb-3">
                    Produit
                  </th>
                  <th className="text-left text-xs font-medium text-[#6e6e80] uppercase tracking-wider pb-3">
                    Prix
                  </th>
                  <th className="text-left text-xs font-medium text-[#6e6e80] uppercase tracking-wider pb-3">
                    Stock
                  </th>
                  <th className="text-left text-xs font-medium text-[#6e6e80] uppercase tracking-wider pb-3">
                    Statut
                  </th>
                  <th className="text-left text-xs font-medium text-[#6e6e80] uppercase tracking-wider pb-3 pr-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 pl-6">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-[#111114] border border-white/5 flex items-center justify-center text-xs">
                          📦
                        </div>
                      )}
                    </td>
                    <td className="py-3">
                      <div>
                        <p className="text-sm font-medium text-[#e8e8ec]">{product.name}</p>
                        <p className="text-xs text-[#6e6e80]">{product.sku}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <div>
                        <p className="text-sm text-[#e8e8ec]">{formatPrice(product.price)}</p>
                        {product.salePrice && (
                          <p className="text-xs text-[#22c55e]">{formatPrice(product.salePrice)}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`text-sm px-2 py-1 rounded-full ${product.stock > 10
                          ? 'bg-[rgba(34,197,94,0.1)] text-[#22c55e]'
                          : product.stock > 0
                            ? 'bg-[rgba(212,146,12,0.1)] text-[#d4920c]'
                            : 'bg-[rgba(239,68,68,0.1)] text-[#ef4444]'
                        }`}>
                        {product.stock > 10 ? 'En stock' : product.stock > 0 ? `Plus que ${product.stock}` : 'Rupture'}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <span className={`badge ${product.published ? 'badge-success' : 'badge-warning'}`}>
                          {product.published ? 'Publié' : 'Brouillon'}
                        </span>
                        {product.featured && (
                          <span className="badge badge-gold">⭐</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => editProduct(product)}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4 text-[#6e6e80]" />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-1 hover:bg-red-500/10 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-[#6e6e80]">
                {searchTerm ? 'Aucun produit trouvé' : 'Aucun produit'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1a1f] rounded-xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Images Upload */}
                <div>
                  <label className="block text-sm font-medium text-[#e8e8ec] mb-3">
                    Images du produit
                  </label>
                  <ImageUpload
                    images={formData.images}
                    onChange={(images) => setFormData({ ...formData, images })}
                    maxImages={5}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                      Nom du produit *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#111114] border border-white/10 rounded-lg text-white placeholder-[#6e6e80] focus:outline-none focus:border-[#d4920c]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-3 py-2 bg-[#111114] border border-white/10 rounded-lg text-white placeholder-[#6e6e80] focus:outline-none focus:border-[#d4920c]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#111114] border border-white/10 rounded-lg text-white placeholder-[#6e6e80] focus:outline-none focus:border-[#d4920c]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                      Prix (FCFA) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 bg-[#111114] border border-white/10 rounded-lg text-white placeholder-[#6e6e80] focus:outline-none focus:border-[#d4920c]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                      Prix promotionnel
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.salePrice}
                      onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                      className="w-full px-3 py-2 bg-[#111114] border border-white/10 rounded-lg text-white placeholder-[#6e6e80] focus:outline-none focus:border-[#d4920c]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                      Stock *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-3 py-2 bg-[#111114] border border-white/10 rounded-lg text-white placeholder-[#6e6e80] focus:outline-none focus:border-[#d4920c]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                      Catégorie
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        className="flex-1 px-3 py-2 bg-[#111114] border border-white/10 rounded-lg text-white placeholder-[#6e6e80] focus:outline-none focus:border-[#d4920c]"
                      >
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={fetchCategories}
                        className="px-3 py-2 bg-[#d4920c] text-white rounded-lg hover:bg-[#b87a0a] transition-colors"
                        title="Recharger les catégories"
                      >
                        ↻
                      </button>
                    </div>
                    {categories.length === 0 && (
                      <p className="text-xs text-[#6e6e80] mt-1">
                        Aucune catégorie trouvée. Créez d'abord une catégorie.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                      Marque
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-3 py-2 bg-[#111114] border border-white/10 rounded-lg text-white placeholder-[#6e6e80] focus:outline-none focus:border-[#d4920c]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                    Tags (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="t-shirt, mode, été"
                    className="w-full px-3 py-2 bg-[#111114] border border-white/10 rounded-lg text-white placeholder-[#6e6e80] focus:outline-none focus:border-[#d4920c]"
                  />
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm text-[#e8e8ec]">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded border-white/10 bg-[#111114] text-[#d4920c] focus:ring-[#d4920c]"
                    />
                    Produit vedette
                  </label>

                  <label className="flex items-center gap-2 text-sm text-[#e8e8ec]">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="rounded border-white/10 bg-[#111114] text-[#d4920c] focus:ring-[#d4920c]"
                    />
                    Publié
                  </label>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-ghost"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {editingProduct ? 'Mettre à jour' : 'Créer le produit'}
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
