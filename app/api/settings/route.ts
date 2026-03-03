// app/api/settings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

import { redisClient } from '@/lib/redis'

export async function GET(request: NextRequest) {
  try {
    // Try cache first
    await redisClient.connect()
    const cached = await redisClient.get('settings')
    if (cached) {
      return NextResponse.json(JSON.parse(cached))
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

    // cache for 5 minutes
    await redisClient.set('settings', JSON.stringify(finalSettings), 300)

    return NextResponse.json(finalSettings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    // Return defaults if database fails
    return NextResponse.json(DEFAULT_SETTINGS)
  }
}
