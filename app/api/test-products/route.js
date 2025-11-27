import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/actions'

export async function GET() {
  try {
    const products = await getProducts()
    
    return NextResponse.json({
      success: true,
      count: products.length,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        createdAt: p.createdAt
      }))
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code
    }, { status: 500 })
  }
}