import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanDatabase() {
  try {
    console.log('🧹 === LIMPIEZA DE BASE DE DATOS ===')
    
    // Eliminar inventario primero (foreign key)
    await prisma.productSize.deleteMany({})
    console.log('✅ Inventario eliminado')
    
    // Eliminar productos
    await prisma.product.deleteMany({})
    console.log('✅ Productos eliminados')
    
    // Verificar que se eliminó todo
    const productCount = await prisma.product.count()
    const inventoryCount = await prisma.productSize.count()
    
    console.log(`📊 Productos restantes: ${productCount}`)
    console.log(`📊 Inventario restante: ${inventoryCount}`)
    
    console.log('✅ === LIMPIEZA COMPLETADA ===')
    
  } catch (error) {
    console.error('❌ Error al limpiar base de datos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanDatabase()