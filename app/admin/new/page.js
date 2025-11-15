import { createProduct } from '@/lib/actions'
import { isAdminAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminNavbar from '@/components/admin/AdminNavbar'
import ProductForm from '@/components/admin/ProductForm'

export default async function NewProduct() {
  if (!isAdminAuthenticated()) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Producto</h1>
          <p className="text-gray-600">Completa la información del producto</p>
        </div>

        <div className="bg-white shadow-sm rounded-lg">
          <ProductForm action={createProduct} />
        </div>
      </div>
    </div>
  )
}