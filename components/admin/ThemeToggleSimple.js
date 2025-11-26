'use client'

import { useState, useEffect } from 'react'

export default function ThemeToggleSimple() {
  const [theme, setTheme] = useState('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Leer tema actual del localStorage y DOM
    const savedTheme = localStorage.getItem('rrboots-theme') || 'light'
    setTheme(savedTheme)
    
    // Aplicar tema al DOM
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(savedTheme)
    root.setAttribute('data-theme', savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    console.log(`Cambiando tema de ${theme} a ${newTheme}`)
    
    // Actualizar estado local
    setTheme(newTheme)
    
    // Guardar en localStorage
    localStorage.setItem('rrboots-theme', newTheme)
    
    // Aplicar al DOM
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(newTheme)
    root.setAttribute('data-theme', newTheme)
  }

  // Evitar hydration mismatch
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
        aria-label="Cargando tema..."
        disabled
      >
        <div className="w-5 h-5 bg-gray-400 rounded"></div>
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Alternar modo oscuro"
      title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
    >
      {theme === 'dark' ? (
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  )
}