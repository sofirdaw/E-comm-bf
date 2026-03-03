'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, Trash2, Star } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface WishlistItem {
  id: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    salePrice: number | null
    images: string[]
    rating: number
    category: { name: string }
  }
}

export function WishlistTab() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    fetchWishlist()
  }, [])

  useEffect(() => {
    // Listen for wishlist changes from other components
    const handleStorageChange = () => {
      setRefreshKey(prev => prev + 1)
    }
    
    window.addEventListener('wishlist-changed', handleStorageChange)
    return () => window.removeEventListener('wishlist-changed', handleStorageChange)
  }, [])

  useEffect(() => {
    // Refetch when refreshKey changes
    fetchWishlist()
  }, [refreshKey])

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/store/wishlist')
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (productId: string) => {
    try {
      const res = await fetch(`/api/store/wishlist/${productId}`, { method: 'DELETE' })
      if (res.ok) {
        setItems(prev => prev.filter(item => item.product.id !== productId))
        // Notify other components
        window.dispatchEvent(new Event('wishlist-changed'))
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-10"><div className="animate-spin w-6 h-6 border-2 border-[#d4920c] border-t-transparent rounded-full mx-auto"></div></div>
  }

  if (items.length === 0) {
    return (
      <div className="card p-6">
        <h2 className="font-display font-semibold text-white mb-4">Mes favoris</h2>
        <div className="text-center py-10 text-[#6e6e80]">
          <Heart className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Votre liste de souhaits est vide</p>
          <Link href="/store/products" className="text-[#d4920c] text-sm hover:underline mt-2 inline-block">
            Explorer les produits →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <h2 className="font-display font-semibold text-white mb-4">Mes favoris ({items.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="border border-white/5 rounded-xl p-4 hover:border-[rgba(212,146,12,0.3)] transition-colors">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#1a1a1f] shrink-0">
                {item.product.images[0] && (
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[#e8e8ec] truncate">{item.product.name}</h3>
                <p className="text-xs text-[#6e6e80] mb-2">{item.product.category.name}</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-sm font-bold text-[#e8aa1f]">
                    {formatPrice(item.product.salePrice || item.product.price)}
                  </span>
                  {item.product.salePrice && (
                    <span className="text-xs text-[#6e6e80] line-through">
                      {formatPrice(item.product.price)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/store/products/${item.product.slug}`} className="btn-ghost text-xs py-1 px-2">
                    Voir
                  </Link>
                  <button
                    onClick={() => handleRemove(item.product.id)}
                    className="btn-ghost text-[#ef4444] text-xs py-1 px-2"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
