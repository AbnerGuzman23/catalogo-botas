import { getProducts } from '@/lib/actions'
import { isAdminAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminNavbar from '@/components/admin/AdminNavbar'
import AdminProductList from '@/components/admin/AdminProductList'
import Link from 'next/link'

export default async function AdminDashboard() {
  // Verificar autenticación del lado del servidor
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }

  const products = await getProducts()

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">RR BOOTS - Panel Administrativo</h1>
            <p className="text-gray-600">Gestiona los artículos western de tu catálogo</p>
          </div>
          
          <Link
            href="/admin/new"
            className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Producto
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Productos ({products.length})
            </h2>
          </div>
          
          <AdminProductList products={products} />
        </div>
      </div>
    </div>
  )
}