// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'E-Comm BF — Tech & Electronics Premium',
    template: '%s | E-Comm BF',
  },
  description: 'Votre destination premium pour les produits tech et électroniques. Smartphones, laptops, audio, gaming et plus — au Burkina Faso.',
  keywords: ['ecommerce', 'tech', 'electronics', 'burkina faso', 'smartphones', 'laptops'],
  authors: [{ name: 'August', url: 'https://ecommbf.com' }],
  creator: 'August',
  openGraph: {
    type: 'website',
    locale: 'fr_BF',
    url: 'https://ecommbf.com',
    title: 'E-Comm BF — Tech & Electronics Premium',
    description: 'Votre destination premium pour les produits tech et électroniques au Burkina Faso.',
    siteName: 'E-Comm BF',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-Comm BF',
    description: 'Tech & Electronics Premium au Burkina Faso',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0b',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a1a1f',
                color: '#e8e8ec',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                fontSize: '14px',
                fontFamily: 'DM Sans, sans-serif',
              },
              success: {
                iconTheme: {
                  primary: '#d4920c',
                  secondary: '#0a0a0b',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#0a0a0b',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
