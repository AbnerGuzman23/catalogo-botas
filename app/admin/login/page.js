import { loginAction } from '@/lib/auth-actions'

export default function AdminLogin({ searchParams }) {
  const error = searchParams?.error

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
              <p className="text-sm text-red-600">{getErrorMessage()}</p>
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
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Iniciar sesión
              </button>
            </div>
          </form>

          <div className="mt-6 bg-gray-50 p-4 rounded-md">
            <p className="text-xs text-gray-500">
              <strong>Credenciales por defecto:</strong><br />
              Usuario: admin<br />
              Contraseña: admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}