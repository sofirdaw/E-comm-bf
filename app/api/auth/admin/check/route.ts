// app/api/auth/admin/check/route.ts
import { NextRequest, NextResponse } from 'next/server'
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

    return NextResponse.json({
      success: true,
      user: {
        id: adminSession.id,
        email: adminSession.email,
        role: adminSession.role,
      },
    })
  } catch (error) {
    console.error('[Admin Check] Error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
