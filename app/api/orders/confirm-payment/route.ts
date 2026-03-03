// app/api/orders/confirm-payment/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { emailTemplates, sendEmail } from '@/lib/email'
import { formatPrice } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  try {
    const { orderId } = await req.json()

    if (!orderId) {
      return NextResponse.json({ error: 'ID de commande requis' }, { status: 400 })
    }

    // Récupérer la commande
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: { 
            product: { 
              select: { 
                name: true, 
                images: true, 
                slug: true,
                brand: true
              } 
            } 
          },
        },
        address: true,
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 })
    }

    // Vérifier que la commande appartient à l'utilisateur
    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    // Vérifier que c'est un paiement Orange Money en attente
    if (order.paymentMethod !== 'ORANGE_MONEY') {
      return NextResponse.json({ error: 'Cette commande n\'utilise pas Orange Money' }, { status: 400 })
    }

    if (order.paymentStatus !== 'PENDING') {
      return NextResponse.json({ error: 'Ce paiement est déjà confirmé' }, { status: 400 })
    }

    // Mettre à jour le statut de paiement
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PAID',
        paymentRef: `CONFIRMED_${Date.now()}`,
        status: 'CONFIRMED',
        updatedAt: new Date()
      }
    })

    // Envoyer l'email de confirmation au client
    try {
      if (order.user.email) {
        await sendEmail({
          to: order.user.email,
          ...emailTemplates.paymentSuccess(order.orderNumber, order.user.name || 'Client', formatPrice(order.total))
        })
      }
    } catch (emailError) {
      console.error('Email client error:', emailError)
    }

    // Envoyer la notification à l'admin
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@example.com',
        ...emailTemplates.adminPaymentNotification(
          order.orderNumber,
          formatPrice(order.total),
          order.user.name || 'Client',
          order.user.email || 'email@non.fourni'
        )
      })
    } catch (emailError) {
      console.error('Email admin error:', emailError)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Paiement confirmé avec succès',
      order: updatedOrder
    })

  } catch (error) {
    console.error('Confirm payment error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
