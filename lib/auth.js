import { cookies } from 'next/headers'
import { getSiteConfig } from './actions'

export async function setAdminSession() {
  const sessionData = {
    isAdmin: true,
    timestamp: Date.now(),
    loginTime: Date.now(),
    sessionId: Math.random().toString(36).substr(2, 9) // ID único de sesión
  }
  
  // Crear cookie de sesión que expira en 2 horas
  const cookieStore = await cookies()
  cookieStore.set('admin-session', JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 2, // 2 horas
    path: '/admin'
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  
  // Solo eliminar la cookie principal
  cookieStore.delete('admin-session')
}

export async function isAdminAuthenticated() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin-session')
    
    if (!sessionCookie || !sessionCookie.value) {
      return false
    }
    
    const session = JSON.parse(sessionCookie.value)
    
    // Validar estructura de la sesión
    if (!session.isAdmin || !session.timestamp || !session.loginTime || !session.sessionId) {
      return false
    }
    
    // Verificar que la sesión no haya expirado (2 horas)
    const sessionAge = Date.now() - session.timestamp
    const maxAge = 60 * 60 * 2 * 1000 // 2 horas en milisegundos
    
    if (sessionAge >= maxAge) {
      return false
    }
    
    return session.isAdmin
  } catch (error) {
    console.error('Error verificando autenticación:', error)
    return false
  }
}

export async function validateAdminCredentials(username, password) {
  try {
    // Log inicial
    console.log(`Login attempt for user: ${username}`)
    
    const adminUser = process.env.ADMIN_USER || 'admin'
    
    // Obtener la contraseña desde la configuración del sitio
    const siteConfig = await getSiteConfig()
    const adminPass = siteConfig?.adminPassword || 'admin123'
    
    // Log para debug
    console.log(`Expected user: ${adminUser}, received: ${username}`)
    console.log(`Expected pass length: ${adminPass.length}, received pass length: ${password.length}`)
    
    // Verificación estricta de credenciales
    const userValid = username === adminUser
    const passValid = password === adminPass
    const isValid = userValid && passValid
    
    if (isValid) {
      console.log(`✅ Admin login successful at ${new Date().toISOString()}`)
    } else {
      console.warn(`❌ Failed admin login attempt:`)
      console.warn(`   User match: ${userValid} (expected: "${adminUser}", received: "${username}")`)
      console.warn(`   Pass match: ${passValid}`)
      console.warn(`   Time: ${new Date().toISOString()}`)
    }
    
    return isValid
  } catch (error) {
    console.error('❌ Error validating admin credentials:', error)
    return false
  }
}

// Función para actualizar timestamp de la sesión
export async function refreshAdminSession() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin-session')
    
    if (!sessionCookie) return false
    
    const session = JSON.parse(sessionCookie.value)
    
    // Actualizar timestamp pero mantener loginTime original
    session.timestamp = Date.now()
    
    cookieStore.set('admin-session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 2, // 2 horas
      path: '/admin'
    })
    
    return true
  } catch {
    return false
  }
}

// Verificar tiempo total de sesión (máximo 2 horas desde login)
export async function checkSessionTimeout() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin-session')
    
    if (!sessionCookie) return { expired: true, reason: 'No session' }
    
    const session = JSON.parse(sessionCookie.value)
    
    const totalSessionTime = Date.now() - session.loginTime
    const maxSessionTime = 60 * 60 * 2 * 1000 // 2 horas
    
    if (totalSessionTime >= maxSessionTime) {
      return { expired: true, reason: 'Session timeout (2 hours)' }
    }
    
    const inactiveTime = Date.now() - session.timestamp
    const maxInactiveTime = 30 * 60 * 1000 // 30 minutos de inactividad
    
    if (inactiveTime >= maxInactiveTime) {
      return { expired: true, reason: 'Inactive session (30 minutes)' }
    }
    
    return { expired: false }
  } catch {
    return { expired: true, reason: 'Session error' }
  }
}