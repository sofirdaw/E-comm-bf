// app/api/auth/admin/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signIn } from '@/lib/auth'
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json()

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email et code OTP requis' },
        { status: 400 }
      )
    }

    // Vérifier que le code OTP existe et n'est pas expiré
    const otpRecord = await prisma.adminOTP.findFirst({
      where: {
        email,
        code,
        expiresAt: {
          gt: new Date(),
        },
      },
    })

    if (!otpRecord) {
      // Log tentative OTP invalide
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (user) {
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: 'ADMIN_OTP_FAILED',
            resource: 'admin_login',
            status: 'FAILED',
            ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '',
            userAgent: req.headers.get('user-agent') || '',
          },
        })
      }

      return NextResponse.json(
        { error: 'Code OTP invalide ou expiré' },
        { status: 401 }
      )
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé ou accès refusé' },
        { status: 403 }
      )
    }

    // Supprimer le code OTP utilisé
    await prisma.adminOTP.delete({
      where: { id: otpRecord.id },
    })

    // Créer un token JWT pour la session admin
    const adminToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        type: 'admin_session',
      },
      process.env.NEXTAUTH_SECRET || 'your-secret',
      { expiresIn: '8h' } // Session de 8h pour l'admin
    )

    // Log la connexion réussie
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'ADMIN_LOGIN_SUCCESS',
        resource: 'admin_login',
        status: 'SUCCESS',
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '',
        userAgent: req.headers.get('user-agent') || '',
      },
    })

    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Connexion réussie',
        token: adminToken,
      },
      { status: 200 }
    )

    // Définir le cookie avec le token
    response.cookies.set({
      name: 'adminToken',
      value: adminToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60, // 8 heures
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[Admin OTP Verify] Error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
