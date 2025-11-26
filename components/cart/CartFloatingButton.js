'use client'

import { useCart } from './CartContext'

export default function CartFloatingButton() {
  const { getTotalItems, toggleCart } = useCart()
  const totalItems = getTotalItems()

  if (totalItems === 0) return null

  return (
    <button
      onClick={toggleCart}
      className="fixed bottom-6 right-6 bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-30"
      title={`Carrito (${totalItems} ${totalItems === 1 ? 'artículo' : 'artículos'})`}
    >
      <div className="relative">
        <span className="text-2xl">🛒</span>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {totalItems > 9 ? '9+' : totalItems}
          </span>
        )}
      </div>
    </button>
  )
}