// app/admin/banners/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatPrice, formatDate } from '@/lib/utils'
import { Plus, Edit, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react'

interface Banner {
  id: string
  title: string
  subtitle?: string
  image: string
  link?: string
  buttonText?: string
  active: boolean
  order: number
  createdAt: string
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/admin/banners')
      if (response.ok) {
        const data = await response.json()
        setBanners(data.map((banner: any) => ({
          ...banner,
          createdAt: banner.createdAt
        })))
      }
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette bannière?')) return
    
    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setBanners(prev => prev.filter(b => b.id !== id))
      }
    } catch (error) {
      console.error('Error deleting banner:', error)
      alert('Erreur lors de la suppression de la bannière')
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#e8e8ec]">Bannières</h1>
          <p className="text-[#6e6e80] text-sm mt-0.5">
            {loading ? 'Chargement...' : `${banners.length} bannière${banners.length !== 1 ? 's' : ''} configurée${banners.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link
          href="/admin/banners/new"
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Nouvelle bannière
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4920c]"></div>
          <p className="text-[#6e6e80] text-sm mt-4">Chargement des bannières...</p>
        </div>
      )}

      {/* Banners Grid */}
      {!loading && banners.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
          <div key={banner.id} className="card overflow-hidden group">
            {/* Image Preview */}
            <div className="relative h-48 bg-[#1a1a1f] overflow-hidden">
              {banner.image ? (
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-[#6e6e80]" />
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <span className={`badge ${banner.active ? 'badge-success' : 'badge-error'}`}>
                  {banner.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Order Badge */}
              <div className="absolute top-3 left-3">
                <span className="badge badge-gold">
                  Ordre {banner.order}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-medium text-[#e8e8ec] mb-1">{banner.title}</h3>
              {banner.subtitle && (
                <p className="text-sm text-[#6e6e80] mb-3 line-clamp-2">{banner.subtitle}</p>
              )}
              
              {/* Links */}
              <div className="space-y-2 text-xs text-[#6e6e80]">
                {banner.link && (
                  <div className="flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    <span className="truncate">{banner.link}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <span>Créée le {formatDate(banner.createdAt)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4">
                <Link
                  href={`/admin/banners/${banner.id}/edit`}
                  className="btn-ghost flex-1"
                >
                  <Edit className="w-3 h-3" />
                  Modifier
                </Link>
                <button 
                  onClick={() => handleDelete(banner.id)}
                  className="btn-ghost text-[#ef4444] hover:text-[#f87171]"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && banners.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-[#6e6e80] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#e8e8ec] mb-2">Aucune bannière</h3>
          <p className="text-[#6e6e80] text-sm mb-4">
            Commencez par créer votre première bannière pour mettre en avant vos produits
          </p>
          <Link href="/admin/banners/new" className="btn-primary">
            <Plus className="w-4 h-4" />
            Créer une bannière
          </Link>
        </div>
      )}
    </div>
  )
}
