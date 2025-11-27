// Configuración general de la aplicación
export const config = {
  // Número de WhatsApp de la empresa (formato internacional)
  // Ejemplo: +34123456789 (España), +52123456789 (México), +1234567890 (USA)
  whatsappNumber: '+34123456789', // CAMBIA ESTE NÚMERO POR EL DE TU EMPRESA
  
  // Información de la empresa
  company: {
    name: 'RR BOOTS',
    description: 'Artículos Western de Calidad Premium',
    address: 'Tu dirección comercial', // Opcional
    email: 'info@rrboots.com', // Opcional
  },
  
  // Configuración de la aplicación
  currency: 'GTQ',
  locale: 'es-GT',
  
  // Métodos de pago aceptados (para mostrar en el checkout)
  paymentMethods: [
    'Transferencia bancaria',
    'PayPal',
    'Tarjeta de crédito/débito',
    'Bizum',
    'Pago contra reembolso'
  ]
}