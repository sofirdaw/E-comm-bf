// components/store/CartSidebar.tsx
'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight, Package } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice, cn } from '@/lib/utils'
import CouponInput from './CouponInput'
import ShippingInfo from './ShippingInfo'

export function CartSidebar() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getTotalItems,
    getSubtotal,
    getShippingCalculation,
    getTotalWithShipping,
    couponValidation
  } = useCartStore()

  const subtotal = getSubtotal()
  const shipping = getShippingCalculation()
  const totalWithShipping = getTotalWithShipping()
  const count = getTotalItems()

  // Body scroll lock when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = '0px' // Prevent layout shift
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div
        className={cn(
          'fixed right-0 top-10 h-[85vh] w-full max-w-md z-[100] transition-transform duration-400 ease-out flex flex-col',
          'bg-[#111114] border-l border-white/5 shadow-2xl',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-32 px-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="w-5 h-5 text-[#d4920c]" />
            <h2 className="font-display font-semibold text-lg text-white">
              Mon Panier
            </h2>
            {count > 0 && (
              <span className="badge badge-gold text-xs">
                {count} article{count > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#6e6e80] hover:text-[#e8e8ec] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto pt-6 pb-24 px-5 space-y-4 scrollbar-thin scrollbar-thumb-[#4a4a5a] scrollbar-track-transparent hover:scrollbar-thumb-[#6e6e80] transition-colors">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-[#1a1a1f] flex items-center justify-center mb-4">
                <Package className="w-10 h-10 text-[#4a4a5a]" />
              </div>
              <h3 className="font-display font-semibold text-[#9898a8] mb-2">
                Votre panier est vide
              </h3>
              <p className="text-sm text-[#6e6e80] mb-6">
                Découvrez nos produits et ajoutez-les à votre panier
              </p>
              <Link
                href="/store/products"
                className="btn-primary"
                onClick={closeCart}
              >
                Explorer la boutique
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.id}-${item.variantId}`}
                className="flex gap-3 p-3 rounded-xl bg-[#1a1a1f] border border-white/5 group"
              >
                {/* Image */}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#111114] shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">📦</div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/store/products/${item.slug}`}
                      className="text-sm font-medium text-[#e8e8ec] hover:text-white transition-colors line-clamp-2"
                      onClick={closeCart}
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeItem(item.id, item.variantId)}
                      className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[#6e6e80] hover:text-[#ef4444] hover:bg-[rgba(239,68,68,0.08)] transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Qty controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.variantId)}
                        className="w-7 h-7 rounded-md bg-[#232330] flex items-center justify-center text-[#9898a8] hover:text-white hover:bg-[#2e2e3d] transition-all"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-[#e8e8ec] font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)}
                        disabled={item.quantity >= item.stock}
                        className="w-7 h-7 rounded-md bg-[#232330] flex items-center justify-center text-[#9898a8] hover:text-white hover:bg-[#2e2e3d] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <span className="font-bold text-[#e8aa1f] text-sm font-mono">
                      {formatPrice((item.salePrice ?? item.price) * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/5 overflow-y-auto scrollbar-thin scrollbar-thumb-[#4a4a5a] scrollbar-track-transparent hover:scrollbar-thumb-[#6e6e80] transition-colors">
            <div className="p-5 space-y-4">
              {/* Coupon Input */}
              <CouponInput />

              {/* Shipping Info */}
              <ShippingInfo />

              {/* Summary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#9898a8]">Sous-total</span>
                  <span className="text-[#e8e8ec] font-mono">{formatPrice(subtotal)}</span>
                </div>

                {couponValidation?.isValid && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#9898a8]">Réduction</span>
                    <span className="text-green-400 font-mono">-{formatPrice(couponValidation.discountAmount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#9898a8]">Livraison</span>
                  <span className={`font-mono ${shipping.isFreeShipping ? 'text-green-400' : 'text-[#e8e8ec]'}`}>
                    {shipping.isFreeShipping ? 'GRATUITE' : formatPrice(shipping.shippingCost)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="font-display font-semibold text-[#e8e8ec]">Total</span>
                <span className="font-bold text-xl text-[#e8aa1f] font-mono">{formatPrice(totalWithShipping)}</span>
              </div>

              <Link
                href="/store/checkout"
                className="btn-primary w-full justify-center"
                onClick={closeCart}
              >
                Passer commande
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/store/cart"
                className="btn-ghost w-full justify-center text-[#9898a8] hover:text-[#e8e8ec]"
                onClick={closeCart}
              >
                Voir le panier complet
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
