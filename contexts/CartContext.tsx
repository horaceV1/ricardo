"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface CartItem {
  order_item_id: string
  purchased_entity_id: string
  title: string
  quantity: number
  unit_price: {
    number: string
    currency_code: string
  }
  total_price: {
    number: string
    currency_code: string
  }
}

interface Cart {
  order_id: string
  order_number: string
  total_price: {
    number: string
    currency_code: string
  }
  order_items: CartItem[]
}

interface CartContextType {
  cart: Cart | null
  loading: boolean
  addToCart: (productId: string, quantity?: number) => Promise<boolean>
  removeFromCart: (orderItemId: string) => Promise<void>
  updateQuantity: (orderItemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)

  const refreshCart = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
      const response = await fetch(`${baseUrl}/api/cart`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Cart data refreshed:', data)
        setCart(data)
      } else {
        console.error('Failed to fetch cart:', response.status)
        setCart(null)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
      setCart(null)
    }
  }

  const addToCart = async (productId: string, quantity: number = 1) => {
    setLoading(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
      console.log('Adding to cart:', { productId, quantity, baseUrl })
      
      const response = await fetch(`${baseUrl}/api/cart/add`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{
          purchased_entity_type: 'commerce_product_variation',
          purchased_entity_id: productId,
          quantity: quantity.toString(),
        }]),
      })

      const data = await response.json()
      console.log('Add to cart response:', data)
      
      if (response.ok && data.success) {
        await refreshCart()
        return true
      } else {
        console.error('Failed to add to cart:', data)
        return false
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (orderItemId: string) => {
    setLoading(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
      const response = await fetch(`${baseUrl}/api/cart/remove`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{
          order_item_id: orderItemId,
        }]),
      })

      if (response.ok) {
        await refreshCart()
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (orderItemId: string, quantity: number) => {
    setLoading(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
      const response = await fetch(`${baseUrl}/api/cart/update`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{
          order_item_id: orderItemId,
          quantity: quantity.toString(),
        }]),
      })

      if (response.ok) {
        await refreshCart()
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    setLoading(true)
    try {
      if (cart?.order_items) {
        for (const item of cart.order_items) {
          await removeFromCart(item.order_item_id)
        }
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshCart()
  }, [])

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
