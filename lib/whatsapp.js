// Funciones para generar y enviar mensajes de WhatsApp
import { getSiteConfig } from './actions'

export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ'
  }).format(price)
}

export const generateWhatsAppMessage = (customerData, items, total, saleId) => {
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
  
  if (saleId) {
    message += `\n📋 *Número de pedido:* #${saleId}\n`
  }
  
  message += `\n💳 *Métodos de pago disponibles:*\n`
  message += `• Efectivo\n`
  message += `• Transferencia bancaria\n`
  message += `• Tarjeta de crédito/débito\n`
  message += `\n🕐 Fecha del pedido: ${new Date().toLocaleString('es-ES')}\n`
  message += `\n¡Gracias por elegir RR BOOTS! 🤠`
  
  return encodeURIComponent(message)
}

export const sendWhatsAppMessage = async (customerData, items, total, saleId, phoneNumber = null) => {
  // Si no se proporciona número, obtener de la configuración
  if (!phoneNumber) {
    const siteConfig = await getSiteConfig()
    phoneNumber = siteConfig.whatsappNumber || '50212345678'
  }
  
  const message = generateWhatsAppMessage(customerData, items, total, saleId)
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`
  window.open(whatsappURL, '_blank')
}

// Función para enviar un mensaje rápido desde el carrito sin checkout
export const sendQuickWhatsAppMessage = async (items, total, phoneNumber = null) => {
  // Si no se proporciona número, obtener de la configuración
  if (!phoneNumber) {
    const siteConfig = await getSiteConfig()
    phoneNumber = siteConfig.whatsappNumber || '50212345678'
  }
  
  const customerData = { name: 'Cliente', phone: '', email: '' }
  await sendWhatsAppMessage(customerData, items, total, null, phoneNumber)
}