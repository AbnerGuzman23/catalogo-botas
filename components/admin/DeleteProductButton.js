'use client'

import { deleteProduct } from '@/lib/actions'
import { useState } from 'react'

export default function DeleteProductButton({ productId, productName }) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteProduct(productId)
      // Si llegamos aquí, la eliminación fue exitosa
      window.location.reload() // Recargar la página para mostrar los cambios
    } catch (error) {
      console.error('Error:', error)
      alert(`Error al eliminar el producto: ${error.message}`)
    } finally {
      setIsDeleting(false)
      setIsConfirming(false)
    }
  }

  if (isConfirming) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-800 p-1 text-xs disabled:opacity-50"
          title="Confirmar eliminación"
        >
          {isDeleting ? '🔄 Eliminando...' : '✓ Eliminar'}
        </button>
        <button
          onClick={() => setIsConfirming(false)}
          disabled={isDeleting}
          className="text-gray-600 hover:text-gray-800 p-1 text-xs disabled:opacity-50"
          title="Cancelar"
        >
          Cancelar
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      className="text-red-600 hover:text-red-800 p-1"
      title={`Eliminar ${productName}`}
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  )
}