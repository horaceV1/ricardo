"use client"

import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'

export function CartIcon() {
  const { cart } = useCart()
  
  const itemCount = cart?.order_items.reduce((total, item) => total + item.quantity, 0) || 0

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center justify-center w-10 h-10 text-gray-700 hover:text-[#009999] transition-colors"
      aria-label="Shopping Cart"
    >
      <ShoppingCart className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#009999] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Link>
  )
}
