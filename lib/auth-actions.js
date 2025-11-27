'use server'

import { validateAdminCredentials, setAdminSession, clearAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function loginAction(formData) {
  console.log(`🚀 === LOGIN ACTION START ===`)
  
  try {
    console.log('📝 Form data received:', Array.from(formData.entries()))
    
    const username = formData.get('username')?.toString().trim()
    const password = formData.get('password')?.toString().trim()
    
    console.log(`🔍 Extracted credentials:`)
    console.log(`  Username: "${username}" (type: ${typeof username})`)
    console.log(`  Password: "${password}" (type: ${typeof password})`)
    
    if (!username || !password) {
      console.warn('❌ Missing credentials')
      redirect('/admin/login')
      return
    }
    
    console.log(`🔐 Calling validateAdminCredentials...`)
    const isValid = await validateAdminCredentials(username, password)
    console.log(`🔐 Validation result: ${isValid}`)
    
    if (isValid) {
      console.log('✅ Valid credentials, setting session...')
      await setAdminSession()
      console.log('✅ Session set, redirecting to admin...')
      redirect('/admin')
    } else {
      console.warn('❌ Invalid credentials, redirecting to login...')
      redirect('/admin/login')
    }
  } catch (error) {
    console.error('💥 Login action error:', error)
    redirect('/admin/login')
  }
  
  console.log(`🚀 === LOGIN ACTION END ===`)
}

export async function logoutAction() {
  await clearAdminSession()
  redirect('/admin/login')
}