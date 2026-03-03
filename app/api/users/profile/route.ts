// app/api/users/profile/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  try {
    const { name, phone } = await req.json()
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { name, phone },
      select: { id: true, name: true, email: true, phone: true },
    })
    return NextResponse.json(user)
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, phone: true, image: true, role: true },
  })

  return NextResponse.json(user)
}
