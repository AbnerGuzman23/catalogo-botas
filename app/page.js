import { Suspense } from 'react'
import { getProducts, getAvailableSizes } from '@/lib/actions'
import ProductGrid from '@/components/ProductGrid'
import SizeFilter from '@/components/SizeFilter'

function SizeFilterWrapper({ sizes, currentSize }) {
  return (
    <Suspense fallback={<div className="bg-white p-6 rounded-lg shadow-sm h-24 animate-pulse"></div>}>
      <SizeFilter sizes={sizes} currentSize={currentSize} />
    </Suspense>
  )
}

export default async function Home(props) {
  const searchParams = await props.searchParams
  const sizeFilter = searchParams?.size || null
  const products = await getProducts(sizeFilter)
  const availableSizes = await getAvailableSizes()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            🥾 Catálogo de Botas
          </h1>
          <p className="text-gray-600 mt-2">
            Encuentra las mejores botas para tu estilo
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtro por talla */}
        <div className="mb-8">
          <SizeFilterWrapper sizes={availableSizes} currentSize={sizeFilter} />
        </div>

        {/* Grid de productos */}
        <ProductGrid products={products} />

        {products.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay productos disponibles
            </h3>
            <p className="text-gray-500">
              {sizeFilter
                ? `No se encontraron productos para la talla "${sizeFilter}"`
                : 'Vuelve pronto para ver nuestros productos'
              }
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500">
            © 2025 Catálogo de Botas. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
