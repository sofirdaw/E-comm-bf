// store/cart.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { calculateShipping, ShippingCalculation } from '@/lib/shipping'
import { validateCoupon, CouponValidation } from '@/lib/coupons'

export interface CartProduct {
  id: string
  name: string
  slug: string
  price: number
  salePrice?: number | null
  image: string
  stock: number
  quantity: number
  variantId?: string
  variantName?: string
}

interface CartStore {
  items: CartProduct[]
  isOpen: boolean
  couponCode: string
  couponValidation?: CouponValidation

  // shipping configuration is stored here so that the client
  // components (checkout, sidebar, etc.) can calculate costs
  // without hard-coding values.  It is initially populated with
  // sensible defaults and then updated by `loadShippingConfig`.
  shippingConfig: {
    base: number
    freeThreshold: number
  }

  // loads the config from the settings API so the fee and
  // threshold stay in sync with what the admin has configured
  loadShippingConfig: () => Promise<void>
  
  // Actions
  addItem: (product: CartProduct) => void
  removeItem: (id: string, variantId?: string) => void
  updateQuantity: (id: string, quantity: number, variantId?: string) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  setCouponCode: (code: string) => void
  clearCoupon: () => void
  
  // Computed
  getTotalItems: () => number
  getSubtotal: () => number
  getShippingCalculation: () => ShippingCalculation
  getTotalWithShipping: () => number
  getItemCount: (id: string, variantId?: string) => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: '',
      couponValidation: undefined,

      addItem: (product) => {
        const { items } = get()
        const existingIndex = items.findIndex(
          (item) => item.id === product.id && item.variantId === product.variantId
        )

        if (existingIndex > -1) {
          const updated = [...items]
          const newQty = updated[existingIndex].quantity + (product.quantity || 1)
          updated[existingIndex].quantity = Math.min(newQty, product.stock)
          set({ items: updated, isOpen: true })
        } else {
          set({ items: [...items, { ...product, quantity: product.quantity || 1 }], isOpen: true })
        }
      },

      removeItem: (id, variantId) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === id && item.variantId === variantId)
          ),
        })
      },

      updateQuantity: (id, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(id, variantId)
          return
        }
        set({
          items: get().items.map((item) =>
            item.id === id && item.variantId === variantId
              ? { ...item, quantity: Math.min(quantity, item.stock) }
              : item
          ),
        })
      },

      clearCart: () => set({ items: [], couponCode: '', couponValidation: undefined }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      
      setCouponCode: async (code) => {
        set({ couponCode: code })
        
        if (!code.trim()) {
          set({ couponValidation: undefined })
          return
        }
        
        try {
          const response = await fetch(`/api/coupons/validate/${code}`)
          if (response.ok) {
            const coupon = await response.json()
            const subtotal = get().getSubtotal()
            const validation = validateCoupon(coupon, subtotal)
            set({ couponValidation: validation })
          } else {
            set({ couponValidation: { isValid: false, discountAmount: 0, message: 'Code invalide' } })
          }
        } catch (error) {
          set({ couponValidation: { isValid: false, discountAmount: 0, message: 'Erreur de validation' } })
        }
      },
      
      clearCoupon: () => set({ couponCode: '', couponValidation: undefined }),

      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      
      getSubtotal: () =>
        get().items.reduce((sum, item) => {
          const price = item.salePrice ?? item.price
          return sum + price * item.quantity
        }, 0),
        
      // shipping configuration is loaded from settings; defaults provided
      shippingConfig: {
        base: 1000,
        freeThreshold: 50000,
      },

      getShippingCalculation: () => {
        const subtotal = get().getSubtotal()
        const { base, freeThreshold } = get().shippingConfig
        const isFree = subtotal >= freeThreshold
        const shippingCost = isFree ? 0 : base
        return {
          shippingCost,
          isFreeShipping: isFree,
          subtotal,
          freeShippingThreshold: freeThreshold,
          baseShippingCost: base,
          remainingForFreeShipping: Math.max(0, freeThreshold - subtotal),
        }
      },

      getTotalWithShipping: () => {
        const subtotal = get().getSubtotal()
        const shipping = get().getShippingCalculation()
        const { couponValidation } = get()
        
        let discountAmount = 0
        if (couponValidation?.isValid) {
          discountAmount = couponValidation.discountAmount
        }
        
        const finalSubtotal = Math.max(0, subtotal - discountAmount)
        return finalSubtotal + shipping.shippingCost
      },

      getItemCount: (id, variantId) => {
        const item = get().items.find(
          (i) => i.id === id && i.variantId === variantId
        )
        return item?.quantity ?? 0
      },
      
      // method to load shipping config from settings API
      loadShippingConfig: async () => {
        try {
          const res = await fetch('/api/settings')
          if (res.ok) {
            const data = await res.json()
            set({
              shippingConfig: {
                base: parseInt(data.shippingCost, 10) || 1000,
                freeThreshold: parseInt(data.freeShippingThreshold, 10) || 50000,
              },
            })
          }
        } catch (e) {
          console.error('failed to load shipping settings', e)
        }
      },
    }),
    {
      name: 'ecommbf-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// kick off settings load immediately so shippingConfig reflects DB values
;(async () => {
  const store = useCartStore.getState()
  if (store.loadShippingConfig) {
    await store.loadShippingConfig()
  }
})();

// Wishlist store
interface WishlistStore {
  items: string[] // product IDs
  addItem: (id: string) => void
  removeItem: (id: string) => void
  toggleItem: (id: string) => void
  hasItem: (id: string) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (id) => set({ items: [...get().items, id] }),
      removeItem: (id) => set({ items: get().items.filter((i) => i !== id) }),
      toggleItem: (id) => {
        if (get().hasItem(id)) {
          get().removeItem(id)
        } else {
          get().addItem(id)
        }
      },
      hasItem: (id) => get().items.includes(id),
    }),
    {
      name: 'ecommbf-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
