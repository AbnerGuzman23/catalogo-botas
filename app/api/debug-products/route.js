import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test básico de conexión
    const productCount = await prisma.product.count()
    const categoryCount = await prisma.category.count()

    // Obtener productos básicos sin includes complejos
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        category: true,
        categoryId: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      counts: {
        products: productCount,
        categories: categoryCount
      },
      products: products,
      message: "Database connection successful"
    })

  } catch (error) {
    console.error('Error in debug endpoint:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code || 'UNKNOWN'
    }, { status: 500 })
  }
}