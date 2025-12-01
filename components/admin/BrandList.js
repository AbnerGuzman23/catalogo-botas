'use client'

import Link from 'next/link'
import Image from 'next/image'
import DeleteBrandButton from './DeleteBrandButton'

export default function BrandList({ brands }) {
  if (brands.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No hay marcas creadas
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Comienza creando tu primera marca para organizar mejor tus productos.
        </p>
        <Link
          href="/admin/brands/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <span>+</span>
          <span className="ml-2">Crear primera marca</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Marca
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Productos
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Sitio Web
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {brands.map((brand) => (
            <tr key={brand.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {brand.logoUrl ? (
                    <div className="flex-shrink-0 h-12 w-12 mr-4">
                      <Image
                        src={brand.logoUrl}
                        alt={`Logo ${brand.name}`}
                        width={48}
                        height={48}
                        className="h-12 w-12 object-contain rounded-lg border border-gray-200 dark:border-gray-600"
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 h-12 w-12 mr-4">
                      <div className="h-12 w-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {brand.name}
                    </div>
                    {brand.description && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {brand.description}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {brand._count.products} producto{brand._count.products !== 1 ? 's' : ''}
                </div>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                {brand.website ? (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm underline"
                  >
                    Visitar sitio
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm">-</span>
                )}
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(brand.createdAt).toLocaleDateString('es-ES')}
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center space-x-3">
                  <Link
                    href={`/admin/brands/edit/${brand.id}`}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    title={`Editar ${brand.name}`}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  
                  <DeleteBrandButton
                    brandId={brand.id}
                    brandName={brand.name}
                    hasProducts={brand._count.products > 0}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}