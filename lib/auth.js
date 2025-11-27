import { cookies } from 'next/headers'
import { getSiteConfig } from './actions'

export async function setAdminSession() {
  try {
    const sessionData = {
      isAdmin: true,
      timestamp: Date.now(),
      loginTime: Date.now(),
      sessionId: Math.random().toString(36).substr(2, 9)
    }
    
    const cookieStore = await cookies()
    cookieStore.set('admin-session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Cambiado de 'strict' a 'lax' para mejor compatibilidad
      maxAge: 60 * 60 * 2, // 2 horas
      path: '/'
    })
    
    console.log('✅ Admin session set successfully')
  } catch (error) {
    console.error('❌ Error setting admin session:', error)
    throw error
  }
}

export async function clearAdminSession() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin-session')
    console.log('✅ Admin session cleared successfully')
  } catch (error) {
    console.error('❌ Error clearing admin session:', error)
  }
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
    console.log(`🔐 === LOGIN DEBUG ===`)
    console.log(`Received username: "${username}"`)
    console.log(`Received password: "${password}"`)
    console.log(`Username length: ${username ? username.length : 'null'}`)
    console.log(`Password length: ${password ? password.length : 'null'}`)
    
    const expectedUser = process.env.ADMIN_USER || 'admin'
    console.log(`Expected username: "${expectedUser}"`)
    
    // Obtener la contraseña desde la base de datos
    let expectedPass = 'admin123' // Fallback por defecto
    
    try {
      const siteConfig = await getSiteConfig()
      if (siteConfig?.adminPassword) {
        expectedPass = siteConfig.adminPassword
        console.log(`📋 Password loaded from database: ${expectedPass ? 'YES' : 'NO'}`)
        console.log(`📋 Database password length: ${expectedPass.length}`)
      } else {
        console.log(`⚠️ No password in database, using default`)
      }
    } catch (configError) {
      console.warn(`⚠️ Error getting siteConfig: ${configError.message}`)
      console.warn(`⚠️ Using default password`)
    }
    
    console.log(`Expected password: "${expectedPass}"`)
    
    // Comparaciones paso a paso
    const userMatch = username === expectedUser
    const passMatch = password === expectedPass
    
    console.log(`Username match: ${userMatch}`)
    console.log(`Password match: ${passMatch}`)
    
    const isValid = userMatch && passMatch
    console.log(`Final result: ${isValid}`)
    console.log(`🔐 === END DEBUG ===`)
    
    return isValid
  } catch (error) {
    console.error('❌ Error in validateAdminCredentials:', error)
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