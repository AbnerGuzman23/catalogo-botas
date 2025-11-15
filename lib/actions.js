'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Obtener todos los productos
export async function getProducts(sizeFilter = null) {
  try {
    const where = sizeFilter ? { size: sizeFilter } : {}
    
    const products = await prisma.product.findMany({
      where,
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
      where: { id: parseInt(id) }
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
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      size: formData.get('size'),
      imageUrl: formData.get('imageUrl') || null
    }

    await prisma.product.create({ data })
    
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
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      size: formData.get('size'),
      imageUrl: formData.get('imageUrl') || null
    }

    await prisma.product.update({
      where: { id: parseInt(id) },
      data
    })
    
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
    const sizes = await prisma.product.findMany({
      select: { size: true },
      distinct: ['size']
    })
    
    return sizes.map(item => item.size).sort()
  } catch (error) {
    console.error('Error fetching sizes:', error)
    return []
  }
}