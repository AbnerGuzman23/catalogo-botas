// Middleware temporalmente deshabilitado para evitar warnings de Next.js 16
// La autenticación ahora se maneja en cada página individualmente

export async function middleware(request) {
  // Middleware simplificado - solo para logging
  console.log('Request to:', request.nextUrl.pathname)
  return
}

export const config = {
  matcher: []
}