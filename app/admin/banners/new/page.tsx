// app/admin/banners/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Eye, Image as ImageIcon } from 'lucide-react'
import { ImageUpload } from '@/components/admin/ImageUpload'
import toast from 'react-hot-toast'

interface BannerForm {
  title: string
  subtitle: string
  image: string
  link: string
  buttonText: string
  active: boolean
  order: number
}

export default function NewBannerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(false)
  const [formData, setFormData] = useState<BannerForm>({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    buttonText: '',
    active: true,
    order: 1,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create banner')
      }

      const banner = await response.json()

      // Rediriger vers la liste des bannières
      router.push('/admin/banners')
    } catch (error) {
      alert('Erreur lors de la création de la bannière: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof BannerForm, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (preview) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPreview(false)}
              className="btn-ghost"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à l'édition
            </button>
            <h1 className="text-2xl font-bold text-[#e8e8ec]">Aperçu de la bannière</h1>
          </div>
        </div>

        {/* Preview Banner */}
        <div className="max-w-4xl mx-auto">
          <div className="relative h-96 bg-gradient-to-br from-[#1a1a1f] to-[#0a0a0b] rounded-2xl overflow-hidden">
            {formData.image ? (
              <img
                src={formData.image}
                alt={formData.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-[#6e6e80]" />
              </div>
            )}

            {/* Overlay Content */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-8">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-bold text-white mb-2">{formData.title || 'Titre de la bannière'}</h2>
                {formData.subtitle && (
                  <p className="text-lg text-[#e8e8ec] mb-4">{formData.subtitle}</p>
                )}
                {formData.buttonText && formData.link && (
                  <a
                    href={formData.link}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 bg-gradient-to-r from-[#d4920c] to-[#e8aa1f] text-white hover:from-[#e8aa1f] hover:to-[#d4920c]"
                  >
                    {formData.buttonText}
                  </a>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <span className={`badge ${formData.active ? 'badge-success' : 'badge-error'}`}>
                {formData.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/banners')}
            className="btn-ghost"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux bannières
          </button>
          <h1 className="text-2xl font-bold text-[#e8e8ec]">Nouvelle bannière</h1>
        </div>
        <button
          onClick={() => setPreview(true)}
          className="btn-secondary"
        >
          <Eye className="w-4 h-4" />
          Aperçu
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {/* Basic Info */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-white mb-4">Informations de base</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                Titre *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="input"
                placeholder="Ex: Nouvelle Collection 2026"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                Sous-titre
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => handleInputChange('subtitle', e.target.value)}
                className="input"
                placeholder="Ex: Découvrez les dernières innovations"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
              URL de l'image *
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              className="input"
              placeholder="https://example.com/image.jpg"
              required
            />
            <p className="text-xs text-[#6e6e80] mt-1">
              Dimensions recommandées: 1920x600px, format JPG ou PNG
            </p>
          </div>
        </div>

        {/* Link & Button */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-white mb-4">Lien et bouton</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                URL de destination
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => handleInputChange('link', e.target.value)}
                className="input"
                placeholder="/store/products ou https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                Texte du bouton
              </label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={(e) => handleInputChange('buttonText', e.target.value)}
                className="input"
                placeholder="Ex: Explorer maintenant"
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-white mb-4">Paramètres</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#e8e8ec] mb-2">
                Ordre d'affichage
              </label>
              <input
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) => handleInputChange('order', parseInt(e.target.value))}
                className="input"
              />
              <p className="text-xs text-[#6e6e80] mt-1">
                Plus le nombre est petit, plus la bannière apparaîtra en premier
              </p>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => handleInputChange('active', e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-[#1a1a1f] text-[#d4920c] focus:ring-[#d4920c]"
              />
              <label htmlFor="active" className="text-sm font-medium text-[#e8e8ec]">
                Bannière active
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Création...' : 'Créer la bannière'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/banners')}
            className="btn-secondary"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}
