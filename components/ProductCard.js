import Image from 'next/image'

export default function ProductCard({ product }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'botas': return '🥾'
      case 'cinturones': return '🔗'
      case 'ropa': return '👕'
      case 'accesorios': return '🎩'
      default: return '🤠'
    }
  }

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'botas': return 'Botas'
      case 'cinturones': return 'Cinturones'
      case 'ropa': return 'Ropa'
      case 'accesorios': return 'Accesorios'
      default: return 'Western'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-200">
      {/* Badge de categoría */}
      <div className="absolute top-3 left-3 z-10 bg-amber-900 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
        <span>{getCategoryIcon(product.category)}</span>
        {getCategoryLabel(product.category)}
      </div>
      
      {/* Imagen del producto */}
      <div className="aspect-square bg-gradient-to-br from-amber-50 to-stone-100 relative overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-amber-600">
            <div className="text-center">
              <div className="text-6xl mb-2">🥾</div>
              <p className="text-sm font-medium">Imagen no disponible</p>
            </div>
          </div>
        )}
        
        {/* Badge decorativo */}
        <div className="absolute top-3 left-3">
          <div className="bg-amber-800 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider">
            PREMIUM
          </div>
        </div>
      </div>

      {/* Información del producto */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-amber-900 mb-3 tracking-wide leading-tight">
          {product.name}
        </h3>
        
        <p className="text-stone-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-amber-800">
              {formatPrice(product.price)}
            </span>
          </div>
          
          <div className="bg-gradient-to-r from-amber-100 to-amber-200 border border-amber-300 px-4 py-2 rounded-full">
            <span className="text-sm font-bold text-amber-800 tracking-wider">
              TALLA {product.size}
            </span>
          </div>
        </div>
        
        {/* Botón de acción */}
        <button className="w-full bg-amber-800 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 tracking-wider">
          VER DETALLES
        </button>
      </div>
    </div>
  )
}