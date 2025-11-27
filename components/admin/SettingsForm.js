'use client'

import { useState } from 'react'
import { updateSiteConfig } from '@/lib/actions'

export default function SettingsForm({ siteConfig }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [imagePreview, setImagePreview] = useState(siteConfig.logoUrl || null)
  const [formData, setFormData] = useState({
    siteName: siteConfig.siteName || '',
    siteDescription: siteConfig.siteDescription || '',
    footerAbout: siteConfig.footerAbout || '',
    footerProducts: siteConfig.footerProducts || '',
    footerServices: siteConfig.footerServices || '',
    adminPassword: '',
    whatsappNumber: siteConfig.whatsappNumber || '',
    logoFile: null
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      const formDataObj = new FormData()
      formDataObj.append('siteName', formData.siteName)
      formDataObj.append('siteDescription', formData.siteDescription)
      formDataObj.append('footerAbout', formData.footerAbout)
      formDataObj.append('footerProducts', formData.footerProducts)
      formDataObj.append('footerServices', formData.footerServices)
      formDataObj.append('adminPassword', formData.adminPassword || siteConfig.adminPassword)
      formDataObj.append('whatsappNumber', formData.whatsappNumber)
      
      // Si hay una imagen nueva, subirla primero
      if (formData.logoFile) {
        // Aquí podrías implementar la subida a un servicio como Cloudinary
        // Por ahora, convertiremos la imagen a base64 para almacenarla
        const reader = new FileReader()
        reader.onload = async (event) => {
          const logoUrl = event.target.result
          formDataObj.append('logoUrl', logoUrl)
          
          await updateSiteConfig(formDataObj)
          setSuccess(true)
          setLoading(false)
          
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        }
        reader.readAsDataURL(formData.logoFile)
      } else {
        // Mantener la URL actual si no hay nueva imagen
        formDataObj.append('logoUrl', siteConfig.logoUrl || '')
        
        await updateSiteConfig(formDataObj)
        setSuccess(true)
        setLoading(false)
        
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
    } catch (error) {
      console.error('Error updating config:', error)
      alert('Error al actualizar la configuración')
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido')
        return
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen debe ser menor a 5MB')
        return
      }
      
      setFormData({
        ...formData,
        logoFile: file
      })
      
      // Crear preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Configuración actualizada exitosamente. La página se recargará automáticamente.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre del Sitio
          </label>
          <input
            type="text"
            name="siteName"
            id="siteName"
            value={formData.siteName}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="RR BOOTS"
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Este nombre aparecerá en el header de tu sitio web
          </p>
        </div>

        <div>
          <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Descripción del Sitio
          </label>
          <input
            type="text"
            name="siteDescription"
            id="siteDescription"
            value={formData.siteDescription}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Artículos Western de Calidad Premium"
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Esta descripción aparecerá debajo del nombre en la página principal
          </p>
        </div>

        <div>
          <label htmlFor="logoFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Logo del Sitio
          </label>
          <div className="mt-1">
            <input
              type="file"
              name="logoFile"
              id="logoFile"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-amber-50 file:text-amber-700
                hover:file:bg-amber-100
                dark:file:bg-gray-700 dark:file:text-gray-300"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Sube una imagen para el logo. Formatos admitidos: JPG, PNG, SVG. Máximo 5MB.
          </p>
        </div>

        {imagePreview && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Vista previa del logo
            </label>
            <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-gray-50 dark:bg-gray-700">
              <img
                src={imagePreview}
                alt="Vista previa del logo"
                className="h-16 w-auto object-contain"
              />
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 dark:border-gray-600 pt-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Contenido del Footer
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Personaliza la información que aparece en el pie de página de tu sitio web
          </p>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="footerAbout" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Descripción de la Empresa
              </label>
              <textarea
                name="footerAbout"
                id="footerAbout"
                rows="3"
                value={formData.footerAbout}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Más de 25 años especializados en artículos western..."
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Este texto aparece en la columna izquierda del footer
              </p>
            </div>

            <div>
              <label htmlFor="footerProducts" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Lista de Productos
              </label>
              <textarea
                name="footerProducts"
                id="footerProducts"
                rows="4"
                value={formData.footerProducts}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="• Zapatos Vaqueros&#10;• Cinturones de Cuero..."
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Lista de productos (usa • para viñetas y saltos de línea para separar)
              </p>
            </div>

            <div>
              <label htmlFor="footerServices" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Servicios y Características
              </label>
              <textarea
                name="footerServices"
                id="footerServices"
                rows="4"
                value={formData.footerServices}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="🤠 Artículos western auténticos&#10;📞 Asesoría especializada..."
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Lista de servicios (usa emojis y saltos de línea para separar)
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-600 pt-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Configuración del Sistema
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Configura la contraseña de administrador y el número de WhatsApp para recibir pedidos
          </p>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nueva Contraseña de Administrador
              </label>
              <input
                type="password"
                name="adminPassword"
                id="adminPassword"
                value={formData.adminPassword}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Deja vacío para mantener la actual"
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Solo ingresa una nueva contraseña si deseas cambiarla
              </p>
            </div>

            <div>
              <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Número de WhatsApp para Pedidos
              </label>
              <input
                type="tel"
                name="whatsappNumber"
                id="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="50212345678"
                required
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Número con código de país (sin +). Ejemplo: 50212345678 para Guatemala
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </>
            ) : (
              'Guardar Configuración'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}