// components/store/ProductFilters.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug: string
  _count: { products: number }
}

interface Props {
  categories: Category[]
  searchParams: Record<string, string | undefined>
}

export function ProductFilters({ categories, searchParams }: Props) {
  const router = useRouter()
  const [priceRange, setPriceRange] = useState({
    min: searchParams.minPrice || '',
    max: searchParams.maxPrice || '',
  })

  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams()
    const current = { ...searchParams }
    if (value) {
      current[key] = value
    } else {
      delete current[key]
    }
    delete current.page
    Object.entries(current).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    router.push(`?${params.toString()}`)
  }

  const clearAll = () => {
    router.push('/store/products')
    setPriceRange({ min: '', max: '' })
  }

  const hasFilters = Object.keys(searchParams).some((k) => k !== 'sort' && searchParams[k])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm text-[#e8e8ec]">Filtres</h3>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-[#d4920c] hover:text-[#e8aa1f] flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" />
            Effacer
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6e6e80] mb-3">
          Catégories
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => updateFilter('category', undefined)}
            className={cn(
              'w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm transition-all text-left',
              !searchParams.category
                ? 'text-[#d4920c] bg-[rgba(212,146,12,0.08)]'
                : 'text-[#9898a8] hover:text-[#e8e8ec] hover:bg-white/5'
            )}
          >
            <span>Tous</span>
            <span className="text-xs text-[#6e6e80]">
              {categories.reduce((sum, c) => sum + c._count.products, 0)}
            </span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter('category', cat.slug)}
              className={cn(
                'w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm transition-all text-left',
                searchParams.category === cat.slug
                  ? 'text-[#d4920c] bg-[rgba(212,146,12,0.08)]'
                  : 'text-[#9898a8] hover:text-[#e8e8ec] hover:bg-white/5'
              )}
            >
              <span>{cat.name}</span>
              <span className="text-xs text-[#6e6e80]">{cat._count.products}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="divider" />

      {/* Price range */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6e6e80] mb-3">
          Prix (FCFA)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange((p) => ({ ...p, min: e.target.value }))}
            onBlur={() => updateFilter('minPrice', priceRange.min || undefined)}
            className="input !py-2 !text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange((p) => ({ ...p, max: e.target.value }))}
            onBlur={() => updateFilter('maxPrice', priceRange.max || undefined)}
            className="input !py-2 !text-sm"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="divider" />

      {/* Special filters */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6e6e80] mb-3">
          Filtres spéciaux
        </h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={searchParams.featured === 'true'}
              onChange={(e) => updateFilter('featured', e.target.checked ? 'true' : undefined)}
              className="w-4 h-4 rounded border border-white/20 bg-[#1a1a1f] accent-[#d4920c]"
            />
            <span className="text-sm text-[#9898a8] group-hover:text-[#e8e8ec] transition-colors">
              En vedette
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={searchParams.sale === 'true'}
              onChange={(e) => updateFilter('sale', e.target.checked ? 'true' : undefined)}
              className="w-4 h-4 rounded border border-white/20 bg-[#1a1a1f] accent-[#d4920c]"
            />
            <span className="text-sm text-[#9898a8] group-hover:text-[#e8e8ec] transition-colors">
              En promotion
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}
