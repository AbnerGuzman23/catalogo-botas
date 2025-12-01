'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function MinimalFilters({ brands, categories, products }) {
  const router = useRouter()
  const [openDropdown, setOpenDropdown] = useState(null)

  // Obtener marcas que tienen productos del género seleccionado
  const getAvailableBrands = (gender) => {
    const availableBrandIds = new Set(
      products
        .filter(product => product.gender === gender)
        .map(product => product.brandId)
        .filter(brandId => brandId !== null)
    )
    
    return brands.filter(brand => availableBrandIds.has(brand.id))
  }

  const handleDropdownToggle = (gender) => {
    setOpenDropdown(openDropdown === gender ? null : gender)
  }

  const handleBrandSelect = (brandId, gender) => {
    const params = new URLSearchParams()
    params.set('gender', gender)
    params.set('brand', brandId)
    
    router.push(`/?${params.toString()}`)
    setOpenDropdown(null)
  }

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null)
    }
    
    if (openDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [openDropdown])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Filtros de Género con Dropdown */}
      <div className="flex justify-center items-center gap-8 py-6 border-b border-gray-200 dark:border-gray-700 relative">
        
        {/* Men's Dropdown */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDropdownToggle('hombre')
            }}
            className="text-sm font-medium tracking-wide uppercase transition-all duration-200 hover:text-gray-900 dark:hover:text-white text-gray-600 dark:text-gray-400 flex items-center gap-1"
          >
            MEN'S
            <span className={`transition-transform duration-200 ${openDropdown === 'hombre' ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {/* Dropdown Menu - Men's */}
          {openDropdown === 'hombre' && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              {getAvailableBrands('hombre').length > 0 ? (
                <div className="py-2">
                  {getAvailableBrands('hombre').map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => handleBrandSelect(brand.id, 'hombre')}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">
                        {brand.name}
                      </div>
                      {brand.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {brand.description}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-4 px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                  No brands available
                </div>
              )}
            </div>
          )}
        </div>

        {/* Women's Dropdown */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDropdownToggle('mujer')
            }}
            className="text-sm font-medium tracking-wide uppercase transition-all duration-200 hover:text-gray-900 dark:hover:text-white text-gray-600 dark:text-gray-400 flex items-center gap-1"
          >
            WOMEN'S
            <span className={`transition-transform duration-200 ${openDropdown === 'mujer' ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {/* Dropdown Menu - Women's */}
          {openDropdown === 'mujer' && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              {getAvailableBrands('mujer').length > 0 ? (
                <div className="py-2">
                  {getAvailableBrands('mujer').map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => handleBrandSelect(brand.id, 'mujer')}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">
                        {brand.name}
                      </div>
                      {brand.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {brand.description}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-4 px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                  No brands available
                </div>
              )}
            </div>
          )}
        </div>

        {/* Clear Filter */}
        <Link
          href="/"
          className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
        >
          VIEW ALL
        </Link>
      </div>
    </div>
  )
}