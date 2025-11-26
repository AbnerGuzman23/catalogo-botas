import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('image')

    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 })
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Tipo de archivo no permitido. Solo se permiten: JPEG, PNG, WebP, GIF' 
      }, { status: 400 })
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'El archivo es demasiado grande. Máximo 5MB' 
      }, { status: 400 })
    }

    // Convertir el archivo a bytes
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Crear nombre único para el archivo
    const timestamp = Date.now()
    const originalName = file.name.replace(/\s+/g, '-')
    const fileName = `${timestamp}-${originalName}`
    
    // Definir ruta donde guardar
    const uploadPath = join(process.cwd(), 'public', 'uploads', fileName)

    // Escribir archivo
    await writeFile(uploadPath, buffer)

    // Retornar URL del archivo
    const fileUrl = `/uploads/${fileName}`
    
    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      message: 'Imagen subida correctamente'
    })

  } catch (error) {
    console.error('Error al subir imagen:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 })
  }
}