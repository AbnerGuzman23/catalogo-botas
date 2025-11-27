'use server'

import { clearAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

// Server Action para limpiar sesión y redirigir
export async function logoutAdmin() {
  await clearAdminSession()
  redirect('/admin/login')
}

// Server Action para validar y limpiar sesión si es necesaria
export async function validateAndCleanSession() {
  try {
    const { checkSessionTimeout } = await import('@/lib/auth')
    const sessionStatus = await checkSessionTimeout()
    
    if (sessionStatus.expired) {
      await clearAdminSession()
      return { valid: false, reason: sessionStatus.reason }
    }
    
    return { valid: true }
  } catch (error) {
    await clearAdminSession()
    return { valid: false, reason: 'Session error' }
  }
}