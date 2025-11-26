import Image from 'next/image'
import Link from 'next/link'
import QuickAddToCart from './QuickAddToCart'

export default function ProductCard({ product }) {
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
      <div className="aspect-square bg-theme-secondary relative overflow-hidden">
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
        
        {/* Badge decorativo */}
        <div className="absolute top-3 left-3">
          <div className="bg-theme-header text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider">
            PREMIUM
          </div>
        </div>

        {/* Overlay hover con información adicional */}
        <div className="absolute inset-0 bg-theme-header bg-opacity-90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <div className="text-2xl mb-2">👁️</div>
            <p className="text-sm font-medium mb-1">Ver detalles completos</p>
            <p className="text-xs opacity-80">Haz clic para más información</p>
          </div>
        </div>
      </div>

      {/* Información del producto */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-theme-primary mb-3 tracking-wide leading-tight group-hover:text-theme-secondary transition-colors duration-200">
          {product.name}
        </h3>
        
        <p className="text-theme-secondary text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-theme-primary">
              {formatPrice(product.price)}
            </span>
          </div>
          
          <div className="bg-gradient-to-r from-amber-100 to-amber-200 border border-amber-300 px-3 py-2 rounded-lg">
            <div className="text-xs font-semibold text-amber-800 tracking-wider">
              TALLAS: {availableSizes.length > 3 
                ? `${availableSizes.slice(0, 3).map(item => item.size).join(', ')}...` 
                : sizesText
              }
            </div>
            {totalStock > 0 && (
              <div className="text-xs text-amber-600 mt-1">
                Stock: {totalStock} unidades
              </div>
            )}
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="space-y-3">
          <QuickAddToCart product={product} />
          <Link 
            href={`/product/${product.id}`}
            className="block w-full bg-amber-800 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 tracking-wider text-center shadow-md hover:shadow-lg transform hover:scale-105"
          >
            VER DETALLES
          </Link>
        </div>
      </div>
    </div>
  )
}