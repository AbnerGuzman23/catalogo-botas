import { Suspense } from 'react'
import { getProducts, getAvailableSizes, getSiteConfig } from '@/lib/actions'
import { getCategories } from '@/lib/category-actions'
import ProductGrid from '@/components/ProductGrid'
import SizeFilter from '@/components/SizeFilter'
import Link from 'next/link'
import Image from 'next/image'

function SizeFilterWrapper({ sizes, currentSize }) {
  return (
    <Suspense fallback={<div className="bg-amber-50 border border-amber-200 p-6 rounded-lg h-24 animate-pulse"></div>}>
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
  
  // Limpiar categoryFilter si está vacío
  const cleanCategoryFilter = categoryFilter && categoryFilter.trim() !== '' ? categoryFilter : null
  
  const products = await getProducts(sizeFilter, cleanCategoryFilter)
  const availableSizes = await getAvailableSizes()
  const categories = await getCategories()
  const siteConfig = await getSiteConfig()

  return (
    <div className="min-h-screen gradient-theme-primary transition-colors duration-300">
      {/* Hero Header */}
      <header className="bg-amber-800 text-amber-50 gradient-western-header">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            {/* Logo/Brand */}
            <div className="flex justify-center items-center mb-6">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                {siteConfig.logoUrl ? (
                  <Image
                    src={siteConfig.logoUrl}
                    alt="Logo"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-3xl">🤠</span>
                )}
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-wider">
                {siteConfig.siteName}
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-amber-100 font-light mb-2">
              {siteConfig.siteDescription}
            </p>
            <p className="text-lg text-amber-200 font-light">
              {categories.map(cat => cat.name).join(' • ')}
            </p>
            
            {/* Decorative element */}
            <div className="mt-8 flex justify-center">
              <div className="w-24 h-0.5 bg-amber-300 opacity-60"></div>
              <div className="w-2 h-2 bg-amber-300 rounded-full mx-4 mt-[-3px]"></div>
              <div className="w-24 h-0.5 bg-amber-300 opacity-60"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filtros de categoría */}
        <div className="text-center mb-12">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link href="/" className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              !cleanCategoryFilter ? 'bg-theme-header text-white shadow-lg' : 'bg-theme-card text-theme-primary border-2 border-theme hover:bg-theme-secondary'
            }`}>
              TODOS
            </Link>
            {categories.map((category) => (
              <Link 
                key={category.id}
                href={`?category=${category.slug}`} 
                className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-500 ease-in-out flex items-center gap-1 sm:gap-2 text-xs sm:text-sm lg:text-base hover:scale-105 transform ${
                  cleanCategoryFilter === category.slug ? 'bg-theme-header text-white shadow-lg' : 'bg-theme-card text-theme-primary border-2 border-theme hover:bg-theme-secondary'
                }`}
              >
                {category.icon && <span>{category.icon}</span>}
                {category.name.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>

        {/* Filtro por talla */}
        <div className="mb-12">
          <SizeFilterWrapper sizes={availableSizes} currentSize={sizeFilter} />
        </div>

        {/* Grid de productos */}
        <ProductGrid products={products} />

        {products.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-700 rounded-lg shadow-lg border border-amber-200 dark:border-slate-600">
            <div className="text-6xl mb-4">🤠</div>
            <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-200 mb-2">
              No hay productos disponibles
            </h3>
            <p className="text-stone-600 dark:text-slate-300">
              {sizeFilter
                ? `No se encontraron productos para la talla "${sizeFilter}"`
                : 'Vuelve pronto para descubrir nuestros nuevos artículos western'
              }
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-amber-900 dark:bg-slate-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand Column */}
            <div>
              <h3 className="text-2xl font-bold mb-4 tracking-wide">{siteConfig.siteName}</h3>
              <p className="text-amber-200 text-sm leading-relaxed">
                {siteConfig.footerAbout}
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Productos</h4>
              <div className="space-y-2 text-amber-200 text-sm">
                {siteConfig.footerProducts.split('\n').map((item, index) => (
                  <div key={index}>{item}</div>
                ))}
              </div>
            </div>
            
            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Servicios</h4>
              <div className="text-amber-200 text-sm space-y-2">
                {siteConfig.footerServices.split('\n').map((service, index) => (
                  <p key={index}>{service}</p>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-amber-800 pt-6 sm:pt-8 text-center">
            <p className="text-amber-300 text-xs sm:text-sm transition-all duration-300 hover:text-amber-200">
              © 2025 {siteConfig.siteName}. Todos los derechos reservados. | Hecho con ❤️ para los amantes de lo vaquero
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
