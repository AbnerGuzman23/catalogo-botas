import { cookies } from 'next/headers'

export function setAdminSession() {
  const sessionData = {
    isAdmin: true,
    timestamp: Date.now()
  }
  
  // Crear cookie de sesión que expira en 24 horas
  const cookieStore = cookies()
  cookieStore.set('admin-session', JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 // 24 horas
  })
}

export function clearAdminSession() {
  const cookieStore = cookies()
  cookieStore.delete('admin-session')
}

export function isAdminAuthenticated() {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('admin-session')
    if (!sessionCookie) return false
    
    const session = JSON.parse(sessionCookie.value)
    
    // Verificar que la sesión no haya expirado (24 horas)
    const sessionAge = Date.now() - session.timestamp
    const maxAge = 60 * 60 * 24 * 1000 // 24 horas en milisegundos
    
    return session.isAdmin && sessionAge < maxAge
  } catch {
    return false
  }
}
}

export function validateAdminCredentials(username, password) {
  const adminUser = process.env.ADMIN_USER || 'admin'
  const adminPass = process.env.ADMIN_PASS || 'admin123'
  
  return username === adminUser && password === adminPass
}