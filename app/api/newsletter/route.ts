// app/api/newsletter/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, emailTemplates } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const newsletter = await prisma.newsletter.upsert({
      where: { email },
      update: {},
      create: { email },
    })

    // Send welcome email
    const template = emailTemplates.newsletterWelcome('Abonné')
    await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
