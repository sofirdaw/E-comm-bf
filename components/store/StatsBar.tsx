// components/store/StatsBar.tsx
import { Truck, Shield, RefreshCw, Headphones } from 'lucide-react'

const stats = [
  {
    icon: Truck,
    title: 'Livraison rapide',
    desc: 'Ouagadougou & régions',
  },
  {
    icon: Shield,
    title: 'Garantie 1 an',
    desc: 'Sur tous les produits',
  },
  {
    icon: RefreshCw,
    title: 'Retour 14 jours',
    desc: 'Satisfait ou remboursé',
  },
  {
    icon: Headphones,
    title: 'Support 7j/7',
    desc: 'Équipe dédiée',
  },
]

export function StatsBar() {
  return (
    <div className="border-y border-white/5 bg-[#111114]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/5">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="flex items-center gap-3 px-6 py-4 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[rgba(212,146,12,0.08)] border border-[rgba(212,146,12,0.15)] flex items-center justify-center shrink-0 group-hover:bg-[rgba(212,146,12,0.12)] transition-colors">
                <stat.icon className="w-4 h-4 text-[#d4920c]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#e8e8ec]">{stat.title}</p>
                <p className="text-xs text-[#6e6e80]">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
