// hooks/useAdminAuth.ts
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export interface AdminUser {
  id: string
  email: string
  role: string
}

export function useAdminAuth() {
  const router = useRouter()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Vérifier si le token admin existe dans les cookies
    const checkAuth = async () => {
      try {
        // Faire une petite requête au serveur pour vérifier le token
        const res = await fetch('/api/auth/admin/check', {
          method: 'GET',
        })

        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const logout = async () => {
    try {
      await fetch('/api/auth/admin/logout', { method: 'POST' })
      setUser(null)
      setIsAuthenticated(false)
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return {
    user,
    loading,
    isAuthenticated,
    logout,
  }
}
