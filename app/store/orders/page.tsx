// app/store/orders/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Package, ChevronRight, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

const statusConfig: Record<string, { label: string; class: string }> = {
  PENDING: { label: 'En attente', class: 'badge-warning' },
  CONFIRMED: { label: 'Confirmée', class: 'badge-info' },
  PROCESSING: { label: 'En traitement', class: 'badge-info' },
  SHIPPED: { label: 'Expédiée', class: 'badge-gold' },
  DELIVERED: { label: 'Livrée', class: 'badge-success' },
  CANCELLED: { label: 'Annulée', class: 'badge-error' },
  REFUNDED: { label: 'Remboursée', class: 'badge-error' },
}

export default async function OrdersPage() {
  const session = await auth()
  if (!session) redirect('/auth/login?callbackUrl=/store/orders')

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { product: { select: { name: true, images: true, slug: true } } },
      },
    },
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Package className="w-6 h-6 text-[#d4920c]" />
        <h1 className="font-display text-2xl font-bold text-white">Mes commandes</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-[#1a1a1f] flex items-center justify-center mx-auto mb-5">
            <Clock className="w-10 h-10 text-[#4a4a5a]" />
          </div>
          <h2 className="font-display text-xl font-semibold text-[#9898a8] mb-3">
            Aucune commande pour le moment
          </h2>
          <p className="text-[#6e6e80] text-sm mb-6">
            Commencez à acheter pour voir vos commandes ici.
          </p>
          <Link href="/store/products" className="btn-primary">
            Explorer la boutique
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.PENDING
            return (
              <div key={order.id} className="card p-5 group hover:border-[rgba(212,146,12,0.2)] transition-colors">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-bold text-[#d4920c]">
                        {order.orderNumber}
                      </span>
                      <span className={cn('badge text-xs', status.class)}>{status.label}</span>
                    </div>
                    <p className="text-xs text-[#6e6e80]">
                      Passée le {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#e8aa1f] font-mono">{formatPrice(order.total)}</p>
                    <p className="text-xs text-[#6e6e80]">{order.items.length} article{order.items.length > 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Products preview */}
                <div className="flex items-center gap-3 mb-4">
                  {order.items.slice(0, 4).map((item) => (
                    <Link
                      key={item.id}
                      href={`/store/products/${item.product.slug}`}
                      className="w-14 h-14 rounded-lg overflow-hidden bg-[#111114] border border-white/5 hover:border-[rgba(212,146,12,0.3)] transition-colors"
                    >
                      {item.product.images[0] ? (
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg opacity-20">📦</div>
                      )}
                    </Link>
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-14 h-14 rounded-lg bg-[#1a1a1f] border border-white/5 flex items-center justify-center text-xs text-[#6e6e80]">
                      +{order.items.length - 4}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-[#9898a8] line-clamp-2">
                      {order.items.map((i) => i.product.name).join(', ')}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <p className="text-xs text-[#6e6e80]">
                    Paiement: {order.paymentStatus === 'PAID' ? '✓ Payé' : order.paymentStatus === 'PENDING' ? '⏳ En attente' : order.paymentStatus}
                  </p>
                  <Link
                    href={`/store/orders/${order.id}`}
                    className="flex items-center gap-1 text-sm text-[#d4920c] hover:text-[#e8aa1f] transition-colors font-medium"
                  >
                    Voir le détail
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
