// app/store/cart/page.tsx
'use client'

import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import {
  ShoppingCart, Minus, Plus, Trash2, ArrowRight, Tag, Package
} from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import CouponInput from '@/components/store/CouponInput'
import ShippingInfo from '@/components/store/ShippingInfo'

export default function CartPage() {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    getSubtotal,
    getShippingCalculation,
    getTotalWithShipping,
    couponValidation 
  } = useCartStore()
  
  const subtotal = getSubtotal()
  const shipping = getShippingCalculation()
  const totalWithShipping = getTotalWithShipping()

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 rounded-2xl bg-[#1a1a1f] border border-white/5 flex items-center justify-center mx-auto mb-6">
          <Package className="w-12 h-12 text-[#4a4a5a]" />
        </div>
        <h1 className="font-display text-3xl font-bold text-white mb-3">Votre panier est vide</h1>
        <p className="text-[#9898a8] mb-8">Découvrez nos produits et ajoutez vos favoris.</p>
        <Link href="/store/products" className="btn-primary">
          Explorer la boutique
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-white">
          Mon panier{' '}
          <span className="text-[#d4920c] text-2xl">({items.length})</span>
        </h1>
        <button
          onClick={() => { clearCart(); toast('Panier vidé', { icon: '🗑️' }) }}
          className="text-sm text-[#ef4444] hover:text-[#f87171] transition-colors"
        >
          Vider le panier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.id}-${item.variantId}`} className="card p-6 flex gap-4 group">
              {/* Image */}
              <Link href={`/store/products/${item.slug}`} className="w-24 h-24 rounded-xl overflow-hidden bg-[#111114] shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl opacity-20">📦</div>
                )}
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Link href={`/store/products/${item.slug}`} className="text-sm font-medium text-[#e8e8ec] hover:text-white transition-colors line-clamp-2">
                    {item.name}
                  </Link>
                  <button
                    onClick={() => { removeItem(item.id, item.variantId); toast('Retiré du panier', { icon: '🗑️' }) }}
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[#6e6e80] hover:text-[#ef4444] hover:bg-[rgba(239,68,68,0.08)] transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {item.variantName && (
                  <p className="text-xs text-[#6e6e80] mb-4">{item.variantName}</p>
                )}

                <div className="flex items-center justify-between">
                  {/* Qty */}
                  <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1, item.variantId)}
                      className="w-10 h-10 flex items-center justify-center text-[#9898a8] hover:text-white hover:bg-white/5 transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-mono font-bold text-[#e8e8ec]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)}
                      disabled={item.quantity >= item.stock}
                      className="w-10 h-10 flex items-center justify-center text-[#9898a8] hover:text-white hover:bg-white/5 transition-all disabled:opacity-40"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-bold text-[#e8aa1f] font-mono">
                      {formatPrice((item.salePrice ?? item.price) * item.quantity)}
                    </p>
                    <p className="text-xs text-[#6e6e80] font-mono">
                      {formatPrice(item.salePrice ?? item.price)} / unité
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-display font-semibold text-white mb-5">Résumé de commande</h2>

            {/* Coupon Input */}
            <CouponInput />
            
            {/* Shipping Info */}
            <ShippingInfo />

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-[#9898a8]">Sous-total</span>
                <span className="text-[#e8e8ec] font-mono">{formatPrice(subtotal)}</span>
              </div>
              
              {couponValidation?.isValid && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#9898a8]">Réduction</span>
                  <span className="text-green-400 font-mono">-{formatPrice(couponValidation.discountAmount)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-[#9898a8]">Livraison</span>
                <span className={shipping.isFreeShipping ? 'text-green-400 text-sm font-medium' : 'text-[#e8e8ec] font-mono'}>
                  {shipping.isFreeShipping ? 'Gratuite ✓' : formatPrice(shipping.shippingCost)}
                </span>
              </div>
            </div>

            <div className="border-t border-white/8 pt-4 mb-5">
              <div className="flex items-center justify-between">
                <span className="font-display font-semibold text-[#e8e8ec]">Total</span>
                <span className="font-bold text-2xl text-[#e8aa1f] font-mono">{formatPrice(totalWithShipping)}</span>
              </div>
              {!shipping.isFreeShipping && shipping.remainingForFreeShipping > 0 && (
                <p className="text-xs text-[#6e6e80] mt-1">
                  Plus que {formatPrice(shipping.remainingForFreeShipping)} pour la livraison gratuite
                </p>
              )}
            </div>

            <Link href="/store/checkout" className="btn-primary w-full justify-center mb-3">
              Passer commande
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/store/products" className="btn-ghost w-full justify-center text-[#9898a8] hover:text-white">
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
