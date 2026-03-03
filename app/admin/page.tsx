// app/admin/page.tsx
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import {
  TrendingUp, TrendingDown, Package, Users, ShoppingCart,
  DollarSign, ArrowUpRight, Eye, Star
} from 'lucide-react'
import { RevenueChart } from '@/components/admin/RevenueChart'
import { OrdersTable } from '@/components/admin/OrdersTable'

async function getDashboardData() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  // Calcule de la date d'il y a 12 mois
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1)

  const [
    totalRevenue,
    lastMonthRevenue,
    totalOrders,
    lastMonthOrders,
    totalUsers,
    lastMonthUsers,
    totalProducts,
    recentOrders,
    topProducts,
    chartOrders,
  ] = await Promise.all([
    // This month revenue
    prisma.order.aggregate({
      where: { createdAt: { gte: startOfMonth }, paymentStatus: 'PAID' },
      _sum: { total: true },
    }),
    // Last month revenue
    prisma.order.aggregate({
      where: {
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        paymentStatus: 'PAID',
      },
      _sum: { total: true },
    }),
    // This month orders
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    // Last month orders
    prisma.order.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
    // This month users
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    // Last month users
    prisma.user.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
    // Total products
    prisma.product.count({ where: { published: true } }),
    // Recent orders
    prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true, image: true } },
        items: {
          include: { product: { select: { name: true, images: true } } },
        },
      },
    }),
    // Top products by sales
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
    // Orders from the last 12 months for the chart
    prisma.order.findMany({
      where: {
        createdAt: { gte: twelveMonthsAgo },
        paymentStatus: 'PAID',
      },
      select: {
        total: true,
        createdAt: true,
      }
    }),
  ])

  // Fetch top product details in a single query
  const topProductIds = topProducts.map(item => item.productId)
  const topProductDetails = await Promise.all([
    // Get all product details in one query
    prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true, images: true, price: true, slug: true },
    }),
    // Get the sales data
    topProducts
  ]).then(([products, salesData]) => {
    return salesData.map(sale => {
      const product = products.find(p => p.id === sale.productId)
      return product ? { ...product, sales: sale._sum.quantity || 0 } : null
    })
  })

  // Group chart data by month
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
  const chartDataMap = new Map()

  // Initialize the last 12 months
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = `${d.getFullYear()}-${d.getMonth()}`
    chartDataMap.set(monthKey, {
      month: months[d.getMonth()],
      revenue: 0,
      orders: 0,
      sortIndex: d.getTime(), // pour trier chronologiquement
    })
  }

  // Aggregate orders into the chart map
  chartOrders.forEach(order => {
    const d = new Date(order.createdAt)
    const monthKey = `${d.getFullYear()}-${d.getMonth()}`
    if (chartDataMap.has(monthKey)) {
      const data = chartDataMap.get(monthKey)
      data.revenue += order.total
      data.orders += 1
    }
  })

  const chartData = Array.from(chartDataMap.values()).sort((a, b) => a.sortIndex - b.sortIndex)

  const prevRevenue = lastMonthRevenue._sum.total || 1
  const currRevenue = totalRevenue._sum.total || 0
  const revenueGrowth = ((currRevenue - prevRevenue) / prevRevenue) * 100
  const ordersGrowth = lastMonthOrders
    ? ((totalOrders - lastMonthOrders) / lastMonthOrders) * 100
    : 100
  const usersGrowth = lastMonthUsers
    ? ((totalUsers - lastMonthUsers) / lastMonthUsers) * 100
    : 100

  return {
    totalRevenue: currRevenue,
    totalOrders,
    totalUsers,
    totalProducts,
    revenueGrowth,
    ordersGrowth,
    usersGrowth,
    recentOrders,
    topProducts: topProductDetails.filter(Boolean),
    chartData,
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData()

  const statsCards = [
    {
      title: 'Revenus du mois',
      value: formatPrice(data.totalRevenue),
      growth: data.revenueGrowth,
      icon: DollarSign,
      color: 'gold',
    },
    {
      title: 'Commandes du mois',
      value: data.totalOrders.toString(),
      growth: data.ordersGrowth,
      icon: ShoppingCart,
      color: 'blue',
    },
    {
      title: 'Nouveaux utilisateurs',
      value: data.totalUsers.toString(),
      growth: data.usersGrowth,
      icon: Users,
      color: 'green',
    },
    {
      title: 'Produits actifs',
      value: data.totalProducts.toString(),
      growth: null,
      icon: Package,
      color: 'purple',
    },
  ]

  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    gold: { bg: 'rgba(212,146,12,0.08)', text: '#d4920c', border: 'rgba(212,146,12,0.2)' },
    blue: { bg: 'rgba(59,130,246,0.08)', text: '#60a5fa', border: 'rgba(59,130,246,0.2)' },
    green: { bg: 'rgba(34,197,94,0.08)', text: '#4ade80', border: 'rgba(34,197,94,0.2)' },
    purple: { bg: 'rgba(168,85,247,0.08)', text: '#c084fc', border: 'rgba(168,85,247,0.2)' },
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-white">
          Tableau de bord
        </h1>
        <p className="text-[#6e6e80] mt-1 text-sm">
          Vue d'ensemble de votre boutique e-comm-bf
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const colors = colorMap[stat.color]
          const isPositive = (stat.growth ?? 0) >= 0

          return (
            <div key={stat.title} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: colors.text }} />
                </div>
                {stat.growth !== null && (
                  <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                    {isPositive ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    {Math.abs(stat.growth).toFixed(1)}%
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold font-mono text-white mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-[#6e6e80]">{stat.title}</p>
              {stat.growth !== null && (
                <p className="text-xs text-[#4a4a5a] mt-1">vs. mois dernier</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-white">
              Évolution des revenus
            </h2>
            <span className="badge badge-gold text-xs">12 derniers mois</span>
          </div>
          <RevenueChart data={data.chartData} />
        </div>

        {/* Top products */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-white">
              Top produits
            </h2>
            <Star className="w-4 h-4 text-[#d4920c]" />
          </div>
          <div className="space-y-3">
            {data.topProducts.map((product: any, i) => (
              <div key={product.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#4a4a5a] w-4">{i + 1}</span>
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#111114] shrink-0">
                  {product.images?.[0] && (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#e8e8ec] truncate">{product.name}</p>
                  <p className="text-xs text-[#6e6e80]">{product.sales} vendus</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="card">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="font-display font-semibold text-white">
            Commandes récentes
          </h2>
          <a href="/admin/orders" className="text-sm text-[#d4920c] hover:text-[#e8aa1f] flex items-center gap-1 transition-colors">
            Voir tout
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <OrdersTable orders={data.recentOrders as any} compact />
      </div>
    </div>
  )
}
