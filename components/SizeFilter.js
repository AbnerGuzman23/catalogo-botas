'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function SizeFilter({ sizes, currentSize }) {
  const router = useRouter()
  const searchParams = useSearchParams()

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
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filtrar por talla</h3>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleSizeChange('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${!currentSize 
              ? 'bg-gray-900 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          Todas
        </button>
        
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => handleSizeChange(size)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${currentSize === size 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {size}
          </button>
        ))}
      </div>
      
      {currentSize && (
        <p className="text-sm text-gray-600 mt-3">
          Mostrando productos para la talla: <span className="font-medium">{currentSize}</span>
        </p>
      )}
    </div>
  )
}