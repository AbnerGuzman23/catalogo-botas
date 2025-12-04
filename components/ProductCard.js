import Image from 'next/image'
import Link from 'next/link'
import QuickAddToCart from './QuickAddToCart'

export default function ProductCard({ product }) {
  const formatPrice = (price) => {
    return `Q ${price.toFixed(2)}`
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

  // Obtener tallas disponibles con stock
  const availableSizes = product.inventory?.filter(item => item.quantity > 0) || []
  const sizesText = availableSizes.length > 0 
    ? availableSizes.map(item => item.size).sort().join(', ') 
    : 'Sin stock'

  // Total de unidades en stock
  const totalStock = availableSizes.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="bg-theme-card rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-theme group">
      {/* Imagen del producto */}
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square bg-theme-secondary relative overflow-hidden cursor-pointer">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-theme-primary">
              <div className="text-center">
                <div className="text-6xl mb-2 group-hover:scale-110 transition-transform duration-300">📷</div>
                <p className="text-sm font-medium">Imagen no disponible</p>
              </div>
            </div>
          )}
          
        {/* Overlay hover con información adicional */}
        <div className="absolute inset-0 bg-theme-header bg-opacity-90 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out flex items-center justify-center transform scale-95 group-hover:scale-100">
          <div className="text-center text-white p-1 sm:p-4">
            <div className="text-lg sm:text-2xl mb-1 sm:mb-2 animate-pulse">👁️</div>
            <p className="text-xs font-medium mb-1 hidden sm:block">Ver detalles completos</p>
            <p className="text-xs opacity-80 hidden lg:block">Haz clic para más información</p>
            </div>
          </div>
        </div>
      </Link>

      {/* Información del producto */}
      <div className="p-2 sm:p-4 lg:p-6">
        <h3 className="text-sm sm:text-xl font-bold text-theme-primary mb-1 sm:mb-3 tracking-wide leading-tight group-hover:text-theme-secondary transition-all duration-300 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-theme-secondary text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2 leading-relaxed hidden sm:block">
          {product.description}
        </p>

        {/* Género del producto */}
        {product.gender && (
          <div className="items-center mb-2 sm:mb-3 hidden sm:flex">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              product.gender === 'hombre' 
                ? 'bg-blue-100 text-blue-800' 
                : product.gender === 'mujer'
                ? 'bg-pink-100 text-pink-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {product.gender === 'hombre' && '👨 '}
              {product.gender === 'mujer' && '👩 '}
              {product.gender === 'unisex' && '👥 '}
              {product.gender === 'hombre' ? 'Hombre' : product.gender === 'mujer' ? 'Mujer' : 'Unisex'}
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-4 space-y-2 sm:space-y-0">
          <div className="flex items-center">
            <span className="text-sm sm:text-xl lg:text-2xl font-bold text-theme-primary">
              {formatPrice(product.price)}
            </span>
          </div>
          
          <div className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-center sm:rounded-lg ${
            totalStock > 0 
              ? 'bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300'
              : 'bg-gradient-to-r from-red-100 to-orange-100 border border-red-300'
          }`}>
            <div className={`text-xs font-semibold tracking-wider ${
              totalStock > 0 ? 'text-gray-800' : 'text-red-800'
            }`}>
              {totalStock > 0 
                ? `TALLAS: ${availableSizes.length > 2 
                  ? `${availableSizes.slice(0, 2).map(item => item.size).join(', ')}...` 
                  : sizesText}`
                : 'Sin stock'
              }
            </div>
            <div className={`text-xs mt-1 hidden sm:block ${
              totalStock > 0 ? 'text-gray-600' : 'text-red-600'
            }`}>
              {totalStock > 0 ? `Stock: ${totalStock} unidades` : 'Temporalmente agotado'}
            </div>
          </div>
        </div>
        
        {/* Botón de acción */}
        <div>
          <QuickAddToCart product={product} />
        </div>
      </div>
    </div>
  )
}