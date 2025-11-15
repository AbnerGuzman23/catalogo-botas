import Link from 'next/link'
import LogoutButton from './LogoutButton'

export default function AdminNavbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/admin" className="text-xl font-bold text-gray-900">
              Admin Panel
            </Link>
            <div className="ml-8 flex space-x-4">
              <Link 
                href="/admin"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link 
                href="/admin/new"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Nuevo Producto
              </Link>
              <Link 
                href="/"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                target="_blank"
              >
                Ver Sitio
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  )
}