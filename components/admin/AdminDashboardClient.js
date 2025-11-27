'use client'

import { useState, useEffect } from 'react'
import { getProducts, getAvailableSizes } from '@/lib/actions'
import AdminNavbar from '@/components/admin/AdminNavbar'
import AdminProductList from '@/components/admin/AdminProductList'
import AdminFilters from '@/components/admin/AdminFilters'
import Link from 'next/link'

export default function AdminDashboardClient({ initialProducts, initialSizes }) {
  const [products, setProducts] = useState(initialProducts)
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [availableSizes, setAvailableSizes] = useState(initialSizes)

  // Extraer categorías únicas de los productos
  const categories = [...new Set(initialProducts.map(p => p.category).filter(Boolean))]
  
  // Usar las tallas disponibles desde la base de datos
  const sizes = availableSizes.sort((a, b) => {
    // Ordenar tallas numéricamente si es posible, sino alfabéticamente
    const numA = parseFloat(a)
    const numB = parseFloat(b)
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB
    }
    return a.localeCompare(b)
  })

  const handleCategoryChange = async (category) => {
    setSelectedCategory(category)
    await loadProducts(category, selectedSize)
  }

  const handleSizeChange = async (size) => {
    setSelectedSize(size)
    await loadProducts(selectedCategory, size)
  }

  const handleClearFilters = async () => {
    setSelectedCategory(null)
    setSelectedSize(null)
    await loadProducts(null, null)
  }

  const loadProducts = async (categoryFilter = null, sizeFilter = null) => {
    setLoading(true)
    try {
      const filteredProducts = await getProducts(sizeFilter, categoryFilter)
      setProducts(filteredProducts)
      
      // Actualizar también las tallas disponibles
      const updatedSizes = await getAvailableSizes()
      setAvailableSizes(updatedSizes)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">RR BOOTS - Panel Administrativo</h1>
            <p className="text-gray-600 dark:text-gray-300">Gestiona los artículos western de tu catálogo</p>
          </div>
          
          <Link
            href="/admin/new"
            className="bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Producto
          </Link>
        </div>

        <AdminFilters
          categories={categories}
          sizes={sizes}
          selectedCategory={selectedCategory}
          selectedSize={selectedSize}
          onCategoryChange={handleCategoryChange}
          onSizeChange={handleSizeChange}
          onClearFilters={handleClearFilters}
        />

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Productos ({products.length})
              </h2>
              {loading && (
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Filtrando...
                </div>
              )}
            </div>
          </div>
          
          <AdminProductList products={products} />
        </div>
      </div>
    </div>
  )
}