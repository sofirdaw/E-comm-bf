// app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

const DEFAULT_SETTINGS = {
  storeName: 'e-comm-bf',
  storeEmail: 'contact@ecommbf.com',
  storePhone: '+226 66193424',
  currency: 'XOF',
  language: 'fr',
  freeShippingThreshold: '500000',
  shippingCost: '1000',
  emailNotifications: 'true',
  orderNotifications: 'true',
  stockAlerts: 'true',
  minStockAlert: '5',
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all settings from database using raw query
    const settings = await prisma.$queryRaw`SELECT key, value FROM "Setting"`
    
    // Convert to key-value object
    const settingsObj = (settings as any[]).reduce((acc: Record<string, string>, setting: any) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, string>)

    // Merge with defaults for any missing settings
    const finalSettings = { ...DEFAULT_SETTINGS, ...settingsObj }

    return NextResponse.json(finalSettings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Update each setting using raw queries with proper column order
    const updates = await Promise.all(
      Object.entries(body).map(async ([key, value]) => {
        await prisma.$executeRaw`
          INSERT INTO "Setting" (id, key, value, "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), ${key}, ${String(value)}, NOW(), NOW())
          ON CONFLICT (key) 
          DO UPDATE SET value = ${String(value)}, "updatedAt" = NOW()
        `
      })
    )

    return NextResponse.json({ success: true, updated: updates.length })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
