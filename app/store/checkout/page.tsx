// app/store/checkout/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import {
  ArrowLeft, CreditCard, Smartphone, CheckCircle,
  MapPin, Loader2, ShoppingCart
} from 'lucide-react'
import toast from 'react-hot-toast'
import { OrangeMoneyInstructions } from '@/components/store/OrangeMoneyInstructions'
import { useEffect } from 'react'
import CouponInput from '@/components/store/CouponInput'
import ShippingInfo from '@/components/store/ShippingInfo'

const paymentMethods = [
  { id: 'orange_money', label: 'Orange Money', subtitle: 'Paiement mobile rapide', icon: Smartphone },
  { id: 'cash', label: 'Paiement à la livraison', subtitle: 'Disponible à Ouagadougou', icon: CreditCard },
]

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { 
    items, 
    getSubtotal, 
    getShippingCalculation, 
    getTotalWithShipping,
    couponValidation,
    couponCode,
    clearCart 
  } = useCartStore()
  
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info')
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('orange_money')
  const [orderData, setOrderData] = useState<any>(null) // Sauvegarder les données de commande
  
  const subtotal = getSubtotal()
  const shipping = getShippingCalculation()
  const totalWithShipping = getTotalWithShipping()
  
  // Restaurer les données depuis localStorage si disponibles
  useEffect(() => {
    const savedOrderData = localStorage.getItem('pendingOrder')
    if (savedOrderData) {
      const data = JSON.parse(savedOrderData)
      // Only auto-restore a pending order if the cart is empty — otherwise
      // the user is trying to place a new order and the old pending order
      // should not block the new flow.
      if (items.length === 0) {
        setOrderData(data)
        setOrderNumber(data.orderNumber)
        setStep('success')
      } else {
        // Remove stale pending order so it doesn't prevent new orders
        localStorage.removeItem('pendingOrder')
      }
    }
  }, [items])
  const [address, setAddress] = useState({
    firstName: session?.user?.name?.split(' ')[0] || '',
    lastName: session?.user?.name?.split(' ')[1] || '',
    address1: '',
    state: 'Centre',
    city: 'Ouagadougou',
    country: 'BF',
    zipCode: '00226',
    phone: '',
  })
  const [orderNumber, setOrderNumber] = useState('')
  const [createdOrderId, setCreatedOrderId] = useState('')

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <ShoppingCart className="w-16 h-16 text-[#4a4a5a] mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold text-white mb-3">Panier vide</h1>
        <p className="text-[#9898a8] mb-6">Ajoutez des articles avant de commander.</p>
        <Link href="/store/products" className="btn-primary">Explorer la boutique</Link>
      </div>
    )
  }

  const handleOrder = async () => {
    if (!session) {
      router.push('/auth/login?callbackUrl=/store/checkout')
      return
    }

    if (!address.firstName || !address.lastName || !address.address1) {
      toast.error('Veuillez remplir tous les champs requis')
      return
    }

    setLoading(true)
    try {
      // Create address first
      const addrRes = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address),
      })
      const addrData = addrRes.ok ? await addrRes.json() : null

      const orderItems = items.map((i) => ({
        productId: i.id,
        quantity: i.quantity,
        variantId: i.variantId,
      }))

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems,
          addressId: addrData?.id,
          paymentMethod,
          couponCode: couponValidation?.isValid ? couponCode : undefined,
        }),
      })

      if (res.ok) {
        const order = await res.json()
        const orderInfo = {
          orderNumber: order.orderNumber,
          id: order.id,
          paymentMethod,
          total: totalWithShipping,
          subtotal,
          // keep the shipping cost we calculated client‑side so that
          // the success view can display the same value even if the
          // store has been cleared or reloaded.
          shippingCost: shipping.shippingCost,
          items: orderItems
        }
        
        // Sauvegarder les données dans localStorage
        localStorage.setItem('pendingOrder', JSON.stringify(orderInfo))
        
        setOrderNumber(order.orderNumber)
        setCreatedOrderId(order.id)
        setOrderData(orderInfo)
        clearCart()
        setStep('success')
      } else {
        const d = await res.json()
        toast.error(d.error || 'Erreur lors de la commande')
      }
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <CheckCircle className="w-10 h-10 text-[#22c55e]" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-3 animate-fade-up">
            Commande confirmée !
          </h1>
          <p className="text-[#9898a8] mb-2 animate-fade-up" style={{ animationDelay: '100ms' }}>
            Numéro de commande : <span className="text-[#d4920c] font-mono">{orderNumber}</span>
          </p>
        </div>

        {/* Payment Instructions */}
        {paymentMethod === 'orange_money' && (
          <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
            <OrangeMoneyInstructions
              orderNumber={orderNumber}
              amount={formatPrice(totalWithShipping)}
              itemsTotal={orderData?.subtotal || subtotal}
              shippingCost={orderData?.shippingCost ?? shipping.shippingCost}
            />
          </div>
        )}
        {paymentMethod === 'cash' && (
          <div className="bg-[rgba(212,146,12,0.05)] border border-[rgba(212,146,12,0.2)] rounded-xl p-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-xl font-semibold text-[#d4920c] mb-3 text-center">
              Paiement à la livraison
            </h3>
            <p className="text-[#9898a8] text-center mb-4">
              Vous payez {formatPrice(totalWithShipping)} à la livraison à Ouagadougou
            </p>
            <div className="bg-[#1a1a1f] rounded-lg p-4 border border-white/5">
              <h4 className="font-medium text-[#e8e8ec] mb-2">Informations de livraison</h4>
              <p className="text-sm text-[#6e6e80]">
                Notre livreur vous contactera dans les 24h pour confirmer la livraison et le paiement.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 animate-fade-up" style={{ animationDelay: '300ms' }}>
          <Link href="/store/orders" className="btn-primary">
            Voir mes commandes
          </Link>
          <Link href="/store/products" className="btn-secondary">
            Continuer les achats
          </Link>
          {orderData && (
            <button
              onClick={() => {
                localStorage.removeItem('pendingOrder')
                setOrderData(null)
                setOrderNumber('')
                setStep('info')
                toast.success('Données effacées')
              }}
              className="btn-ghost"
            >
              Effacer cette commande
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/store/cart" className="btn-ghost !px-2">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="font-display text-2xl font-bold text-white">Finaliser ma commande</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3 space-y-6">
          {/* Delivery info */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-white flex items-center gap-2 mb-5">
              <MapPin className="w-4 h-4 text-[#d4920c]" />
              Adresse de livraison
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#9898a8] mb-1.5">Prénom *</label>
                <input value={address.firstName} onChange={(e) => setAddress({ ...address, firstName: e.target.value })} required className="input" />
              </div>
              <div>
                <label className="block text-sm text-[#9898a8] mb-1.5">Nom *</label>
                <input value={address.lastName} onChange={(e) => setAddress({ ...address, lastName: e.target.value })} required className="input" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-[#9898a8] mb-1.5">Adresse *</label>
                <input value={address.address1} onChange={(e) => setAddress({ ...address, address1: e.target.value })} placeholder="Secteur, rue, quartier..." required className="input" />
              </div>
              <div>
                <label className="block text-sm text-[#9898a8] mb-1.5">Ville</label>
                <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="input" />
              </div>
              <div>
                <label className="block text-sm text-[#9898a8] mb-1.5">Téléphone *</label>
                <input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="+226 70 00 00 00" required className="input" />
              </div>
            </div>

            {/* Address Preview */}
            {(address.firstName || address.lastName || address.address1) && (
              <div className="mt-6 p-4 bg-[rgba(212,146,12,0.05)] border border-[rgba(212,146,12,0.15)] rounded-xl">
                <h3 className="text-sm font-medium text-[#d4920c] mb-3">Aperçu de l'adresse</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-white font-medium">
                    {address.firstName} {address.lastName}
                  </p>
                  {address.address1 && (
                    <p className="text-[#6e6e80]">{address.address1}</p>
                  )}
                  <p className="text-[#6e6e80]">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-[#6e6e80]">{address.country}</p>
                  {address.phone && (
                    <p className="text-[#6e6e80]">{address.phone}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-white flex items-center gap-2 mb-5">
              <CreditCard className="w-4 h-4 text-[#d4920c]" />
              Mode de paiement
            </h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === method.id
                      ? 'border-[rgba(212,146,12,0.4)] bg-[rgba(212,146,12,0.06)]'
                      : 'border-white/8 hover:border-white/15'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                    className="accent-[#d4920c]"
                  />
                  <div className="w-10 h-10 rounded-xl bg-[rgba(212,146,12,0.08)] border border-[rgba(212,146,12,0.15)] flex items-center justify-center">
                    <method.icon className="w-5 h-5 text-[#d4920c]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#e8e8ec]">{method.label}</p>
                    <p className="text-xs text-[#6e6e80]">{method.subtitle}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="card p-6 sticky top-24">
            <h2 className="font-display font-semibold text-white mb-4">Votre commande</h2>

            {/* Coupon Input */}
            <CouponInput />
            
            {/* Shipping Info */}
            <ShippingInfo />

            {/* Items */}
            <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.id}-${item.variantId}`} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#111114] shrink-0">
                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#e8e8ec] truncate">{item.name}</p>
                    <p className="text-xs text-[#6e6e80]">x{item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-[#e8aa1f] font-mono shrink-0">
                    {formatPrice((item.salePrice ?? item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/8 pt-4 space-y-2 mb-5">
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
                <span className={shipping.isFreeShipping ? 'text-green-400' : 'text-[#e8e8ec] font-mono'}>
                  {shipping.isFreeShipping ? 'Gratuite' : formatPrice(shipping.shippingCost)}
                </span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-white/8">
                <span className="text-[#e8e8ec]">Total</span>
                <span className="text-[#e8aa1f] font-mono text-xl">{formatPrice(totalWithShipping)}</span>
              </div>
            </div>

            <button
              onClick={handleOrder}
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              {loading ? 'Traitement...' : 'Confirmer la commande'}
            </button>

            <p className="text-xs text-[#6e6e80] text-center mt-3">
              En confirmant, vous acceptez nos conditions d'utilisation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
