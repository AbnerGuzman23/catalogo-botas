'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// Procesar una venta completa con descuento automático del inventario
export async function processSale(saleData, items) {
  try {
    // Verificar stock disponible antes de procesar la venta
    for (const item of items) {
      const productSize = await prisma.productSize.findUnique({
        where: {
          productId_size: {
            productId: item.productId,
            size: item.size
          }
        }
      })

      if (!productSize || productSize.quantity < item.quantity) {
        throw new Error(`Stock insuficiente para ${item.productName} talla ${item.size}. Stock disponible: ${productSize?.quantity || 0}`)
      }
    }

    // Usar transacción para garantizar integridad
    const result = await prisma.$transaction(async (tx) => {
      // Crear la venta
      const sale = await tx.sale.create({
        data: {
          total: saleData.total,
          customerName: saleData.customerName || null,
          customerEmail: saleData.customerEmail || null,
          customerPhone: saleData.customerPhone || null,
          status: 'completed'
        }
      })

      // Crear los elementos de venta
      const saleItems = await Promise.all(
        items.map(item => 
          tx.saleItem.create({
            data: {
              saleId: sale.id,
              productId: item.productId,
              size: item.size,
              quantity: item.quantity,
              price: item.price
            }
          })
        )
      )

      // Actualizar inventario (descontar cantidades vendidas)
      await Promise.all(
        items.map(item =>
          tx.productSize.update({
            where: {
              productId_size: {
                productId: item.productId,
                size: item.size
              }
            },
            data: {
              quantity: {
                decrement: item.quantity
              }
            }
          })
        )
      )

      return { sale, saleItems }
    })

    // Revalidar páginas para reflejar el nuevo inventario
    revalidatePath('/')
    revalidatePath('/admin')
    
    return {
      success: true,
      saleId: result.sale.id,
      message: 'Venta procesada exitosamente'
    }

  } catch (error) {
    console.error('Error processing sale:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Obtener todas las ventas (para admin)
export async function getSales(page = 1, limit = 20) {
  try {
    const skip = (page - 1) * limit

    const sales = await prisma.sale.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    const total = await prisma.sale.count()

    return {
      sales,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching sales:', error)
    return { sales: [], pagination: { page: 1, limit, total: 0, pages: 0 } }
  }
}

// Obtener una venta específica
export async function getSaleById(id) {
  try {
    const sale = await prisma.sale.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })
    return sale
  } catch (error) {
    console.error('Error fetching sale:', error)
    return null
  }
}

// Verificar disponibilidad de stock para un producto y talla
export async function checkStock(productId, size) {
  try {
    const productSize = await prisma.productSize.findUnique({
      where: {
        productId_size: {
          productId: parseInt(productId),
          size: size
        }
      }
    })

    return {
      available: productSize?.quantity || 0,
      inStock: (productSize?.quantity || 0) > 0
    }
  } catch (error) {
    console.error('Error checking stock:', error)
    return { available: 0, inStock: false }
  }
}

// Agregar producto al carrito (simulado con localStorage del lado del cliente)
// Esta función valida stock antes de permitir agregar al carrito
export async function validateCartItem(productId, size, quantity) {
  try {
    const stock = await checkStock(productId, size)
    
    if (!stock.inStock) {
      return {
        valid: false,
        error: 'Producto sin stock'
      }
    }

    if (stock.available < quantity) {
      return {
        valid: false,
        error: `Solo hay ${stock.available} unidades disponibles`
      }
    }

    return {
      valid: true,
      available: stock.available
    }
  } catch (error) {
    console.error('Error validating cart item:', error)
    return {
      valid: false,
      error: 'Error al validar el producto'
    }
  }
}