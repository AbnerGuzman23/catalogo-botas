'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult('')

    const formData = new FormData(e.target)
    const username = formData.get('username')
    const password = formData.get('password')

    console.log('🔄 Iniciando debug login...')
    setResult('🔄 Procesando login...')

    try {
      const response = await fetch('/api/debug-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()
      console.log('📥 Respuesta del servidor:', data)

      if (data.success) {
        setResult('✅ Login exitoso! Redirigiendo...')
        setTimeout(() => {
          router.push('/admin')
        }, 1000)
      } else {
        setResult(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      console.error('💥 Error en fetch:', error)
      setResult(`💥 Error de conexión: ${error.message}`)
    }

    setLoading(false)
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
          
          {result && (
            <div className={`mb-4 p-3 rounded-md border ${
              result.includes('✅') ? 'bg-green-50 border-green-200 text-green-600' :
              result.includes('❌') || result.includes('💥') ? 'bg-red-50 border-red-200 text-red-600' :
              'bg-blue-50 border-blue-200 text-blue-600'
            }`}>
              <p className="text-sm font-mono">{result}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Usuario
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
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
                  autoComplete="current-password"
                  required
                  defaultValue="admin123"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                  placeholder="Contraseña"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50"
              >
                {loading ? 'Procesando...' : 'Iniciar sesión'}
              </button>
            </div>
          </form>

          <div className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200">
            <p className="text-xs text-gray-800">
              <strong>💡 Credenciales de prueba:</strong><br />
              Usuario: <code className="bg-gray-100 px-1 rounded">admin</code><br />
              Contraseña: <code className="bg-gray-100 px-1 rounded">admin123</code>
            </p>
          </div>

          <div className="mt-4 bg-blue-50 p-4 rounded-md border border-blue-200">
            <p className="text-xs text-blue-800">
              🔧 <strong>DEBUG:</strong> Los resultados aparecerán arriba y en la consola (F12)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
