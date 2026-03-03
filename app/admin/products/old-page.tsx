// app/admin/products/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Search, Filter, Package, TrendingUp, Eye } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { ImageUpload } from '@/components/admin/ImageUpload'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  salePrice: number | null
  stock: number
  featured: boolean
  published: boolean
  category: { name: string }
  _count: { orderItems: number; reviews: number }
  images: string[]
  brand: string | null
}

async function getProducts() {
  const response = await fetch('/api/admin/products')
  if (!response.ok) throw new Error('Failed to fetch products')
  return response.json()
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProductsData()
  }, [])

  const fetchProductsData = async () => {
    try {
      const data = await getProducts()
      setProducts(data.products)
      setTotal(data.total)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) return
    
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== id))
        setTotal(prev => prev - 1)
      } else {
        throw new Error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Erreur lors de la suppression du produit')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Produits</h1>
          <p className="text-[#6e6e80] text-sm mt-0.5">{total} produit{total !== 1 ? 's' : ''} au total</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          Nouveau produit
        </Link>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Produit', 'Catégorie', 'Prix', 'Stock', 'Ventes', 'Statut', 'Actions'].map((h, index) => (
                  <th key={`header-${index}`} className="text-left text-xs font-medium text-[#6e6e80] uppercase tracking-wider py-3 px-4 first:pl-6 last:pr-6">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((product) => (
                <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors">
                  {/* Product */}
                  <td className="py-3 pl-6 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#111114] shrink-0">
                        {product.images[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl opacity-20">📦</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#e8e8ec] truncate max-w-[200px]">{product.name}</p>
                        {product.brand && (
                          <p className="text-xs text-[#6e6e80]">{product.brand}</p>
                        )}
                        {product.featured && (
                          <span className="badge badge-gold text-[9px] py-0 px-1.5 mt-0.5">⭐ Vedette</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="text-sm text-[#9898a8]">{product.category.name}</span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4">
                    <span className="font-mono text-sm font-bold text-[#e8aa1f]">
                      {formatPrice(product.salePrice ?? product.price)}
                    </span>
                    {product.salePrice && (
                      <span className="block text-xs text-[#6e6e80] line-through font-mono">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="py-3 px-4">
                    <span className={`text-sm font-mono font-medium ${
                      product.stock === 0 ? 'text-[#f87171]' :
                      product.stock <= 5 ? 'text-[#fbbf24]' :
                      'text-[#4ade80]'
                    }`}>
                      {product.stock}
                    </span>
                  </td>

                  {/* Sales */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-sm text-[#9898a8]">
                      <TrendingUp className="w-3 h-3" />
                      {product._count.orderItems}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span className={`badge text-xs ${product.published ? 'badge-success' : 'badge-error'}`}>
                      {product.published ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 pl-4 pr-6">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/store/products/${product.slug}`}
                        target="_blank"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6e6e80] hover:text-[#9898a8] hover:bg-white/5 transition-all"
                        title="Voir"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6e6e80] hover:text-[#d4920c] hover:bg-[rgba(212,146,12,0.08)] transition-all"
                        title="Modifier"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6e6e80] hover:text-[#ef4444] hover:bg-[rgba(239,68,68,0.08)] transition-all"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
