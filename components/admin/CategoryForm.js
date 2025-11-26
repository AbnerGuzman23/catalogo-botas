'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CategoryForm({ action, category = null, submitText = "Crear Categoría" }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const formData = new FormData(e.target)
      
      let result
      if (category) {
        result = await action(category.id, formData)
      } else {
        result = await action(formData)
      }
      
      if (result.success) {
        router.push('/admin/categories')
      } else {
        setError(result.error || 'Error al procesar la categoría')
      }
    } catch (err) {
      setError('Error al procesar la categoría')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Nombre de la categoría *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={category?.name || ''}
          required
          autoFocus
          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Ej: Zapatos, Cinturones, Ropa..."
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={category?.description || ''}
          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Descripción opcional de la categoría"
        />
      </div>

      <div>
        <label htmlFor="icon" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Icono/Emoji
        </label>
        <input
          type="text"
          id="icon"
          name="icon"
          defaultValue={category?.icon || ''}
          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Ej: 👢, 👕, 🎭, 🔧"
          maxLength={4}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Opcional: Agrega un emoji que represente esta categoría
        </p>
      </div>

      {/* Sección de configuración adicional */}
      <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Configuración Adicional</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center">
              <input
                id="hasSizes"
                name="hasSizes"
                type="checkbox"
                defaultChecked={category?.hasSizes || false}
                className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="hasSizes" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">
                Esta categoría usa tallas
              </label>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Marcar si los productos de esta categoría necesitan especificar talla
            </p>
          </div>

          <div>
            <div className="flex items-center">
              <input
                id="hasColors"
                name="hasColors"
                type="checkbox"
                defaultChecked={category?.hasColors || false}
                className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="hasColors" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">
                Esta categoría usa colores
              </label>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Marcar si los productos de esta categoría pueden tener diferentes colores
            </p>
          </div>

          <div>
            <div className="flex items-center">
              <input
                id="hasMaterials"
                name="hasMaterials"
                type="checkbox"
                defaultChecked={category?.hasMaterials || false}
                className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="hasMaterials" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">
                Esta categoría especifica materiales
              </label>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Marcar si es importante especificar el material (cuero, algodón, etc.)
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
        <Link
          href="/admin/categories"
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
        >
          {loading ? 'Procesando...' : submitText}
        </button>
      </div>
    </form>
  )
}