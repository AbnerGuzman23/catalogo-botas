import { getCategories } from '@/lib/category-actions'
import { isAdminAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminNavbar from '@/components/admin/AdminNavbar'
import CategoryList from '@/components/admin/CategoryList'
import Link from 'next/link'

// Configurar como página dinámica para evitar errores de renderizado estático
export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }

  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Categorías</h1>
            <p className="text-gray-600 dark:text-gray-300">Administra las categorías de productos de tu catálogo</p>
          </div>
          
          <Link
            href="/admin/categories/new"
            className="bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nueva Categoría
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Categorías ({categories.length})
            </h2>
          </div>
          
          <CategoryList categories={categories} />
        </div>
      </div>
    </div>
  )
}