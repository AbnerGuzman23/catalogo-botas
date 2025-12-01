'use server'

import { prisma } from './prisma'
import { revalidatePath } from 'next/cache'

// Obtener todas las categorías
export async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true }
        },
        sizes: {
          orderBy: { order: 'asc' }
        }
      }
    })
  } catch (error) {
    console.error('Error al obtener categorías:', error)
    throw new Error('Error al obtener categorías')
  }
}

// Obtener una categoría por ID
export async function getCategoryById(id) {
  try {
    return await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { products: true }
        },
        sizes: {
          orderBy: { order: 'asc' }
        }
      }
    })
  } catch (error) {
    console.error('Error al obtener categoría:', error)
    return null
  }
}

// Crear una nueva categoría
export async function createCategory(formData) {
  try {
    const name = formData.get('name')
    const description = formData.get('description') || null
    const icon = formData.get('icon') || null
    
    if (!name) {
      throw new Error('El nombre de la categoría es requerido')
    }

    // Crear slug automáticamente
    const slug = name.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    // Extraer información de tallas desde el FormData
    const sizes = []
    let index = 0
    while (formData.has(`sizes[${index}][size]`)) {
      sizes.push({
        size: formData.get(`sizes[${index}][size]`),
        order: parseInt(formData.get(`sizes[${index}][order]`)) || index
      })
      index++
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        icon,
        sizes: {
          create: sizes
        }
      },
      include: {
        sizes: {
          orderBy: { order: 'asc' }
        }
      }
    })

    revalidatePath('/admin/categories')
    revalidatePath('/')
    return { success: true, category }
  } catch (error) {
    console.error('Error al crear categoría:', error)
    return { success: false, error: error.message }
  }
}

// Actualizar categoría
export async function updateCategory(id, formData) {
  try {
    const name = formData.get('name')
    const description = formData.get('description') || null
    const icon = formData.get('icon') || null
    
    if (!name) {
      throw new Error('El nombre de la categoría es requerido')
    }

    // Crear slug automáticamente
    const slug = name.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    // Extraer información de tallas desde el FormData
    const sizes = []
    let index = 0
    while (formData.has(`sizes[${index}][size]`)) {
      const sizeId = formData.get(`sizes[${index}][id]`)
      sizes.push({
        id: sizeId && sizeId !== 'undefined' && !isNaN(sizeId) ? parseInt(sizeId) : undefined,
        size: formData.get(`sizes[${index}][size]`),
        order: parseInt(formData.get(`sizes[${index}][order]`)) || index
      })
      index++
    }

    // Actualizar usando una transacción
    const category = await prisma.$transaction(async (tx) => {
      // Primero eliminar todas las tallas existentes
      await tx.categorySize.deleteMany({
        where: { categoryId: parseInt(id) }
      })

      // Luego crear las nuevas tallas
      const updatedCategory = await tx.category.update({
        where: { id: parseInt(id) },
        data: {
          name,
          slug,
          description,
          icon,
          sizes: {
            create: sizes.map(({ id, ...sizeData }) => sizeData)
          }
        },
        include: {
          sizes: {
            orderBy: { order: 'asc' }
          }
        }
      })

      return updatedCategory
    })

    revalidatePath('/admin/categories')
    revalidatePath('/')
    return { success: true, category }
  } catch (error) {
    console.error('Error al actualizar categoría:', error)
    return { success: false, error: error.message }
  }
}

// Eliminar categoría
export async function deleteCategory(id) {
  try {
    // Verificar si tiene productos asociados
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: { _count: { select: { products: true } } }
    })

    if (!category) {
      throw new Error('Categoría no encontrada')
    }

    if (category._count.products > 0) {
      throw new Error('No se puede eliminar una categoría que tiene productos asociados')
    }

    await prisma.category.delete({
      where: { id: parseInt(id) }
    })

    revalidatePath('/admin/categories')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error al eliminar categoría:', error)
    return { success: false, error: error.message }
  }
}