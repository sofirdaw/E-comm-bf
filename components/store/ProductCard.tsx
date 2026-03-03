// components/store/ProductCard.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Heart, ShoppingCart, Eye, Zap } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/cart'
import { formatPrice, getDiscountPercentage, cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { RatingBadge } from './StarRating'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  salePrice: number | null
  images: string[]
  rating: number
  reviewCount: number
  stock: number
  brand: string | null
  category?: { name: string; slug: string } | null
}

export function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCartStore()
  const { toggleItem, hasItem } = useWishlistStore()

  const isWishlisted = hasItem(product.id)
  const displayPrice = product.salePrice ?? product.price
  const discount = product.salePrice
    ? getDiscountPercentage(product.price, product.salePrice)
    : 0
  const inStock = product.stock > 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!inStock || isAdding) return

    setIsAdding(true)
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      image: product.images[0] || '',
      stock: product.stock,
      quantity: 1,
    })
    toast.success('Ajouté au panier', {
      icon: '🛒',
    })
    setTimeout(() => setIsAdding(false), 800)
  }

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()

    try {
      if (isWishlisted) {
        // Remove from wishlist
        const response = await fetch(`/api/store/wishlist/${product.id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          toggleItem(product.id)
          toast('Retiré de la liste ❤️', { icon: '💔' })
          // Notify other components to refresh
          window.dispatchEvent(new Event('wishlist-changed'))
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/store/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id }),
        })
        if (response.ok) {
          toggleItem(product.id)
          toast('Ajouté à la liste ❤️', { icon: '❤️' })
          // Notify other components to refresh
          window.dispatchEvent(new Event('wishlist-changed'))
        }
      }
    } catch (error) {
      console.error('Error updating wishlist:', error)
      toast('Erreur lors de la mise à jour de la liste', { icon: '❌' })
    }
  }

  return (
    <Link href={`/store/products/${product.slug}`} className="group block">
      <div className="card overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square bg-[#111114] overflow-hidden">
          {!imgError && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-5xl opacity-20">📦</div>
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="badge badge-gold text-xs font-bold">
                -{discount}%
              </span>
            )}
            {!inStock && (
              <span className="badge badge-error text-xs">
                Épuisé
              </span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <span className="badge badge-warning text-xs">
                <Zap className="w-2.5 h-2.5" />
                Presque épuisé
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <button
              onClick={handleWishlist}
              className={cn(
                'w-8 h-8 rounded-lg glass flex items-center justify-center transition-all',
                isWishlisted
                  ? 'text-[#ef4444] border border-[rgba(239,68,68,0.3)]'
                  : 'text-[#9898a8] hover:text-[#e8e8ec] border border-white/10'
              )}
              aria-label="Wishlist"
            >
              <Heart className={cn('w-4 h-4', isWishlisted && 'fill-current')} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                window.location.href = `/store/products/${product.slug}`
              }}
              className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center text-[#9898a8] hover:text-[#e8e8ec] transition-all"
              aria-label="Voir le produit"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Add to cart overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              disabled={!inStock || isAdding}
              className={cn(
                'w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all',
                inStock
                  ? 'btn-primary !rounded-lg'
                  : 'bg-[#232330] text-[#6e6e80] cursor-not-allowed'
              )}
            >
              <ShoppingCart className="w-4 h-4" />
              {isAdding ? 'Ajouté ✓' : inStock ? 'Ajouter au panier' : 'Épuisé'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          {/* Brand & category */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-[#6e6e80] uppercase tracking-wider">
              {product.brand || product.category?.name || 'Non catégorisé'}
            </span>
            {/* Rating */}
            <RatingBadge rating={product.rating} count={product.reviewCount} />
          </div>

          {/* Name */}
          <h3 className="font-medium text-sm text-[#e8e8ec] leading-snug mb-3 group-hover:text-white transition-colors line-clamp-2 flex-1">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 mt-auto">
            <span className="font-bold text-[#e8aa1f] text-sm sm:text-base font-mono whitespace-nowrap">
              {formatPrice(displayPrice)}
            </span>
            {product.salePrice && (
              <span className="text-[10px] sm:text-xs text-[#6e6e80] line-through font-mono whitespace-nowrap">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

// Skeleton loader
export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-square animate-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-3 animate-shimmer rounded-full w-1/3" />
        <div className="h-4 animate-shimmer rounded-full w-4/5" />
        <div className="h-4 animate-shimmer rounded-full w-2/3" />
        <div className="h-5 animate-shimmer rounded-full w-1/2" />
      </div>
    </div>
  )
}
