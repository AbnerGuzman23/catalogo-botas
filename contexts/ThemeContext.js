'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de ThemeProvider')
  }
  return context
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const [mounted, setMounted] = useState(false)

  // Función para aplicar tema al documento
  const applyTheme = (newTheme) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      
      // Remover clases previas
      root.classList.remove('light', 'dark')
      
      // Agregar nueva clase
      root.classList.add(newTheme)
      
      // Establecer atributo data para referencia
      root.setAttribute('data-theme', newTheme)
      
      console.log(`Tema aplicado: ${newTheme}, clases actuales:`, root.classList.toString())
    }
  }

  useEffect(() => {
    setMounted(true)
    
    // Cargar tema guardado o usar default light
    let initialTheme = 'light'
    
    try {
      const savedTheme = localStorage.getItem('rrboots-theme')
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        initialTheme = savedTheme
      }
    } catch (e) {
      console.log('Error accessing localStorage:', e)
    }
    
    console.log(`Tema inicial: ${initialTheme}`)
    setTheme(initialTheme)
    applyTheme(initialTheme)
  }, [])

  useEffect(() => {
    if (mounted) {
      applyTheme(theme)
      try {
        localStorage.setItem('rrboots-theme', theme)
      } catch (e) {
        console.log('Error saving theme:', e)
      }
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    console.log(`Cambiando tema de ${theme} a ${newTheme}`)
    setTheme(newTheme)
  }

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    mounted
  }

  // Evitar flash de contenido sin estilo
  if (!mounted) {
    return (
      <div style={{ visibility: 'hidden' }}>
        {children}
      </div>
    )
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}