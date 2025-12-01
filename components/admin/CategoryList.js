'use client'

import Link from 'next/link'
import DeleteCategoryButton from './DeleteCategoryButton'

export default function CategoryList({ categories }) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">No hay categorías creadas</div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-700"
        >
          Crear primera categoría
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Categoría
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Tallas
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Productos
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {category.icon && (
                    <span className="text-2xl mr-3">{category.icon}</span>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {category.slug}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 dark:text-gray-200 max-w-xs truncate">
                  {category.description || 'Sin descripción'}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {category.sizes && category.sizes.length > 0 ? (
                    category.sizes.slice(0, 3).map((size) => (
                      <span 
                        key={size.id} 
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      >
                        {size.size}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500 dark:text-gray-400">Sin tallas</span>
                  )}
                  {category.sizes && category.sizes.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{category.sizes.length - 3} más
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                {category._count.products} producto(s)
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                <Link
                  href={`/admin/categories/edit/${category.id}`}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white inline-flex items-center"
                  title="Editar categoría"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Link>
                <DeleteCategoryButton 
                  categoryId={category.id} 
                  categoryName={category.name}
                  hasProducts={category._count.products > 0}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}