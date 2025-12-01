import { getBrandById } from '@/lib/brand-actions'
import BrandForm from '@/components/admin/BrandForm'
import AdminNavbar from '@/components/admin/AdminNavbar'
import { isAdminAuthenticated } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

export async function generateMetadata({ params }) {
  const brand = await getBrandById(params.id)
  
  if (!brand) {
    return {
      title: 'Marca no encontrada - RR BOOTS Admin'
    }
  }
  
  return {
    title: `Editar ${brand.name} - RR BOOTS Admin`,
    description: `Editar la marca ${brand.name}`
  }
}

export default async function EditBrandPage({ params }) {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }
  
  const brand = await getBrandById(params.id)
  
  if (!brand) {
    notFound()
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Editar Marca: {brand.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Modifica la información de la marca
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
              <BrandForm brand={brand} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}