// components/admin/OrdersTable.tsx
"use client"

import Link from 'next/link'
import { formatPrice, formatDate, cn } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'
import { ValidatePaymentButton } from './ValidatePaymentButton'

const statusConfig: Record<string, { label: string; class: string }> = {
  PENDING: { label: 'En attente', class: 'badge-warning' },
  CONFIRMED: { label: 'Confirmée', class: 'badge-info' },
  PROCESSING: { label: 'En cours', class: 'badge-info' },
  SHIPPED: { label: 'Expédiée', class: 'badge-gold' },
  DELIVERED: { label: 'Livrée', class: 'badge-success' },
  CANCELLED: { label: 'Annulée', class: 'badge-error' },
  REFUNDED: { label: 'Remboursée', class: 'badge-error' },
}

const paymentConfig: Record<string, { label: string; class: string }> = {
  PENDING: { label: 'En attente', class: 'badge-warning' },
  PAID: { label: 'Payé', class: 'badge-success' },
  FAILED: { label: 'Échoué', class: 'badge-error' },
  REFUNDED: { label: 'Remboursé', class: 'badge-error' },
}

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  paymentMethod?: string
  total: number
  createdAt: Date
  user: { name: string | null; email: string | null; image: string | null }
  items: { product: { name: string; images: string[] } }[]
}

export function OrdersTable({ orders, compact = false }: { orders: Order[]; compact?: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/5">
            <th className="text-left text-xs font-medium text-[#6e6e80] uppercase tracking-wider pb-3 pl-6">
              Commande
            </th>
            <th className="text-left text-xs font-medium text-[#6e6e80] uppercase tracking-wider pb-3">
              Client
            </th>
            {!compact && (
              <th className="text-left text-xs font-medium text-[#6e6e80] uppercase tracking-wider pb-3">
                Produits
              </th>
            )}
            <th className="text-left text-xs font-medium text-[#6e6e80] uppercase tracking-wider pb-3">
              Statut
            </th>
            <th className="text-left text-xs font-medium text-[#6e6e80] uppercase tracking-wider pb-3">
              Paiement
            </th>
            <th className="text-right text-xs font-medium text-[#6e6e80] uppercase tracking-wider pb-3 pr-6">
              Total
            </th>
            <th className="text-right text-xs font-medium text-[#6e6e80] uppercase tracking-wider pb-3 pr-6">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.PENDING
            const payment = paymentConfig[order.paymentStatus] || paymentConfig.PENDING

            return (
              <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="py-3 pl-6">
                  <div>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-sm font-mono font-medium text-[#d4920c] hover:text-[#e8aa1f] transition-colors flex items-center gap-1"
                    >
                      {order.orderNumber}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <p className="text-xs text-[#6e6e80] mt-0.5">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-[#1a1a1f] shrink-0">
                      {order.user.image ? (
                        <img src={order.user.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-[#d4920c] font-bold">
                          {order.user.name?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-[#e8e8ec] truncate max-w-[120px]">{order.user.name || 'Inconnu'}</p>
                      <p className="text-xs text-[#6e6e80] truncate max-w-[120px]">{order.user.email}</p>
                    </div>
                  </div>
                </td>
                {!compact && (
                  <td className="py-3">
                    <p className="text-sm text-[#9898a8] truncate max-w-[160px]">
                      {order.items.map((i) => i.product.name).join(', ')}
                    </p>
                    <p className="text-xs text-[#6e6e80]">{order.items.length} article{order.items.length !== 1 ? 's' : ''}</p>
                  </td>
                )}
                <td className="py-3">
                  <span className={cn('badge', status.class)}>{status.label}</span>
                </td>
                <td className="py-3">
                  <span className={cn('badge', payment.class)}>{payment.label}</span>
                </td>
                <td className="py-3 pr-6 text-right">
                  <span className="text-sm font-bold text-white font-mono">
                    {formatPrice(order.total)}
                  </span>
                </td>
                <td className="py-3 pr-6 text-right">
                  {/* Quick admin action: validate Orange Money payments from the list */}
                  {order.paymentStatus === 'PENDING' && order.paymentMethod === 'ORANGE_MONEY' ? (
                    <ValidatePaymentButton
                      orderId={order.id}
                      orderNumber={order.orderNumber}
                      amount={order.total}
                      onValidationComplete={() => window.location.reload()}
                    />
                  ) : (
                    <Link href={`/admin/orders/${order.id}`} className="text-sm text-[#d4920c] hover:text-[#e8aa1f]">
                      Voir
                    </Link>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {orders.length === 0 && (
        <div className="text-center py-12 text-[#6e6e80] text-sm">
          Aucune commande trouvée
        </div>
      )}
    </div>
  )
}
