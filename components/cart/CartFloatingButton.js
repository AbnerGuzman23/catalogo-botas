'use client'

import { useCart } from './CartContext'

export default function CartFloatingButton() {
  const { getTotalItems, toggleCart } = useCart()
  const totalItems = getTotalItems()

  if (totalItems === 0) return null

  return (
    <button
      onClick={toggleCart}
      className="fixed bottom-6 right-6 bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-30"
      title={`Carrito (${totalItems} ${totalItems === 1 ? 'artículo' : 'artículos'})`}
    >
      <div className="relative">
        <span className="text-lg sm:text-xl lg:text-2xl">🛍️</span>
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs sm:text-sm w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-bold animate-bounce">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </div>
    </button>
  )
}