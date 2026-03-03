// app/api/admin/audit-logs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  try {
    const adminSession = await getAdminSession()

    if (!adminSession) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const filter = url.searchParams.get('filter') || 'all'
    const pageSize = 50

    // Construire le filtre
    const where: any = {}

    if (filter === 'login') {
      where.action = {
        in: ['ADMIN_LOGIN_SUCCESS', 'ADMIN_LOGIN_FAILED', 'ADMIN_OTP_REQUESTED'],
      }
    } else if (filter === 'success') {
      where.status = 'SUCCESS'
    } else if (filter === 'failed') {
      where.status = 'FAILED'
    }

    // Compter le total
    const total = await prisma.auditLog.count({ where })

    // Récupérer les logs
    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    const totalPages = Math.ceil(total / pageSize)

    return NextResponse.json({
      logs,
      total,
      page,
      pageSize,
      totalPages,
    })
  } catch (error) {
    console.error('[Audit Logs] Error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
