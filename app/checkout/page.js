'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/components/cart/CartContext'
import { processSale } from '@/lib/sales-actions'
import { getSiteConfig } from '@/lib/actions'
import Image from 'next/image'
import Link from 'next/link'

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [saleId, setSaleId] = useState(null)
  const [error, setError] = useState('')
  const [siteConfig, setSiteConfig] = useState(null)
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: ''
  })

  // Cargar configuración del sitio
  useEffect(() => {
    const loadSiteConfig = async () => {
      const config = await getSiteConfig()
      setSiteConfig(config)
    }
    loadSiteConfig()
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(price)
  }

  const generateWhatsAppMessage = (customerData, items, total, saleId) => {
    let message = `🤠 *NUEVO PEDIDO - RR BOOTS* 🥾\n\n`
    
    if (customerData.name || customerData.phone || customerData.email) {
      message += `👤 *DATOS DEL CLIENTE:*\n`
      if (customerData.name) message += `• Nombre: ${customerData.name}\n`
      if (customerData.phone) message += `• Teléfono: ${customerData.phone}\n`
      if (customerData.email) message += `• Email: ${customerData.email}\n`
      message += `\n`
    }
    
    message += `📦 *PRODUCTOS SOLICITADOS:*\n`
    
    items.forEach((item, index) => {
      message += `\n${index + 1}. *${item.productName}*\n`
      message += `   • Precio: ${formatPrice(item.price)}\n`
      message += `   • Talla: ${item.size}\n`
      message += `   • Cantidad: ${item.quantity}\n`
      message += `   • Subtotal: ${formatPrice(item.price * item.quantity)}\n`
    })
    
    message += `\n💰 *TOTAL DEL PEDIDO: ${formatPrice(total)}*\n`
    message += `\n📋 *Número de pedido:* #${saleId}\n`
    message += `\n💳 *Métodos de pago disponibles:*\n`
    message += `• Efectivo\n`
    message += `• Transferencia bancaria\n`
    message += `• Tarjeta de crédito/débito\n`
    message += `\n🕐 Fecha del pedido: ${new Date().toLocaleString('es-ES')}\n`
    message += `\n¡Gracias por elegir RR BOOTS! 🤠`
    
    return encodeURIComponent(message)
  }

  const sendWhatsAppMessage = (customerData, items, total, saleId) => {
    const whatsappNumber = siteConfig?.whatsappNumber || '50212345678'
    const message = generateWhatsAppMessage(customerData, items, total, saleId)
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`
    window.open(whatsappURL, '_blank')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    setError('')

    try {
      const saleData = {
        total: getTotalPrice(),
        customerName: customerData.name || null,
        customerEmail: customerData.email || null,
        customerPhone: customerData.phone || null
      }

      const saleItems = items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        size: item.size,
        quantity: item.quantity,
        price: item.price
      }))

      const result = await processSale(saleData, saleItems)

      if (result.success) {
        setSaleId(result.saleId)
        setOrderComplete(true)
        
        // Enviar mensaje de WhatsApp
        sendWhatsAppMessage(customerData, items, getTotalPrice(), result.saleId)
        
        clearCart()
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError('Error al procesar la venta')
      console.error('Checkout error:', error)
    }

    setIsProcessing(false)
  }

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Tu carrito está vacío
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Agrega productos antes de proceder al checkout
          </p>
          <Link
            href="/"
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Ir a la tienda
          </Link>
        </div>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full mx-4 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
            ¡Pedido Confirmado!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Tu pedido #{saleId} ha sido procesado exitosamente.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            El inventario ha sido actualizado automáticamente.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => sendWhatsAppMessage(customerData, items, getTotalPrice(), saleId)}
              className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors mb-3"
            >
              📱 Enviar por WhatsApp
            </button>
            <Link
              href="/"
              className="block bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-center"
            >
              Seguir Comprando
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Finalizar Compra
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario del cliente */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Información del Cliente
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre (opcional)
                  </label>
                  <input
                    type="text"
                    value={customerData.name}
                    onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email (opcional)
                  </label>
                  <input
                    type="email"
                    value={customerData.email}
                    onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Teléfono (opcional)
                  </label>
                  <input
                    type="tel"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="+34 123 456 789"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  {isProcessing ? 'Procesando...' : 'Confirmar Pedido'}
                </button>
              </form>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Resumen del Pedido
              </h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
                      {item.productImage ? (
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          📷
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.productName}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Talla: {item.size} • Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    Total:
                  </span>
                  <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
