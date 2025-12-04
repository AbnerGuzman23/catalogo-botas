import BrandForm from '@/components/admin/BrandForm'
import AdminNavbar from '@/components/admin/AdminNavbar'
import { isAdminAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// Configurar como página dinámica para evitar errores de renderizado estático
export const dynamic = 'force-dynamic'
export const revalidate = 0 // Desactivar cache completamente

export const metadata = {
  title: 'Nueva Marca - RR BOOTS Admin',
  description: 'Crear nueva marca'
}

export default async function NewBrandPage() {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Nueva Marca
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Crea una nueva marca para tus productos
              </p>
            </div>
            
            <Link
              href="/admin/brands"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Volver a Marcas
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <BrandForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}