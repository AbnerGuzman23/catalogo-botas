'use client'

import { useState } from 'react'
import { useCart } from '@/components/cart/CartContext'
import CartDrawer from './CartDrawer'

export default function CartIcon() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { itemCount } = useCart()

  return (
    <>
      {/* Icono flotante del carrito */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-theme-header hover:bg-theme-secondary text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-12"
        aria-label={`Carrito de compras - ${itemCount} artículos`}
      >
        <div className="relative">
          {/* Icono del carrito */}
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v8a2 2 0 002 2h6a2 2 0 002-2v-8M9 17h.01M15 17h.01" 
            />
          </svg>
          
          {/* Badge con número de artículos */}
          {itemCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-pulse">
              {itemCount > 99 ? '99+' : itemCount}
            </div>
          )}
        </div>
      </button>

      {/* Drawer del carrito */}
      <CartDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  )
}