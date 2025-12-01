import BrandForm from '@/components/admin/BrandForm'
import Link from 'next/link'

export const metadata = {
  title: 'Nueva Marca - RR BOOTS Admin',
  description: 'Crear nueva marca'
}

export default function NewBrandPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
  )
}