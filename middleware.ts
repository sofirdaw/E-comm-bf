// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import jwt from 'jsonwebtoken'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Routes publiques - pas de protection
  const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/admin/login',
    '/api/auth',
    '/api/coupons/validate',
  ]

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Si c'est une route publique, laisser passer
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Protection des routes admin
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Vérifier le token admin JWT
    const adminToken = request.cookies.get('adminToken')?.value

    if (!adminToken) {
      // Token absent - rediriger vers login admin
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      // Vérifier la signature du token
      jwt.verify(adminToken, process.env.NEXTAUTH_SECRET || 'your-secret')
    } catch (error) {
      // Token invalide ou expiré
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('adminToken')
      return response
    }
  }

  // Protection des routes utilisateur protégées
  if (pathname.startsWith('/store/account') || pathname.startsWith('/store/orders')) {
    const session = await auth()

    if (!session) {
      return NextResponse.redirect(new URL('/auth/login?callbackUrl=' + pathname, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Protéger les routes admin
    '/admin/:path*',
    // Protéger les routes utilisateur
    '/store/account/:path*',
    '/store/orders/:path*',
  ],
}
