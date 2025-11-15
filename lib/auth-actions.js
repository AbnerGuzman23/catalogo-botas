'use server'

import { validateAdminCredentials, setAdminSession, clearAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function loginAction(formData) {
  const username = formData.get('username')
  const password = formData.get('password')
  
  if (validateAdminCredentials(username, password)) {
    setAdminSession()
    redirect('/admin')
  } else {
    return { error: 'Credenciales incorrectas' }
  }
}

export async function logoutAction() {
  clearAdminSession()
  redirect('/admin/login')
}