// app/store/page.tsx
import { prisma } from '@/lib/prisma'
import { HeroSection } from '@/components/store/HeroSection'
import { CategorySection } from '@/components/store/CategorySection'
import { FeaturedProducts } from '@/components/store/FeaturedProducts'
import { StatsBar } from '@/components/store/StatsBar'
import { NewsletterSection } from '@/components/store/NewsletterSection'
import { redisClient } from '@/lib/redis'

// revalidate every 60 seconds (ISR) - fresh data on every user visit after 60s
export const revalidate = 60

async function getData() {
  // Try Redis cache first (30s TTL - short enough to reflect DB changes quickly)
  try {
    const cacheKey = 'homepage:data'
    await redisClient.connect()
    const cached = await redisClient.get(cacheKey)
    if (cached) {
      return JSON.parse(cached)
    }
  } catch {
    // Redis unavailable - fall through to database
  }

  const [categories, featuredProducts, banners] = await Promise.all([
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      take: 6,
    }),
    prisma.product.findMany({
      where: { featured: true, published: true },
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.banner.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    }),
  ])

  const result = { categories, featuredProducts, banners }
  // Cache for 30s only - short enough that when Supabase reconnects, fresh data appears quickly
  try {
    await redisClient.set('homepage:data', JSON.stringify(result), 30)
  } catch {
    // Redis unavailable - skip caching, always fresh from DB
  }

  return result
}

export default async function HomePage() {
  const { categories, featuredProducts, banners } = await getData()

  return (
    <>
      <HeroSection banners={banners} />
      <StatsBar />
      <CategorySection categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <NewsletterSection />
    </>
  )
}
