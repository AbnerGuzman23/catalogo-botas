const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function linkProductsToCategories() {
  try {
    console.log('🔗 Vinculando productos existentes con categorías...')

    // Obtener la categoría "Zapatos" que ya creamos (con slug "botas")
    const zapatos = await prisma.category.findUnique({
      where: { slug: 'botas' }
    })

    if (!zapatos) {
      console.log('❌ No se encontró la categoría de Zapatos')
      return
    }

    console.log('✅ Categoría encontrada:', zapatos.name, 'ID:', zapatos.id)

    // Obtener todos los productos que tienen category = "botas" pero no tienen categoryId
    const productsToUpdate = await prisma.product.findMany({
      where: {
        category: 'botas',
        categoryId: null
      }
    })

    console.log(`📦 Productos a vincular: ${productsToUpdate.length}`)

    if (productsToUpdate.length > 0) {
      // Actualizar todos los productos para vincularlos con la categoría
      const result = await prisma.product.updateMany({
        where: {
          category: 'botas',
          categoryId: null
        },
        data: {
          categoryId: zapatos.id
        }
      })

      console.log(`✅ ${result.count} productos vinculados exitosamente`)
    } else {
      console.log('ℹ️ No hay productos que vincular')
    }

    // Verificar el resultado
    const updatedProducts = await prisma.product.findMany({
      where: { categoryId: zapatos.id },
      select: { id: true, name: true, category: true, categoryId: true }
    })

    console.log('🎯 Productos vinculados:', updatedProducts.length)
    updatedProducts.forEach(p => {
      console.log(`  - ${p.name} (ID: ${p.id}, CategoryID: ${p.categoryId})`)
    })

    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Error durante la vinculación:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

linkProductsToCategories()