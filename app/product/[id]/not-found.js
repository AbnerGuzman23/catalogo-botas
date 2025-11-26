import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-stone-100 flex items-center justify-center">
      <div className="text-center bg-white p-12 rounded-2xl shadow-2xl border border-amber-200 max-w-md mx-4">
        <div className="text-8xl mb-6">🤠</div>
        <h2 className="text-3xl font-bold text-amber-900 mb-4">
          Producto No Encontrado
        </h2>
        <p className="text-stone-600 mb-8 leading-relaxed">
          Lo sentimos, el producto que buscas no existe o ya no está disponible en nuestro catálogo.
        </p>
        <Link 
          href="/"
          className="inline-block bg-amber-800 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          ← Volver al Catálogo
        </Link>
      </div>
    </div>
  )
}