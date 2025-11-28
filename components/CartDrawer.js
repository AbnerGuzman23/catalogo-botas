'use client'

import { useCart } from '@/components/cart/CartContext'
import Image from 'next/image'
import { useState } from 'react'
import CheckoutForm from './CheckoutForm'

export default function CartDrawer({ isOpen, onClose }) {
  const { items, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)

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

  if (!isOpen) return null

  return (
    <>
      {/* Área invisible para cerrar al hacer clic fuera */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
        {/* Drawer */}
        <div 
          className="absolute right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-slate-800 bg-opacity-95 dark:bg-opacity-95 backdrop-blur-md shadow-2xl transform transition-transform duration-300 translate-x-0 border-l-4 border-gray-300 dark:border-gray-600 pointer-events-auto"
        >
          {!showCheckout ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="bg-gray-900 dark:bg-slate-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">🛒 Tu Carrito</h2>
                  {items.length > 0 && (
                    <span className="bg-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                      {items.length} {items.length === 1 ? 'artículo' : 'artículos'}
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-colors duration-200"
                  aria-label="Cerrar carrito"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido del carrito */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-2">Tu carrito está vacío</h3>
                  <p className="text-stone-600 dark:text-slate-300 mb-6">¡Agrega algunos productos western a tu carrito!</p>
                  <button
                    onClick={onClose}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    Seguir Comprando
                  </button>
                </div>
              ) : (
                <div className="p-4">
                  {items.map((item) => (
                    <div key={item.id} className="bg-gray-50 dark:bg-slate-600 border border-gray-200 dark:border-slate-500 rounded-lg p-4 mb-4 shadow-sm">
                      <div className="flex gap-4">
                        {/* Imagen del producto */}
                        <div className="relative w-20 h-20 bg-gradient-to-br from-gray-100 to-stone-200 rounded-lg overflow-hidden flex-shrink-0">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                              <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                            </div>
                          )}
                        </div>

                        {/* Información del producto */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 dark:text-gray-200 text-sm mb-1 truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-stone-600 dark:text-slate-300 mb-2">
                            Talla: {item.size} | {formatPrice(item.price)}
                          </p>
                          
                          {/* Controles de cantidad */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="bg-gray-200 hover:bg-gray-300 w-7 h-7 rounded-full flex items-center justify-center text-gray-800 font-bold transition-colors duration-200"
                                aria-label="Disminuir cantidad"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-medium text-gray-900 dark:text-gray-200">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="bg-gray-200 hover:bg-gray-300 w-7 h-7 rounded-full flex items-center justify-center text-gray-800 font-bold transition-colors duration-200"
                                aria-label="Aumentar cantidad"
                              >
                                +
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-600 hover:text-red-800 p-1 transition-colors duration-200"
                              aria-label="Eliminar producto"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          
                          {/* Subtotal */}
                          <div className="text-right mt-2">
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-300">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer con total y acciones */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 p-6">
                <div className="mb-4">
                  <div className="flex justify-between items-center text-lg font-bold text-gray-900 dark:text-gray-200">
                    <span>Total:</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <span>💬</span>
                    Proceder al Pago (WhatsApp)
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={clearCart}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Vaciar Carrito
                    </button>
                    <button
                      onClick={onClose}
                      className="bg-stone-600 hover:bg-stone-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Seguir Comprando
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <CheckoutForm 
            onBack={() => setShowCheckout(false)}
            onClose={onClose}
          />
        )}
      </div>
    </div>
    </>
  )
}