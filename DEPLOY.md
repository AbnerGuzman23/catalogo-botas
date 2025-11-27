# Guía de Despliegue - Catálogo de Botas

## Pasos para desplegar en Vercel con Neon PostgreSQL

### 1. Crear cuenta en Neon Database
1. Ve a https://neon.tech/
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto/database
4. Copia la URL de conexión PostgreSQL

### 2. Configurar variables de entorno en Vercel
Cuando despliegues a Vercel, agrega estas variables de entorno:

```
DATABASE_URL=postgresql://[usuario]:[password]@[host]/[database]?sslmode=require
NEXTAUTH_SECRET=tu_secreto_aqui_para_produccion
NEXTAUTH_URL=https://tu-dominio.vercel.app
```

### 3. Comandos para desplegar

```bash
# 1. Instalar CLI de Vercel
npm i -g vercel

# 2. Login en Vercel
vercel login

# 3. Desplegar
vercel

# 4. Ejecutar migraciones de Prisma en producción
npx prisma generate
npx prisma db push
```

### 4. Configuración inicial después del despliegue
1. Visita tu sitio en producción
2. Ve a `/admin` 
3. La contraseña por defecto es "admin123"
4. Cambia inmediatamente la contraseña desde el panel admin
5. Configura el número de WhatsApp
6. Sube el logo de tu empresa

## Notas importantes
- La base de datos gratuita de Neon tiene límites de uso
- Considera actualizar el plan si tienes mucho tráfico
- El sitio tendrá HTTPS automáticamente en Vercel
- Las sesiones de admin se cerrarán cada 2 horas por seguridad