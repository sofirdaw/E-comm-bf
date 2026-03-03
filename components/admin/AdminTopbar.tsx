// components/admin/AdminTopbar.tsx
'use client'

import { Bell, Search, Sun } from 'lucide-react'
import { useState } from 'react'

interface User {
  name?: string | null
  email?: string | null
}

export function AdminTopbar({ user }: { user: User }) {
  const [query, setQuery] = useState('')

  return (
    <header className="h-14 border-b border-white/5 bg-[#0d0d10]/80 backdrop-blur-sm flex items-center gap-4 px-6 shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4a5a]" />
        <input
          type="text"
          placeholder="Rechercher dans l'admin..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input !py-2 !text-sm !pl-9 w-full"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-[#6e6e80] hover:text-[#e8e8ec] hover:bg-white/5 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#d4920c] rounded-full" />
        </button>

        {/* Date/Time */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#6e6e80] px-3 py-1.5 rounded-lg bg-[#1a1a1f] border border-white/5">
          <Sun className="w-3.5 h-3.5" />
          {new Date().toLocaleDateString('fr-BF', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          })}
        </div>
      </div>
    </header>
  )
}
