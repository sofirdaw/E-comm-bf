// app/admin/orders/page.tsx
import { prisma } from '@/lib/prisma'
import { OrdersTable } from '@/components/admin/OrdersTable'
import { PaymentReminderButton } from '@/components/admin/PaymentReminderButton'
import { ShoppingCart } from 'lucide-react'

const statusOptions = ['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

async function getOrders(status?: string) {
  const where: any = {}
  if (status && status !== 'ALL') where.status = status

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: { select: { name: true, email: true, image: true } },
        items: {
          include: { product: { select: { name: true, images: true } } },
        },
      },
    }),
    prisma.order.count({ where }),
  ])

  return { orders, total }
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const { orders, total } = await getOrders(resolvedSearchParams.status)

  const statusLabels: Record<string, string> = {
    ALL: 'Toutes',
    PENDING: 'En attente',
    CONFIRMED: 'Confirmées',
    PROCESSING: 'En cours',
    SHIPPED: 'Expédiées',
    DELIVERED: 'Livrées',
    CANCELLED: 'Annulées',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-[#d4920c]" />
            Commandes
          </h1>
          <p className="text-[#6e6e80] text-sm mt-0.5">{total} commande{total !== 1 ? 's' : ''} au total</p>
        </div>
        <PaymentReminderButton />
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {statusOptions.map((status) => {
          const isActive = (resolvedSearchParams.status || 'ALL') === status
          return (
            <a
              key={status}
              href={status === 'ALL' ? '/admin/orders' : `/admin/orders?status=${status}`}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[rgba(212,146,12,0.1)] text-[#d4920c] border border-[rgba(212,146,12,0.2)]'
                  : 'text-[#9898a8] hover:text-[#e8e8ec] hover:bg-white/5'
              }`}
            >
              {statusLabels[status]}
            </a>
          )
        })}
      </div>

      <div className="card overflow-hidden">
        <OrdersTable orders={orders as any} />
      </div>
    </div>
  )
}
