const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrateToCategories() {
  try {
    console.log('🏗️  Iniciando migración a categorías dinámicas...')

    // Primero, crear las categorías por defecto basadas en los productos existentes
    const existingCategories = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category']
    })

    console.log('📊 Categorías encontradas:', existingCategories.map(p => p.category))

    // Mapeo de categorías con sus datos
    const categoryMap = {
      'botas': { name: 'Zapatos', description: 'Calzado western de alta calidad', icon: '👢' },
      'cinturones': { name: 'Cinturones', description: 'Cinturones de cuero auténtico', icon: '⚡' },
      'ropa': { name: 'Ropa', description: 'Vestimenta western y casual', icon: '👔' },
      'accesorios': { name: 'Accesorios', description: 'Complementos y accesorios vaqueros', icon: '🎩' }
    }

    // Crear las nuevas categorías
    const createdCategories = {}
    
    for (const product of existingCategories) {
      const categorySlug = product.category
      const categoryData = categoryMap[categorySlug] || {
        name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
        description: `Productos de ${categorySlug}`,
        icon: '🔶'
      }

      console.log(`📝 Creando categoría: ${categoryData.name}`)
      
      const newCategory = await prisma.category.create({
        data: {
          name: categoryData.name,
          slug: categorySlug,
          description: categoryData.description,
          icon: categoryData.icon
        }
      })
      
      createdCategories[categorySlug] = newCategory.id
    }

    console.log('✅ Categorías creadas:', createdCategories)

    // Ahora necesitamos actualizar la base de datos para agregar categoryId
    // Como SQLite no soporta ADD COLUMN con relaciones, tendremos que hacer esto paso a paso

    console.log('✅ Migración completada. Ahora puedes ejecutar la migración de Prisma.')
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Error durante la migración:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

migrateToCategories()