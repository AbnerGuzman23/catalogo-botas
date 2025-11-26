import { getProductById } from '@/lib/actions'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import AddToCartButton from '@/components/AddToCartButton'
import ThemeToggleSimple from '@/components/admin/ThemeToggleSimple'

export default async function ProductDetail(props) {
  const params = await props.params
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'botas': return ''
      case 'cinturones': return ''
      case 'ropa': return ''
      case 'accesorios': return ''
      default: return ''
    }
  }

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'botas': return 'Zapatos'
      case 'cinturones': return 'Cinturones'
      case 'ropa': return 'Ropa'
      case 'accesorios': return 'Accesorios'
      default: return 'Western'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-stone-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                ← Volver al catálogo
              </Link>
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-xl">🤠</span>
              </div>
              <h1 className="text-2xl font-bold">RR BOOTS</h1>
            </div>
            <ThemeToggleSimple />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Imagen del producto */}
            <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-stone-100 dark:from-slate-600 dark:to-slate-700">
              {/* Badge de categoría */}
              <div className="absolute top-6 left-6 z-10 bg-amber-900 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
                <span className="text-lg">{getCategoryIcon(product.category)}</span>
                {getCategoryLabel(product.category)}
              </div>
              
              {/* Badge premium */}
              <div className="absolute top-6 right-6 z-10 bg-gradient-to-r from-yellow-400 to-yellow-500 text-amber-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                ⭐ PREMIUM
              </div>

              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-amber-600">
                  <div className="text-center">
                    <div className="text-8xl mb-4">{getCategoryIcon(product.category)}</div>
                    <p className="text-xl font-medium text-amber-800">Producto Premium</p>
                    <p className="text-lg text-stone-600">Imagen no disponible</p>
                  </div>
                </div>
              )}
            </div>

            {/* Información del producto */}
            <div className="p-8 lg:p-12">
              <div className="h-full flex flex-col">
                {/* Título y precio */}
                <div className="mb-6">
                  <h1 className="text-3xl lg:text-4xl font-bold text-amber-900 dark:text-amber-200 mb-4 leading-tight">
                    {product.name}
                  </h1>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl lg:text-5xl font-bold text-amber-800 dark:text-amber-300">
                      {formatPrice(product.price)}
                    </span>
                    <div className="bg-gradient-to-r from-amber-100 to-amber-200 border-2 border-amber-300 px-6 py-3 rounded-full">
                      <span className="text-lg font-bold text-amber-800 tracking-wider">
                        TALLA {product.size}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div className="flex-grow mb-8">
                  <h2 className="text-xl font-bold text-amber-900 dark:text-amber-200 mb-4">Descripción del Producto</h2>
                  <p className="text-stone-700 dark:text-slate-300 text-lg leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Información adicional */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200 mb-4">Detalles del Producto</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-amber-50 dark:bg-slate-700 border border-amber-200 dark:border-slate-600 p-4 rounded-lg">
                      <div className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">Categoría</div>
                      <div className="text-lg font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                        <span>{getCategoryIcon(product.category)}</span>
                        {getCategoryLabel(product.category)}
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 dark:bg-slate-700 border border-amber-200 dark:border-slate-600 p-4 rounded-lg">
                      <div className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">Talla</div>
                      <div className="text-lg font-bold text-amber-900 dark:text-amber-200">
                        {product.size}
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 dark:bg-slate-700 border border-amber-200 dark:border-slate-600 p-4 rounded-lg">
                      <div className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">Precio</div>
                      <div className="text-lg font-bold text-amber-900 dark:text-amber-200">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 dark:bg-slate-700 border border-amber-200 dark:border-slate-600 p-4 rounded-lg">
                      <div className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">Calidad</div>
                      <div className="text-lg font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1">
                        ⭐ Premium
                      </div>
                    </div>
                  </div>
                </div>

                {/* Características */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200 mb-4">Características</h3>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3 text-stone-700 dark:text-slate-300">
                      <span className="text-green-600 font-bold">✓</span>
                      Artículo western auténtico
                    </div>
                    <div className="flex items-center gap-3 text-stone-700 dark:text-slate-300">
                      <span className="text-green-600 font-bold">✓</span>
                      Materiales de alta calidad
                    </div>
                    <div className="flex items-center gap-3 text-stone-700 dark:text-slate-300">
                      <span className="text-green-600 font-bold">✓</span>
                      Diseño tradicional y duradero
                    </div>
                    <div className="flex items-center gap-3 text-stone-700 dark:text-slate-300">
                      <span className="text-green-600 font-bold">✓</span>
                      Garantía de satisfacción
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="space-y-4">
                  <AddToCartButton product={product} />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button className="bg-white dark:bg-slate-700 border-2 border-amber-800 dark:border-amber-400 text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-slate-600 font-bold py-3 px-6 rounded-lg transition-all duration-300">
                      💬 CONSULTAR
                    </button>
                    <Link 
                      href="/"
                      className="bg-stone-600 dark:bg-slate-600 hover:bg-stone-500 dark:hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 text-center"
                    >
                      ← SEGUIR VIENDO
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-amber-200 dark:border-slate-600">
            <div className="text-center">
              <div className="text-3xl mb-4">🚚</div>
              <h3 className="font-bold text-amber-900 dark:text-amber-200 mb-2">Envío Seguro</h3>
              <p className="text-stone-600 dark:text-slate-400 text-sm">Entrega cuidadosa de tu pedido</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-amber-200 dark:border-slate-600">
            <div className="text-center">
              <div className="text-3xl mb-4">✨</div>
              <h3 className="font-bold text-amber-900 dark:text-amber-200 mb-2">Calidad Premium</h3>
              <p className="text-stone-600 dark:text-slate-400 text-sm">Artículos western auténticos</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-amber-200 dark:border-slate-600">
            <div className="text-center">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="font-bold text-amber-900 dark:text-amber-200 mb-2">Garantía</h3>
              <p className="text-stone-600 dark:text-slate-400 text-sm">Satisfacción garantizada</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}