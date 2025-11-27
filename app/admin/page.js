import { getProducts, getAvailableSizes } from '@/lib/actions'
import { isAdminAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminDashboardClient from '@/components/admin/AdminDashboardClient'

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