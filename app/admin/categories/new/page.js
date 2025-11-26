import { createCategory } from '@/lib/category-actions'
import { isAdminAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminNavbar from '@/components/admin/AdminNavbar'
import CategoryForm from '@/components/admin/CategoryForm'

export default async function NewCategoryPage() {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nueva Categoría</h1>
          <p className="text-gray-600 dark:text-gray-300">Crea una nueva categoría para organizar tus productos</p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
          <CategoryForm action={createCategory} />
        </div>
      </div>
    </div>
  )
}