import { getSiteConfig, updateSiteConfig } from '@/lib/actions'
import { isAdminAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminNavbar from '@/components/admin/AdminNavbar'
import SettingsForm from '@/components/admin/SettingsForm'

export default async function AdminSettings() {
  // Verificar autenticación del lado del servidor
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }

  const siteConfig = await getSiteConfig()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configuración del Sitio</h1>
          <p className="text-gray-600 dark:text-gray-300">Personaliza el logo y la información de tu tienda</p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Información General
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Configura el nombre, descripción y logo de tu sitio web
            </p>
          </div>
          
          <div className="p-6">
            <SettingsForm siteConfig={siteConfig} />
          </div>
        </div>
      </div>
    </div>
  )
}