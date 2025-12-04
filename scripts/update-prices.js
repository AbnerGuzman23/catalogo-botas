import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updatePrices() {
  console.log('🔄 Actualizando precios a quetzales...')

  const updates = [
    { name: 'Botas Chelsea de Cuero Negro', price: 1162.50 },
    { name: 'Botas de Trabajo de Seguridad', price: 697.50 },
    { name: 'Botas Cowboy de Cuero', price: 1937.50 },
    { name: 'Botas de Montaña Impermeables', price: 1395.00 },
    { name: 'Botines Urbanos Negros', price: 736.25 },
    { name: 'Botas Vaqueras Rosa', price: 1472.50 },
    { name: 'Botas de Cuero Marrón Clásicas', price: 1550.00 },
    { name: 'Botines de Mujer Elegantes', price: 1007.50 },
    { name: 'Botas de Trabajo Industriales', price: 930.00 },
    { name: 'Botas Vaqueras Premium', price: 2325.00 },
    { name: 'Botines de Diseño Moderno', price: 1240.00 },
    { name: 'Botas de Montaña Extremas', price: 2015.00 },
    { name: 'Botas Cowboy Tradicionales', price: 1705.00 },
    { name: 'Botines Western para Mujer', price: 1317.50 },
    { name: 'Botas de Trabajo Ranchero', price: 1085.00 },
    { name: 'Botas de Senderismo Heritage', price: 1472.50 },
    { name: 'Botas Vaqueras Texanas', price: 1395.00 },
    { name: 'Botines Casual Mujer', price: 697.50 },
    { name: 'Botas de Trabajo Electricista', price: 1162.50 }
  ]

  for (const update of updates) {
    try {
      const result = await prisma.product.updateMany({
        where: { name: update.name },
        data: { price: update.price }
      })
      
      if (result.count > 0) {
        console.log(`✅ Actualizado: ${update.name} -> Q${update.price}`)
      } else {
        console.log(`⚠️ No encontrado: ${update.name}`)
      }
    } catch (error) {
      console.error(`❌ Error actualizando ${update.name}:`, error)
    }
  }

  console.log('🎉 Actualización de precios completada!')
}

updatePrices()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })