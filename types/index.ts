// types/index.ts
import { Role, OrderStatus, PaymentStatus } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string | null
      email: string | null
      image: string | null
      role: Role
    }
  }

  interface User {
    role: Role
  }
}


export type { Role, OrderStatus, PaymentStatus }

export interface ProductWithCategory {
  id: string
  name: string
  slug: string
  description: string
  price: number
  salePrice: number | null
  sku: string | null
  stock: number
  images: string[]
  featured: boolean
  published: boolean
  brand: string | null
  tags: string[]
  rating: number
  reviewCount: number
  views: number
  createdAt: Date
  updatedAt: Date
  category: {
    id: string
    name: string
    slug: string
  }
}

export interface OrderWithDetails {
  id: string
  orderNumber: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  subtotal: number
  shippingCost: number
  tax: number
  discount: number
  total: number
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
  items: {
    id: string
    quantity: number
    price: number
    product: {
      id: string
      name: string
      slug: string
      images: string[]
    }
  }[]
  address: {
    firstName: string
    lastName: string
    address1: string
    city: string
    country: string
  } | null
}

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalUsers: number
  totalProducts: number
  revenueGrowth: number
  ordersGrowth: number
  usersGrowth: number
  recentOrders: OrderWithDetails[]
  topProducts: {
    id: string
    name: string
    slug: string
    images: string[]
    price: number
    salesCount: number
    revenue: number
  }[]
  salesByMonth: {
    month: string
    revenue: number
    orders: number
  }[]
}
