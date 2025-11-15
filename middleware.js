import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export function middleware(request) {
  // Solo aplicar middleware a rutas /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Verificar si hay token de sesión
    const sessionToken = request.cookies.get('admin-session')
    
    // Si no hay token y no está en la página de login, redirigir al login
    if (!sessionToken && request.nextUrl.pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    // Si hay token y está en la página de login, redirigir al dashboard
    if (sessionToken && request.nextUrl.pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}