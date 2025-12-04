import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./animations.css";
import { CartProvider } from '@/components/cart/CartContext';
import CartSidebar from '@/components/cart/CartSidebar';
import CartFloatingButton from '@/components/cart/CartFloatingButton';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'RR BOOTS - Artículos Western de Calidad Premium',
  description: 'Descubre nuestra colección de botas western, botines y artículos cowboy de la más alta calidad. Encuentra tu estilo perfecto en RR BOOTS.',
  keywords: 'botas western, botines, cowboy, vaquero, calzado western, botas de trabajo',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  other: {
    'msapplication-config': 'none',
    'theme-color': '#78350f',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          <div className="bg-gray-50 text-gray-900 min-h-screen">
            {children}
          </div>
          <CartSidebar />
          <CartFloatingButton />
        </CartProvider>
      </body>
    </html>
  );
}
