'use server'

import { validateAdminCredentials, setAdminSession, clearAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function loginAction(formData) {
  try {
    const username = formData.get('username')?.toString()
    const password = formData.get('password')?.toString()
    
    console.log(`🔐 Processing login for: ${username}`)
    
    // Validar que se envíen los datos
    if (!username || !password) {
      console.warn('❌ Missing username or password')
      throw new Error('Faltan credenciales')
    }
    
    const isValid = await validateAdminCredentials(username, password)
    
    if (isValid) {
      console.log('✅ Credentials valid, setting session')
      await setAdminSession()
      redirect('/admin')
    } else {
      console.warn('❌ Invalid credentials')
      throw new Error('Credenciales incorrectas')
    }
  } catch (error) {
    console.error('❌ Login action error:', error)
    // En lugar de usar cookies, simplemente redirigir
    redirect('/admin/login')
  }
}

export async function logoutAction() {
  await clearAdminSession()
  redirect('/admin/login')
}