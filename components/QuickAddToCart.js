'use client'

import { useState } from 'react'
import { useCart } from './cart/CartContext'
import { validateCartItem } from '@/lib/sales-actions'

export default function QuickAddToCart({ product }) {
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Obtener tallas disponibles con stock
  const availableSizes = product.inventory?.filter(item => item.quantity > 0) || []

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setMessage('Selecciona una talla')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      // Validar stock disponible
      const validation = await validateCartItem(product.id, selectedSize, quantity)
      
      if (!validation.valid) {
        setMessage(validation.error)
        setIsLoading(false)
        return
      }

      // Agregar al carrito
      addItem(product, selectedSize, quantity)
      setMessage('✅ Agregado al carrito')
      setSelectedSize('')
      setQuantity(1)
      
      // Limpiar mensaje después de 2 segundos
      setTimeout(() => setMessage(''), 2000)
      
    } catch (error) {
      setMessage('Error al agregar al carrito')
      console.error('Error adding to cart:', error)
    }
    
    setIsLoading(false)
  }

  if (availableSizes.length === 0) {
    return (
      <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 py-2 px-4 rounded-lg text-center text-sm">
        Sin stock disponible
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Selector de talla */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Talla:
        </label>
        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">Seleccionar talla</option>
          {availableSizes.map((item) => (
            <option key={item.size} value={item.size}>
              Talla {item.size} ({item.quantity} disponibles)
            </option>
          ))}
        </select>
      </div>

      {/* Selector de cantidad */}
      {selectedSize && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cantidad:
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max={availableSizes.find(item => item.size === selectedSize)?.quantity || 1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              type="button"
              onClick={() => {
                const maxStock = availableSizes.find(item => item.size === selectedSize)?.quantity || 1
                setQuantity(Math.min(maxStock, quantity + 1))
              }}
              disabled={quantity >= (availableSizes.find(item => item.size === selectedSize)?.quantity || 1)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Botón agregar */}
      <button
        onClick={handleAddToCart}
        disabled={!selectedSize || isLoading}
        className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
      >
        {isLoading ? 'Agregando...' : '🛒 Agregar al Carrito'}
      </button>

      {/* Mensaje */}
      {message && (
        <p className={`text-sm text-center ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  )
}