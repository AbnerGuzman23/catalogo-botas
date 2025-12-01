'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Obtener todos los productos
export async function getProducts(sizeFilter = null, categoryFilter = null, genderFilter = null, brandFilter = null) {
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

    if (genderFilter) {
      where.gender = genderFilter
    }

    if (brandFilter) {
      where.brandId = parseInt(brandFilter)
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        categoryRel: true,
        brandRel: true,
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
    const brandId = formData.get('brandId')
    
    // Buscar la categoría por slug para obtener el ID
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug }
    })

    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      gender: formData.get('gender') || 'unisex',
      category: categorySlug, // Mantener por compatibilidad
      categoryId: category?.id || null, // Relación foreign key
      brandId: brandId ? parseInt(brandId) : null, // Relación con marca
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
    const brandId = formData.get('brandId')
    
    // Buscar la categoría por slug para obtener el ID
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug }
    })

    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      gender: formData.get('gender') || 'unisex',
      category: categorySlug, // Mantener por compatibilidad
      categoryId: category?.id || null, // Relación foreign key
      brandId: brandId ? parseInt(brandId) : null, // Relación con marca
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
    const productId = parseInt(id)
    
    // Verificar si el producto existe
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })
    
    if (!product) {
      throw new Error('Producto no encontrado')
    }
    
    // Usar una transacción para eliminar todo de forma segura
    await prisma.$transaction(async (tx) => {
      // Eliminar registros de ventas relacionados primero
      await tx.saleItem.deleteMany({
        where: { productId: productId }
      })
      
      // Los ProductSize se eliminarán automáticamente por el CASCADE
      // pero podemos hacerlo explícitamente para estar seguros
      await tx.productSize.deleteMany({
        where: { productId: productId }
      })
      
      // Finalmente eliminar el producto
      await tx.product.delete({
        where: { id: productId }
      })
    })
    
    revalidatePath('/')
    revalidatePath('/admin')
  } catch (error) {
    console.error('Error deleting product:', error)
    throw new Error('Error al eliminar el producto: ' + error.message)
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

// Obtener configuración del sitio
export async function getSiteConfig() {
  try {
    let config = await prisma.siteConfig.findFirst()
    
    // Si no existe configuración, crear una por defecto
    if (!config) {
      config = await prisma.siteConfig.create({
        data: {
          siteName: "RR BOOTS",
          siteDescription: "Artículos Western de Calidad Premium",
          footerAbout: "Más de 25 años especializados en artículos western de alta calidad. Botas, cinturones, ropa y accesorios vaqueros con tradición y estilo auténtico.",
          footerProducts: "• Zapatos Vaqueros\n• Cinturones de Cuero\n• Ropa Western\n• Accesorios Vaqueros",
          footerServices: "🤠 Artículos western auténticos\n📞 Asesoría especializada\n🚚 Envíos seguros\n✨ Garantía de calidad",
          adminPassword: "admin123",
          whatsappNumber: "50212345678"
        }
      })
    }
    
    return config
  } catch (error) {
    console.error('Error fetching site config:', error)
    return {
      siteName: "RR BOOTS",
      siteDescription: "Artículos Western de Calidad Premium",
      logoUrl: null,
      footerAbout: "Más de 25 años especializados en artículos western de alta calidad. Botas, cinturones, ropa y accesorios vaqueros con tradición y estilo auténtico.",
      footerProducts: "• Zapatos Vaqueros\n• Cinturones de Cuero\n• Ropa Western\n• Accesorios Vaqueros",
      footerServices: "🤠 Artículos western auténticos\n📞 Asesoría especializada\n🚚 Envíos seguros\n✨ Garantía de calidad",
      adminPassword: "admin123",
      whatsappNumber: "50212345678"
    }
  }
}

// Actualizar configuración del sitio
export async function updateSiteConfig(formData) {
  try {
    console.log('🔧 === UPDATE SITE CONFIG ===')
    
    const siteName = formData.get('siteName')
    const siteDescription = formData.get('siteDescription')
    const logoUrl = formData.get('logoUrl')
    const footerAbout = formData.get('footerAbout')
    const footerProducts = formData.get('footerProducts')
    const footerServices = formData.get('footerServices')
    const adminPassword = formData.get('adminPassword')
    const whatsappNumber = formData.get('whatsappNumber')

    console.log('📝 Form data received:')
    console.log(`  siteName: "${siteName}"`)
    console.log(`  adminPassword: "${adminPassword}" (length: ${adminPassword ? adminPassword.length : 'null'})`)
    console.log(`  whatsappNumber: "${whatsappNumber}"`)

    const data = {
      siteName,
      siteDescription,
      logoUrl: logoUrl || null,
      footerAbout,
      footerProducts,
      footerServices,
      adminPassword,
      whatsappNumber
    }

    console.log('📋 Data object to save:', data)

    // Buscar configuración existente
    const existingConfig = await prisma.siteConfig.findFirst()
    console.log('📖 Existing config found:', existingConfig ? 'YES' : 'NO')

    let config
    if (existingConfig) {
      console.log('🔄 Updating existing config...')
      config = await prisma.siteConfig.update({
        where: { id: existingConfig.id },
        data
      })
    } else {
      console.log('🆕 Creating new config...')
      config = await prisma.siteConfig.create({
        data
      })
    }

    console.log('✅ Config saved successfully:')
    console.log(`  adminPassword: "${config.adminPassword}"`)
    console.log('🔧 === END UPDATE CONFIG ===')

    revalidatePath('/')
    revalidatePath('/admin')
    return config
  } catch (error) {
    console.error('Error updating site config:', error)
    throw new Error('Error al actualizar la configuración del sitio')
  }
}