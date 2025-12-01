'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrand, updateBrand } from '@/lib/brand-actions'

export default function BrandForm({ brand = null }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const isEditing = !!brand

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const formData = new FormData(e.target)
    
    try {
      let result
      
      if (isEditing) {
        result = await updateBrand(brand.id, formData)
      } else {
        result = await createBrand(formData)
      }
      
      if (result.success) {
        router.push('/admin/brands')
        router.refresh()
      } else {
        setError(result.error)
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Error inesperado. Por favor intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre de la marca *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={brand?.name || ''}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Ej: Nike, Adidas, Texas Botas..."
          />
        </div>

        {/* Sitio Web */}
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sitio web
          </label>
          <input
            type="url"
            id="website"
            name="website"
            defaultValue={brand?.website || ''}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="https://ejemplo.com"
          />
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={brand?.description || ''}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Describe la marca, su historia, características..."
        />
      </div>

      {/* URL del Logo */}
      <div>
        <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          URL del Logo
        </label>
        <input
          type="url"
          id="logoUrl"
          name="logoUrl"
          defaultValue={brand?.logoUrl || ''}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="https://ejemplo.com/logo.png"
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Recomendado: imagen cuadrada de al menos 200x200px en formato PNG o JPG
        </p>
      </div>

      {/* Vista previa del logo */}
      {(brand?.logoUrl) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Logo actual
          </label>
          <div className="w-24 h-24 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
            <img
              src={brand.logoUrl}
              alt={`Logo ${brand.name}`}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Botones */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEditing ? 'Actualizando...' : 'Creando...'}
            </>
          ) : (
            isEditing ? 'Actualizar Marca' : 'Crear Marca'
          )}
        </button>
      </div>
    </form>
  )
}