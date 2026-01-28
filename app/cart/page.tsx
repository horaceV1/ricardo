"use client"

import { useCart } from '@/contexts/CartContext'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function CartPage() {
  const { cart, loading, removeFromCart, updateQuantity } = useCart()
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())

  const handleUpdateQuantity = async (orderItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setUpdatingItems(prev => new Set(prev).add(orderItemId))
    await updateQuantity(orderItemId, newQuantity)
    setUpdatingItems(prev => {
      const next = new Set(prev)
      next.delete(orderItemId)
      return next
    })
  }

  const handleRemove = async (orderItemId: string) => {
    setUpdatingItems(prev => new Set(prev).add(orderItemId))
    await removeFromCart(orderItemId)
    setUpdatingItems(prev => {
      const next = new Set(prev)
      next.delete(orderItemId)
      return next
    })
  }

  const formatPrice = (number: string, currencyCode: string) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(number))
  }

  if (loading && !cart) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009999]"></div>
          </div>
        </div>
      </div>
    )
  }

  const isEmpty = !cart?.order_items || cart.order_items.length === 0

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Carrinho de Compras</h1>
          <p className="text-gray-600">Revise seus itens antes de finalizar a compra</p>
        </div>

        {isEmpty ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-8">Adicione cursos ao seu carrinho para continuar</p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#009999] to-[#007a7a] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              Explorar Cursos
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.order_items.map((item) => {
                const isUpdating = updatingItems.has(item.order_item_id)
                return (
                  <div
                    key={item.order_item_id}
                    className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-2xl font-bold text-[#009999]">
                          {formatPrice(item.unit_price.number, item.unit_price.currency_code)}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => handleUpdateQuantity(item.order_item_id, item.quantity - 1)}
                            disabled={isUpdating || item.quantity <= 1}
                            className="p-2 hover:bg-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4 text-gray-700" />
                          </button>
                          <span className="w-8 text-center font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.order_item_id, item.quantity + 1)}
                            disabled={isUpdating}
                            className="p-2 hover:bg-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4 text-gray-700" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(item.order_item_id)}
                          disabled={isUpdating}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {item.quantity > 1 && (
                      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-sm text-gray-600">Subtotal:</span>
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(item.total_price.number, item.total_price.currency_code)}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Resumo do Pedido</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(cart.total_price.number, cart.total_price.currency_code)}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Impostos</span>
                    <span>Calculado no checkout</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-[#009999]">
                        {formatPrice(cart.total_price.number, cart.total_price.currency_code)}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#009999] to-[#007a7a] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                >
                  Finalizar Compra
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <Link
                  href="/courses"
                  className="block text-center text-[#009999] hover:text-[#007a7a] mt-4 font-semibold"
                >
                  Continuar Comprando
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
