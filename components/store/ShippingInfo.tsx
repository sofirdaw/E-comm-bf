'use client'

import { useCartStore } from '@/store/cart'
import { Truck, Gift } from 'lucide-react'
import { formatShippingMessage } from '@/lib/shipping'

export default function ShippingInfo() {
  const { getSubtotal, getShippingCalculation } = useCartStore()
  
  const shipping = getShippingCalculation()
  const subtotal = getSubtotal()

  return (
    <div className="bg-[#1a1a1f] border border-white/10 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Truck className="w-4 h-4 text-[#d4920c]" />
        <h3 className="font-semibold text-white">Livraison</h3>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[#e8e8ec]">Frais de livraison:</span>
          <span className={`font-semibold ${
            shipping.isFreeShipping ? 'text-green-400' : 'text-white'
          }`}>
            {shipping.isFreeShipping ? 'GRATUITE' : `${shipping.shippingCost}F`}
          </span>
        </div>

        {!shipping.isFreeShipping && shipping.remainingForFreeShipping > 0 && (
          <div className="p-3 bg-[#d4920c]/10 border border-[#d4920c]/20 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Gift className="w-4 h-4 text-[#d4920c]" />
              <p className="text-[#e8e8ec]">
                Plus que <span className="font-semibold text-[#d4920c]">
                  {shipping.remainingForFreeShipping}F
                </span> pour la livraison gratuite !
              </p>
            </div>
            <div className="mt-2">
              <div className="w-full bg-[#111114] rounded-full h-2">
                <div 
                  className="bg-[#d4920c] h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(100, (subtotal / shipping.freeShippingThreshold) * 100)}%` 
                  }}
                />
              </div>
              <p className="text-xs text-[#6e6e80] mt-1">
                {Math.round((subtotal / shipping.freeShippingThreshold) * 100)}% atteint
              </p>
            </div>
          </div>
        )}

        {shipping.isFreeShipping && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Gift className="w-4 h-4 text-green-400" />
              <p className="text-green-400 font-medium">
                🎉 Livraison gratuite offerte !
              </p>
            </div>
          </div>
        )}

        <div className="text-xs text-[#6e6e80] pt-2 border-t border-white/5">
          <p>Frais de base: {shipping.baseShippingCost}F</p>
          <p>Seuil de gratuité: {shipping.freeShippingThreshold}F</p>
        </div>
      </div>
    </div>
  )
}
