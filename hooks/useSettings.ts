// hooks/useSettings.ts
import { useState, useEffect } from 'react'

interface Settings {
  storeName: string
  storeEmail: string
  storePhone: string
  currency: string
  language: string
  freeShippingThreshold: string
  shippingCost: string
  emailNotifications: string
  orderNotifications: string
  stockAlerts: string
  minStockAlert: string
}

const DEFAULT_SETTINGS: Settings = {
  storeName: 'e-comm-bf',
  storeEmail: 'contact@ecommbf.com',
  storePhone: '+226 66193424',
  currency: 'XOF',
  language: 'fr',
  freeShippingThreshold: '50000',
  shippingCost: '1000',
  emailNotifications: 'true',
  orderNotifications: 'true',
  stockAlerts: 'true',
  minStockAlert: '5',
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  return { settings, loading }
}
