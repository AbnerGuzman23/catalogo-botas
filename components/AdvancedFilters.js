'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdvancedFilters({ brands, categories, products }) {
  const router = useRouter()
  const [selectedGender, setSelectedGender] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [openBrandId, setOpenBrandId] = useState(null)

  // Obtener marcas que tienen productos del género seleccionado
  const getAvailableBrands = (gender) => {
    if (!gender) return []
    
    const availableBrandIds = new Set(
      products
        .filter(product => product.gender === gender)
        .map(product => product.brandId)
        .filter(brandId => brandId !== null)
    )
    
    return brands.filter(brand => availableBrandIds.has(brand.id))
  }

  // Obtener categorías disponibles para una marca y género específicos
  const getAvailableCategories = (brandId, gender) => {
    const availableCategoryIds = new Set(
      products
        .filter(product => 
          product.brandId === brandId && 
          product.gender === gender
        )
        .map(product => product.categoryId)
        .filter(categoryId => categoryId !== null)
    )
    
    return categories.filter(category => availableCategoryIds.has(category.id))
  }

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender)
    setSelectedBrand('')
    setOpenBrandId(null)
  }

  const handleBrandClick = (brandId) => {
    if (openBrandId === brandId) {
      setOpenBrandId(null)
    } else {
      setOpenBrandId(brandId)
      setSelectedBrand(brandId)
    }
  }

  const handleCategorySelect = (categorySlug) => {
    const params = new URLSearchParams()
    if (selectedGender) params.set('gender', selectedGender)
    if (selectedBrand) params.set('brand', selectedBrand)
    if (categorySlug) params.set('category', categorySlug)
    
    router.push(`/?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedGender('')
    setSelectedBrand('')
    setOpenBrandId(null)
    router.push('/')
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <span className="text-3xl">🔍</span>
          Filtros Avanzados
        </h2>
        {(selectedGender || selectedBrand) && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <span>✕</span> Limpiar filtros
          </button>
        )}
      </div>

      {/* Paso 1: Selección de Género */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-bold">1</span>
          Selecciona el género
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleGenderSelect('hombre')}
            className={`p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
              selectedGender === 'hombre'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 text-gray-600 dark:text-gray-400'
            }`}
          >
            <span className="text-3xl">👨</span>
            <span className="font-semibold">HOMBRE</span>
          </button>
          <button
            onClick={() => handleGenderSelect('mujer')}
            className={`p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
              selectedGender === 'mujer'
                ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300'
                : 'border-gray-200 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-500 text-gray-600 dark:text-gray-400'
            }`}
          >
            <span className="text-3xl">👩</span>
            <span className="font-semibold">MUJER</span>
          </button>
        </div>
      </div>

      {/* Paso 2: Selección de Marca (solo si se seleccionó género) */}
      {selectedGender && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
            <span className="w-8 h-8 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center text-sm font-bold">2</span>
            Selecciona la marca
          </h3>
          
          {getAvailableBrands(selectedGender).length > 0 ? (
            <div className="space-y-2">
              {getAvailableBrands(selectedGender).map((brand) => (
                <div key={brand.id} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleBrandClick(brand.id)}
                    className={`w-full p-4 text-left transition-all duration-300 flex items-center justify-between ${
                      selectedBrand === brand.id
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🏷️</span>
                      <span className="font-medium">{brand.name}</span>
                    </div>
                    <span className={`transition-transform duration-200 ${
                      openBrandId === brand.id ? 'rotate-180' : ''
                    }`}>
                      ⬇️
                    </span>
                  </button>
                  
                  {/* Paso 3: Categorías de la marca seleccionada */}
                  {openBrandId === brand.id && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-600">
                      <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                        Categorías disponibles
                      </h4>
                      
                      {getAvailableCategories(brand.id, selectedGender).length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {getAvailableCategories(brand.id, selectedGender).map((category) => (
                            <button
                              key={category.id}
                              onClick={() => handleCategorySelect(category.slug)}
                              className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 flex items-center gap-3 text-left group"
                            >
                              <span className="text-2xl">{category.icon || '📦'}</span>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {category.name}
                                </div>
                                {category.description && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                    {category.description}
                                  </div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                          No hay categorías disponibles para esta marca y género.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              No hay marcas disponibles para el género seleccionado.
            </p>
          )}
        </div>
      )}

      {/* Información de ayuda */}
      {!selectedGender && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-300">¿Cómo usar los filtros?</h4>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                Selecciona primero el género para ver las marcas disponibles, luego elige una marca para explorar sus categorías.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}