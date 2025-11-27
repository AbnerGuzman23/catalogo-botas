import { getProducts, getAvailableSizes } from '@/lib/actions'
import { isAdminAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminDashboardClient from '@/components/admin/AdminDashboardClient'

// Configurar como página dinámica para evitar errores de renderizado estático
export const dynamic = 'force-dynamic'
export const revalidate = 0 // Desactivar cache completamente

export default async function AdminDashboard() {
  // Verificar autenticación del lado del servidor
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }

  const [products, availableSizes] = await Promise.all([
    getProducts(),
    getAvailableSizes()
  ])

  // Debug en servidor
  console.log('🔍 Server-side debug:')
  console.log(`  Products count: ${products.length}`)
  console.log(`  Available sizes: ${availableSizes.join(', ')}`)
  if (products.length > 0) {
    console.log(`  First product: ${products[0].name}`)
  }

  return <AdminDashboardClient initialProducts={products} initialSizes={availableSizes} />
}