'use client'

import { useState } from 'react'

export default function ImageUpload({ value = null, onChange, name = 'imageUrl' }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value)
  const [error, setError] = useState('')

  const handleFileSelect = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setError('Tipo de archivo no permitido. Solo se permiten: JPEG, PNG, WebP, GIF')
      return
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo es demasiado grande. Máximo 5MB')
      return
    }

    setError('')
    setUploading(true)

    // Mostrar preview local inmediatamente
    const localPreview = URL.createObjectURL(file)
    setPreview(localPreview)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al subir imagen')
      }

      // La imagen se subió correctamente
      setPreview(result.url)
      onChange(result.url)
      
      // Limpiar preview local
      URL.revokeObjectURL(localPreview)

    } catch (error) {
      console.error('Error uploading image:', error)
      setError(error.message)
      setPreview(value) // Volver al valor anterior
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setPreview(null)
    onChange(null)
    setError('')
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Imagen del producto
      </label>
      
      {preview ? (
        <div className="relative">
          <div className="relative w-full h-48 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-sm">Subiendo...</div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={removeImage}
            disabled={uploading}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 disabled:opacity-50"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="w-full">
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Haz clic para subir</span> o arrastra una imagen
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, WebP o GIF (Máx. 5MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
            />
          </label>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Hidden input para el formulario */}
      <input
        type="hidden"
        name={name}
        value={preview || ''}
      />
    </div>
  )
}