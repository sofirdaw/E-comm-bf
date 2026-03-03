// app/admin/categories/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Tag, Plus, Edit2, Trash2, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  _count: { products: number }
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', image: '' })
  const [saving, setSaving] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const load = async () => {
    const res = await fetch('/api/categories')
    const data = await res.json()
    setCategories(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (editingCategory) {
        // Update
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form),
        })

        if (res.ok) {
          toast.success('Catégorie mise à jour !')
          setShowForm(false)
          setEditingCategory(null)
          setForm({ name: '', description: '', image: '' })
          load()
        } else {
          const d = await res.json()
          toast.error(d.error || 'Erreur')
        }
      } else {
        // Create
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form),
        })

        const d = await res.json()

        if (res.ok) {
          toast.success('Catégorie créée !')
          setShowForm(false)
          setEditingCategory(null)
          setForm({ name: '', description: '', image: '' })
          load()
        } else {
          toast.error(d.error || 'Erreur')
        }
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Erreur')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setForm({
      name: category.name,
      description: category.description || '',
      image: category.image || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      return
    }

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Catégorie supprimée !')
        load()
      } else {
        toast.error(data.error || 'Erreur')
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Tag className="w-6 h-6 text-[#d4920c]" />
            Catégories
          </h1>
          <p className="text-[#6e6e80] text-sm mt-0.5">{categories.length} catégorie{categories.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus className="w-4 h-4" />
          Nouvelle catégorie
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="card p-6 animate-fade-up">
          <h2 className="font-display font-semibold text-white mb-4">
            {editingCategory ? 'Modifier la catégorie' : 'Créer une catégorie'}
          </h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#9898a8] mb-1.5">Nom *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Smartphones"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm text-[#9898a8] mb-1.5">Image URL</label>
              <input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                className="input"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-[#9898a8] mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                placeholder="Description de la catégorie..."
                className="input resize-none"
              />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Créer la catégorie
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 animate-shimmer rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="card p-4 group relative overflow-hidden">
              {cat.image && (
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                  <img src={cat.image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(212,146,12,0.1)] border border-[rgba(212,146,12,0.2)] flex items-center justify-center">
                    <Tag className="w-5 h-5 text-[#d4920c]" />
                  </div>
                  <div className="flex gap-1 opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleEdit(cat)
                      }}
                      className="w-7 h-7 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#9898a8] hover:text-[#d4920c] transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleDelete(cat.id)
                      }}
                      className="w-7 h-7 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#9898a8] hover:text-[#ef4444] transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <h3 className="font-medium text-[#e8e8ec] text-sm">{cat.name}</h3>
                <p className="text-xs text-[#6e6e80] mt-1">{cat._count.products} produit{cat._count.products !== 1 ? 's' : ''}</p>
                {cat.description && (
                  <p className="text-xs text-[#6e6e80] mt-1 line-clamp-2">{cat.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
