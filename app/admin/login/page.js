import { loginAction } from '@/lib/auth-actions'
import { cookies } from 'next/headers'

// Configurar como página dinámica para manejar cookies
export const dynamic = 'force-dynamic'

export default async function AdminLogin() {
  // Leer error desde cookie
  const cookieStore = await cookies()
  const errorCookie = cookieStore.get('login-error')
  const error = errorCookie?.value

  // Limpiar la cookie de error después de leerla
  if (error) {
    cookieStore.delete('login-error')
  }

  const getErrorMessage = () => {
    switch (error) {
      case 'invalid':
        return 'Credenciales incorrectas. Verifica tu usuario y contraseña.'
      case 'missing':
        return 'Por favor, ingresa tu usuario y contraseña.'
      case 'server':
        return 'Error interno del servidor. Inténtalo nuevamente.'
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          RR BOOTS - Acceso Administrativo
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ingresa tus credenciales para acceder al panel de administración
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">❌ {getErrorMessage()}</p>
            </div>
          )}
          
          <form action={loginAction} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Usuario
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  defaultValue="admin"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                  placeholder="Nombre de usuario"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                  placeholder="Contraseña"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-800 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
              >
                Iniciar sesión
              </button>
            </div>
          </form>

          <div className="mt-6 bg-amber-50 p-4 rounded-md border border-amber-200">
            <p className="text-xs text-amber-800">
              <strong>💡 Para probar:</strong><br />
              Usuario: <code className="bg-amber-100 px-1 rounded">admin</code><br />
              Contraseña: <code className="bg-amber-100 px-1 rounded">admin123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}