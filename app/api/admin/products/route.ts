// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true } },
        _count: { select: { orderItems: true, reviews: true } },
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await req.json()
    const {
      name,
      price,
      salePrice,
      sku,
      stock,
      featured,
      published,
      brand,
      weight,
      dimensions,
      tags,
      images,
      categoryId,
    } = body

    // Validation - seuls name et price sont obligatoires
    if (!name || !price || stock === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, stock are required' },
        { status: 400 }
      )
    }

    // Gestion du SKU
    let finalSku = sku || null
    if (sku) {
      // Vérifier si le SKU existe déjà
      const existingProduct = await prisma.product.findUnique({
        where: { sku },
      })
      
      if (existingProduct) {
        // Trouver le prochain SKU disponible
        const lastProduct = await prisma.product.findFirst({
          where: {
            sku: {
              startsWith: 'SKU',
            },
          },
          orderBy: {
            sku: 'desc',
          },
        })
        
        let nextSkuNumber = 1
        if (lastProduct?.sku) {
          const match = lastProduct.sku.match(/SKU(\d+)/)
          if (match) {
            nextSkuNumber = parseInt(match[1]) + 1
          }
        }
        
        const nextSku = `SKU${nextSkuNumber}`
        
        return NextResponse.json({
          error: `Le numéro de code "${sku}" existe déjà. Veuillez changer. Code SKU suivant disponible: ${nextSku}`,
          suggestedSku: nextSku,
        }, { status: 400 })
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: body.description || '',
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        sku: finalSku,
        stock: parseInt(stock),
        featured: Boolean(featured),
        published: Boolean(published),
        brand: brand || null,
        weight: weight ? parseFloat(weight) : null,
        dimensions: dimensions || null,
        tags: Array.isArray(tags) ? tags : [],
        images: Array.isArray(images) ? images : [],
        // N'inclure la catégorie que si categoryId est fourni
        ...(categoryId && { categoryId }),
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)
    if (error.code === 'P2002') {
      // Gérer les autres erreurs de contrainte unique
      return NextResponse.json({
        error: 'Une contrainte unique a été violée. Vérifiez les données.'
      }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    )
  }
}
