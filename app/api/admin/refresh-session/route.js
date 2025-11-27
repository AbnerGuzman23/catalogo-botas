import { refreshAdminSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const refreshed = await refreshAdminSession()
    
    if (refreshed) {
      return NextResponse.json({
        success: true,
        message: 'Session refreshed'
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to refresh session'
      }, { status: 401 })
    }
  } catch (error) {
    console.error('Session refresh error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal error'
    }, { status: 500 })
  }
}