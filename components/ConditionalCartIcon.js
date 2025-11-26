'use client'

import { usePathname } from 'next/navigation';
import CartIcon from './CartIcon';

export default function ConditionalCartIcon() {
  const pathname = usePathname();
  
  // No mostrar el carrito en rutas de admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  
  return <CartIcon />;
}