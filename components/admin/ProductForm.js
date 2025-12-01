'use client'

import { useState } from 'react'
import Link from 'next/link'
import SizeInventoryManager from './SizeInventoryManager'
import ImageUpload from './ImageUpload'

export default function ProductForm({ action, product = null, categories = [], brands = [] }) {
  const isEditing = !!product
  const [sizeInventory, setSizeInventory] = useState(product?.inventory || [])
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || null)

  const handleSubmit = async (formData) => {
    // Agregar datos del inventario al formData
    sizeInventory.forEach((item) => {
      formData.append(`sizes[${item.size}]`, item.quantity.toString())
    })
    
    // La imagen ya se maneja por el ImageUpload con el hidden input
    
    // Llamar a la acción del servidor
    return action(formData)
  }

  return (
    <form action={handleSubmit} className="p-6 space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Nombre del producto
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={product?.name || ''}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Ej: Botas de cuero elegantes"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={product?.description || ''}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Describe las características del producto..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Precio (Q)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            required
            step="0.01"
            min="0"
            defaultValue={product?.price || ''}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="99.99"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Categoría
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={product?.category || ''}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.icon && `${category.icon} `}{category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="brandId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Marca
          </label>
          <select
            id="brandId"
            name="brandId"
            defaultValue={product?.brandId || ''}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Sin marca específica</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <ImageUpload
          value={imageUrl}
          onChange={setImageUrl}
          name="imageUrl"
        />
      </div>

      {/* Nuevo componente para gestión de tallas e inventario */}
      <div>
        <SizeInventoryManager
          sizes={sizeInventory}
          onChange={setSizeInventory}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/admin"
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          {isEditing ? 'Actualizar Producto' : 'Crear Producto'}
        </button>
      </div>
    </form>
  )
}