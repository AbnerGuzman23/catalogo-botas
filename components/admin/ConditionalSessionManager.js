'use client'

import { usePathname } from 'next/navigation'
import SessionManager from './SessionManager'

export default function ConditionalSessionManager() {
  const pathname = usePathname()
  
  // Solo mostrar SessionManager si estamos en rutas de admin (excepto login)
  const shouldShowSessionManager = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')
  
  if (!shouldShowSessionManager) {
    return null
  }
  
  return <SessionManager />
}