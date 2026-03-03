// lib/admin-auth.ts
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export interface AdminToken {
  id: string
  email: string
  role: string
  type: string
  iat: number
  exp: number
}

export async function getAdminSession(): Promise<AdminToken | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('adminToken')?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || 'your-secret'
    ) as AdminToken

    return decoded
  } catch (error) {
    console.error('[Admin Auth] Invalid token:', error)
    return null
  }
}

export async function logAdminAction(
  userId: string,
  action: string,
  resource: string,
  newValue?: string,
  oldValue?: string
) {
  try {
    // Appeler directement Prisma pour enregistrer l'action
    const { prisma } = await import('@/lib/prisma')

    await prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        newValue,
        oldValue,
        status: 'SUCCESS',
      },
    })
  } catch (error) {
    console.error('[Audit Log] Error:', error)
  }
}
