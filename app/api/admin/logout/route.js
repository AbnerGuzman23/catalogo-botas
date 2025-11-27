import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Session cleared'
    })
    
    // Limpiar cookie de sesión
    response.cookies.delete('admin-session', { 
      path: '/admin',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({
      success: false,
      message: 'Error during logout'
    }, { status: 500 })
  }
}