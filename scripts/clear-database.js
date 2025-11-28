const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function clearDatabase() {
  try {
    console.log('🗑️ Iniciando limpieza de la base de datos...')
    
    // Eliminar en orden correcto (por las foreign keys)
    console.log('Eliminando registros de ventas...')
    await prisma.sale.deleteMany({})
    
    console.log('Eliminando inventario de productos...')
    await prisma.productSize.deleteMany({})
    
    console.log('Eliminando productos...')
    await prisma.product.deleteMany({})
    
    console.log('Eliminando categorías...')
    await prisma.category.deleteMany({})
    
    console.log('✅ Base de datos limpiada exitosamente!')
    console.log('La aplicación ahora está en blanco y lista para entrega.')
    
  } catch (error) {
    console.error('❌ Error al limpiar la base de datos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearDatabase()