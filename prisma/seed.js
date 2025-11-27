import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with categories and products...')

  // Primero crear categorías
  const categories = [
    {
      name: 'Botas Vaqueras',
      slug: 'botas-vaqueras',
      description: 'Botas tradicionales de estilo cowboy y western',
      icon: '🤠',
      hasSizes: true,
      hasColors: true,
      hasMaterials: true
    },
    {
      name: 'Botas de Trabajo',
      slug: 'botas-trabajo',
      description: 'Botas resistentes para trabajo pesado y seguridad',
      icon: '⚒️',
      hasSizes: true,
      hasColors: false,
      hasMaterials: true
    },
    {
      name: 'Botines',
      slug: 'botines',
      description: 'Botines elegantes para uso casual y formal',
      icon: '👢',
      hasSizes: true,
      hasColors: true,
      hasMaterials: true
    },
    {
      name: 'Botas de Montaña',
      slug: 'botas-montana',
      description: 'Botas especializadas para actividades outdoor',
      icon: '🏔️',
      hasSizes: true,
      hasColors: false,
      hasMaterials: true
    }
  ]

  for (const categoryData of categories) {
    await prisma.category.upsert({
      where: { slug: categoryData.slug },
      create: categoryData,
      update: categoryData
    })
    console.log(`✅ Created/Updated category: ${categoryData.name}`)
  }

  console.log('📦 Creating sample products...')

  console.log('📦 Creating sample products...')

  // Obtener las categorías creadas
  const vaqueras = await prisma.category.findUnique({ where: { slug: 'botas-vaqueras' } })
  const trabajo = await prisma.category.findUnique({ where: { slug: 'botas-trabajo' } })
  const botines = await prisma.category.findUnique({ where: { slug: 'botines' } })
  const montana = await prisma.category.findUnique({ where: { slug: 'botas-montana' } })

  const products = [
    {
      name: 'Botas Chelsea de Cuero Negro',
      description: 'Elegantes botas Chelsea de cuero genuino con banda elástica lateral. Perfectas para looks casuales y formales.',
      price: 149.99,
      category: 'botines',
      categoryId: botines.id,
      imageUrl: 'https://picsum.photos/400/400?random=1'
    },
    {
      name: 'Botas de Trabajo de Seguridad',
      description: 'Botas robustas con puntera de acero, ideales para trabajos pesados. Suela antideslizante y resistente al agua.',
      price: 89.99,
      category: 'botas-trabajo',
      categoryId: trabajo.id,
      imageUrl: 'https://picsum.photos/400/400?random=2'
    },
    {
      name: 'Botas Cowboy de Cuero',
      description: 'Auténticas botas estilo cowboy de cuero genuino. Diseño clásico americano con costuras decorativas.',
      price: 249.99,
      category: 'botas-vaqueras',
      categoryId: vaqueras.id,
      imageUrl: 'https://picsum.photos/400/400?random=7'
    },
    {
      name: 'Botas de Montaña Impermeables',
      description: 'Botas de senderismo impermeables con excelente tracción. Perfectas para caminatas y actividades de montaña.',
      price: 179.99,
      category: 'botas-montana',
      categoryId: montana.id,
      imageUrl: 'https://picsum.photos/400/400?random=6'
    },
    {
      name: 'Botines Urbanos Negros',
      description: 'Botines modernos de cuero negro con cierre lateral. Ideales para looks urbanos y casuales.',
      price: 94.99,
      category: 'botines',
      categoryId: botines.id,
      imageUrl: 'https://picsum.photos/400/400?random=8'
    }
  ]

  for (const product of products) {
    // Verificar si el producto ya existe antes de crear
    const existingProduct = await prisma.product.findFirst({
      where: { name: product.name }
    })

    let createdProduct
    if (existingProduct) {
      console.log(`⚠️ Product already exists: ${product.name} - Skipping`)
      createdProduct = existingProduct
    } else {
      createdProduct = await prisma.product.create({
        data: product
      })
      console.log(`✅ Created product: ${product.name}`)
    }

    // Verificar si ya tiene inventario antes de crear
    const existingInventory = await prisma.productSize.count({
      where: { productId: createdProduct.id }
    })

    if (existingInventory === 0) {
      // Crear inventario de tallas para cada producto
      const sizes = ['38', '39', '40', '41', '42', '43', '44']
      const sizeInventory = sizes.map(size => ({
        productId: createdProduct.id,
        size,
        quantity: Math.floor(Math.random() * 10) + 1 // 1-10 items por talla
      }))

      await prisma.productSize.createMany({
        data: sizeInventory
      })
      console.log(`📦 Created inventory for ${product.name}`)
    } else {
      console.log(`📦 Inventory already exists for ${product.name}`)
    }
  }

  console.log('🎉 Seeding completed successfully!')
  console.log(`📊 Total products created: ${products.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })