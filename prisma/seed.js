import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with categories and products...')

  // Primero crear marcas
  const brandData = [
    {
      name: 'Western Classic',
      slug: 'western-classic',
      description: 'Marca tradicional de productos western de alta calidad'
    },
    {
      name: 'RR Originals',
      slug: 'rr-originals',
      description: 'Línea exclusiva de productos western premium'
    },
    {
      name: 'Cowboy Heritage',
      slug: 'cowboy-heritage',
      description: 'Productos authentic western con tradición'
    }
  ]

  for (const brand of brandData) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      create: brand,
      update: {
        name: brand.name,
        description: brand.description
      }
    })
    console.log(`✅ Created/Updated brand: ${brand.name}`)
  }

  // Primero crear categorías
  const categories = [
    {
      name: 'Botas Vaqueras',
      slug: 'botas-vaqueras',
      description: 'Botas tradicionales de estilo cowboy y western',
      icon: '🤠',
      sizes: {
        create: [
          { size: '38', order: 0 },
          { size: '39', order: 1 },
          { size: '40', order: 2 },
          { size: '41', order: 3 },
          { size: '42', order: 4 },
          { size: '43', order: 5 },
          { size: '44', order: 6 },
          { size: '45', order: 7 }
        ]
      }
    },
    {
      name: 'Botas de Trabajo',
      slug: 'botas-trabajo',
      description: 'Botas resistentes para trabajo pesado y seguridad',
      icon: '⚒️',
      sizes: {
        create: [
          { size: '39', order: 0 },
          { size: '40', order: 1 },
          { size: '41', order: 2 },
          { size: '42', order: 3 },
          { size: '43', order: 4 },
          { size: '44', order: 5 },
          { size: '45', order: 6 }
        ]
      }
    },
    {
      name: 'Botines',
      slug: 'botines',
      description: 'Botines elegantes para uso casual y formal',
      icon: '👢',
      sizes: {
        create: [
          { size: 'S', order: 0 },
          { size: 'M', order: 1 },
          { size: 'L', order: 2 },
          { size: 'XL', order: 3 },
          { size: '36', order: 4 },
          { size: '37', order: 5 },
          { size: '38', order: 6 },
          { size: '39', order: 7 },
          { size: '40', order: 8 }
        ]
      }
    },
    {
      name: 'Botas de Montaña',
      slug: 'botas-montana',
      description: 'Botas especializadas para actividades outdoor',
      icon: '🏔️',
      sizes: {
        create: [
          { size: '40', order: 0 },
          { size: '41', order: 1 },
          { size: '42', order: 2 },
          { size: '43', order: 3 },
          { size: '44', order: 4 },
          { size: '45', order: 5 },
          { size: '46', order: 6 }
        ]
      }
    }
  ]

  for (const categoryData of categories) {
    await prisma.category.upsert({
      where: { slug: categoryData.slug },
      create: categoryData,
      update: {
        name: categoryData.name,
        description: categoryData.description,
        icon: categoryData.icon
      }
    })
    console.log(`✅ Created/Updated category: ${categoryData.name}`)
  }

  console.log('📦 Creating sample products...')

  console.log('📦 Creating sample products...')

  // Obtener las categorías y marcas creadas
  const vaqueras = await prisma.category.findUnique({ where: { slug: 'botas-vaqueras' } })
  const trabajo = await prisma.category.findUnique({ where: { slug: 'botas-trabajo' } })
  const botines = await prisma.category.findUnique({ where: { slug: 'botines' } })
  const montana = await prisma.category.findUnique({ where: { slug: 'botas-montana' } })

  const westernClassic = await prisma.brand.findUnique({ where: { slug: 'western-classic' } })
  const rrOriginals = await prisma.brand.findUnique({ where: { slug: 'rr-originals' } })
  const cowboyHeritage = await prisma.brand.findUnique({ where: { slug: 'cowboy-heritage' } })

  const products = [
    {
      name: 'Botas Chelsea de Cuero Negro',
      description: 'Elegantes botas Chelsea de cuero genuino con banda elástica lateral. Perfectas para looks casuales y formales.',
      price: 149.99,
      gender: 'hombre',
      category: 'botines',
      categoryId: botines.id,
      brandId: westernClassic.id,
      imageUrl: 'https://picsum.photos/400/400?random=1'
    },
    {
      name: 'Botas de Trabajo de Seguridad',
      description: 'Botas robustas con puntera de acero, ideales para trabajos pesados. Suela antideslizante y resistente al agua.',
      price: 89.99,
      gender: 'unisex',
      category: 'botas-trabajo',
      categoryId: trabajo.id,
      brandId: rrOriginals.id,
      imageUrl: 'https://picsum.photos/400/400?random=2'
    },
    {
      name: 'Botas Cowboy de Cuero',
      description: 'Auténticas botas estilo cowboy de cuero genuino. Diseño clásico americano con costuras decorativas.',
      price: 249.99,
      gender: 'hombre',
      category: 'botas-vaqueras',
      categoryId: vaqueras.id,
      brandId: cowboyHeritage.id,
      imageUrl: 'https://picsum.photos/400/400?random=7'
    },
    {
      name: 'Botas de Montaña Impermeables',
      description: 'Botas de senderismo impermeables con excelente tracción. Perfectas para caminatas y actividades de montaña.',
      price: 179.99,
      gender: 'unisex',
      category: 'botas-montana',
      categoryId: montana.id,
      brandId: westernClassic.id,
      imageUrl: 'https://picsum.photos/400/400?random=6'
    },
    {
      name: 'Botines Urbanos Negros',
      description: 'Botines modernos de cuero negro con cierre lateral. Ideales para looks urbanos y casuales.',
      price: 94.99,
      gender: 'mujer',
      category: 'botines',
      categoryId: botines.id,
      brandId: rrOriginals.id,
      imageUrl: 'https://picsum.photos/400/400?random=8'
    },
    {
      name: 'Botas Vaqueras Rosa',
      description: 'Botas vaqueras especialmente diseñadas para mujer con detalles elegantes en rosa.',
      price: 189.99,
      gender: 'mujer',
      category: 'botas-vaqueras',
      categoryId: vaqueras.id,
      brandId: cowboyHeritage.id,
      imageUrl: 'https://picsum.photos/400/400?random=9'
    },
    // Nuevos productos para Western Classic
    {
      name: 'Botas de Cuero Marrón Clásicas',
      description: 'Botas de cuero marrón tradicionales con diseño clásico western. Perfectas para uso diario.',
      price: 199.99,
      gender: 'hombre',
      category: 'botas-vaqueras',
      categoryId: vaqueras.id,
      brandId: westernClassic.id,
      imageUrl: 'https://picsum.photos/400/400?random=10'
    },
    {
      name: 'Botines de Mujer Elegantes',
      description: 'Botines de tacón medio con acabado premium. Ideales para ocasiones especiales.',
      price: 129.99,
      gender: 'mujer',
      category: 'botines',
      categoryId: botines.id,
      brandId: westernClassic.id,
      imageUrl: 'https://picsum.photos/400/400?random=11'
    },
    {
      name: 'Botas de Trabajo Industriales',
      description: 'Botas de trabajo reforzadas con protección química y antideslizante para industria pesada.',
      price: 119.99,
      gender: 'unisex',
      category: 'botas-trabajo',
      categoryId: trabajo.id,
      brandId: westernClassic.id,
      imageUrl: 'https://picsum.photos/400/400?random=12'
    },
    // Nuevos productos para RR Originals
    {
      name: 'Botas Vaqueras Premium',
      description: 'Línea premium de botas vaqueras con detalles artesanales y cuero de primera calidad.',
      price: 299.99,
      gender: 'hombre',
      category: 'botas-vaqueras',
      categoryId: vaqueras.id,
      brandId: rrOriginals.id,
      imageUrl: 'https://picsum.photos/400/400?random=13'
    },
    {
      name: 'Botines de Diseño Moderno',
      description: 'Botines con diseño contemporáneo y materiales innovadores. Comodidad y estilo únicos.',
      price: 159.99,
      gender: 'mujer',
      category: 'botines',
      categoryId: botines.id,
      brandId: rrOriginals.id,
      imageUrl: 'https://picsum.photos/400/400?random=14'
    },
    {
      name: 'Botas de Montaña Extremas',
      description: 'Botas técnicas para montañismo extremo. Resistentes a temperaturas bajo cero.',
      price: 259.99,
      gender: 'unisex',
      category: 'botas-montana',
      categoryId: montana.id,
      brandId: rrOriginals.id,
      imageUrl: 'https://picsum.photos/400/400?random=15'
    },
    // Nuevos productos para Cowboy Heritage
    {
      name: 'Botas Cowboy Tradicionales',
      description: 'Botas cowboy con diseño tradicional texano. Auténtico estilo del viejo oeste.',
      price: 219.99,
      gender: 'hombre',
      category: 'botas-vaqueras',
      categoryId: vaqueras.id,
      brandId: cowboyHeritage.id,
      imageUrl: 'https://picsum.photos/400/400?random=16'
    },
    {
      name: 'Botines Western para Mujer',
      description: 'Botines estilo western especialmente diseñados para mujer con detalles únicos.',
      price: 169.99,
      gender: 'mujer',
      category: 'botines',
      categoryId: botines.id,
      brandId: cowboyHeritage.id,
      imageUrl: 'https://picsum.photos/400/400?random=17'
    },
    {
      name: 'Botas de Trabajo Ranchero',
      description: 'Botas robustas para trabajo de rancho y ganadería. Resistentes y cómodas.',
      price: 139.99,
      gender: 'unisex',
      category: 'botas-trabajo',
      categoryId: trabajo.id,
      brandId: cowboyHeritage.id,
      imageUrl: 'https://picsum.photos/400/400?random=18'
    },
    {
      name: 'Botas de Senderismo Heritage',
      description: 'Botas de montaña con estilo heritage. Combina tradición con tecnología moderna.',
      price: 189.99,
      gender: 'unisex',
      category: 'botas-montana',
      categoryId: montana.id,
      brandId: cowboyHeritage.id,
      imageUrl: 'https://picsum.photos/400/400?random=19'
    },
    // Productos adicionales variados
    {
      name: 'Botas Vaqueras Texanas',
      description: 'Botas vaqueras auténticas de Texas con punta cuadrada y tacón bajo.',
      price: 179.99,
      gender: 'hombre',
      category: 'botas-vaqueras',
      categoryId: vaqueras.id,
      brandId: westernClassic.id,
      imageUrl: 'https://picsum.photos/400/400?random=20'
    },
    {
      name: 'Botines Casual Mujer',
      description: 'Botines casuales perfectos para el día a día. Combina comodidad y estilo.',
      price: 89.99,
      gender: 'mujer',
      category: 'botines',
      categoryId: botines.id,
      brandId: rrOriginals.id,
      imageUrl: 'https://picsum.photos/400/400?random=21'
    },
    {
      name: 'Botas de Trabajo Electricista',
      description: 'Botas especializadas para electricistas con protección dieléctrica y suela aislante.',
      price: 149.99,
      gender: 'unisex',
      category: 'botas-trabajo',
      categoryId: trabajo.id,
      brandId: westernClassic.id,
      imageUrl: 'https://picsum.photos/400/400?random=22'
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