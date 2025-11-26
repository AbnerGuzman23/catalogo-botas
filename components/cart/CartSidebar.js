'use client'

import { useCart } from './CartContext'
import Image from 'next/image'
import Link from 'next/link'

export default function CartSidebar() {
  const { 
    items, 
    isOpen, 
    toggleCart, 
    removeItem, 
    updateQuantity, 
    getTotalPrice,
    getTotalItems 
  } = useCart()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={toggleCart}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Carrito ({getTotalItems()})
          </h2>
          <button
            onClick={toggleCart}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-500 dark:text-gray-400">Tu carrito está vacío</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Agrega productos para comenzar tu compra
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex gap-3">
                    {/* Imagen */}
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      {item.productImage ? (
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          📷
                        </div>
                      )}
                    </div>

                    {/* Detalles */}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm leading-tight">
                        {item.productName}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Talla: {item.size}
                      </p>
                      <p className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-1">
                        {formatPrice(item.price)}
                      </p>
                      
                      {/* Controles de cantidad */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                          >
                            -
                          </button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.productId, item.size)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                Total:
              </span>
              <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
            
            <Link
              href="/checkout"
              onClick={toggleCart}
              className="block w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors"
            >
              Finalizar Compra
            </Link>
            
            <button
              onClick={toggleCart}
              className="block w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg text-center transition-colors"
            >
              Seguir Comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}