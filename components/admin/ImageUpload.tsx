// components/admin/ImageUpload.tsx
'use client'

import { useState, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleUpload = useCallback(async (files: FileList) => {
    if (images.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images autorisées`)
      return
    }

    setUploading(true)
    const uploadPromises = Array.from(files).slice(0, maxImages - images.length).map(async (file) => {
      if (!file.type.startsWith('image/')) {
        throw new Error('Seules les images sont autorisées')
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('La taille maximale est de 5MB par image')
      }

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de l\'upload')
      }

      const result = await response.json()
      return result.url
    })

    try {
      const newImages = await Promise.all(uploadPromises)
      onChange([...images, ...newImages])
      toast.success(`${newImages.length} image(s) uploadée(s) avec succès`)
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Erreur lors de l\'upload')
    } finally {
      setUploading(false)
    }
  }, [images, onChange, maxImages])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files)
    }
  }, [handleUpload])

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-[#d4920c] bg-[rgba(212,146,12,0.05)]' 
            : 'border-white/20 hover:border-white/30 bg-[#1a1a1f]'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading || images.length >= maxImages}
        />
        
        <div className="flex flex-col items-center space-y-3">
          {uploading ? (
            <Loader2 className="w-8 h-8 text-[#d4920c] animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-[#6e6e80]" />
          )}
          
          <div>
            <p className="text-white font-medium">
              {uploading ? 'Upload en cours...' : 'Glissez les images ici'}
            </p>
            <p className="text-sm text-[#6e6e80]">
              ou cliquez pour sélectionner
            </p>
          </div>
          
          <p className="text-xs text-[#6e6e80]">
            PNG, JPG, GIF jusqu'à 5MB • Max {maxImages} images
          </p>
        </div>
      </div>

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-[#111114] border border-white/5">
                <img
                  src={image}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload More Button */}
      {images.length > 0 && images.length < maxImages && (
        <button
          onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
          className="w-full py-2 px-4 bg-[#1a1a1f] border border-white/20 rounded-lg text-[#6e6e80] hover:border-[#d4920c] hover:text-[#d4920c] transition-colors"
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Ajouter d'autres images
        </button>
      )}
    </div>
  )
}
