'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Obtener todos los productos
export async function getProducts(sizeFilter = null, categoryFilter = null) {
  try {
    const where = {}
    
    // Para filtrar por talla, ahora buscamos en la tabla ProductSize
    if (sizeFilter) {
      where.inventory = {
        some: {
          size: sizeFilter,
          quantity: { gt: 0 } // Solo productos con stock
        }
      }
    }
    
    if (categoryFilter) {
      // Buscar por el slug de la categoría
      where.categoryRel = {
        slug: categoryFilter
      }
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        categoryRel: true,
        inventory: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

// Obtener un producto por ID
export async function getProductById(id) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        categoryRel: true,
        inventory: {
          orderBy: { size: 'asc' }
        }
      }
    })
    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

// Crear nuevo producto
export async function createProduct(formData) {
  try {
    const categorySlug = formData.get('category') || 'botas'
    
    // Buscar la categoría por slug para obtener el ID
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug }
    })

    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      category: categorySlug, // Mantener por compatibilidad
      categoryId: category?.id || null, // Relación foreign key
      imageUrl: formData.get('imageUrl') || null
    }

    // Crear el producto
    const product = await prisma.product.create({ data })

    // Obtener los datos de inventario del FormData
    const sizeInventory = []
    const seenSizes = new Set()
    
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('sizes[') && key.endsWith(']')) {
        const size = key.slice(6, -1) // Extraer la talla
        const quantity = parseInt(value)
        
        // Evitar duplicados
        if (quantity > 0 && !seenSizes.has(size)) {
          seenSizes.add(size)
          sizeInventory.push({
            productId: product.id,
            size,
            quantity
          })
        }
      }
    }

    // Crear las entradas de inventario
    if (sizeInventory.length > 0) {
      await prisma.productSize.createMany({
        data: sizeInventory
      })
    }
    
    revalidatePath('/')
    revalidatePath('/admin')
  } catch (error) {
    console.error('Error creating product:', error)
    throw new Error('Error al crear el producto')
  }
  
  redirect('/admin')
}

// Actualizar producto
export async function updateProduct(id, formData) {
  try {
    const categorySlug = formData.get('category') || 'botas'
    
    // Buscar la categoría por slug para obtener el ID
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug }
    })

    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      category: categorySlug, // Mantener por compatibilidad
      categoryId: category?.id || null, // Relación foreign key
      imageUrl: formData.get('imageUrl') || null
    }

    // Actualizar el producto
    await prisma.product.update({
      where: { id: parseInt(id) },
      data
    })

    // Eliminar inventario existente
    await prisma.productSize.deleteMany({
      where: { productId: parseInt(id) }
    })

    // Obtener los nuevos datos de inventario del FormData
    const sizeInventory = []
    const seenSizes = new Set()
    
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('sizes[') && key.endsWith(']')) {
        const size = key.slice(6, -1) // Extraer la talla
        const quantity = parseInt(value)
        
        // Evitar duplicados
        if (quantity > 0 && !seenSizes.has(size)) {
          seenSizes.add(size)
          sizeInventory.push({
            productId: parseInt(id),
            size,
            quantity
          })
        }
      }
    }

    // Crear las nuevas entradas de inventario
    if (sizeInventory.length > 0) {
      await prisma.productSize.createMany({
        data: sizeInventory
      })
    }
    
    revalidatePath('/')
    revalidatePath('/admin')
  } catch (error) {
    console.error('Error updating product:', error)
    throw new Error('Error al actualizar el producto')
  }
  
  redirect('/admin')
}

// Eliminar producto
export async function deleteProduct(id) {
  try {
    await prisma.product.delete({
      where: { id: parseInt(id) }
    })
    
    revalidatePath('/')
    revalidatePath('/admin')
  } catch (error) {
    console.error('Error deleting product:', error)
    throw new Error('Error al eliminar el producto')
  }
}

// Obtener tallas únicas para el filtro
export async function getAvailableSizes() {
  try {
    const sizes = await prisma.productSize.findMany({
      where: {
        quantity: { gt: 0 } // Solo tallas con stock
      },
      select: { size: true },
      distinct: ['size']
    })
    
    return sizes.map(item => item.size).sort()
  } catch (error) {
    console.error('Error fetching sizes:', error)
    return []
  }
}