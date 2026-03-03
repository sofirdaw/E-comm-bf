// app/admin/stats/page.tsx
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { BarChart2, TrendingUp, Users, ShoppingCart, Package } from 'lucide-react'

async function getStats() {
  const [
    totalRevenue,
    totalOrders,
    totalUsers,
    totalProducts,
    ordersByStatus,
    topCategories,
  ] = await Promise.all([
    prisma.order.aggregate({ where: { paymentStatus: 'PAID' }, _sum: { total: true } }),
    prisma.order.count(),
    prisma.user.count(),
    prisma.product.count({ where: { published: true } }),
    prisma.order.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
    prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
        products: {
          select: { _count: { select: { orderItems: true } } },
          take: 100,
        },
      },
      orderBy: { name: 'asc' },
    }),
  ])

  return {
    totalRevenue: totalRevenue._sum.total || 0,
    totalOrders,
    totalUsers,
    totalProducts,
    ordersByStatus,
    topCategories: topCategories.map((cat) => ({
      ...cat,
      totalSales: cat.products.reduce((sum: number, p: any) => sum + p._count.orderItems, 0),
    })),
  }
}

export default async function AdminStatsPage() {
  const stats = await getStats()

  const cards = [
    { label: 'Revenus totaux', value: formatPrice(stats.totalRevenue), icon: TrendingUp, color: 'gold' },
    { label: 'Commandes totales', value: stats.totalOrders.toString(), icon: ShoppingCart, color: 'blue' },
    { label: 'Utilisateurs', value: stats.totalUsers.toString(), icon: Users, color: 'green' },
    { label: 'Produits actifs', value: stats.totalProducts.toString(), icon: Package, color: 'purple' },
  ]

  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    gold: { bg: 'rgba(212,146,12,0.08)', text: '#d4920c', border: 'rgba(212,146,12,0.2)' },
    blue: { bg: 'rgba(59,130,246,0.08)', text: '#60a5fa', border: 'rgba(59,130,246,0.2)' },
    green: { bg: 'rgba(34,197,94,0.08)', text: '#4ade80', border: 'rgba(34,197,94,0.2)' },
    purple: { bg: 'rgba(168,85,247,0.08)', text: '#c084fc', border: 'rgba(168,85,247,0.2)' },
  }

  const statusLabels: Record<string, string> = {
    PENDING: 'En attente',
    CONFIRMED: 'Confirmées',
    PROCESSING: 'En traitement',
    SHIPPED: 'Expédiées',
    DELIVERED: 'Livrées',
    CANCELLED: 'Annulées',
    REFUNDED: 'Remboursées',
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-[#d4920c]" />
          Statistiques
        </h1>
        <p className="text-[#6e6e80] text-sm mt-0.5">Vue d'ensemble de toute l'activité</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => {
          const colors = colorMap[card.color]
          return (
            <div key={card.label} className="card p-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
                <card.icon className="w-5 h-5" style={{ color: colors.text }} />
              </div>
              <p className="text-2xl font-bold font-mono text-white">{card.value}</p>
              <p className="text-sm text-[#6e6e80] mt-1">{card.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by status */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-white mb-5">Commandes par statut</h2>
          <div className="space-y-3">
            {stats.ordersByStatus.map((item) => {
              const pct = stats.totalOrders > 0 ? (item._count.id / stats.totalOrders) * 100 : 0
              return (
                <div key={item.status}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-[#9898a8]">{statusLabels[item.status] || item.status}</span>
                    <span className="font-mono text-[#e8e8ec] font-medium">{item._count.id}</span>
                  </div>
                  <div className="h-1.5 bg-[#222228] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#d4920c] to-[#e8aa1f] transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top categories */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-white mb-5">Ventes par catégorie</h2>
          <div className="space-y-3">
            {stats.topCategories.map((cat: any) => (
              <div key={cat.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[rgba(212,146,12,0.08)] border border-[rgba(212,146,12,0.15)] flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-[#d4920c]">{cat.name[0]}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#9898a8]">{cat.name}</span>
                    <span className="font-mono text-[#e8e8ec] text-xs">{cat._count.products} produits</span>
                  </div>
                  <div className="h-1 bg-[#222228] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#d4920c] opacity-60"
                      style={{ width: `${Math.min((cat.totalSales / (stats.totalOrders || 1)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-[#6e6e80] font-mono w-8 text-right">{cat.totalSales}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
