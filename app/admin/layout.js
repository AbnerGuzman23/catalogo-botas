'use client'

export default function AdminLayout({ children }) {
  // Simplificar el layout del admin para evitar conflictos de contexto
  // El ThemeProvider ya está disponible desde el RootLayout
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
}