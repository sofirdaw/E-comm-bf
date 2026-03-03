// app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { products: { where: { published: true } } } },
      },
    })
    
    return NextResponse.json(categories)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { name, description, image } = await req.json()
    if (!name) return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 })

    const slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

    const category = await prisma.category.create({
      data: { name, slug, description, image },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Cette catégorie existe déjà' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
  }
}
