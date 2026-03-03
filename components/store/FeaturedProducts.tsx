// components/store/FeaturedProducts.tsx
'use client'

import Link from 'next/link'
import { ArrowRight, Flame } from 'lucide-react'
import { ProductCard } from './ProductCard'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  salePrice: number | null
  images: string[]
  rating: number
  reviewCount: number
  stock: number
  brand: string | null
  category?: { name: string; slug: string } | null
}

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="section-tag mb-3">
              <Flame className="w-3 h-3" />
              Sélection premium
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              Produits <span className="text-gold-gradient">en vedette</span>
            </h2>
          </div>
          <Link
            href="/store/products?featured=true"
            className="hidden sm:flex items-center gap-2 text-sm text-[#9898a8] hover:text-[#d4920c] transition-colors group"
          >
            Voir tout
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {products.map((product, i) => (
            <div
              key={product.id}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link href="/store/products" className="btn-secondary">
            Voir tous les produits
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
