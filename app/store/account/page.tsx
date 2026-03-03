// app/store/account/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AccountClient } from '@/components/store/AccountClient'
import { headers } from 'next/headers'

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const session = await auth()
  if (!session) redirect('/auth/login?callbackUrl=/store/account')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  })

  if (!user) redirect('/auth/login')

  return <AccountClient user={user as any} tab={resolvedSearchParams.tab} />
}
