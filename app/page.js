'use client'

import { Suspense, useEffect, useState } from 'react'
import { getProducts, getAvailableSizes, getSiteConfig } from '@/lib/actions'
import { getCategories } from '@/lib/category-actions'
import { getBrands } from '@/lib/brand-actions'
import ProductGrid from '@/components/ProductGrid'
import SizeFilter from '@/components/SizeFilter'
import FilterPanel from '@/components/FilterPanel'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

function HomeContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [availableSizes, setAvailableSizes] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [siteConfig, setSiteConfig] = useState({
    siteName: 'RR BOOTS',
    siteDescription: 'Artículos Western de Calidad Premium',
    footerAbout: '',
    footerProducts: '',
    footerServices: ''
  })
  const [loading, setLoading] = useState(true)

  const sizeFilter = searchParams.get('size') || null
  const categoryFilter = searchParams.get('category') || null
  const genderFilter = searchParams.get('gender') || null
  const brandFilter = searchParams.get('brand') || null
  
  // Limpiar categoryFilter si está vacío
  const cleanCategoryFilter = categoryFilter && categoryFilter.trim() !== '' ? categoryFilter : null
  const hasActiveFilters = genderFilter || brandFilter || categoryFilter || sizeFilter

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [
          productsData,
          allProductsData,
          sizesData,
          categoriesData,
          brandsData,
          configData
        ] = await Promise.all([
          getProducts(sizeFilter, cleanCategoryFilter, genderFilter, brandFilter),
          getProducts(),
          getAvailableSizes(),
          getCategories(),
          getBrands(),
          getSiteConfig()
        ])

        setProducts(productsData)
        setAllProducts(allProductsData)
        setAvailableSizes(sizesData)
        setCategories(categoriesData)
        setBrands(brandsData)
        setSiteConfig(configData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [sizeFilter, cleanCategoryFilter, genderFilter, brandFilter])

  function SizeFilterWrapper({ sizes, currentSize }) {
    return (
      <Suspense fallback={<div className="bg-white border border-black p-3 h-10 w-40 animate-pulse"></div>}>
        <SizeFilter sizes={sizes} currentSize={currentSize} />
      </Suspense>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🤠</div>
          <p className="text-black">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-black border-b border-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                {siteConfig.logoUrl ? (
                  <img 
                    src={siteConfig.logoUrl} 
                    alt={siteConfig.siteName}
                    className="h-6 w-6 sm:h-8 sm:w-8 mr-1 sm:mr-2 object-contain"
                  />
                ) : (
                  <span className="text-lg sm:text-xl mr-1 sm:mr-2">🤠</span>
                )}
                <span className="text-lg sm:text-xl font-bold tracking-wider text-white">
                  {siteConfig.siteName}
                </span>
              </Link>
            </div>

            {/* Social Media Links and Filter Button */}
            <div className="flex items-center space-x-1 sm:space-x-4">
              <a
                href={siteConfig.whatsappUrl || "https://wa.me/5218261234567"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:bg-white hover:text-black p-1 sm:p-2 transition-colors"
                title="WhatsApp"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.89 3.488"/>
                </svg>
              </a>

              <a
                href={siteConfig.instagramUrl || "https://instagram.com/rrboots"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:bg-white hover:text-black p-1 sm:p-2 transition-colors"
                title="Instagram"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              <a
                href={siteConfig.tiktokUrl || "https://tiktok.com/@rrboots"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:bg-white hover:text-black p-1 sm:p-2 transition-colors"
                title="TikTok"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>

              <a
                href={siteConfig.facebookUrl || "https://facebook.com/rrboots"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:bg-white hover:text-black p-1 sm:p-2 transition-colors"
                title="Facebook"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* Separador visual */}
              <div className="h-6 w-px bg-white"></div>

              {/* Botón de Filtrar integrado */}
              <button
                onClick={() => {
                  if (window.openFilterPanel) {
                    window.openFilterPanel()
                  }
                }}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 text-white hover:bg-white hover:text-black border border-white transition-colors text-xs sm:text-sm"
                title="Filtrar productos"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                </svg>
                <span className="hidden sm:inline font-medium">Filtrar</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative h-screen bg-black bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1544966503-7cc5ac882d2e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')`
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            {siteConfig.logoUrl ? (
              <div className="flex justify-center mb-8">
                <img 
                  src={siteConfig.logoUrl} 
                  alt={siteConfig.siteName}
                  className="h-32 w-32 md:h-40 md:w-40 lg:h-48 lg:w-48 object-contain"
                />
              </div>
            ) : (
              <div className="text-6xl mb-6">🤠</div>
            )}
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-wider">
              {siteConfig.siteName}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              {siteConfig.siteDescription}
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  // Scroll to products section
                  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-8 py-3 bg-white text-black font-semibold hover:bg-black hover:text-white border border-white transition-all duration-300"
              >
                EXPLORAR COLECCIÓN
              </button>
              
              <button
                onClick={() => {
                  if (window.openFilterPanel) {
                    window.openFilterPanel()
                  }
                }}
                className="px-8 py-3 bg-transparent text-white font-semibold border border-white hover:bg-white hover:text-black transition-all duration-300"
              >
                FILTRAR PRODUCTOS
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Panel de Filtros */}
      <FilterPanel 
        brands={brands}
        categories={categories}
        products={allProducts}
      />

      {/* Products Section */}
      <main id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Indicador de filtros activos */}
        {hasActiveFilters && (
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm">
              {genderFilter && (
                <span className="text-white capitalize">
                  {genderFilter === 'hombre' ? 'Hombre' : genderFilter === 'mujer' ? 'Mujer' : 'Unisex'}
                </span>
              )}
              {brandFilter && (
                <span className="text-white">
                  • {brands.find(b => b.id == brandFilter)?.name || 'Brand'}
                </span>
              )}
              {categoryFilter && (
                <span className="text-white">
                  • {categories.find(c => c.id == categoryFilter)?.name || 'Category'}
                </span>
              )}
              {sizeFilter && (
                <span className="text-white">
                  • Talla {sizeFilter}
                </span>
              )}
              <Link
                href="/"
                className="text-xs text-white hover:text-white ml-2"
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
                      <h3 className="text-2xl font-light text-black">
                        {brand.name}
                      </h3>
                      {brand.description && (
                        <p className="text-black text-sm mt-1">
                          {brand.description}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/?brand=${brand.id}`}
                      className="text-sm text-black hover:underline font-medium"
                    >
                      Ver todos →
                    </Link>
                  </div>

                  {/* Grid de productos */}
                  <div className="flex gap-2 sm:gap-6 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
                    {brandProducts.map(product => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="group bg-white rounded-lg sm:rounded-xl shadow-sm border border-black overflow-hidden hover:shadow-lg transition-all duration-300 flex-shrink-0 w-40 sm:w-auto"
                      >
                        {/* Imagen */}
                        <div className="aspect-square bg-white relative overflow-hidden border-b border-black">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-black">
                              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          
                          {/* Badge de género */}
                          <div className="absolute top-1 sm:top-3 left-1 sm:left-3">
                            <span className="px-1 sm:px-2 py-0.5 sm:py-1 text-xs font-medium bg-black text-white">
                              {product.gender === 'hombre' ? 'Hombre' : product.gender === 'mujer' ? 'Mujer' : 'Unisex'}
                            </span>
                          </div>
                        </div>

                        {/* Información del producto */}
                        <div className="p-2 sm:p-4">
                          <h4 className="font-medium text-black line-clamp-2 group-hover:underline transition-all text-sm sm:text-base">
                            {product.name}
                          </h4>
                          
                          {product.categoryRel && (
                            <p className="text-xs sm:text-sm text-black mt-1">
                              {product.categoryRel.name}
                            </p>
                          )}
                          
                          {product.description && (
                            <p className="text-xs sm:text-sm text-black mt-1 sm:mt-2 line-clamp-2 hidden sm:block">
                              {product.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between mt-2 sm:mt-3">
                            <span className="text-sm sm:text-lg font-semibold text-black">
                              ${product.price}
                            </span>
                            <span className="text-xs text-black font-medium group-hover:underline">
                              Ver detalles
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Separador */}
                  {brand !== brands[brands.length - 1] && (
                    <hr className="border-black" />
                  )}
                </div>
              )
            })}

            {/* Call to action */}
            <div className="text-center py-12 bg-white border border-black rounded-2xl">
              <h3 className="text-xl font-light text-black mb-4">
                ¿Buscas algo específico?
              </h3>
              <p className="text-black mb-6">
                Utiliza nuestros filtros para encontrar exactamente lo que necesitas
              </p>
              <div className="flex justify-center">
                <div className="animate-bounce">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-black mt-2">
                Botón de filtros en la esquina superior derecha
              </p>
            </div>
          </div>
        ) : (
          // Contenido cuando hay filtros activos
          products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-black">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-black mb-2">
                No se encontraron productos
              </h3>
              <p className="text-black mb-4">
                No hay productos que coincidan con tu selección.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-white hover:text-black border border-black transition-colors"
              >
                Ver Todos los Productos
              </Link>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand Column */}
            <div>
              <h3 className="text-2xl font-bold mb-4 tracking-wide">{siteConfig.siteName}</h3>
              <p className="text-white text-sm leading-relaxed">
                {siteConfig.footerAbout}
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Productos</h4>
              <div className="space-y-2 text-white text-sm">
                {siteConfig.footerProducts.split('\n').map((item, index) => (
                  <div key={index}>{item}</div>
                ))}
              </div>
            </div>
            
            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Servicios</h4>
              <div className="text-white text-sm space-y-2">
                {siteConfig.footerServices.split('\n').map((service, index) => (
                  <p key={index}>{service}</p>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-white pt-6 sm:pt-8 text-center">
            <p className="text-white text-xs sm:text-sm transition-all duration-300 hover:text-white">
              © 2025 {siteConfig.siteName}. Todos los derechos reservados. | Hecho con ❤️ para los amantes de lo vaquero
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🤠</div>
            <p className="text-black">Cargando...</p>
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  )
}
