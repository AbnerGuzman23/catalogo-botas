'use client'

import { logoutAdmin } from '@/lib/session-actions'

export default function LogoutButton() {
  return (
    <form action={logoutAdmin}>
      <button
        type="submit"
        className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-100 rounded-md"
      >
        Cerrar Sesión
      </button>
    </form>
  )
}