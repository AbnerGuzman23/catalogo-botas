'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { config } from '@/lib/config'

export default function CheckoutForm({ onBack, onClose }) {
  const { items, cartTotal, generateWhatsAppMessage, clearCart } = useCart()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Número de WhatsApp de la empresa desde la configuración
  const BUSINESS_WHATSAPP = config.whatsappNumber

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio'
    } else if (!/^[\+]?[\s\-\(\)]*([0-9][\s\-\(\)]*)+([\s\-\(\)]*[0-9])*$/g.test(formData.phone)) {
      newErrors.phone = 'Formato de teléfono inválido'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de email inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Generar mensaje de WhatsApp
      const message = generateWhatsAppMessage(formData)
      
      // Crear URL de WhatsApp
      const whatsappURL = `https://wa.me/${BUSINESS_WHATSAPP.replace(/[^0-9]/g, '')}?text=${message}`
      
      // Abrir WhatsApp
      window.open(whatsappURL, '_blank')
      
      // Mostrar mensaje de éxito
      alert('¡Pedido enviado! Se abrirá WhatsApp para completar tu pedido.')
      
      // Limpiar carrito y cerrar
      clearCart()
      onClose()
      
    } catch (error) {
      console.error('Error al enviar pedido:', error)
      alert('Error al enviar el pedido. Por favor, inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-green-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="bg-green-700 hover:bg-green-800 p-2 rounded-full transition-colors duration-200"
              aria-label="Volver al carrito"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold">💬 Finalizar Pedido</h2>
          </div>
          <button
            onClick={onClose}
            className="bg-green-700 hover:bg-green-800 p-2 rounded-full transition-colors duration-200"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Contenido del formulario */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Resumen del pedido */}
        <div className="bg-amber-50 dark:bg-slate-600 border border-amber-200 dark:border-slate-500 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-amber-900 dark:text-amber-200 mb-3 flex items-center gap-2">
            <span>📦</span>
            Resumen del Pedido
          </h3>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-stone-700 dark:text-slate-300">
                  {item.name} (Talla {item.size}) x{item.quantity}
                </span>
                <span className="font-medium text-amber-800 dark:text-amber-300">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="border-t border-amber-300 pt-2 mt-3">
              <div className="flex justify-between font-bold text-amber-900 dark:text-amber-200">
                <span>Total:</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Información sobre el proceso */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
            <span>ℹ️</span>
            ¿Cómo funciona?
          </h4>
          <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
            <li>Completa tus datos de contacto</li>
            <li>Se abrirá WhatsApp con tu pedido</li>
            <li>Confirma el pedido con nosotros</li>
            <li>Te indicaremos el método de pago</li>
            <li>¡Procesaremos tu pedido!</li>
          </ol>
        </div>

        {/* Métodos de pago */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
            <span>💳</span>
            Métodos de Pago Disponibles
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
            {config.paymentMethods.map((method, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                {method}
              </div>
            ))}
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-stone-700 dark:text-slate-300 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors bg-white dark:bg-slate-700 text-stone-900 dark:text-slate-100 ${
                errors.name ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-stone-300 dark:border-slate-600'
              }`}
              placeholder="Ej: Juan Pérez"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-stone-700 dark:text-slate-300 mb-2">
              Número de Teléfono *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors bg-white dark:bg-slate-700 text-stone-900 dark:text-slate-100 ${
                errors.phone ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-stone-300 dark:border-slate-600'
              }`}
              placeholder="Ej: +34 123 456 789"
            />
            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 dark:text-slate-300 mb-2">
              Email (opcional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors bg-white dark:bg-slate-700 text-stone-900 dark:text-slate-100 ${
                errors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-stone-300 dark:border-slate-600'
              }`}
              placeholder="Ej: juan@email.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-stone-700 dark:text-slate-300 mb-2">
              Notas Adicionales (opcional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-stone-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors resize-none bg-white dark:bg-slate-700 text-stone-900 dark:text-slate-100"
              placeholder="Ej: Preferencia de horario de entrega, instrucciones especiales..."
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full font-bold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                isSubmitting
                  ? 'bg-stone-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 transform hover:scale-105'
              } text-white`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <span className="text-xl">📱</span>
                  Enviar Pedido por WhatsApp
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}