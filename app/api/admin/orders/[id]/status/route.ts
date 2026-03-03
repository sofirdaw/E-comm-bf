// app/api/admin/orders/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { sendEmail, emailTemplates } from '@/lib/email'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await req.json()
    const { status } = body

    if (!status || !['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'].includes(status)) {
      return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
    }

    // Get current order to check status transition
    const currentOrder = await prisma.order.findUnique({
      where: { id },
      include: { user: true }
    })

    if (!currentOrder) {
      return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 })
    }

    // Validate status transitions
    const validTransitions: Record<string, string[]> = {
      'PENDING': ['CONFIRMED', 'CANCELLED'],
      'CONFIRMED': ['PROCESSING', 'SHIPPED', 'CANCELLED'],
      'PROCESSING': ['SHIPPED', 'CANCELLED'],
      'SHIPPED': ['DELIVERED'],
      'DELIVERED': [],
      'CANCELLED': ['REFUNDED'],
      'REFUNDED': []
    }

    if (!validTransitions[currentOrder.status].includes(status)) {
      return NextResponse.json({ 
        error: `Transition de statut invalide: ${currentOrder.status} → ${status}` 
      }, { status: 400 })
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { 
        status,
        updatedAt: new Date()
      },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { name: true } } } }
      }
    })

    // Send email notification to customer
    if (updatedOrder.user.email && status !== currentOrder.status) {
      const customerName = updatedOrder.user.name || 'Client'
      const template = emailTemplates.orderStatusUpdate(
        updatedOrder.orderNumber,
        status,
        customerName
      )
      
      await sendEmail({
        to: updatedOrder.user.email,
        subject: template.subject,
        html: template.html
      })
    }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
