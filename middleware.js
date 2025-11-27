import { NextResponse } from 'next/server'

export async function middleware(request) {
  // Solo aplicar middleware a rutas de admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // Permitir acceso libre a la página de login y APIs de sesión
    const allowedPaths = [
      '/admin/login',
      '/api/admin/session-check',
      '/api/admin/refresh-session',
      '/api/admin/logout'
    ]
    
    if (allowedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
      return NextResponse.next()
    }
    
    try {
      const sessionToken = request.cookies.get('admin-session')
      
      if (!sessionToken || !sessionToken.value) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
      
      // Validar sesión
      const session = JSON.parse(sessionToken.value)
      const currentTime = Date.now()
      
      // Verificar estructura válida de sesión
      if (!session.loginTime || !session.timestamp || !session.isAdmin || !session.sessionId) {
        const response = NextResponse.redirect(new URL('/admin/login', request.url))
        response.cookies.delete('admin-session')
        return response
      }
      
      // Verificar expiración total (2 horas desde login)
      const sessionAge = currentTime - session.loginTime
      const maxSessionAge = 2 * 60 * 60 * 1000 // 2 horas
      
      if (sessionAge >= maxSessionAge) {
        const response = NextResponse.redirect(new URL('/admin/login?expired=session', request.url))
        response.cookies.delete('admin-session')
        return response
      }
      
      // Verificar inactividad (30 minutos)
      const inactiveTime = currentTime - session.timestamp
      const maxInactiveTime = 30 * 60 * 1000 // 30 minutos
      
      if (inactiveTime >= maxInactiveTime) {
        const response = NextResponse.redirect(new URL('/admin/login?expired=inactive', request.url))
        response.cookies.delete('admin-session')
        return response
      }
      
    } catch (error) {
      console.error('Middleware auth error:', error)
      const response = NextResponse.redirect(new URL('/admin/login?error=invalid', request.url))
      response.cookies.delete('admin-session')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}