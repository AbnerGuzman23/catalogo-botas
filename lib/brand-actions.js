'use server'

import { prisma } from './prisma'
import { revalidatePath } from 'next/cache'

// Obtener todas las marcas
export async function getBrands() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })
    
    return brands
  } catch (error) {
    console.error('Error fetching brands:', error)
    return []
  }
}

// Obtener una marca por ID
export async function getBrandById(id) {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: parseInt(id) },
      include: {
        products: {
          include: {
            categoryRel: true,
            inventory: true
          }
        }
      }
    })
    
    return brand
  } catch (error) {
    console.error('Error fetching brand:', error)
    return null
  }
}

// Crear una nueva marca
export async function createBrand(formData) {
  try {
    const name = formData.get('name')
    const description = formData.get('description') || ''
    const logoUrl = formData.get('logoUrl') || ''
    const website = formData.get('website') || ''
    
    if (!name) {
      throw new Error('El nombre de la marca es requerido')
    }
    
    // Generar slug
    const slug = name
      .toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    
    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
        description: description || null,
        logoUrl: logoUrl || null,
        website: website || null
      }
    })
    
    revalidatePath('/admin/brands')
    revalidatePath('/admin')
    revalidatePath('/')
    
    return { success: true, brand }
  } catch (error) {
    console.error('Error creating brand:', error)
    
    if (error.code === 'P2002') {
      return { success: false, error: 'Ya existe una marca con ese nombre' }
    }
    
    return { success: false, error: error.message || 'Error al crear la marca' }
  }
}

// Actualizar una marca
export async function updateBrand(id, formData) {
  try {
    const name = formData.get('name')
    const description = formData.get('description') || ''
    const logoUrl = formData.get('logoUrl') || ''
    const website = formData.get('website') || ''
    
    if (!name) {
      throw new Error('El nombre de la marca es requerido')
    }
    
    // Generar nuevo slug
    const slug = name
      .toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    
    const brand = await prisma.brand.update({
      where: { id: parseInt(id) },
      data: {
        name,
        slug,
        description: description || null,
        logoUrl: logoUrl || null,
        website: website || null
      }
    })
    
    revalidatePath('/admin/brands')
    revalidatePath('/admin')
    revalidatePath('/')
    
    return { success: true, brand }
  } catch (error) {
    console.error('Error updating brand:', error)
    
    if (error.code === 'P2002') {
      return { success: false, error: 'Ya existe una marca con ese nombre' }
    }
    
    return { success: false, error: error.message || 'Error al actualizar la marca' }
  }
}

// Eliminar una marca
export async function deleteBrand(id) {
  try {
    const brandId = parseInt(id)
    
    // Verificar si hay productos asociados
    const productsCount = await prisma.product.count({
      where: { brandId: brandId }
    })
    
    if (productsCount > 0) {
      throw new Error(`No se puede eliminar la marca porque tiene ${productsCount} producto(s) asociado(s)`)
    }
    
    await prisma.brand.delete({
      where: { id: brandId }
    })
    
    revalidatePath('/admin/brands')
    revalidatePath('/admin')
    revalidatePath('/')
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting brand:', error)
    return { success: false, error: error.message || 'Error al eliminar la marca' }
  }
}