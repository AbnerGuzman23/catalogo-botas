import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('🔍 === VERIFICACIÓN DE BASE DE DATOS ===')
    
    // Verificar productos
    const allProducts = await prisma.product.findMany({
      include: {
        categoryRel: true,
        inventory: true
      }
    })
    
    console.log(`📦 Total productos encontrados: ${allProducts.length}`)
    
    if (allProducts.length > 0) {
      console.log('\n📋 Lista de productos:')
      allProducts.forEach(product => {
        console.log(`  - ID: ${product.id}`)
        console.log(`    Nombre: ${product.name}`)
        console.log(`    Categoría: ${product.category} (ID: ${product.categoryId})`)
        console.log(`    Relación categoría: ${product.categoryRel?.name || 'NULL'}`)
        console.log(`    Inventario: ${product.inventory?.length || 0} tallas`)
        console.log(`    Fecha: ${product.createdAt}`)
        console.log('')
      })
    }
    
    // Verificar categorías
    const allCategories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        },
        products: {
          select: { id: true, name: true }
        }
      }
    })
    
    console.log(`📁 Total categorías encontradas: ${allCategories.length}`)
    
    if (allCategories.length > 0) {
      console.log('\n📂 Lista de categorías:')
      allCategories.forEach(category => {
        console.log(`  - ID: ${category.id}`)
        console.log(`    Nombre: ${category.name}`)
        console.log(`    Slug: ${category.slug}`)
        console.log(`    Productos asociados: ${category._count.products}`)
        if (category.products.length > 0) {
          console.log(`    Productos: ${category.products.map(p => p.name).join(', ')}`)
        }
        console.log('')
      })
    }
    
    // Verificar inventario
    const allInventory = await prisma.productSize.findMany()
    console.log(`📦 Total registros de inventario: ${allInventory.length}`)
    
    // Verificar tallas disponibles
    const availableSizes = await prisma.productSize.findMany({
      where: { quantity: { gt: 0 } },
      select: { size: true },
      distinct: ['size']
    })
    console.log(`📏 Tallas con stock: ${availableSizes.map(s => s.size).join(', ')}`)
    
    console.log('\n✅ === VERIFICACIÓN COMPLETADA ===')
    
  } catch (error) {
    console.error('❌ Error al verificar base de datos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()