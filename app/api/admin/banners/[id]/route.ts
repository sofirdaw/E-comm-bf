// app/api/admin/banners/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const bannerId = resolvedParams.id

    // Get banner
    const banner = await prisma.banner.findUnique({
      where: { id: bannerId },
    })

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }

    return NextResponse.json(banner)
  } catch (error) {
    console.error('Error fetching banner:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const bannerId = resolvedParams.id
    const body = await request.json()

    // Check if banner exists
    const existingBanner = await prisma.banner.findUnique({
      where: { id: bannerId },
    })

    if (!existingBanner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }

    // Update banner
    const updatedBanner = await prisma.banner.update({
      where: { id: bannerId },
      data: {
        title: body.title,
        subtitle: body.subtitle || null,
        image: body.image,
        link: body.link || null,
        buttonText: body.buttonText || null,
        active: body.active,
        order: body.order,
      },
    })

    return NextResponse.json(updatedBanner)
  } catch (error) {
    console.error('Error updating banner:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const bannerId = resolvedParams.id

    // Check if banner exists
    const banner = await prisma.banner.findUnique({
      where: { id: bannerId },
    })

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }

    // Delete the banner
    await prisma.banner.delete({
      where: { id: bannerId },
    })

    return NextResponse.json({ message: 'Banner deleted successfully' })
  } catch (error) {
    console.error('Error deleting banner:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
