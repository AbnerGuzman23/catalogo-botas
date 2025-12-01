'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MinimalFilters({ brands, categories, products }) {
  const router = useRouter()
  const [selectedGender, setSelectedGender] = useState('')

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

  const handleGenderSelect = (gender) => {
    if (selectedGender === gender) {
      // Si ya está seleccionado, deseleccionar
      setSelectedGender('')
      router.push('/')
    } else {
      setSelectedGender(gender)
      router.push(`/?gender=${gender}`)
    }
  }

  const handleBrandSelect = (brandId, brandSlug) => {
    const params = new URLSearchParams()
    if (selectedGender) params.set('gender', selectedGender)
    params.set('brand', brandId)
    
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Filtros de Género - Minimalista */}
      <div className="flex justify-center items-center gap-8 py-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => handleGenderSelect('hombre')}
          className={`text-sm font-medium tracking-wide uppercase transition-all duration-200 hover:text-gray-900 dark:hover:text-white ${
            selectedGender === 'hombre'
              ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white pb-1'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Men's
        </button>
        <button
          onClick={() => handleGenderSelect('mujer')}
          className={`text-sm font-medium tracking-wide uppercase transition-all duration-200 hover:text-gray-900 dark:hover:text-white ${
            selectedGender === 'mujer'
              ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white pb-1'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Women's
        </button>
        {selectedGender && (
          <button
            onClick={() => handleGenderSelect('')}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Marcas disponibles - Solo si se seleccionó género */}
      {selectedGender && (
        <div className="py-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-light text-gray-900 dark:text-white tracking-wide">
              {selectedGender === 'hombre' ? 'Men\'s Brands' : 'Women\'s Brands'}
            </h2>
          </div>
          
          {getAvailableBrands(selectedGender).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {getAvailableBrands(selectedGender).map((brand) => {
                const brandProducts = products.filter(p => 
                  p.brandId === brand.id && p.gender === selectedGender
                )
                const productCount = brandProducts.length
                
                return (
                  <button
                    key={brand.id}
                    onClick={() => handleBrandSelect(brand.id, brand.slug)}
                    className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 text-left hover:border-gray-300 dark:hover:border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {brand.name}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {productCount} {productCount === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                    {brand.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {brand.description}
                      </p>
                    )}
                    <div className="mt-4 text-xs text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
                      View Collection →
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No brands available
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No brands found for the selected gender.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mensaje inicial cuando no hay género seleccionado */}
      {!selectedGender && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="text-4xl mb-4">👔👗</div>
            <h2 className="text-xl font-light text-gray-900 dark:text-white mb-2">
              Choose Your Style
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Select Men's or Women's to explore our curated collection of brands and products.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}