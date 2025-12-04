'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function FilterPanel({ brands, categories, products }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedGender, setSelectedGender] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // Inicializar filtros desde URL
  useEffect(() => {
    setSelectedGender(searchParams.get('gender') || '')
    setSelectedBrand(searchParams.get('brand') || '')
    setSelectedCategory(searchParams.get('category') || '')
  }, [searchParams])

  // Obtener marcas disponibles para el género seleccionado
  const getAvailableBrands = () => {
    if (!selectedGender) return []
    
    const availableBrandIds = new Set(
      products
        .filter(product => product.gender === selectedGender)
        .map(product => product.brandId)
        .filter(brandId => brandId !== null)
    )
    
    return brands.filter(brand => 
      availableBrandIds.has(brand.id) && availableBrandIds.size > 0
    )
  }

  // Obtener categorías disponibles para género y marca seleccionados
  const getAvailableCategories = () => {
    if (!selectedGender) return []
    
    let filteredProducts = products.filter(product => product.gender === selectedGender)
    
    if (selectedBrand) {
      filteredProducts = filteredProducts.filter(product => product.brandId === parseInt(selectedBrand))
    }
    
    const availableCategoryIds = new Set(
      filteredProducts
        .map(product => product.categoryId)
        .filter(categoryId => categoryId !== null)
    )
    
    return categories.filter(category => 
      availableCategoryIds.has(category.id) && availableCategoryIds.size > 0
    )
  }

  // Aplicar filtros
  const applyFilters = () => {
    const params = new URLSearchParams()
    
    if (selectedGender) params.set('gender', selectedGender)
    if (selectedBrand) params.set('brand', selectedBrand)
    if (selectedCategory) params.set('category', selectedCategory)
    
    const queryString = params.toString()
    router.push(queryString ? `/?${queryString}` : '/')
    setIsOpen(false)
  }

  // Limpiar filtros
  const clearFilters = () => {
    setSelectedGender('')
    setSelectedBrand('')
    setSelectedCategory('')
    router.push('/')
    setIsOpen(false)
  }

  // Manejar selección de género
  const handleGenderChange = (gender) => {
    setSelectedGender(gender)
    setSelectedBrand('') // Reset brand cuando cambia género
    setSelectedCategory('') // Reset category cuando cambia género
  }

  // Manejar selección de marca
  const handleBrandChange = (brandId) => {
    setSelectedBrand(brandId)
    setSelectedCategory('') // Reset category cuando cambia marca
  }

  // Contar productos filtrados
  const getFilteredProductsCount = () => {
    let filtered = products
    if (selectedGender) filtered = filtered.filter(p => p.gender === selectedGender)
    if (selectedBrand) filtered = filtered.filter(p => p.brandId === parseInt(selectedBrand))
    if (selectedCategory) filtered = filtered.filter(p => p.categoryId === parseInt(selectedCategory))
    return filtered.length
  }

  return (
    <>
      {/* Botón Flotante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-40 bg-black text-white p-3 hover:bg-white hover:text-black border border-black transition-all duration-200 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
        </svg>
        <span className="hidden sm:inline text-sm font-medium">Filtrar</span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Panel Lateral */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white z-50 border-l border-black transform transition-transform duration-300 overflow-y-auto ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="p-6 border-b border-black">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-black">Filtros</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-black hover:text-black"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido de Filtros */}
        <div className="p-6 space-y-6">
          
          {/* 1. Filtro de Género */}
          <div>
            <h3 className="text-sm font-medium text-black mb-3">Género</h3>
            <div className="space-y-2">
              {['hombre', 'mujer', 'unisex'].map((gender) => (
                <label key={gender} className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={selectedGender === gender}
                    onChange={(e) => handleGenderChange(e.target.value)}
                    className="h-4 w-4 text-black focus:ring-black border-black"
                  />
                  <span className="ml-3 text-sm text-black capitalize">
                    {gender === 'hombre' ? 'Hombre' : gender === 'mujer' ? 'Mujer' : 'Unisex'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 2. Filtro de Marca (Solo si hay género seleccionado) */}
          {selectedGender && (
            <div>
              <h3 className="text-sm font-medium text-black mb-3">Marca</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {getAvailableBrands().map((brand) => (
                  <label key={brand.id} className="flex items-center">
                    <input
                      type="radio"
                      name="brand"
                      value={brand.id}
                      checked={selectedBrand === brand.id.toString()}
                      onChange={(e) => handleBrandChange(e.target.value)}
                      className="h-4 w-4 text-black focus:ring-black border-black"
                    />
                    <span className="ml-3 text-sm text-black">
                      {brand.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 3. Filtro de Categoría (Solo si hay género seleccionado) */}
          {selectedGender && (
            <div>
              <h3 className="text-sm font-medium text-black mb-3">Categoría</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {getAvailableCategories().map((category) => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={selectedCategory === category.id.toString()}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="h-4 w-4 text-black focus:ring-black border-black"
                    />
                    <span className="ml-3 text-sm text-black">
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer con botones */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-black">
          <div className="space-y-3">
            {/* Contador de productos */}
            <div className="text-center text-sm text-black">
              {getFilteredProductsCount()} productos encontrados
            </div>
            
            {/* Botones */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-black text-black hover:bg-black hover:text-white transition-colors text-sm"
              >
                Limpiar
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-black text-white hover:bg-white hover:text-black border border-black transition-colors text-sm"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}