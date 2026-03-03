// app/api/admin/orders/[id]/validate-payment/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { sendEmail, emailTemplates } from '@/lib/email'
import { formatPrice } from '@/lib/utils'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { id } = await params

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 })
    }

    if (order.paymentStatus === 'PAID') {
      return NextResponse.json({ error: 'Paiement déjà validé' }, { status: 400 })
    }

    // Update order payment status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        paymentStatus: 'PAID',
        paymentMethod: 'ORANGE_MONEY',
        paymentRef: `ADMIN_VALIDATED_${Date.now()}`,
        updatedAt: new Date()
      },
      include: {
        user: { select: { name: true, email: true } }
      }
    })

    // Send payment success email to customer
    if (updatedOrder.user.email) {
      const customerTemplate = emailTemplates.paymentSuccess(
        updatedOrder.orderNumber,
        updatedOrder.user.name || 'Client',
        formatPrice(updatedOrder.total)
      )
      
      await sendEmail({
        to: updatedOrder.user.email,
        subject: customerTemplate.subject,
        html: customerTemplate.html
      })
    }

    // Send notification to admin
    const adminEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    const adminTemplate = emailTemplates.adminPaymentNotification(
      updatedOrder.orderNumber,
      formatPrice(updatedOrder.total),
      updatedOrder.user.name || 'Client',
      updatedOrder.user.email || 'Email non disponible'
    )
    
    await sendEmail({
      to: adminEmail,
      subject: `Paiement validé manuellement - ${updatedOrder.orderNumber}`,
      html: adminTemplate.html.replace('Nouveau paiement reçu', 'Paiement validé manuellement')
    })

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      amount: formatPrice(updatedOrder.total)
    })
  } catch (error) {
    console.error('Error validating payment:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
