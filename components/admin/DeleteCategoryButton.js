'use client'

import { useState } from 'react'
import { deleteCategory } from '@/lib/category-actions'
import { useRouter } from 'next/navigation'

export default function DeleteCategoryButton({ categoryId, categoryName, hasProducts }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (hasProducts) {
      alert('No se puede eliminar una categoría que tiene productos asociados')
      return
    }

    if (confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoryName}"?`)) {
      setLoading(true)
      try {
        const result = await deleteCategory(categoryId)
        if (result.success) {
          router.refresh()
        } else {
          alert(result.error || 'Error al eliminar la categoría')
        }
      } catch (error) {
        alert('Error al eliminar la categoría')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading || hasProducts}
      className={`inline-flex items-center ${
        hasProducts 
          ? 'text-gray-400 cursor-not-allowed' 
          : 'text-red-600 hover:text-red-800'
      }`}
      title={hasProducts ? 'No se puede eliminar: tiene productos asociados' : 'Eliminar categoría'}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  )
}