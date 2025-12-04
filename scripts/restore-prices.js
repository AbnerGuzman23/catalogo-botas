import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function restoreOriginalPrices() {
  console.log('🔄 Restaurando precios originales...')

  const originalPrices = [
    { name: 'Botas Chelsea de Cuero Negro', price: 149.99 },
    { name: 'Botas de Trabajo de Seguridad', price: 89.99 },
    { name: 'Botas Cowboy de Cuero', price: 249.99 },
    { name: 'Botas de Montaña Impermeables', price: 179.99 },
    { name: 'Botines Urbanos Negros', price: 94.99 },
    { name: 'Botas Vaqueras Rosa', price: 189.99 },
    { name: 'Botas de Cuero Marrón Clásicas', price: 199.99 },
    { name: 'Botines de Mujer Elegantes', price: 129.99 },
    { name: 'Botas de Trabajo Industriales', price: 119.99 },
    { name: 'Botas Vaqueras Premium', price: 299.99 },
    { name: 'Botines de Diseño Moderno', price: 159.99 },
    { name: 'Botas de Montaña Extremas', price: 259.99 },
    { name: 'Botas Cowboy Tradicionales', price: 219.99 },
    { name: 'Botines Western para Mujer', price: 169.99 },
    { name: 'Botas de Trabajo Ranchero', price: 139.99 },
    { name: 'Botas de Senderismo Heritage', price: 189.99 },
    { name: 'Botas Vaqueras Texanas', price: 179.99 },
    { name: 'Botines Casual Mujer', price: 89.99 },
    { name: 'Botas de Trabajo Electricista', price: 149.99 }
  ]

  for (const restore of originalPrices) {
    try {
      const result = await prisma.product.updateMany({
        where: { name: restore.name },
        data: { price: restore.price }
      })
      
      if (result.count > 0) {
        console.log(`✅ Restaurado: ${restore.name} -> $${restore.price}`)
      } else {
        console.log(`⚠️ No encontrado: ${restore.name}`)
      }
    } catch (error) {
      console.error(`❌ Error restaurando ${restore.name}:`, error)
    }
  }

  console.log('🎉 Precios originales restaurados!')
}

restoreOriginalPrices()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })