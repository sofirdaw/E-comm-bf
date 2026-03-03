// app/store/products/page.tsx
import { prisma } from '@/lib/prisma'
import type { Product } from '@prisma/client'
import { ProductCard } from '@/components/store/ProductCard'
import { ProductFilters } from '@/components/store/ProductFilters'
import { SortSelect } from '@/components/store/SortSelect'
import { Suspense } from 'react'
import { ProductCardSkeleton } from '@/components/store/ProductCard'
import { SlidersHorizontal, Search as SearchIcon } from 'lucide-react'
import { redisClient } from '@/lib/redis'

// revalidate every 5 minutes (ISR)
export const revalidate = 300


interface PageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    brand?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
    page?: string
    featured?: string
    sale?: string
  }>
}

async function getProducts(searchParams: PageProps['searchParams']): Promise<{
  products: Product[]
  total: number
  pages: number
  page: number
  categories: Array<any>
}> {
  const params = await searchParams
  const cacheKey = `products:${JSON.stringify(params)}`

  await redisClient.connect()
  const cached = await redisClient.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }

  const page = parseInt(params.page || '1')
  const limit = 16
  const skip = (page - 1) * limit

  const where: any = { published: true }

  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: 'insensitive' } },
      { description: { contains: params.q, mode: 'insensitive' } },
      { brand: { contains: params.q, mode: 'insensitive' } },
      { tags: { has: params.q.toLowerCase() } },
    ]
  }

  if (params.category) {
    where.category = { slug: params.category }
  }

  if (params.featured === 'true') {
    where.featured = true
  }

  if (params.sale === 'true') {
    where.salePrice = { not: null }
  }

  if (params.brand) {
    where.brand = { contains: params.brand, mode: 'insensitive' }
  }

  if (params.minPrice || params.maxPrice) {
    where.price = {}
    if (params.minPrice) where.price.gte = parseFloat(params.minPrice)
    if (params.maxPrice) where.price.lte = parseFloat(params.maxPrice)
  }

  const orderBy: any = {}
  switch (params.sort) {
    case 'price-asc': orderBy.price = 'asc'; break
    case 'price-desc': orderBy.price = 'desc'; break
    case 'newest': orderBy.createdAt = 'desc'; break
    case 'popular': orderBy.views = 'desc'; break
    case 'rating': orderBy.rating = 'desc'; break
    default: orderBy.featured = 'desc'
  }

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: { category: { select: { name: true, slug: true } } },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      include: { _count: { select: { products: { where: { published: true } } } } } ,
      orderBy: { name: 'asc' },
    }),
  ])

  const result = { products, total, pages: Math.ceil(total / limit), page, categories }
  // cache two minutes
  await redisClient.set(cacheKey, JSON.stringify(result), 120)

  return result
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { products, total, pages, page, categories } = await getProducts(searchParams)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          {params.q
            ? `Résultats pour "${params.q}"`
            : params.category
            ? categories.find((c: any) => c.slug === params.category)?.name || 'Produits'
            : 'Tous les produits'}
        </h1>
        <p className="text-[#9898a8] text-sm">
          {total} produit{total !== 1 ? 's' : ''} trouvé{total !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Filters sidebar */}
        <aside className="hidden lg:block w-60 shrink-0">
          <ProductFilters categories={categories} searchParams={params} />
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          {/* Sort + filter bar */}
          <div className="flex items-center justify-between mb-6">
            <button className="lg:hidden btn-secondary !py-2 !px-3 text-sm">
              <SlidersHorizontal className="w-4 h-4" />
              Filtres
            </button>
            <div className="ml-auto">
              <SortSelect current={params.sort} />
            </div>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <SearchIcon className="w-12 h-12 text-[#4a4a5a] mb-4" />
              <h3 className="font-display text-xl font-semibold text-[#9898a8] mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-sm text-[#6e6e80]">
                Essayez de modifier vos filtres ou votre recherche
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product, i) => (
                <div
                  key={product.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`?${new URLSearchParams({ ...params, page: p.toString() })}`}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                    p === page
                      ? 'btn-primary !w-9 !h-9 !p-0'
                      : 'text-[#9898a8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
