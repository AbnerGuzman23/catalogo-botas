'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  // Cargar carrito del localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (product, size, quantity = 1) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(
        item => item.productId === product.id && item.size === size
      )

      if (existingItem) {
        // Actualizar cantidad del item existente
        return currentItems.map(item =>
          item.productId === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // Agregar nuevo item
        return [...currentItems, {
          productId: product.id,
          productName: product.name,
          productImage: product.imageUrl,
          size,
          quantity,
          price: product.price
        }]
      }
    })
  }

  const removeItem = (productId, size) => {
    setItems(currentItems =>
      currentItems.filter(
        item => !(item.productId === productId && item.size === size)
      )
    )
  }

  const updateQuantity = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeItem(productId, size)
      return
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.productId === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const toggleCart = () => {
    setIsOpen(!isOpen)
  }

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isOpen,
    toggleCart,
    setIsOpen
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}