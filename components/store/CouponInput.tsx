'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import { Tag, X, CheckCircle } from 'lucide-react'

export default function CouponInput() {
  const [inputCode, setInputCode] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  
  const { 
    couponCode, 
    couponValidation, 
    setCouponCode, 
    clearCoupon,
    getSubtotal 
  } = useCartStore()

  const handleApplyCoupon = async () => {
    if (!inputCode.trim()) return
    
    setIsApplying(true)
    await setCouponCode(inputCode.trim())
    setIsApplying(false)
    
    if (couponValidation?.isValid) {
      setInputCode('')
    }
  }

  const handleRemoveCoupon = () => {
    clearCoupon()
    setInputCode('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleApplyCoupon()
    }
  }

  const subtotal = getSubtotal()

  return (
    <div className="bg-[#1a1a1f] border border-white/10 rounded-lg p-4 mb-1 mt-4 max-h-64 overflow-y-auto">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-4 h-4 text-[#d4920c]" />
        <h3 className="font-semibold text-white">Code de réduction</h3>
      </div>

      {couponValidation?.isValid && couponCode ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-sm font-medium text-green-400">
                  {couponValidation.message}
                </p>
                <p className="text-xs text-[#6e6e80]">
                  Code: <span className="font-mono">{couponCode}</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="p-1 hover:bg-red-500/20 rounded transition-colors"
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
          
          <div className="text-sm text-[#e8e8ec]">
            <p>
              Réduction: <span className="font-semibold text-green-400">
                -{couponValidation.discountAmount}F
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="Entrez votre code promo"
              className="flex-1 px-3 py-2 bg-[#111114] border border-white/10 rounded-lg text-white placeholder-[#6e6e80] focus:outline-none focus:border-[#d4920c]"
            />
            <button
              onClick={handleApplyCoupon}
              disabled={isApplying || !inputCode.trim()}
              className="px-4 py-2 bg-[#d4920c] text-white rounded-lg hover:bg-[#b87a0a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isApplying ? '...' : 'Appliquer'}
            </button>
          </div>

          {couponValidation && !couponValidation.isValid && (
            <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{couponValidation.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
