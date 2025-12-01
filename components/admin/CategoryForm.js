'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CategoryForm({ action, category = null, submitText = "Crear Categoría" }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sizes, setSizes] = useState(category?.sizes?.map(s => ({ id: s.id, size: s.size, order: s.order })) || [])
  const [newSize, setNewSize] = useState('')

  const addSize = () => {
    if (newSize.trim() && !sizes.find(s => s.size === newSize.trim())) {
      setSizes([...sizes, { 
        id: Date.now(), // ID temporal para nuevas tallas
        size: newSize.trim(), 
        order: sizes.length 
      }])
      setNewSize('')
    }
  }

  const removeSize = (index) => {
    setSizes(sizes.filter((_, i) => i !== index))
  }

  const moveSizeUp = (index) => {
    if (index > 0) {
      const newSizes = [...sizes]
      ;[newSizes[index - 1], newSizes[index]] = [newSizes[index], newSizes[index - 1]]
      setSizes(newSizes.map((size, i) => ({ ...size, order: i })))
    }
  }

  const moveSizeDown = (index) => {
    if (index < sizes.length - 1) {
      const newSizes = [...sizes]
      ;[newSizes[index], newSizes[index + 1]] = [newSizes[index + 1], newSizes[index]]
      setSizes(newSizes.map((size, i) => ({ ...size, order: i })))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const formData = new FormData(e.target)
      
      // Agregar las tallas al FormData
      sizes.forEach((size, index) => {
        formData.append(`sizes[${index}][id]`, size.id)
        formData.append(`sizes[${index}][size]`, size.size)
        formData.append(`sizes[${index}][order]`, index)
      })
      
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

      {/* Gestión de Tallas */}
      <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tallas de la Categoría</h3>
        
        {/* Agregar nueva talla */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
            placeholder="Ej: S, M, L, XL, 38, 39, 40..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            type="button"
            onClick={addSize}
            className="px-4 py-2 bg-gray-900 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-md font-medium transition-colors duration-200"
          >
            Agregar
          </button>
        </div>

        {/* Lista de tallas */}
        {sizes.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Tallas configuradas ({sizes.length})
            </h4>
            <div className="space-y-2">
              {sizes.map((size, index) => (
                <div key={size.id} className="flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {size.size}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveSizeUp(index)}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      title="Mover arriba"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSizeDown(index)}
                      disabled={index === sizes.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      title="Mover abajo"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSize(index)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Eliminar talla"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Configura las tallas específicas que estarán disponibles para los productos de esta categoría. Si no agregas tallas, los productos de esta categoría no tendrán opciones de talla.
        </p>
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