import { Suspense } from 'react'
import { getProducts, getAvailableSizes, getSiteConfig } from '@/lib/actions'
import { getCategories } from '@/lib/category-actions'
import { getBrands } from '@/lib/brand-actions'
import ProductGrid from '@/components/ProductGrid'
import SizeFilter from '@/components/SizeFilter'
import MinimalFilters from '@/components/MinimalFilters'
import Link from 'next/link'
import Image from 'next/image'

function SizeFilterWrapper({ sizes, currentSize }) {
  return (
    <Suspense fallback={<div className="bg-gray-50 border border-gray-200 p-6 rounded-lg h-24 animate-pulse"></div>}>
      <SizeFilter sizes={sizes} currentSize={currentSize} />
    </Suspense>
  )
}

// Función para generar metadata dinámica
export async function generateMetadata(props) {
  // Mantener título fijo para evitar confusión
  return {
    title: 'RR BOOTS',
    description: 'Catálogo de artículos western'
  }
}

export default async function Home(props) {
  const searchParams = await props.searchParams
  const sizeFilter = searchParams?.size || null
  const categoryFilter = searchParams?.category || null
  const genderFilter = searchParams?.gender || null
  const brandFilter = searchParams?.brand || null
  
  // Limpiar categoryFilter si está vacío
  const cleanCategoryFilter = categoryFilter && categoryFilter.trim() !== '' ? categoryFilter : null
  
  const products = await getProducts(sizeFilter, cleanCategoryFilter, genderFilter, brandFilter)
  const availableSizes = await getAvailableSizes()
  const categories = await getCategories()
  const brands = await getBrands()
  const siteConfig = await getSiteConfig()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Minimal Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            {/* Logo/Brand */}
            <div className="flex justify-center items-center mb-4">
              {siteConfig.logoUrl ? (
                <Image
                  src={siteConfig.logoUrl}
                  alt="Logo"
                  width={40}
                  height={40}
                  className="object-contain mr-3"
                />
              ) : (
                <span className="text-2xl mr-3">🤠</span>
              )}
              <h1 className="text-3xl md:text-4xl font-light tracking-wider text-gray-900 dark:text-white">
                {siteConfig.siteName}
              </h1>
            </div>
            
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-light">
              {siteConfig.siteDescription}
            </p>
          </div>
        </div>
      </header>

      {/* Filtros Minimalistas */}
      <MinimalFilters 
        brands={brands} 
        categories={categories} 
        products={products}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Indicador de filtros activos - Solo si hay marca o categoría seleccionada */}
        {(brandFilter || categoryFilter || sizeFilter) && (
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
              {brandFilter && (
                <span className="text-gray-700 dark:text-gray-300">
                  {brands.find(b => b.id == brandFilter)?.name || 'Brand'}
                </span>
              )}
              {categoryFilter && (
                <span className="text-gray-700 dark:text-gray-300">
                  • {categories.find(c => c.slug === categoryFilter)?.name || 'Category'}
                </span>
              )}
              {sizeFilter && (
                <span className="text-gray-700 dark:text-gray-300">
                  • Size {sizeFilter}
                </span>
              )}
              <Link
                href="/"
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 ml-2"
              >
                ✕
              </Link>
            </div>
          </div>
        )}

        {/* Filtro por talla - Solo si hay marca seleccionada */}
        {brandFilter && (
          <div className="mb-8">
            <SizeFilterWrapper sizes={availableSizes} currentSize={sizeFilter} />
          </div>
        )}

        {/* Grid de productos */}
        {(genderFilter || brandFilter) ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🤠</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-2">
              Welcome to RR BOOTS
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Select a gender above to start exploring our collection
            </p>
          </div>
        )}

        {products.length === 0 && (genderFilter || brandFilter) && (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No products match your current selection.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
              View All Products
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-slate-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand Column */}
            <div>
              <h3 className="text-2xl font-bold mb-4 tracking-wide">{siteConfig.siteName}</h3>
              <p className="text-gray-200 text-sm leading-relaxed">
                {siteConfig.footerAbout}
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Productos</h4>
              <div className="space-y-2 text-gray-200 text-sm">
                {siteConfig.footerProducts.split('\n').map((item, index) => (
                  <div key={index}>{item}</div>
                ))}
              </div>
            </div>
            
            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Servicios</h4>
              <div className="text-gray-200 text-sm space-y-2">
                {siteConfig.footerServices.split('\n').map((service, index) => (
                  <p key={index}>{service}</p>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6 sm:pt-8 text-center">
            <p className="text-gray-300 text-xs sm:text-sm transition-all duration-300 hover:text-gray-200">
              © 2025 {siteConfig.siteName}. Todos los derechos reservados. | Hecho con ❤️ para los amantes de lo vaquero
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
