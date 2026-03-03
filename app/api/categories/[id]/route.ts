// app/api/categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const resolvedParams = await params
    const categoryId = resolvedParams.id
    const { name, description, image } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 })
    }

    const slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: { name, slug, description, image },
    })

    return NextResponse.json(category)
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Cette catégorie existe déjà' }, { status: 400 })
    }
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const resolvedParams = await params
    const categoryId = resolvedParams.id

    // Check if category has products
    const categoryWithProducts = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { _count: { select: { products: true } } },
    })

    if (!categoryWithProducts) {
      return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 404 })
    }

    if (categoryWithProducts._count.products > 0) {
      return NextResponse.json({ 
        error: 'Impossible de supprimer une catégorie contenant des produits' 
      }, { status: 400 })
    }

    await prisma.category.delete({
      where: { id: categoryId },
    })

    return NextResponse.json({ message: 'Catégorie supprimée avec succès' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}
