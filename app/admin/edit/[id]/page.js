import { updateProduct, getProductById } from '@/lib/actions'
import { getCategories } from '@/lib/category-actions'
import { isAdminAuthenticated } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import AdminNavbar from '@/components/admin/AdminNavbar'
import ProductForm from '@/components/admin/ProductForm'

export default async function EditProduct(props) {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }

  const params = await props.params
  const product = await getProductById(params.id)
  
  if (!product) {
    notFound()
  }

  // Obtener categorías dinámicas de la base de datos
  const categories = await getCategories()

  const updateProductWithId = updateProduct.bind(null, params.id)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Editar Producto</h1>
          <p className="text-gray-600 dark:text-gray-300">Modifica la información del producto</p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <ProductForm action={updateProductWithId} product={product} categories={categories} />
        </div>
      </div>
    </div>
  )
}