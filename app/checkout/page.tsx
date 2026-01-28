"use client"

import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { ShoppingBag, ArrowLeft, CreditCard, MapPin, User as UserIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function CheckoutPage() {
  const { cart, loading } = useCart()
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [processing, setProcessing] = useState(false)
  const [paypalLoaded, setPaypalLoaded] = useState(false)

  const formatPrice = (number: string, currencyCode: string) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(number))
  }

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/entrar?redirect=/checkout')
    }
  }, [isAuthenticated, loading, router])

  // Redirect to cart if empty
  useEffect(() => {
    if (!loading && (!cart || cart.order_items.length === 0)) {
      router.push('/cart')
    }
  }, [cart, loading, router])

  // Load PayPal SDK
  useEffect(() => {
    if (typeof window !== 'undefined' && !paypalLoaded) {
      const script = document.createElement('script')
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=EUR`
      script.async = true
      script.onload = () => setPaypalLoaded(true)
      document.body.appendChild(script)
    }
  }, [paypalLoaded])

  // Initialize PayPal buttons when loaded
  useEffect(() => {
    if (paypalLoaded && cart && window.paypal) {
      window.paypal.Buttons({
        createOrder: async () => {
          // Create order on backend
          const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
          const response = await fetch(`${baseUrl}/api/checkout/paypal/create-order`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              order_id: cart.order_id,
            }),
          })

          const data = await response.json()
          return data.paypal_order_id
        },
        onApprove: async (data: any) => {
          setProcessing(true)
          try {
            // Capture payment on backend
            const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
            const response = await fetch(`${baseUrl}/api/checkout/paypal/capture-order`, {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                paypal_order_id: data.orderID,
                order_id: cart.order_id,
              }),
            })

            const result = await response.json()
            if (result.success) {
              router.push(`/pedidos/confirmacao/${cart.order_id}`)
            }
          } catch (error) {
            console.error('Error capturing payment:', error)
            alert('Erro ao processar pagamento. Por favor, tente novamente.')
          } finally {
            setProcessing(false)
          }
        },
        onError: (err: any) => {
          console.error('PayPal error:', err)
          alert('Erro ao processar pagamento. Por favor, tente novamente.')
        },
      }).render('#paypal-button-container')
    }
  }, [paypalLoaded, cart, router])

  if (loading || !cart || !user) {
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-[#009999] hover:text-[#007a7a] font-semibold mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar ao Carrinho
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Finalizar Compra</h1>
          <p className="text-gray-600">Revise seu pedido e complete o pagamento</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#009999]/10 rounded-lg">
                  <UserIcon className="h-6 w-6 text-[#009999]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Informações do Cliente</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nome</label>
                  <p className="text-gray-900">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{user.mail}</p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#009999]/10 rounded-lg">
                  <CreditCard className="h-6 w-6 text-[#009999]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Método de Pagamento</h2>
              </div>

              {processing ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009999] mx-auto mb-4"></div>
                    <p className="text-gray-600">Processando pagamento...</p>
                  </div>
                </div>
              ) : (
                <div id="paypal-button-container"></div>
              )}

              <p className="text-sm text-gray-500 mt-4 text-center">
                Você será redirecionado para o PayPal para completar o pagamento de forma segura.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Resumo do Pedido</h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                {cart.order_items.map((item) => (
                  <div key={item.order_item_id} className="flex gap-3 pb-4 border-b border-gray-200 last:border-0">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">Qtd: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {formatPrice(item.total_price.number, item.total_price.currency_code)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(cart.total_price.number, cart.total_price.currency_code)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Impostos</span>
                  <span>Incluído</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xl font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-[#009999]">
                      {formatPrice(cart.total_price.number, cart.total_price.currency_code)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 text-center">
                  <span className="font-semibold">🔒 Pagamento Seguro</span><br />
                  Seus dados estão protegidos com criptografia SSL
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Extend window type for PayPal SDK
declare global {
  interface Window {
    paypal: any
  }
}
