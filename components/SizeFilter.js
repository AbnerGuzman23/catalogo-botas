'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function SizeFilter({ sizes, currentSize }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const handleSizeChange = (size) => {
    const params = new URLSearchParams(searchParams)
    
    if (size === 'all') {
      params.delete('size')
    } else {
      params.set('size', size)
    }

    const queryString = params.toString()
    const url = queryString ? `/?${queryString}` : '/'
    router.push(url)
    setIsOpen(false)
  }

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => {
      setIsOpen(false)
    }
    
    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative inline-block">
      {/* Botón principal */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
      >
        <span>{currentSize || 'Todas las tallas'}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {/* Opción "Todas las tallas" */}
          <button
            onClick={() => handleSizeChange('all')}
            className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
              !currentSize ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
            }`}
          >
            Todas las tallas
          </button>
          
          {/* Opciones de tallas */}
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeChange(size)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                currentSize === size ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}