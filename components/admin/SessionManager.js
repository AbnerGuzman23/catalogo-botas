'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SessionManager() {
  const router = useRouter()
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [showWarning, setShowWarning] = useState(false)
  const [hasValidSession, setHasValidSession] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar sesión cada minuto
    const checkSession = async () => {
      try {
        const response = await fetch('/api/admin/session-check', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        
        const data = await response.json()
        
        if (data.expired) {
          // Solo mostrar alerta si teníamos una sesión válida antes Y no es silencioso
          if (hasValidSession && !data.silent) {
            alert(`Sesión expirada: ${data.reason}. Serás redirigido al login.`)
            await fetch('/api/admin/logout', { method: 'POST' })
            router.push('/admin/login')
          } else if (!data.silent) {
            // Si no es silencioso pero no teníamos sesión válida, redirigir sin alerta
            router.push('/admin/login')
          }
          // Si es silencioso, no hacer nada (usuario probablemente no estaba autenticado)
          return
        }
        
        if (data.timeRemaining) {
          setHasValidSession(true)
          setTimeRemaining(data.timeRemaining)
          
          // Mostrar advertencia cuando quedan menos de 10 minutos
          if (data.timeRemaining < 10 * 60 * 1000) {
            setShowWarning(true)
          } else {
            setShowWarning(false)
          }
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error checking session:', error)
        setIsLoading(false)
      }
    }

    // Verificar inmediatamente
    checkSession()
    
    // Verificar cada 2 minutos en lugar de cada minuto
    const interval = setInterval(checkSession, 120000)
    
    // Actualizar actividad del usuario
    const updateActivity = async () => {
      try {
        if (hasValidSession) {
          await fetch('/api/admin/refresh-session', {
            method: 'POST',
            credentials: 'include'
          })
        }
      } catch (error) {
        console.error('Error updating activity:', error)
      }
    }

    // Eventos para detectar actividad del usuario
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    let lastActivity = Date.now()
    const handleActivity = () => {
      const now = Date.now()
      // Solo actualizar si han pasado más de 5 minutos desde la última actualización
      if (now - lastActivity > 5 * 60 * 1000 && hasValidSession) {
        lastActivity = now
        updateActivity()
      }
    }

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true })
    })

    return () => {
      clearInterval(interval)
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
    }
  }, [router, hasValidSession])

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`
    }
    return `${remainingMinutes}m`
  }

  const extendSession = async () => {
    try {
      const response = await fetch('/api/admin/extend-session', {
        method: 'POST',
        credentials: 'include'
      })
      
      if (response.ok) {
        setShowWarning(false)
        setTimeRemaining(2 * 60 * 60 * 1000) // 2 horas
        alert('Sesión extendida exitosamente')
      }
    } catch (error) {
      console.error('Error extending session:', error)
    }
  }

  // No mostrar nada si está cargando o no hay sesión válida
  if (isLoading || !hasValidSession) {
    return null
  }

  if (showWarning && timeRemaining) {
    return (
      <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-50 max-w-sm animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-sm">⚠️ Sesión por expirar</p>
            <p className="text-xs">Tiempo restante: {formatTime(timeRemaining)}</p>
          </div>
          <button
            onClick={extendSession}
            className="ml-3 bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors"
          >
            Extender
          </button>
        </div>
      </div>
    )
  }

  return null
}