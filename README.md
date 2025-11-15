# Catálogo de Botas 🥾

Una aplicación web moderna para gestionar y mostrar un catálogo de productos de botas. Desarrollada con Next.js, Prisma y SQLite.

## Características

### Parte Pública (Clientes)
- 📱 **Listado responsivo** de productos con diseño mobile-first
- 🔍 **Filtrado por talla** (dinámico basado en productos disponibles)
- 💰 **Información completa** de cada producto (nombre, precio, talla, descripción, imagen)
- 🖼️ **Soporte de imágenes** con fallback automático para productos sin imagen

### Panel Administrativo
- 🔐 **Autenticación simple** con credenciales de entorno
- ➕ **Crear productos** con formulario completo
- ✏️ **Editar productos** existentes
- 🗑️ **Eliminar productos** con confirmación
- 📊 **Dashboard** con vista general de productos

## Stack Tecnológico

- **Framework**: Next.js 15 con App Router
- **Lenguaje**: JavaScript (ES6+)
- **ORM**: Prisma
- **Base de datos**: SQLite (migrable a PostgreSQL/SQL Server)
- **Estilos**: Tailwind CSS
- **Autenticación**: Sistema simple basado en cookies

## Instalación

### Prerrequisitos

- Node.js 18+ instalado
- npm o yarn

### Pasos de instalación

1. **Clona el repositorio**
   ```bash
   git clone <tu-repositorio-url>
   cd catalogo-botas
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   ```bash
   cp .env.example .env
   ```

4. **Edita el archivo `.env`** con tus configuraciones:
   ```env
   # Base de datos SQLite
   DATABASE_URL="file:./dev.db"
   
   # Credenciales de administrador
   ADMIN_USER="admin"
   ADMIN_PASS="tu-contraseña-segura"
   
   # Secret para sesiones
   SESSION_SECRET="tu-clave-secreta-aleatoria"
   ```

5. **Ejecuta las migraciones de Prisma**
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Genera el cliente de Prisma**
   ```bash
   npx prisma generate
   ```

7. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

8. **Abre tu navegador** en [http://localhost:3000](http://localhost:3000)

## Estructura del Proyecto

```
catalogo-botas/
├── app/                          # Next.js App Router
│   ├── admin/                    # Rutas administrativas
│   │   ├── edit/[id]/           # Editar producto
│   │   ├── login/               # Login de admin
│   │   ├── new/                 # Crear producto
│   │   └── page.js              # Dashboard admin
│   ├── globals.css              # Estilos globales
│   ├── layout.js                # Layout principal
│   └── page.js                  # Página principal
├── components/                   # Componentes reutilizables
│   ├── admin/                   # Componentes del admin
│   │   ├── AdminNavbar.js
│   │   ├── AdminProductList.js
│   │   ├── DeleteProductButton.js
│   │   ├── LogoutButton.js
│   │   └── ProductForm.js
│   ├── ProductCard.js           # Tarjeta de producto
│   ├── ProductGrid.js           # Grid de productos
│   └── SizeFilter.js            # Filtro por talla
├── lib/                         # Utilidades y lógica
│   ├── actions.js               # Server actions para productos
│   ├── auth-actions.js          # Server actions para auth
│   ├── auth.js                  # Utilidades de autenticación
│   └── prisma.js                # Cliente de Prisma
├── prisma/                      # Configuración de Prisma
│   ├── migrations/              # Migraciones de BD
│   └── schema.prisma            # Esquema de la BD
├── middleware.js                # Middleware de Next.js
├── .env                         # Variables de entorno
├── .env.example                 # Ejemplo de variables
└── package.json                 # Dependencias del proyecto
```

## Uso

### Acceso Público

1. Visita [http://localhost:3000](http://localhost:3000)
2. Explora los productos disponibles
3. Usa el filtro de tallas para encontrar productos específicos

### Panel Administrativo

1. Ve a [http://localhost:3000/admin](http://localhost:3000/admin)
2. Inicia sesión con las credenciales configuradas en `.env`:
   - Usuario: El valor de `ADMIN_USER`
   - Contraseña: El valor de `ADMIN_PASS`
3. Gestiona productos desde el dashboard

### Operaciones CRUD

- **Crear**: Haz clic en "Nuevo Producto" desde el dashboard
- **Actualizar**: Haz clic en el icono de edición en la lista
- **Eliminar**: Haz clic en el icono de papelera y confirma

## Configuración de Base de Datos

### SQLite (Por defecto)

El proyecto está configurado para usar SQLite por defecto:

```env
DATABASE_URL="file:./dev.db"
```

### PostgreSQL (Producción)

Para cambiar a PostgreSQL:

1. Modifica el `DATABASE_URL` en `.env`:
   ```env
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_bd"
   ```

2. Actualiza `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. Ejecuta las migraciones:
   ```bash
   npx prisma migrate dev
   ```

### SQL Server (Producción)

Para cambiar a SQL Server:

1. Modifica el `DATABASE_URL` en `.env`:
   ```env
   DATABASE_URL="sqlserver://localhost:1433;database=nombre_bd;user=usuario;password=contraseña;encrypt=true"
   ```

2. Actualiza `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "sqlserver"
     url      = env("DATABASE_URL")
   }
   ```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Construye la aplicación para producción
npm start            # Inicia el servidor de producción

# Base de datos
npx prisma studio    # Abre el editor visual de Prisma
npx prisma migrate dev    # Ejecuta migraciones en desarrollo
npx prisma generate  # Regenera el cliente de Prisma

# Lint
npm run lint         # Ejecuta ESLint
```

## Modelo de Datos

### Product

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String   // Nombre del producto
  description String   // Descripción detallada
  price       Float    // Precio en euros
  size        String   // Talla (35-45, S, M, L, XL)
  imageUrl    String?  // URL de imagen (opcional)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard
3. Cambia a PostgreSQL para producción
4. Despliega automáticamente

## Solución de Problemas

### Error de Prisma Client
```bash
npx prisma generate
```

### Base de datos no encontrada
```bash
npx prisma migrate dev
```

### Error de autenticación
Revisa que las variables `ADMIN_USER` y `ADMIN_PASS` estén configuradas.

---

**¡Feliz coding!** 🚀
