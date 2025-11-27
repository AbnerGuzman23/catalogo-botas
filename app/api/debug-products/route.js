import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Verificar productos directamente
    const products = await prisma.product.findMany({
      include: {
        categoryRel: true,
        inventory: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Verificar categorías
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    // Verificar tallas
    const sizes = await prisma.productSize.findMany({
      where: { quantity: { gt: 0 } },
      select: { size: true },
      distinct: ['size']
    })

    return NextResponse.json({
      success: true,
      data: {
        products: products.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          categoryId: p.categoryId,
          categoryRel: p.categoryRel?.name || null,
          inventoryCount: p.inventory?.length || 0,
          createdAt: p.createdAt
        })),
        categories: categories.map(c => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          productCount: c._count.products
        })),
        availableSizes: sizes.map(s => s.size).sort(),
        summary: {
          totalProducts: products.length,
          totalCategories: categories.length,
          totalSizes: sizes.length
        }
      }
    })

  } catch (error) {
    console.error('Error in debug endpoint:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}