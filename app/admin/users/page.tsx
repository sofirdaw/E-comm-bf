// app/admin/users/page.tsx
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Users, Shield, User as UserIcon } from 'lucide-react'

async function getUsers() {
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { orders: true } },
      },
    }),
    prisma.user.count(),
  ])
  return { users, total }
}

export default async function AdminUsersPage() {
  const { users, total } = await getUsers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-[#d4920c]" />
          Utilisateurs
        </h1>
        <p className="text-[#6e6e80] text-sm mt-0.5">{total} utilisateur{total !== 1 ? 's' : ''} enregistré{total !== 1 ? 's' : ''}</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Utilisateur', 'Email', 'Rôle', 'Commandes', 'Inscrit le', 'Actions'].map((h, index) => (
                  <th key={`user-header-${index}`} className="text-left text-xs font-medium text-[#6e6e80] uppercase tracking-wider py-3 px-4 first:pl-6 last:pr-6">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pl-6 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-[#1a1a1f] border border-white/5 shrink-0">
                        {user.image ? (
                          <img src={user.image} alt={user.name || ''} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm font-bold text-[#d4920c]">
                            {user.name?.[0]?.toUpperCase() || '?'}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#e8e8ec]">{user.name || 'Sans nom'}</p>
                        {user.phone && <p className="text-xs text-[#6e6e80]">{user.phone}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-[#9898a8]">{user.email}</p>
                    {user.emailVerified && (
                      <span className="text-[10px] text-[#4ade80]">✓ Vérifié</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge text-xs flex items-center gap-1 w-fit ${user.role === 'ADMIN' ? 'badge-gold' : 'badge-info'}`}>
                      {user.role === 'ADMIN' ? <Shield className="w-2.5 h-2.5" /> : <UserIcon className="w-2.5 h-2.5" />}
                      {user.role === 'ADMIN' ? 'Admin' : 'Client'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-[#9898a8] font-mono">{user._count.orders}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-[#9898a8]">{formatDate(user.createdAt)}</span>
                  </td>
                  <td className="py-3 pl-4 pr-6">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-xs px-2 py-1 rounded-lg border border-white/10 text-[#9898a8] hover:text-[#d4920c] hover:border-[rgba(212,146,12,0.3)] transition-all">
                        Modifier
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
