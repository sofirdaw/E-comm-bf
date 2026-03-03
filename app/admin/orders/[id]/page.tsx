// app/admin/orders/[id]/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate, cn } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, Package, MapPin, CreditCard, Truck, CheckCircle, Clock, XCircle, User, Mail, Phone } from 'lucide-react'
import { OrderActions } from '@/components/admin/OrderActions'
import { ValidatePaymentButton } from '@/components/admin/ValidatePaymentButton'

const statusConfig: Record<string, { label: string; icon: any; class: string }> = {
  PENDING: { label: 'En attente', icon: Clock, class: 'badge-warning' },
  CONFIRMED: { label: 'Confirmée', icon: CheckCircle, class: 'badge-info' },
  PROCESSING: { label: 'En traitement', icon: Package, class: 'badge-info' },
  SHIPPED: { label: 'Expédiée', icon: Truck, class: 'badge-gold' },
  DELIVERED: { label: 'Livrée', icon: CheckCircle, class: 'badge-success' },
  CANCELLED: { label: 'Annulée', icon: XCircle, class: 'badge-error' },
  REFUNDED: { label: 'Remboursée', icon: XCircle, class: 'badge-error' },
}

const paymentStatusConfig: Record<string, { label: string; class: string }> = {
  PENDING: { label: 'En attente', class: 'badge-warning' },
  PAID: { label: 'Payée', class: 'badge-success' },
  FAILED: { label: 'Échouée', class: 'badge-error' },
  REFUNDED: { label: 'Remboursée', class: 'badge-error' },
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/orders')
  }

  const { id } = await params
  const order = await prisma.order.findFirst({
    where: { id },
    include: {
      user: { select: { name: true, email: true, phone: true, image: true } },
      items: {
        include: {
          product: {
            select: {
              name: true,
              images: true,
              slug: true,
              brand: true
            }
          }
        },
      },
      address: true,
    },
  })

  if (!order) {
    redirect('/admin/orders')
  }

  const status = statusConfig[order.status] || statusConfig.PENDING
  const paymentStatus = paymentStatusConfig[order.paymentStatus] || paymentStatusConfig.PENDING
  const StatusIcon = status.icon

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 text-[#6e6e80] hover:text-[#e8e8ec] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux commandes
          </Link>
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-[#d4920c]" />
            <h1 className="font-display text-2xl font-bold text-white">
              Détail de la commande
            </h1>
          </div>
        </div>
        <OrderActions orderId={order.id} currentStatus={order.status} />
      </div>

      {/* Order Info */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-lg font-bold text-[#d4920c]">
                {order.orderNumber}
              </span>
              <span className={cn('badge', status.class)}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {status.label}
              </span>
            </div>
            <p className="text-sm text-[#6e6e80]">
              Passée le {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#e8aa1f] font-mono">
              {formatPrice(order.total)}
            </p>
            <span className={cn('badge text-xs mt-1', paymentStatus.class)}>
              {paymentStatus.label}
            </span>
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#1a1a1f] rounded-lg p-4 border border-white/5">
            <h3 className="font-medium text-[#e8e8ec] mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Informations client
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-white font-medium">{order.user.name}</p>
              <div className="flex items-center gap-2 text-[#6e6e80]">
                <Mail className="w-3 h-3" />
                {order.user.email}
              </div>
              {order.user.phone && (
                <div className="flex items-center gap-2 text-[#6e6e80]">
                  <Phone className="w-3 h-3" />
                  {order.user.phone}
                </div>
              )}
            </div>
          </div>

          {/* Delivery Address */}
          {order.address && (
            <div className="bg-[#1a1a1f] rounded-lg p-4 border border-white/5">
              <h3 className="font-medium text-[#e8e8ec] mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Adresse de livraison
              </h3>
              <div className="space-y-1 text-sm">
                <p className="text-white">
                  {order.address.firstName} {order.address.lastName}
                </p>
                {order.address.company && (
                  <p className="text-[#6e6e80]">{order.address.company}</p>
                )}
                <p className="text-[#6e6e80]">{order.address.address1}</p>
                {order.address.address2 && (
                  <p className="text-[#6e6e80]">{order.address.address2}</p>
                )}
                <p className="text-[#6e6e80]">
                  {order.address.city}, {order.address.state} {order.address.zipCode}
                </p>
                <p className="text-[#6e6e80]">{order.address.country}</p>
                {order.address.phone && (
                  <p className="text-[#6e6e80]">{order.address.phone}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tracking Info */}
        {(order.trackingNumber || order.shippingCarrier) && (
          <div className="bg-[#1a1a1f] rounded-lg p-4 border border-white/5 mt-4">
            <h3 className="font-medium text-[#e8e8ec] mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Suivi de livraison
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {order.shippingCarrier && (
                <div>
                  <p className="text-xs text-[#6e6e80] mb-1">Transporteur</p>
                  <p className="text-sm text-white">{order.shippingCarrier}</p>
                </div>
              )}
              {order.trackingNumber && (
                <div>
                  <p className="text-xs text-[#6e6e80] mb-1">Numéro de suivi</p>
                  <p className="text-sm text-white font-mono">{order.trackingNumber}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h3 className="font-medium text-[#e8e8ec] mb-4 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Articles commandés ({order.items.length})
            </h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-white/5 last:border-0">
                  <Link
                    href={`/store/products/${item.product.slug}`}
                    className="w-20 h-20 rounded-lg overflow-hidden bg-[#111114] border border-white/5 hover:border-[rgba(212,146,12,0.3)] transition-colors flex-shrink-0"
                  >
                    {item.product.images[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg opacity-20">📦</div>
                    )}
                  </Link>
                  <div className="flex-1">
                    <Link
                      href={`/store/products/${item.product.slug}`}
                      className="text-white font-medium hover:text-[#d4920c] transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-[#6e6e80] mb-2">
                      {item.product.brand}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6e6e80]">
                        Quantité: {item.quantity}
                      </span>
                      <span className="font-medium text-[#e8e8ec]">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-medium text-[#e8e8ec] mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Résumé de la commande
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#6e6e80]">Sous-total</span>
                <span className="text-[#e8e8ec]">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6e6e80]">Livraison</span>
                <span className="text-[#e8e8ec]">{formatPrice(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6e6e80]">Taxes</span>
                <span className="text-[#e8e8ec]">{formatPrice(order.tax)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#6e6e80]">Remise</span>
                  <span className="text-[#d4920c]">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-white/5">
                <div className="flex justify-between">
                  <span className="font-medium text-white">Total</span>
                  <span className="font-bold text-[#e8aa1f] text-lg">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="card p-6">
            <h3 className="font-medium text-[#e8e8ec] mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Informations de paiement
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6e6e80]">Mode de paiement</span>
                <span className="text-[#e8e8ec]">{order.paymentMethod || 'Non spécifié'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6e6e80]">Statut paiement</span>
                <span className={cn(
                  'badge',
                  order.paymentStatus === 'PAID' ? 'badge-success' : 'badge-warning'
                )}>
                  {order.paymentStatus === 'PAID' ? 'Payé' : 'En attente'}
                </span>
              </div>
              {order.paymentRef && (
                <div className="flex justify-between">
                  <span className="text-[#6e6e80]">Référence</span>
                  <span className="text-[#e8e8ec] font-mono">{order.paymentRef}</span>
                </div>
              )}
              {order.notes && (
                <div className="pt-3 border-t border-white/5">
                  <p className="text-[#6e6e80] mb-1">Notes</p>
                  <p className="text-[#e8e8ec]">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Payment Validation Button */}
            {order.paymentMethod?.toUpperCase() === 'ORANGE_MONEY' && order.paymentStatus === 'PENDING' && (
              <div className="mt-6 pt-6 border-t border-white/5">
                <h4 className="font-medium text-[#e8e8ec] mb-3">Validation du paiement</h4>
                <p className="text-sm text-[#6e6e80] mb-4">
                  Validez manuellement le paiement Orange Money après confirmation client
                </p>
                <ValidatePaymentButton
                  orderId={order.id}
                  orderNumber={order.orderNumber}
                  amount={order.total}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
