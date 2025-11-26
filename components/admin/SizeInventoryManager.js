'use client'

import { useState } from 'react'

export default function SizeInventoryManager({ sizes = [], onChange }) {
  const [sizeInventory, setSizeInventory] = useState(sizes)

  const availableSizes = [
    '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45',
    'S', 'M', 'L', 'XL', 'Único'
  ]

  const addSize = (size) => {
    if (!sizeInventory.find(item => item.size === size)) {
      const newInventory = [...sizeInventory, { size, quantity: 0 }]
      setSizeInventory(newInventory)
      onChange(newInventory)
    }
  }

  const updateQuantity = (size, quantity) => {
    const newInventory = sizeInventory.map(item => 
      item.size === size ? { ...item, quantity: parseInt(quantity) || 0 } : item
    )
    setSizeInventory(newInventory)
    onChange(newInventory)
  }

  const removeSize = (size) => {
    const newInventory = sizeInventory.filter(item => item.size !== size)
    setSizeInventory(newInventory)
    onChange(newInventory)
  }

  const availableSizesToAdd = availableSizes.filter(
    size => !sizeInventory.find(item => item.size === size)
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Inventario por Talla
        </label>
        {availableSizesToAdd.length > 0 && (
          <select
            onChange={(e) => {
              if (e.target.value) {
                addSize(e.target.value)
                e.target.value = ''
              }
            }}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">+ Agregar talla</option>
            {availableSizesToAdd.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        )}
      </div>

      {sizeInventory.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No hay tallas agregadas</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Use el selector de arriba para agregar tallas
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {sizeInventory.map((item) => (
            <div
              key={item.size}
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  Talla {item.size}
                </span>
                <button
                  type="button"
                  onClick={() => removeSize(item.size)}
                  className="text-red-500 hover:text-red-700 text-xs"
                  title="Eliminar talla"
                >
                  ✕
                </button>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Cantidad
                </label>
                <input
                  type="number"
                  min="0"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.size, e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="0"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-sm text-gray-500 dark:text-gray-400">
        Total de unidades: {sizeInventory.reduce((sum, item) => sum + item.quantity, 0)}
      </div>
    </div>
  )
}