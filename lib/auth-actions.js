'use server'

import { validateAdminCredentials, setAdminSession, clearAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function loginAction(formData) {
  try {
    const username = formData.get('username')
    const password = formData.get('password')
    
    console.log(`🔐 Processing login for: ${username}`)
    
    // Validar que se envíen los datos
    if (!username || !password) {
      console.warn('❌ Missing username or password')
      // Guardar error en cookie temporal
      const cookieStore = await cookies()
      cookieStore.set('login-error', 'missing', { maxAge: 60, path: '/admin/login' })
      redirect('/admin/login')
    }
    
    const isValid = await validateAdminCredentials(username, password)
    
    if (isValid) {
      console.log('✅ Credentials valid, setting session')
      // Limpiar cualquier error previo
      const cookieStore = await cookies()
      cookieStore.delete('login-error')
      await setAdminSession()
      redirect('/admin')
    } else {
      console.warn('❌ Invalid credentials, redirecting to login')
      // Guardar error en cookie temporal
      const cookieStore = await cookies()
      cookieStore.set('login-error', 'invalid', { maxAge: 60, path: '/admin/login' })
      redirect('/admin/login')
    }
  } catch (error) {
    console.error('❌ Login action error:', error)
    // Guardar error en cookie temporal
    const cookieStore = await cookies()
    cookieStore.set('login-error', 'server', { maxAge: 60, path: '/admin/login' })
    redirect('/admin/login')
  }
}

export async function logoutAction() {
  await clearAdminSession()
  redirect('/admin/login')
}