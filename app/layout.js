import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from '@/components/cart/CartContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
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
  title: 'RR BOOTS',
  description: 'Catálogo de artículos western de alta calidad',
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
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Solo manejar el tema
                  var savedTheme = localStorage.getItem('rrboots-theme');
                  var theme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(theme);
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-theme-primary text-theme-primary`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <CartProvider>
            {children}
            <CartSidebar />
            <CartFloatingButton />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
