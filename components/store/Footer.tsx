// components/store/Footer.tsx
'use client'

import Link from 'next/link'
import { Smartphone, Mail, MapPin, Phone, Github, Twitter, Instagram } from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'

export function Footer() {
  const { settings } = useSettings()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#080809] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/store" className="flex items-center gap-2.5 mb-5">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#e8aa1f] to-[#b07408] opacity-90" />
                <span className="absolute inset-0 flex items-center justify-center text-[#0a0a0b] font-bold text-sm">E</span>
              </div>
              <span className="font-display font-bold text-xl">
                <span className="text-white">e-comm</span>
                <span className="text-[#d4920c]">bf</span>
              </span>
            </Link>
            <p className="text-sm text-[#6e6e80] leading-relaxed mb-6">
              Votre destination tech premium au Burkina Faso. Les meilleurs produits électroniques, livrés rapidement.
            </p>
            <div className="space-y-2">
              <a href={`mailto:${settings.storeEmail}`} className="flex items-center gap-2 text-sm text-[#6e6e80] hover:text-[#d4920c] transition-colors">
                <Mail className="w-3.5 h-3.5" />
                {settings.storeEmail}
              </a>
              <a href={`tel:${settings.storePhone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-[#6e6e80] hover:text-[#d4920c] transition-colors">
                <Phone className="w-3.5 h-3.5" />
                {settings.storePhone}
              </a>
              <p className="flex items-center gap-2 text-sm text-[#6e6e80]">
                <MapPin className="w-3.5 h-3.5" />
                Ouagadougou, Burkina Faso
              </p>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-medium text-sm text-[#e8e8ec] mb-5 tracking-wide">Boutique</h4>
            <ul className="space-y-3">
              {[
                { label: 'Tous les produits', href: '/store/products' },
                { label: 'Smartphones', href: '/store/products?category=smartphones' },
                { label: 'Laptops', href: '/store/products?category=laptops' },
                { label: 'Copieur', href: '/store/products?category=copier' },
                { label: 'Application', href: '/store/products?category=application' },
                { label: 'Gaming', href: '/store/products?category=gaming' },
                { label: 'Promotions', href: '/store/products?sale=true' },
                { label: 'Ordinateur de bureau', href: '/store/products?category=desktop' },
                { label: 'Souris', href: '/store/products?category=mouse' },
                { label: 'Tablette', href: '/store/products?category=tablet' },
                // Placeholder pour futures catégories (commenter si nécessaire)
                // { label: 'Imprimantes', href: '/store/products?category=printers' },
                // { label: 'Accessoires', href: '/store/products?category=accessories' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#6e6e80] hover:text-[#d4920c] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-medium text-sm text-[#e8e8ec] mb-5 tracking-wide">Mon compte</h4>
            <ul className="space-y-3">
              {[
                { label: 'Connexion', href: '/auth/login' },
                { label: 'Inscription', href: '/auth/register' },
                { label: 'Mes commandes', href: '/store/orders' },
                { label: 'Liste de souhaits', href: '/store/account?tab=wishlist' },
                { label: 'Mon profil', href: '/store/account' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#6e6e80] hover:text-[#d4920c] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-medium text-sm text-[#e8e8ec] mb-5 tracking-wide">Informations</h4>
            <ul className="space-y-3">
              {[
                { label: 'À propos', href: '/store/about' },
                { label: 'Livraison & retours', href: '/store/shipping' },
                { label: 'Politique de confidentialité', href: '/store/privacy' },
                { label: 'Conditions d\'utilisation', href: '/store/terms' },
                { label: 'FAQ', href: '/store/faq' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#6e6e80] hover:text-[#d4920c] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#4a4a5a]">
            © {year} e-comm-bf. Conçu et développé par <span className="text-[#d4920c]">August</span>. Tous droits réservés.
          </p>
          <div className="flex items-center gap-1">
            {[
              { icon: Twitter, href: '#' },
              { icon: Instagram, href: '#' },
              { icon: Github, href: '#' },
            ].map(({ icon: Icon, href }) => (
              <a
                key={href}
                href={href}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4a4a5a] hover:text-[#d4920c] hover:bg-[rgba(212,146,12,0.08)] transition-all"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
