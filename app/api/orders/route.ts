// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { generateOrderNumber } from '@/lib/utils'
import { sendEmail, emailTemplates } from '@/lib/email'
import { validateCoupon } from '@/lib/coupons'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 10

    const where: any = {}
    if (session.user.role !== 'ADMIN') {
      where.userId = session.user.id
    }

    const status = searchParams.get('status')
    if (status) where.status = status

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true, image: true } },
          items: {
            include: {
              product: { select: { id: true, name: true, slug: true, images: true } },
            },
          },
          address: true,
        },
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({ orders, total, pages: Math.ceil(total / limit) })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { items, addressId, paymentMethod, notes, couponCode } = body

    if (!items?.length) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    // Calculate totals
    const productIds = items.map((i: any) => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, published: true },
    })

    let subtotal = 0
    const orderItems = items.map((item: any) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product) throw new Error(`Produit ${item.productId} introuvable`)
      if (product.stock < item.quantity) throw new Error(`Stock insuffisant pour ${product.name}`)

      const price = product.salePrice ?? product.price
      subtotal += price * item.quantity
      return { productId: item.productId, quantity: item.quantity, price }
    })

    // Apply coupon if provided
    let discount = 0
    let couponId: string | undefined = undefined
    if (couponCode) {
      const couponFromDb = await prisma.coupon.findUnique({ where: { code: couponCode } })
      // prisma return type may omit some timestamp fields; cast to our Coupon interface
      const coupon = (couponFromDb as unknown) as import('@/lib/coupons').Coupon | null
      const validation = validateCoupon(coupon ?? null, subtotal)
      if (validation.isValid && coupon) {
        discount = validation.discountAmount
        couponId = coupon.id
        // increment used count so admin can see usage
        await prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } })
      }
    }

    // Free shipping when the payable amount (after discount) is greater than 50000F
    const payableBeforeShipping = Math.max(0, subtotal - discount)
    const shippingCost = payableBeforeShipping > 50000 ? 0 : 1000
    const total = payableBeforeShipping + shippingCost

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.user.id,
        addressId,
        paymentMethod,
        notes,
        subtotal,
        shippingCost,
        tax: 0,
        discount,
        total,
        couponId,
        items: { create: orderItems },
      },
      include: {
        items: { include: { product: true } },
        user: { select: { name: true, email: true } }
      },
    })

    // Update stock
    await Promise.all(
      orderItems.map((item: any) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      )
    )

    // Send confirmation email
    if (order.user.email) {
      const customerName = order.user.name || 'Client'
      const template = emailTemplates.orderConfirmation(
        order.orderNumber,
        customerName
      )
      
      await sendEmail({
        to: order.user.email,
        subject: template.subject,
        html: template.html
      })
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erreur lors de la commande' }, { status: 400 })
  }
}
