// app/api/auth/admin/logout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  try {
    const adminSession = await getAdminSession()

    if (!adminSession) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Log la déconnexion
    await prisma.auditLog.create({
      data: {
        userId: adminSession.id,
        action: 'ADMIN_LOGOUT',
        resource: 'admin_session',
        status: 'SUCCESS',
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '',
        userAgent: req.headers.get('user-agent') || '',
      },
    })

    const response = NextResponse.json(
      { success: true, message: 'Déconnexion réussie' }
    )

    // Supprimer le cookie
    response.cookies.delete('adminToken')

    return response
  } catch (error) {
    console.error('[Admin Logout] Error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
