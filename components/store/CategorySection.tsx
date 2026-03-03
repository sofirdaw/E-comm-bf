// components/store/CategorySection.tsx
'use client'

import Link from 'next/link'
import { Grid2X2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const categoryIcons: Record<string, string> = {
  smartphones: '📱',
  laptops: '💻',
  copier: '🖨️',
  application: '💻',
  gaming: '🎮',
  cameras: '📷',
  accessories: '⌚',
}

interface Category {
  id: string
  name: string
  slug: string
  image: string | null
  _count: { products: number }
}

export function CategorySection({ categories }: { categories: Category[] }) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0e0e12]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="section-tag mb-3">
              <Grid2X2 className="w-3 h-3" />
              Catégories
            </div>
            <h2 className="font-display text-3xl font-bold text-white">
              Explorez par <span className="text-gold-gradient">univers</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/store/products?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#1a1a1f] hover:border-[rgba(212,146,12,0.3)] transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Background image */}
              {cat.image && (
                <div className="absolute inset-0">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300 scale-105 group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1f] to-transparent" />
                </div>
              )}

              <div className="relative p-5 text-center">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[#232330] border border-white/5 flex items-center justify-center mx-auto mb-3 group-hover:border-[rgba(212,146,12,0.3)] group-hover:bg-[rgba(212,146,12,0.06)] transition-all duration-300">
                  <span className="text-2xl">
                    {categoryIcons[cat.slug] || '📦'}
                  </span>
                </div>

                <h3 className="font-medium text-sm text-[#e8e8ec] group-hover:text-white transition-colors mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#6e6e80]">
                  {cat._count.products} produit{cat._count.products !== 1 ? 's' : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
