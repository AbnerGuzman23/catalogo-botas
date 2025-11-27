import { getProducts, getAvailableSizes } from '@/lib/actions'
import { isAdminAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminDashboardClient from '@/components/admin/AdminDashboardClient'

// Configurar como página dinámica para evitar errores de renderizado estático
export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  // Verificar autenticación del lado del servidor
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }

  const [products, availableSizes] = await Promise.all([
    getProducts(),
    getAvailableSizes()
  ])

  return <AdminDashboardClient initialProducts={products} initialSizes={availableSizes} />
}