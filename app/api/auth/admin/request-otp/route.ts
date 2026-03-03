// app/api/auth/admin/request-otp/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, emailTemplates } from '@/lib/email'
import bcrypt from 'bcryptjs'

// Générer un code OTP aléatoire à 6 chiffres
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    // Vérifier que l'utilisateur existe et c'est un admin
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      )
    }

    if (user.role !== 'ADMIN') {
      // Log l'accès refusé (tentative d'accès admin par utilisateur non-admin)
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'ADMIN_ACCESS_DENIED',
          resource: 'admin_login',
          status: 'FAILED',
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '',
          userAgent: req.headers.get('user-agent') || '',
        },
      })

      return NextResponse.json(
        { error: 'Accès administrateur refusé' },
        { status: 403 }
      )
    }

    // Vérifier le password
    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      // Log la tentative échouée
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'ADMIN_LOGIN_FAILED',
          resource: 'admin_login',
          status: 'FAILED',
          ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '',
          userAgent: req.headers.get('user-agent') || '',
        },
      })

      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      )
    }

    // Nettoyer les anciens OTPs expiés
    await prisma.adminOTP.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    })

    // Générer un nouveau code OTP
    const code = generateOTP()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    // Sauvegarder le code OTP
    await prisma.adminOTP.create({
      data: {
        email,
        code,
        expiresAt,
      },
    })

    // Envoyer l'email avec le code OTP
    const template = emailTemplates.adminOTP(code)
    await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
    })

    // Log la tentative
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'ADMIN_OTP_REQUESTED',
        resource: 'admin_login',
        status: 'SUCCESS',
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '',
        userAgent: req.headers.get('user-agent') || '',
      },
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Code OTP envoyé à votre email',
        expiresIn: 15 // minutes
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Admin OTP] Error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
