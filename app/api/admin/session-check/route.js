import { checkSessionTimeout, isAdminAuthenticated } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    // Primero verificar si hay una cookie de sesión
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin-session')
    
    if (!sessionCookie || !sessionCookie.value) {
      // No hay sesión - no es un error, simplemente no hay sesión
      return NextResponse.json({
        expired: true,
        reason: 'No session found',
        silent: true // Flag para indicar que no debe mostrar alerta
      }, { status: 200 }) // 200 en lugar de 401 para evitar errores
    }

    try {
      const session = JSON.parse(sessionCookie.value)
      
      // Verificar estructura básica
      if (!session.isAdmin || !session.timestamp || !session.loginTime) {
        const response = NextResponse.json({
          expired: true,
          reason: 'Invalid session structure'
        }, { status: 401 })
        
        response.cookies.delete('admin-session', { path: '/admin' })
        return response
      }

      // Verificar timeout
      const sessionStatus = await checkSessionTimeout()
      
      if (sessionStatus.expired) {
        const response = NextResponse.json({
          expired: true,
          reason: sessionStatus.reason
        }, { status: 401 })
        
        response.cookies.delete('admin-session', { path: '/admin' })
        return response
      }

      // Calcular tiempo restante
      const currentTime = Date.now()
      const sessionStartTime = session.loginTime
      const maxSessionTime = 2 * 60 * 60 * 1000 // 2 horas
      const timeRemaining = maxSessionTime - (currentTime - sessionStartTime)
      
      return NextResponse.json({
        expired: false,
        timeRemaining: Math.max(0, timeRemaining),
        status: 'active'
      })
      
    } catch (parseError) {
      // Cookie corrupta
      const response = NextResponse.json({
        expired: true,
        reason: 'Corrupted session data'
      }, { status: 401 })
      
      response.cookies.delete('admin-session', { path: '/admin' })
      return response
    }
    
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({
      expired: true,
      reason: 'Internal server error'
    }, { status: 500 })
  }
}