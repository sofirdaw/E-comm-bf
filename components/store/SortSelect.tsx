// components/store/SortSelect.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

const sortOptions = [
  { value: 'default', label: 'Par défaut' },
  { value: 'newest', label: 'Plus récents' },
  { value: 'popular', label: 'Plus populaires' },
  { value: 'rating', label: 'Mieux notés' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
]

export function SortSelect({ current }: { current?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <div className="relative">
      <select
        value={current || 'default'}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString())
          if (e.target.value === 'default') {
            params.delete('sort')
          } else {
            params.set('sort', e.target.value)
          }
          router.push(`?${params.toString()}`)
        }}
        className="input !py-2 !pr-8 !text-sm appearance-none cursor-pointer"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#1a1a1f]">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6e6e80] pointer-events-none" />
    </div>
  )
}
