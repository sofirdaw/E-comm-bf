// app/api/admin/orders/payment-reminders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { sendEmail, emailTemplates } from '@/lib/email'
import { formatPrice } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    // Get orders with pending payment status
    const pendingOrders = await prisma.order.findMany({
      where: {
        status: 'PENDING',
        paymentStatus: 'PENDING',
        createdAt: {
          // Orders older than 24 hours
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      },
      include: {
        user: { select: { name: true, email: true } }
      }
    })

    const remindersSent = []

    for (const order of pendingOrders) {
      if (order.user.email) {
        const customerName = order.user.name || 'Client'
        const template = emailTemplates.paymentReminder(
          order.orderNumber,
          customerName,
          formatPrice(order.total)
        )
        
        const result = await sendEmail({
          to: order.user.email,
          subject: template.subject,
          html: template.html
        })

        if (result.success) {
          remindersSent.push({
            orderId: order.id,
            orderNumber: order.orderNumber,
            email: order.user.email
          })
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      remindersSent: remindersSent.length,
      orders: remindersSent
    })
  } catch (error) {
    console.error('Error sending payment reminders:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
