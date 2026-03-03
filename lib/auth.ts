// lib/auth.ts
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { Role } from '@prisma/client'

export const { handlers, signIn, signOut, auth: _auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) {
          throw new Error('Identifiants invalides')
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) {
          throw new Error('Identifiants invalides')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
      }

      if (trigger === 'update' && session) {
        token.name = session.name
        token.image = session.image
      }

      // Only refresh role from DB periodically (every 24 hours) to reduce DB load
      if (token.id && (!token.lastRoleRefresh || Date.now() - (token.lastRoleRefresh as number) > 24 * 60 * 60 * 1000)) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true, name: true, image: true },
          })
          if (dbUser) {
            token.role = dbUser.role
            token.name = dbUser.name
            token.image = dbUser.image
            token.lastRoleRefresh = Date.now()
          }
        } catch (error) {
          console.error('[Auth] Error refreshing user data:', error)
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
      }
      return session
    },
  },
  events: {
    async createUser({ user }) {
      // User creation log removed
    },
  },
})

// wrap the auth function to prevent thrown errors during build-time when the database is unreachable
export async function auth() {
  try {
    return await _auth()
  } catch (error) {
    console.error('[Auth] caught error:', error)
    return null
  }
}
