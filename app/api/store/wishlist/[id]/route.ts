// app/api/store/wishlist/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const productId = resolvedParams.id

    // Delete from wishlist
    const deletedItem = await prisma.wishlistItem.deleteMany({
      where: {
        userId: session.user.id,
        productId,
      },
    })

    if (deletedItem.count === 0) {
      return NextResponse.json({ error: 'Item not found in wishlist' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Item removed from wishlist' })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
