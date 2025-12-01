import { getBrands } from '@/lib/brand-actions'
import Link from 'next/link'
import BrandList from '@/components/admin/BrandList'

export const metadata = {
  title: 'Gestión de Marcas - RR BOOTS Admin',
  description: 'Administra las marcas de productos'
}

export default async function BrandsPage() {
  const brands = await getBrands()
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Marcas
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Administra las marcas de productos de tu catálogo
          </p>
        </div>
        
        <Link
          href="/admin/brands/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <span>+</span>
          Nueva Marca
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Marcas ({brands.length})
          </h2>
        </div>
        
        <BrandList brands={brands} />
      </div>
    </div>
  )
}