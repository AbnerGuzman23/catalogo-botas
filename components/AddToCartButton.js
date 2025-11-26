'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)
    
    // Simular una pequeña demora para el efecto
    setTimeout(() => {
      addToCart(product)
      setIsAdding(false)
      setJustAdded(true)
      
      // Quitar el estado de "recién agregado" después de 2 segundos
      setTimeout(() => {
        setJustAdded(false)
      }, 2000)
    }, 300)
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || justAdded}
      className={`w-full font-bold py-4 px-6 rounded-lg text-lg tracking-wider shadow-lg transition-all duration-300 transform ${
        justAdded
          ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 scale-105'
          : isAdding
          ? 'bg-amber-600 dark:bg-amber-700 scale-95 cursor-not-allowed'
          : 'bg-gradient-to-r from-amber-800 to-amber-700 hover:from-amber-700 hover:to-amber-600 dark:from-amber-700 dark:to-amber-600 dark:hover:from-amber-600 dark:hover:to-amber-500 hover:shadow-xl hover:-translate-y-1'
      } text-white`}
    >
      <div className="flex items-center justify-center gap-3">
        {isAdding ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            AGREGANDO...
          </>
        ) : justAdded ? (
          <>
            <span className="text-2xl animate-bounce">✅</span>
            ¡AGREGADO AL CARRITO!
          </>
        ) : (
          <>
            <span className="text-2xl">🛒</span>
            AGREGAR AL CARRITO
          </>
        )}
      </div>
    </button>
  )
}