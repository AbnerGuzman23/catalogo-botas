import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with sample products...')

  const products = [
    {
      name: 'Botas Chelsea de Cuero Negro',
      description: 'Elegantes botas Chelsea de cuero genuino con banda elástica lateral. Perfectas para looks casuales y formales.',
      price: 149.99,
      size: '42',
      imageUrl: 'https://picsum.photos/400/400?random=1'
    },
    {
      name: 'Botas de Trabajo de Seguridad',
      description: 'Botas robustas con puntera de acero, ideales para trabajos pesados. Suela antideslizante y resistente al agua.',
      price: 89.99,
      size: '43',
      imageUrl: 'https://picsum.photos/400/400?random=2'
    },
    {
      name: 'Botas Altas de Cuero Marrón',
      description: 'Botas altas de cuero marrón con cordones. Estilo vintage perfecto para el otoño e invierno.',
      price: 199.99,
      size: '40',
      imageUrl: 'https://picsum.photos/400/400?random=3'
    },
    {
      name: 'Botas Militares Tácticas',
      description: 'Botas resistentes de estilo militar con suela de goma resistente. Perfectas para aventuras al aire libre.',
      price: 129.99,
      size: '44',
      imageUrl: 'https://picsum.photos/400/400?random=4'
    },
    {
      name: 'Botines de Gamuza Beige',
      description: 'Botines elegantes de gamuza en tono beige. Tacón medio y diseño sofisticado para ocasiones especiales.',
      price: 119.99,
      size: '38',
      imageUrl: 'https://picsum.photos/400/400?random=5'
    },
    {
      name: 'Botas de Montaña Impermeables',
      description: 'Botas de senderismo impermeables con excelente tracción. Perfectas para caminatas y actividades de montaña.',
      price: 179.99,
      size: '41',
      imageUrl: 'https://picsum.photos/400/400?random=6'
    },
    {
      name: 'Botas Cowboy de Cuero',
      description: 'Auténticas botas estilo cowboy de cuero genuino. Diseño clásico americano con costuras decorativas.',
      price: 249.99,
      size: '42',
      imageUrl: 'https://picsum.photos/400/400?random=7'
    },
    {
      name: 'Botines Urbanos Negros',
      description: 'Botines modernos de cuero negro con cierre lateral. Ideales para looks urbanos y casuales.',
      price: 94.99,
      size: '39',
      imageUrl: 'https://picsum.photos/400/400?random=8'
    }
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
    console.log(`✅ Created product: ${product.name}`)
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