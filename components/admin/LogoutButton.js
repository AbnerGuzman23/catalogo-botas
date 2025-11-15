'use client'

import { logoutAction } from '@/lib/auth-actions'

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
      >
        Cerrar Sesión
      </button>
    </form>
  )
}