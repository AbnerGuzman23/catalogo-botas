import { getProductById, getSiteConfig } from '@/lib/actions'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import QuickAddToCart from '@/components/QuickAddToCart'

export default async function ProductDetail(props) {
  const params = await props.params
  const [product, siteConfig] = await Promise.all([
    getProductById(params.id),
    getSiteConfig()
  ])

  if (!product) {
    notFound()
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-black via-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium border-2 border-gray-600"
              >
                ← Volver al catálogo
              </Link>
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center overflow-hidden">
                {siteConfig.logoUrl ? (
                  <Image
                    src={siteConfig.logoUrl}
                    alt="Logo"
                    width={32}
                    height={32}
                    className="object-cover rounded-full"
                  />
                ) : (
                  <span className="text-xl font-bold text-white">RR</span>
                )}
              </div>
              <h1 className="text-2xl font-bold">{siteConfig.siteName || 'RR BOOTS'}</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Imagen del producto */}
            <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
              {/* Badge de categoría */}
              <div className="absolute top-6 left-6 z-10 bg-black text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
                <span className="text-lg">{product.categoryRel?.icon || '👢'}</span>
                {product.categoryRel?.name || 'Sin categoría'}
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
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  <div className="text-center">
                    <div className="text-8xl mb-4">{getCategoryIcon(product.category)}</div>
                    <p className="text-xl font-medium text-gray-800">Imagen del Producto</p>
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
                  <h1 className="text-3xl lg:text-4xl font-bold text-black mb-4 leading-tight">
                    {product.name}
                  </h1>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl lg:text-5xl font-bold text-gray-800">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>

                {/* Descripción */}
                <div className="flex-grow mb-8">
                  <h2 className="text-xl font-bold text-black mb-4">Descripción del Producto</h2>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Información adicional */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-black mb-4">Detalles del Producto</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                      <div className="text-sm font-medium text-gray-600 mb-1">Categoría</div>
                      <div className="text-lg font-bold text-black flex items-center gap-2">
                        <span>{product.categoryRel?.icon || '👢'}</span>
                        {product.categoryRel?.name || 'Sin categoría'}
                      </div>
                    </div>
                    
                    {product.gender && (
                      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-600 mb-1">Género</div>
                        <div className="text-lg font-bold text-black flex items-center gap-2">
                          {product.gender === 'hombre' && '👨'}
                          {product.gender === 'mujer' && '👩'}
                          {product.gender === 'unisex' && '👥'}
                          {product.gender === 'hombre' ? 'Hombre' : product.gender === 'mujer' ? 'Mujer' : 'Unisex'}
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                      <div className="text-sm font-medium text-gray-600 mb-1">Tallas Disponibles</div>
                      <div className="flex flex-wrap gap-1">
                        {product.inventory && product.inventory.length > 0 ? (
                          product.inventory
                            .filter(inv => inv.quantity > 0)
                            .sort((a, b) => parseFloat(a.size) - parseFloat(b.size))
                            .map((inv) => (
                              <span 
                                key={inv.size} 
                                className="px-2 py-1 text-xs font-bold bg-black text-white rounded-full"
                                title={`Stock: ${inv.quantity}`}
                              >
                                {inv.size}
                              </span>
                            ))
                        ) : (
                          <span className="text-sm text-gray-700">Consultar disponibilidad</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                      <div className="text-sm font-medium text-gray-600 mb-1">Precio</div>
                      <div className="text-lg font-bold text-black">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                  </div>
                </div>



                {/* Botones de acción */}
                <div className="space-y-4">
                  <QuickAddToCart product={product} />
                  
                  <div className="flex justify-center">
                    <Link 
                      href="/"
                      className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 text-center w-full"
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
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <div className="text-center">
              <div className="text-3xl mb-4">🚚</div>
              <h3 className="font-bold text-black mb-2">Envío Seguro</h3>
              <p className="text-gray-600 text-sm">Entrega cuidadosa de tu pedido</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <div className="text-center">
              <div className="text-3xl mb-4">✨</div>
              <h3 className="font-bold text-black mb-2">Calidad Premium</h3>
              <p className="text-gray-600 text-sm">Artículos auténticos</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <div className="text-center">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="font-bold text-black mb-2">Garantía</h3>
              <p className="text-gray-600 text-sm">Satisfacción garantizada</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}