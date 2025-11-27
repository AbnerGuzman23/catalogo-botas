'use client'

import { useState } from 'react'

export default function AdminFilters({ 
  categories = [], 
  sizes = [], 
  selectedCategory, 
  selectedSize, 
  onCategoryChange, 
  onSizeChange,
  onClearFilters 
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Filtros:</span>
        </div>

        {/* Filtro por Categoría */}
        <div className="relative">
          <select
            value={selectedCategory || ''}
            onChange={(e) => onCategoryChange(e.target.value || null)}
            className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500 text-sm"
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        {/* Filtro por Talla */}
        <div className="relative">
          <select
            value={selectedSize || ''}
            onChange={(e) => onSizeChange(e.target.value || null)}
            className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500 text-sm"
          >
            <option value="">Todas las tallas</option>
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        {/* Botón para limpiar filtros */}
        {(selectedCategory || selectedSize) && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Indicadores de filtros activos */}
      {(selectedCategory || selectedSize) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedCategory && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Categoría: {categories.find(cat => cat.slug === selectedCategory)?.name || selectedCategory}
              <button
                onClick={() => onCategoryChange(null)}
                className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
              >
                <svg className="h-2 w-2" fill="currentColor" viewBox="0 0 8 8">
                  <path fillRule="evenodd" d="M5.354 4L8 6.646 6.646 8 4 5.354 1.354 8 0 6.646 2.646 4 0 1.354 1.354 0 4 2.646 6.646 0 8 1.354 5.354 4z" />
                </svg>
              </button>
            </span>
          )}
          {selectedSize && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Talla: {selectedSize}
              <button
                onClick={() => onSizeChange(null)}
                className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-green-400 hover:bg-green-200 hover:text-green-500 focus:outline-none"
              >
                <svg className="h-2 w-2" fill="currentColor" viewBox="0 0 8 8">
                  <path fillRule="evenodd" d="M5.354 4L8 6.646 6.646 8 4 5.354 1.354 8 0 6.646 2.646 4 0 1.354 1.354 0 4 2.646 6.646 0 8 1.354 5.354 4z" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}