// components/store/ProductDetailClient.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ShoppingCart, Heart, Star, ChevronLeft, Minus, Plus,
  Truck, Shield, RefreshCw, Share2, Check, Zap
} from 'lucide-react'
import { useCartStore, useWishlistStore } from '@/store/cart'
import { formatPrice, getDiscountPercentage, cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Review {
  id: string
  rating: number
  title: string | null
  body: string
  createdAt: Date
  user: { name: string | null; image: string | null }
}

interface Variant {
  id: string
  name: string
  value: string
  price: number | null
  stock: number
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  salePrice: number | null
  stock: number
  images: string[]
  brand: string | null
  rating: number
  reviewCount: number
  tags: string[]
  category: { name: string; slug: string }
  reviews: Review[]
  variants: Variant[]
}

export function ProductDetailClient({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [adding, setAdding] = useState(false)
  const { addItem } = useCartStore()
  const { toggleItem, hasItem } = useWishlistStore()

  const isWishlisted = hasItem(product.id)
  const displayPrice = selectedVariant?.price ?? product.salePrice ?? product.price
  const discount = product.salePrice ? getDiscountPercentage(product.price, product.salePrice) : 0
  const currentStock = selectedVariant?.stock ?? product.stock
  const inStock = currentStock > 0

  // Group variants by name
  const variantGroups = product.variants.reduce<Record<string, Variant[]>>((acc, v) => {
    if (!acc[v.name]) acc[v.name] = []
    acc[v.name].push(v)
    return acc
  }, {})

  const handleAddToCart = async () => {
    if (!inStock || adding) return
    setAdding(true)
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      image: product.images[0] || '',
      stock: currentStock,
      quantity,
      variantId: selectedVariant?.id,
      variantName: selectedVariant ? `${selectedVariant.name}: ${selectedVariant.value}` : undefined,
    })
    toast.success(`${quantity} article${quantity > 1 ? 's' : ''} ajouté${quantity > 1 ? 's' : ''} au panier`, { icon: '🛒' })
    setTimeout(() => setAdding(false), 800)
  }

  const handleWishlist = () => {
    toggleItem(product.id)
    toast(isWishlisted ? 'Retiré de la liste' : 'Ajouté à la liste ❤️', {
      icon: isWishlisted ? '💔' : '❤️',
    })
  }

  const handleShare = async () => {
    try {
      if (typeof window !== 'undefined' && navigator.share) {
        await navigator.share({ title: product.name, url: window.location.href })
      } else {
        throw new Error('Share API not available')
      }
    } catch {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Lien copié !')
      }
    }
  }

  return (
    <>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#6e6e80] mb-8">
        <Link href="/store" className="hover:text-[#d4920c] transition-colors">Accueil</Link>
        <span>/</span>
        <Link href="/store/products" className="hover:text-[#d4920c] transition-colors">Produits</Link>
        <span>/</span>
        <Link href={`/store/products?category=${product.category.slug}`} className="hover:text-[#d4920c] transition-colors">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-[#9898a8] truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#111114] border border-white/5">
            {product.images[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover animate-fade-in"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl opacity-10">📦</div>
            )}
            {discount > 0 && (
              <div className="absolute top-4 left-4">
                <span className="badge badge-gold font-bold">-{discount}%</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    'shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all',
                    i === selectedImage
                      ? 'border-[#d4920c]'
                      : 'border-white/5 hover:border-white/20'
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {/* Brand & category */}
          <div className="flex items-center gap-2 mb-3">
            {product.brand && (
              <span className="text-xs font-medium uppercase tracking-wider text-[#d4920c] bg-[rgba(212,146,12,0.08)] border border-[rgba(212,146,12,0.2)] px-2 py-0.5 rounded-full">
                {product.brand}
              </span>
            )}
            <Link
              href={`/store/products?category=${product.category.slug}`}
              className="text-xs text-[#6e6e80] hover:text-[#9898a8] transition-colors"
            >
              {product.category.name}
            </Link>
          </div>

          <h1 className="font-display text-3xl font-bold text-white mb-4 leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-4 h-4',
                    i < Math.round(product.rating)
                      ? 'fill-[#d4920c] text-[#d4920c]'
                      : 'text-[#4a4a5a]'
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-[#9898a8]">
              {product.rating.toFixed(1)} ({product.reviewCount} avis)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-4xl font-bold text-[#e8aa1f]">
              {formatPrice(displayPrice)}
            </span>
            {product.salePrice && (
              <span className="text-xl text-[#6e6e80] line-through font-mono">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <div className={cn('w-2 h-2 rounded-full', inStock ? 'bg-[#22c55e]' : 'bg-[#ef4444]')} />
            <span className={cn('text-sm font-medium', inStock ? 'text-[#4ade80]' : 'text-[#f87171]')}>
              {inStock
                ? currentStock <= 5
                  ? `⚡ Plus que ${currentStock} en stock !`
                  : 'En stock'
                : 'Rupture de stock'}
            </span>
          </div>

          {/* Variants */}
          {Object.entries(variantGroups).map(([groupName, variants]) => (
            <div key={groupName} className="mb-5">
              <p className="text-sm font-medium text-[#9898a8] mb-2">
                {groupName}:{' '}
                <span className="text-[#e8e8ec]">{selectedVariant?.value || 'Choisir'}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v.id === selectedVariant?.id ? null : v)}
                    disabled={v.stock === 0}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium border transition-all',
                      v.id === selectedVariant?.id
                        ? 'border-[#d4920c] bg-[rgba(212,146,12,0.1)] text-[#d4920c]'
                        : v.stock === 0
                        ? 'border-white/5 text-[#4a4a5a] cursor-not-allowed line-through'
                        : 'border-white/10 text-[#9898a8] hover:border-white/25 hover:text-[#e8e8ec]'
                    )}
                  >
                    {v.value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-11 h-11 flex items-center justify-center text-[#9898a8] hover:text-white hover:bg-white/5 transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-[#e8e8ec] font-mono font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                disabled={quantity >= currentStock}
                className="w-11 h-11 flex items-center justify-center text-[#9898a8] hover:text-white hover:bg-white/5 transition-all disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-sm text-[#6e6e80]">
              Total: <span className="text-[#e8aa1f] font-bold font-mono">{formatPrice(displayPrice * quantity)}</span>
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={!inStock || adding}
              className={cn(
                'flex-1 py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all',
                inStock ? 'btn-primary' : 'bg-[#232330] text-[#6e6e80] cursor-not-allowed'
              )}
            >
              {adding ? (
                <>
                  <Check className="w-4 h-4" />
                  Ajouté !
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  {inStock ? 'Ajouter au panier' : 'Épuisé'}
                </>
              )}
            </button>

            <button
              onClick={handleWishlist}
              className={cn(
                'w-12 h-12 rounded-xl border flex items-center justify-center transition-all',
                isWishlisted
                  ? 'border-[rgba(239,68,68,0.4)] bg-[rgba(239,68,68,0.08)] text-[#f87171]'
                  : 'border-white/10 text-[#6e6e80] hover:border-white/20 hover:text-[#e8e8ec]'
              )}
            >
              <Heart className={cn('w-5 h-5', isWishlisted && 'fill-current')} />
            </button>

            <button
              onClick={handleShare}
              className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center text-[#6e6e80] hover:border-white/20 hover:text-[#e8e8ec] transition-all"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 py-5 border-y border-white/5 mb-6">
            {[
              { icon: Truck, label: 'Livraison rapide', sub: 'Ouaga & régions' },
              { icon: Shield, label: 'Garantie 1 an', sub: 'Produit authentique' },
              { icon: RefreshCw, label: 'Retour 14j', sub: 'Satisfait ou remboursé' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="text-center">
                <Icon className="w-5 h-5 text-[#d4920c] mx-auto mb-1" />
                <p className="text-xs font-medium text-[#e8e8ec]">{label}</p>
                <p className="text-[10px] text-[#6e6e80]">{sub}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-medium text-[#e8e8ec] mb-2">Description</h3>
            <p className="text-sm text-[#9898a8] leading-relaxed">{product.description}</p>
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <span key={`${tag}-${index}`} className="px-2 py-0.5 rounded-full text-xs text-[#6e6e80] border border-white/8 bg-white/[0.03]">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews section */}
      {product.reviews.length > 0 && (
        <section className="mt-16 pt-10 border-t border-white/5">
          <h2 className="font-display text-2xl font-bold text-white mb-8">
            Avis clients ({product.reviewCount})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-[#1a1a1f]">
                      {review.user.image ? (
                        <img src={review.user.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-[#d4920c]">
                          {review.user.name?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#e8e8ec]">{review.user.name || 'Anonyme'}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'w-3 h-3',
                              i < review.rating ? 'fill-[#d4920c] text-[#d4920c]' : 'text-[#4a4a5a]'
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-[#6e6e80]">
                    {new Date(review.createdAt).toLocaleDateString('fr-BF')}
                  </span>
                </div>
                {review.title && (
                  <h4 className="text-sm font-medium text-[#e8e8ec] mb-1">{review.title}</h4>
                )}
                <p className="text-sm text-[#9898a8] leading-relaxed">{review.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
