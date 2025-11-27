import { setAdminSession, isAdminAuthenticated } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const isAuth = await isAdminAuthenticated()
    
    if (!isAuth) {
      return NextResponse.json({
        success: false,
        message: 'Not authenticated'
      }, { status: 401 })
    }
    
    // Crear nueva sesión extendida
    await setAdminSession()
    
    return NextResponse.json({
      success: true,
      message: 'Session extended for 2 more hours'
    })
  } catch (error) {
    console.error('Session extend error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal error'
    }, { status: 500 })
  }
}