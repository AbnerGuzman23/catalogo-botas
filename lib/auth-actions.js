'use server'

import { validateAdminCredentials, setAdminSession, clearAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function loginAction(formData) {
  try {
    const username = formData.get('username')
    const password = formData.get('password')
    
    console.log(`🔐 Processing login for: ${username}`)
    
    // Validar que se envíen los datos
    if (!username || !password) {
      console.warn('❌ Missing username or password')
      redirect('/admin/login?error=missing')
    }
    
    const isValid = await validateAdminCredentials(username, password)
    
    if (isValid) {
      console.log('✅ Credentials valid, setting session')
      await setAdminSession()
      redirect('/admin')
    } else {
      console.warn('❌ Invalid credentials, redirecting to login')
      redirect('/admin/login?error=invalid')
    }
  } catch (error) {
    console.error('❌ Login action error:', error)
    redirect('/admin/login?error=server')
  }
}

export async function logoutAction() {
  await clearAdminSession()
  redirect('/admin/login')
}