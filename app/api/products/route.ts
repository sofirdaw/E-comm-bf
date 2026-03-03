// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { cacheService } from '@/lib/cache'
import slugify from 'slugify'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '16')
    const category = searchParams.get('category')
    const q = searchParams.get('q')
    const featured = searchParams.get('featured') === 'true'

    // Create cache key based on search parameters
    const cacheKey = `products:${page}:${limit}:${category || 'all'}:${q || 'none'}:${featured ? 'featured' : 'all'}`
    
    // Try to get from cache first
    const cached = await cacheService.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    const where: any = { published: true }
    if (category) where.category = { slug: category }
    if (q) where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ]
    if (featured) where.featured = true

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { category: { select: { name: true, slug: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ])

    const result = { products, total, pages: Math.ceil(total / limit) }
    
    // Cache the result for 30 minutes
    await cacheService.set(cacheKey, result, 1800)
    
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, description, price, salePrice, categoryId, stock, images, brand, tags, featured } = body

    const slug = slugify(name, { lower: true, strict: true })
    const uniqueSlug = `${slug}-${Date.now()}`

    const product = await prisma.product.create({
      data: {
        name,
        slug: uniqueSlug,
        description,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        categoryId,
        stock: parseInt(stock),
        images: images || [],
        brand,
        tags: tags || [],
        featured: featured || false,
      },
    })

    // Invalidate products cache when new product is created
    await cacheService.invalidateProducts()

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Un produit avec ce nom existe déjà' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
  }
}
