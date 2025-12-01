import { Suspense } from 'react'
import { getProducts, getAvailableSizes, getSiteConfig } from '@/lib/actions'
import { getCategories } from '@/lib/category-actions'
import { getBrands } from '@/lib/brand-actions'
import ProductGrid from '@/components/ProductGrid'
import SizeFilter from '@/components/SizeFilter'
import FilterPanel from '@/components/FilterPanel'
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
  const allProducts = await getProducts() // Para el panel de filtros
  const availableSizes = await getAvailableSizes()
  const categories = await getCategories()
  const brands = await getBrands()
  const siteConfig = await getSiteConfig()

  const hasActiveFilters = genderFilter || brandFilter || categoryFilter || sizeFilter

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
              <Link 
                href="/"
                className="text-3xl md:text-4xl font-light tracking-wider text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 cursor-pointer"
              >
                {siteConfig.siteName}
              </Link>
            </div>
            
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-light">
              {siteConfig.siteDescription}
            </p>
          </div>
        </div>
      </header>

      {/* Panel de Filtros Lateral */}
      <FilterPanel 
        brands={brands} 
        categories={categories} 
        products={allProducts}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Indicador de filtros activos */}
        {hasActiveFilters && (
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
              {genderFilter && (
                <span className="text-gray-700 dark:text-gray-300 capitalize">
                  {genderFilter === 'hombre' ? 'Hombre' : genderFilter === 'mujer' ? 'Mujer' : 'Unisex'}
                </span>
              )}
              {brandFilter && (
                <span className="text-gray-700 dark:text-gray-300">
                  • {brands.find(b => b.id == brandFilter)?.name || 'Brand'}
                </span>
              )}
              {categoryFilter && (
                <span className="text-gray-700 dark:text-gray-300">
                  • {categories.find(c => c.id == categoryFilter)?.name || 'Category'}
                </span>
              )}
              {sizeFilter && (
                <span className="text-gray-700 dark:text-gray-300">
                  • Talla {sizeFilter}
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

        {/* Filtro por talla - Solo si hay filtros activos */}
        {hasActiveFilters && (
          <div className="mb-8 flex justify-start">
            <SizeFilterWrapper sizes={availableSizes} currentSize={sizeFilter} />
          </div>
        )}

        {/* Contenido principal cuando no hay filtros */}
        {!hasActiveFilters ? (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl">
              <div className="text-6xl mb-6">🤠</div>
              <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-4">
                Bienvenido a RR BOOTS
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Descubre nuestra colección de artículos western de calidad premium. 
                Usa el botón de filtros en la esquina superior derecha para explorar por género, marca y categoría.
              </p>
            </div>

            {/* Productos por Marca */}
            {brands.filter(brand => {
              // Solo mostrar marcas que tengan productos
              const brandProducts = allProducts.filter(p => p.brandId === brand.id)
              return brandProducts.length > 0
            }).map(brand => {
              const brandProducts = allProducts
                .filter(p => p.brandId === brand.id)
                .slice(0, 4) // Máximo 4 productos por marca

              return (
                <div key={brand.id} className="space-y-6">
                  {/* Header de la marca */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-light text-gray-900 dark:text-white">
                        {brand.name}
                      </h3>
                      {brand.description && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                          {brand.description}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/?brand=${brand.id}`}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Ver todos →
                    </Link>
                  </div>

                  {/* Grid de productos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {brandProducts.map(product => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300"
                      >
                        {/* Imagen */}
                        <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          
                          {/* Badge de género */}
                          <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 text-xs font-medium bg-black/70 text-white rounded-full backdrop-blur-sm">
                              {product.gender === 'hombre' ? 'Hombre' : product.gender === 'mujer' ? 'Mujer' : 'Unisex'}
                            </span>
                          </div>
                        </div>

                        {/* Información del producto */}
                        <div className="p-4">
                          <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {product.name}
                          </h4>
                          
                          {product.categoryRel && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {product.categoryRel.name}
                            </p>
                          )}
                          
                          {product.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                              {product.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                              ${product.price}
                            </span>
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
                              Ver detalles
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Separador */}
                  {brand !== brands[brands.length - 1] && (
                    <hr className="border-gray-200 dark:border-gray-700" />
                  )}
                </div>
              )
            })}

            {/* Call to action */}
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl">
              <h3 className="text-xl font-light text-gray-900 dark:text-white mb-4">
                ¿Buscas algo específico?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Utiliza nuestros filtros para encontrar exactamente lo que necesitas
              </p>
              <div className="flex justify-center">
                <div className="animate-bounce">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Botón de filtros en la esquina superior derecha
              </p>
            </div>
          </div>
        ) : (
          // Contenido cuando hay filtros activos
          products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No hay productos que coincidan con tu selección.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              >
                Ver Todos los Productos
              </Link>
            </div>
          )
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
