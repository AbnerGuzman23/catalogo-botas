import { getCategoryById, updateCategory } from '@/lib/category-actions'
import { isAdminAuthenticated } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import AdminNavbar from '@/components/admin/AdminNavbar'
import CategoryForm from '@/components/admin/CategoryForm'

export default async function EditCategoryPage({ params }) {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }

  // Await params en Next.js 13+
  const resolvedParams = await params
  const categoryId = parseInt(resolvedParams.id)
  if (isNaN(categoryId)) {
    notFound()
  }

  const category = await getCategoryById(categoryId)
  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Editar Categoría</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Modifica la información de la categoría "{category.name}"
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
          <CategoryForm 
            action={updateCategory} 
            category={category}
            submitText="Actualizar Categoría"
          />
        </div>
      </div>
    </div>
  )
}