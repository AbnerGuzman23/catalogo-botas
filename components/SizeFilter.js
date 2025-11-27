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
    <div className="bg-white border border-amber-200 p-8 rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-amber-900 mb-2 tracking-wide">FILTRAR POR TALLA</h3>
        <div className="w-16 h-0.5 bg-amber-600 mx-auto"></div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => handleSizeChange('all')}
          className={`px-6 py-3 rounded-lg text-sm font-bold tracking-wider transition-all duration-300 border-2 transform hover:scale-105
            ${!currentSize 
              ? 'bg-amber-800 text-white border-amber-800 shadow-lg' 
              : 'bg-white text-amber-800 border-amber-300 hover:border-amber-500 hover:bg-amber-50'
            }`}
        >
          TODAS
        </button>
        
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => handleSizeChange(size)}
            className={`px-6 py-3 rounded-lg text-sm font-bold tracking-wider transition-all duration-300 border-2 transform hover:scale-105
              ${currentSize === size 
                ? 'bg-amber-800 text-white border-amber-800 shadow-lg' 
                : 'bg-white text-amber-800 border-amber-300 hover:border-amber-500 hover:bg-amber-50'
              }`}
          >
            {size}
          </button>
        ))}
      </div>
      
      {currentSize && (
        <div className="text-center mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-amber-900 font-medium">
            Mostrando productos para la talla: <span className="font-bold text-amber-800 text-lg">{currentSize}</span>
          </p>
        </div>
      )}
    </div>
  )
}