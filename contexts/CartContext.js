'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'
import { config } from '@/lib/config'

// Tipos de acciones del carrito
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
}

// Reducer para manejar el estado del carrito
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }]
        }
      }
    }
    
    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id)
      }
    
    case CART_ACTIONS.UPDATE_QUANTITY:
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload.id)
        }
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      }
    
    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: []
      }
    
    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload || []
      }
    
    default:
      return state
  }
}

// Estado inicial
const initialState = {
  items: []
}

// Crear el contexto
const CartContext = createContext()

// Hook personalizado para usar el carrito
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider')
  }
  return context
}

// Proveedor del contexto del carrito
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('rrboots-cart')
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart)
          dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartData })
        } catch (error) {
          console.error('Error loading cart from localStorage:', error)
        }
      }
    }
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rrboots-cart', JSON.stringify(state.items))
    }
  }, [state.items])

  // Calcular totales
  const cartTotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  const itemCount = state.items.reduce((count, item) => count + item.quantity, 0)

  // Funciones del carrito
  const addToCart = (product) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: product })
  }

  const removeFromCart = (productId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: { id: productId } })
  }

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id: productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART })
  }

  // Función para generar mensaje de WhatsApp
  const generateWhatsAppMessage = (customerData) => {
    const { name, phone, email, notes } = customerData
    
    let message = `🤠 *NUEVO PEDIDO - ${config.company.name}* 🥾\n\n`
    message += `👤 *DATOS DEL CLIENTE:*\n`
    message += `• Nombre: ${name}\n`
    message += `• Teléfono: ${phone}\n`
    if (email) message += `• Email: ${email}\n`
    message += `\n📦 *PRODUCTOS SOLICITADOS:*\n`
    
    state.items.forEach((item, index) => {
      message += `\n${index + 1}. *${item.name}*\n`
      message += `   • Precio: ${new Intl.NumberFormat(config.locale, { style: 'currency', currency: config.currency }).format(item.price)}\n`
      message += `   • Talla: ${item.size}\n`
      message += `   • Cantidad: ${item.quantity}\n`
      message += `   • Subtotal: ${new Intl.NumberFormat(config.locale, { style: 'currency', currency: config.currency }).format(item.price * item.quantity)}\n`
    })
    
    message += `\n💰 *TOTAL DEL PEDIDO: ${new Intl.NumberFormat(config.locale, { style: 'currency', currency: config.currency }).format(cartTotal)}*\n`
    
    message += `\n💳 *Métodos de pago disponibles:*\n`
    config.paymentMethods.slice(0, 3).forEach(method => {
      message += `• ${method}\n`
    })
    
    if (notes) {
      message += `\n📝 *Notas adicionales:*\n${notes}\n`
    }
    
    message += `\n🕐 Fecha del pedido: ${new Date().toLocaleString(config.locale)}\n`
    message += `\n¡Gracias por elegir ${config.company.name}! 🤠`
    
    return encodeURIComponent(message)
  }

  const value = {
    items: state.items,
    cartTotal,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    generateWhatsAppMessage
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}