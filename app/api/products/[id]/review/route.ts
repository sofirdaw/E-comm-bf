// app/api/products/[id]/review/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    const reviews = await prisma.review.findMany({
        where: { productId: id },
        include: {
            user: { select: { name: true, image: true } },
        },
        orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(reviews)
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: 'Vous devez être connecté pour laisser un avis' }, { status: 401 })
    }

    const { id: productId } = await params

    try {
        const { rating, title, body } = await req.json()

        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Note entre 1 et 5 requise' }, { status: 400 })
        }
        if (!body?.trim()) {
            return NextResponse.json({ error: 'Un commentaire est requis' }, { status: 400 })
        }

        // Upsert: update if user already reviewed this product, else create
        const review = await prisma.review.upsert({
            where: { productId_userId: { productId, userId: session.user.id } },
            create: { productId, userId: session.user.id, rating, title, body },
            update: { rating, title, body },
        })

        // Recalculate product's average rating and reviewCount
        const aggregate = await prisma.review.aggregate({
            where: { productId },
            _avg: { rating: true },
            _count: { rating: true },
        })

        await prisma.product.update({
            where: { id: productId },
            data: {
                rating: Math.round((aggregate._avg.rating ?? 0) * 10) / 10,
                reviewCount: aggregate._count.rating,
            },
        })

        return NextResponse.json(review, { status: 201 })
    } catch (error: any) {
        console.error('Review error:', error)
        return NextResponse.json({ error: 'Erreur lors de l\'envoi de l\'avis' }, { status: 500 })
    }
}
