// app/api/admin/newsletter/stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const [totalSubscribers, recentSubscribers, subscribersThisMonth] = await Promise.all([
      prisma.newsletter.count(),
      prisma.newsletter.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.newsletter.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ])

    return NextResponse.json({
      totalSubscribers,
      recentSubscribers,
      subscribersThisMonth
    })
  } catch (error) {
    console.error('Error fetching newsletter stats:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
