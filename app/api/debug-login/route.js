import { validateAdminCredentials, setAdminSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request) {
  console.log(`🚀 === API LOGIN START ===`)
  
  try {
    const body = await request.json()
    console.log('📝 Request body:', body)
    
    const { username, password } = body
    
    console.log(`🔍 Extracted credentials:`)
    console.log(`  Username: "${username}" (type: ${typeof username})`)
    console.log(`  Password: "${password}" (type: ${typeof password})`)
    
    if (!username || !password) {
      console.warn('❌ Missing credentials')
      return NextResponse.json({ success: false, error: 'Missing credentials' })
    }
    
    console.log(`🔐 Calling validateAdminCredentials...`)
    const isValid = await validateAdminCredentials(username, password)
    console.log(`🔐 Validation result: ${isValid}`)
    
    if (isValid) {
      console.log('✅ Valid credentials, setting session...')
      await setAdminSession()
      console.log('✅ Session set successfully')
      return NextResponse.json({ success: true, redirect: '/admin' })
    } else {
      console.warn('❌ Invalid credentials')
      return NextResponse.json({ success: false, error: 'Invalid credentials' })
    }
  } catch (error) {
    console.error('💥 API Login error:', error)
    return NextResponse.json({ success: false, error: 'Server error' })
  }
}