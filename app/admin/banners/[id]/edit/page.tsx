// app/admin/banners/[id]/edit/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { formatPrice, formatDate } from '@/lib/utils'
import { ArrowLeft, Save, ExternalLink, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

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

export default function EditBannerPage() {
  const router = useRouter()
  const params = useParams()
  const [banner, setBanner] = useState<Banner | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchBanner()
    }
  }, [params.id])

  const fetchBanner = async () => {
    try {
      const response = await fetch(`/api/admin/banners/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setBanner(data)
      }
    } catch (error) {
      console.error('Error fetching banner:', error)
      toast.error('Erreur lors du chargement de la bannière')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!banner || saving) return

    setSaving(true)
    try {
      const response = await fetch(`/api/admin/banners/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(banner),
      })

      if (response.ok) {
        toast.success('Bannière mise à jour avec succès')
        router.push('/admin/banners')
      } else {
        toast.error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Error updating banner:', error)
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4920c]"></div>
      </div>
    )
  }

  if (!banner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Bannière non trouvée</h1>
          <Link href="/admin/banners" className="btn-primary">
            Retour aux bannières
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Modifier la bannière</h1>
          <Link href="/admin/banners" className="btn-secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4">Informations de base</h2>
              
              <div>
                <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  value={banner.title}
                  onChange={(e) => setBanner({ ...banner, title: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1a1a1f] border border-white/20 rounded-lg text-white focus:border-[#d4920c] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                  Sous-titre
                </label>
                <textarea
                  value={banner.subtitle || ''}
                  onChange={(e) => setBanner({ ...banner, subtitle: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1a1a1f] border border-white/20 rounded-lg text-white focus:border-[#d4920c] focus:outline-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                  URL de l'image
                </label>
                <input
                  type="url"
                  value={banner.image}
                  onChange={(e) => setBanner({ ...banner, image: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1a1a1f] border border-white/20 rounded-lg text-white focus:border-[#d4920c] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                  Lien (optionnel)
                </label>
                <input
                  type="url"
                  value={banner.link || ''}
                  onChange={(e) => setBanner({ ...banner, link: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1a1a1f] border border-white/20 rounded-lg text-white focus:border-[#d4920c] focus:outline-none"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                  Texte du bouton (optionnel)
                </label>
                <input
                  type="text"
                  value={banner.buttonText || ''}
                  onChange={(e) => setBanner({ ...banner, buttonText: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1a1a1f] border border-white/20 rounded-lg text-white focus:border-[#d4920c] focus:outline-none"
                  placeholder="En savoir plus"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  value={banner.order}
                  onChange={(e) => setBanner({ ...banner, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-[#1a1a1f] border border-white/20 rounded-lg text-white focus:border-[#d4920c] focus:outline-none"
                  min="0"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={banner.active}
                  onChange={(e) => setBanner({ ...banner, active: e.target.checked })}
                  className="w-4 h-4 text-[#d4920c] bg-[#1a1a1f] border-white/20 rounded focus:ring-[#d4920c]"
                />
                <label htmlFor="active" className="ml-2 text-sm font-medium text-[#e8e8ec]">
                  Bannière active
                </label>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4">Aperçu</h2>
              <div className="bg-[#1a1a1f] border border-white/20 rounded-lg p-6">
                <div className="relative h-64 bg-gradient-to-r from-[#d4920c] to-[#e8aa1f] rounded-lg overflow-hidden">
                  {banner.image && (
                    <img 
                      src={banner.image} 
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center text-white p-6">
                      <h3 className="text-2xl font-bold mb-2">{banner.title}</h3>
                      {banner.subtitle && (
                        <p className="text-lg mb-4">{banner.subtitle}</p>
                      )}
                      {banner.link && banner.buttonText && (
                        <a 
                          href={banner.link}
                          className="inline-block bg-white text-[#d4920c] px-6 py-2 rounded-lg font-medium hover:bg-[#e8e8ec] transition-colors"
                        >
                          {banner.buttonText}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Link href="/admin/banners" className="btn-secondary">
              Annuler
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer les modifications
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
