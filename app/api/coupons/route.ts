// app/api/coupons/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { generateCouponCode } from '@/lib/coupons'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const where = search
      ? {
          OR: [
            { code: { contains: search, mode: 'insensitive' as const } },
            { type: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.coupon.count({ where }),
    ])

    return NextResponse.json({ coupons, total })
  } catch (error) {
    console.error('Error fetching coupons:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      code,
      type,
      discount,
      minOrder,
      maxUses,
      expiresAt,
      active = true,
    } = body

    // Validation
    if (!type || !discount) {
      return NextResponse.json(
        { error: 'Type and discount are required' },
        { status: 400 }
      )
    }

    if (type === 'PERCENTAGE' && (discount < 1 || discount > 50)) {
      return NextResponse.json(
        { error: 'Percentage must be between 1% and 50%' },
        { status: 400 }
      )
    }

    if (type === 'FIXED' && discount <= 0) {
      return NextResponse.json(
        { error: 'Fixed amount must be greater than 0' },
        { status: 400 }
      )
    }

    // Générer un code automatiquement si non fourni
    const couponCode = code || generateCouponCode()

    const coupon = await prisma.coupon.create({
      data: {
        code: couponCode.toUpperCase(),
        type,
        discount: parseFloat(discount),
        minOrder: minOrder ? parseFloat(minOrder) : null,
        maxUses: maxUses ? parseInt(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        active,
      },
    })

    return NextResponse.json(coupon, { status: 201 })
  } catch (error: any) {
    console.error('Error creating coupon:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Coupon code already exists' },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
