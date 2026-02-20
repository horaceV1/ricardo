"use client"

import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, CreditCard, User as UserIcon, Smartphone, Building2, Wallet, Clock, CheckCircle2, AlertCircle, Copy, Check, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useCallback, Suspense } from 'react'

type PaymentMethod = 'multibanco' | 'mbway' | 'creditcard' | 'paypal'

interface MultibancoDetails {
  entity: string
  reference: string
  amount: string
  deadline: string
  order_id: number
}

interface MbwayDetails {
  reference: string
  amount: string
  order_id: number
  message: string
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009999]"></div>
          </div>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}

function CheckoutContent() {
  const { cart, loading, refreshCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [processing, setProcessing] = useState(false)
  const [paypalLoaded, setPaypalLoaded] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)

  // MB WAY state
  const [mbwayPhone, setMbwayPhone] = useState('')
  const [mbwayDetails, setMbwayDetails] = useState<MbwayDetails | null>(null)
  const [mbwayPolling, setMbwayPolling] = useState(false)

  // Multibanco state
  const [multibancoDetails, setMultibancoDetails] = useState<MultibancoDetails | null>(null)

  // Success/error states
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'

  const formatPrice = (number: string, currencyCode: string) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(number))
  }

  const getAuthToken = (): string | null => {
    const tokensStr = localStorage.getItem('drupal_auth_tokens')
    const tokens = tokensStr ? JSON.parse(tokensStr) : null
    return tokens?.access_token || null
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  // Check for payment error from redirect
  useEffect(() => {
    if (searchParams.get('payment_error')) {
      setPaymentError('O pagamento não foi concluído. Por favor, tente novamente.')
    }
  }, [searchParams])

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

  // Load PayPal SDK only when PayPal is selected
  useEffect(() => {
    if (selectedMethod === 'paypal' && typeof window !== 'undefined' && !paypalLoaded) {
      const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]')
      if (existingScript) {
        setPaypalLoaded(true)
        return
      }
      const script = document.createElement('script')
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=EUR`
      script.async = true
      script.onload = () => setPaypalLoaded(true)
      document.body.appendChild(script)
    }
  }, [selectedMethod, paypalLoaded])

  // Initialize PayPal buttons when loaded and selected
  useEffect(() => {
    if (selectedMethod === 'paypal' && paypalLoaded && cart && window.paypal) {
      const container = document.getElementById('paypal-button-container')
      if (container) {
        container.innerHTML = ''
      }

      window.paypal.Buttons({
        createOrder: async () => {
          try {
            const token = getAuthToken()
            if (!token) throw new Error('Authentication required')

            const response = await fetch(`${baseUrl}/api/checkout/paypal/create-order`, {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ order_id: cart.order_id }),
            })

            const responseText = await response.text()
            if (!response.ok) throw new Error(responseText || 'Failed to create order')

            return JSON.parse(responseText)
          } catch (error) {
            console.error('Error in createOrder:', error)
            throw error
          }
        },
        onApprove: async (data: any) => {
          setProcessing(true)
          try {
            const token = getAuthToken()
            if (!token) throw new Error('Authentication required')

            const response = await fetch(`${baseUrl}/api/checkout/paypal/capture-order`, {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                paypal_order_id: data.orderID,
                order_id: cart.order_id,
              }),
            })

            const result = await response.json()
            if (result.success) {
              await refreshCart()
              router.push(`/pedidos/confirmacao/${cart.order_id}`)
            } else {
              throw new Error('Payment capture failed')
            }
          } catch (error) {
            console.error('Error capturing payment:', error)
            setPaymentError('Erro ao processar pagamento PayPal. Por favor, tente novamente.')
          } finally {
            setProcessing(false)
          }
        },
        onError: (err: any) => {
          console.error('PayPal error:', err)
          setPaymentError('Erro ao processar pagamento PayPal. Por favor, tente novamente.')
        },
      }).render('#paypal-button-container')
    }
  }, [selectedMethod, paypalLoaded, cart, router, refreshCart, baseUrl])

  // Poll for MB WAY payment status
  const pollMbwayStatus = useCallback(async (orderId: number) => {
    setMbwayPolling(true)
    const token = getAuthToken()
    if (!token) return

    let attempts = 0
    const maxAttempts = 60 // 5 minutes with 5-second intervals

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setMbwayPolling(false)
        setPaymentError('O tempo para pagamento MB WAY expirou. Por favor, tente novamente.')
        return
      }

      try {
        const response = await fetch(`${baseUrl}/api/checkout/eupago/status/${orderId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
          if (data.status === 'paid') {
            setMbwayPolling(false)
            await refreshCart()
            router.push(`/pedidos/confirmacao/${orderId}`)
            return
          }
        }
      } catch (error) {
        console.error('Error polling status:', error)
      }

      attempts++
      setTimeout(poll, 5000)
    }

    poll()
  }, [baseUrl, refreshCart, router])

  // Handle Multibanco payment
  const handleMultibanco = async () => {
    if (!cart) return
    setProcessing(true)
    setPaymentError(null)

    try {
      const token = getAuthToken()
      if (!token) throw new Error('Authentication required')

      const response = await fetch(`${baseUrl}/api/checkout/eupago/multibanco`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ order_id: cart.order_id }),
      })

      const result = await response.json()
      if (result.success) {
        setMultibancoDetails({
          entity: result.entity,
          reference: result.reference,
          amount: result.amount,
          deadline: result.deadline,
          order_id: result.order_id,
        })
      } else {
        throw new Error(result.error || 'Failed to create Multibanco reference')
      }
    } catch (error: any) {
      console.error('Multibanco error:', error)
      setPaymentError(error.message || 'Erro ao criar referência Multibanco.')
    } finally {
      setProcessing(false)
    }
  }

  // Handle MB WAY payment
  const handleMbway = async () => {
    if (!cart || !mbwayPhone) return
    setProcessing(true)
    setPaymentError(null)

    try {
      const token = getAuthToken()
      if (!token) throw new Error('Authentication required')

      const response = await fetch(`${baseUrl}/api/checkout/eupago/mbway`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_id: cart.order_id,
          phone: mbwayPhone,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setMbwayDetails({
          reference: result.reference,
          amount: result.amount,
          order_id: result.order_id,
          message: result.message,
        })
        // Start polling for payment confirmation
        pollMbwayStatus(result.order_id)
      } else {
        throw new Error(result.error || 'Failed to create MB WAY payment')
      }
    } catch (error: any) {
      console.error('MB WAY error:', error)
      setPaymentError(error.message || 'Erro ao criar pagamento MB WAY.')
    } finally {
      setProcessing(false)
    }
  }

  // Handle Credit Card payment
  const handleCreditCard = async () => {
    if (!cart) return
    setProcessing(true)
    setPaymentError(null)

    try {
      const token = getAuthToken()
      if (!token) throw new Error('Authentication required')

      const response = await fetch(`${baseUrl}/api/checkout/eupago/creditcard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ order_id: cart.order_id }),
      })

      const result = await response.json()
      if (result.success && result.redirect_url) {
        // Redirect to Eupago's secure 3D Secure form
        window.location.href = result.redirect_url
      } else {
        throw new Error(result.error || 'Failed to create Credit Card payment')
      }
    } catch (error: any) {
      console.error('Credit Card error:', error)
      setPaymentError(error.message || 'Erro ao criar pagamento com cartão.')
      setProcessing(false)
    }
  }

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

        {/* Payment Error Banner */}
        {paymentError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-semibold">Erro no Pagamento</p>
              <p className="text-red-600 text-sm">{paymentError}</p>
            </div>
            <button
              onClick={() => setPaymentError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        )}

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

            {/* Payment Method Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#009999]/10 rounded-lg">
                  <CreditCard className="h-6 w-6 text-[#009999]" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Método de Pagamento</h2>
              </div>

              {/* Multibanco details view */}
              {multibancoDetails ? (
                <MultibancoDetailsView
                  details={multibancoDetails}
                  copiedField={copiedField}
                  onCopy={copyToClipboard}
                  formatPrice={formatPrice}
                />
              ) : mbwayDetails ? (
                <MbwayDetailsView
                  details={mbwayDetails}
                  polling={mbwayPolling}
                  formatPrice={formatPrice}
                />
              ) : (
                <>
                  {/* Payment method selector grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <PaymentMethodCard
                      method="multibanco"
                      selected={selectedMethod === 'multibanco'}
                      onSelect={() => { setSelectedMethod('multibanco'); setPaymentError(null) }}
                      icon={<Building2 className="h-6 w-6" />}
                      name="Multibanco"
                      description="Referência ATM"
                    />
                    <PaymentMethodCard
                      method="mbway"
                      selected={selectedMethod === 'mbway'}
                      onSelect={() => { setSelectedMethod('mbway'); setPaymentError(null) }}
                      icon={<Smartphone className="h-6 w-6" />}
                      name="MB WAY"
                      description="Pagamento instantâneo"
                    />
                    <PaymentMethodCard
                      method="creditcard"
                      selected={selectedMethod === 'creditcard'}
                      onSelect={() => { setSelectedMethod('creditcard'); setPaymentError(null) }}
                      icon={<CreditCard className="h-6 w-6" />}
                      name="Cartão de Crédito"
                      description="Visa / Mastercard"
                    />
                    <PaymentMethodCard
                      method="paypal"
                      selected={selectedMethod === 'paypal'}
                      onSelect={() => { setSelectedMethod('paypal'); setPaymentError(null) }}
                      icon={<Wallet className="h-6 w-6" />}
                      name="PayPal"
                      description="Pagamento online"
                    />
                  </div>

                  {/* Selected method actions */}
                  {selectedMethod === 'multibanco' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-800">
                          <strong>Multibanco</strong> — Será gerada uma referência para pagamento por ATM ou homebanking.
                          Tem até <strong>3 dias</strong> para efetuar o pagamento.
                        </p>
                      </div>
                      <button
                        onClick={handleMultibanco}
                        disabled={processing}
                        className="w-full py-3 px-4 bg-[#009999] hover:bg-[#007a7a] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {processing ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            A gerar referência...
                          </>
                        ) : (
                          <>
                            <Building2 className="h-5 w-5" />
                            Gerar Referência Multibanco
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {selectedMethod === 'mbway' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-800">
                          <strong>MB WAY</strong> — Receberá uma notificação na aplicação MB WAY.
                          Tem <strong>5 minutos</strong> para confirmar o pagamento.
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Número de Telemóvel
                        </label>
                        <div className="flex gap-0">
                          <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 text-sm">
                            +351
                          </span>
                          <input
                            type="tel"
                            value={mbwayPhone}
                            onChange={(e) => setMbwayPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                            placeholder="912345678"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[#009999] focus:border-transparent outline-none text-gray-900"
                            maxLength={9}
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleMbway}
                        disabled={processing || mbwayPhone.length !== 9}
                        className="w-full py-3 px-4 bg-[#009999] hover:bg-[#007a7a] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {processing ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            A enviar pedido...
                          </>
                        ) : (
                          <>
                            <Smartphone className="h-5 w-5" />
                            Pagar com MB WAY
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {selectedMethod === 'creditcard' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-800">
                          <strong>Cartão de Crédito/Débito</strong> — Será redirecionado para uma página segura
                          com tecnologia <strong>3D Secure</strong> para completar o pagamento.
                        </p>
                      </div>
                      <button
                        onClick={handleCreditCard}
                        disabled={processing}
                        className="w-full py-3 px-4 bg-[#009999] hover:bg-[#007a7a] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {processing ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            A processar...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-5 w-5" />
                            Pagar com Cartão
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {selectedMethod === 'paypal' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-800">
                          <strong>PayPal</strong> — Será redirecionado para o PayPal para completar o pagamento de forma segura.
                        </p>
                      </div>
                      {processing ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-center">
                            <Loader2 className="h-12 w-12 animate-spin text-[#009999] mx-auto mb-4" />
                            <p className="text-gray-600">Processando pagamento...</p>
                          </div>
                        </div>
                      ) : (
                        <div id="paypal-button-container" className="min-h-[50px]"></div>
                      )}
                    </div>
                  )}

                  {!selectedMethod && (
                    <p className="text-center text-gray-500 py-4">
                      Selecione um método de pagamento para continuar
                    </p>
                  )}
                </>
              )}
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

              {/* Payment method logos */}
              <div className="mt-4 flex items-center justify-center gap-3 flex-wrap opacity-50">
                <span className="text-xs text-gray-500">Multibanco</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">MB WAY</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">Visa/MC</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Sub-components ---

function PaymentMethodCard({
  method,
  selected,
  onSelect,
  icon,
  name,
  description,
}: {
  method: PaymentMethod
  selected: boolean
  onSelect: () => void
  icon: React.ReactNode
  name: string
  description: string
}) {
  return (
    <button
      onClick={onSelect}
      className={`p-4 rounded-xl border-2 transition-all text-left ${
        selected
          ? 'border-[#009999] bg-[#009999]/5 ring-1 ring-[#009999]'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      <div className={`mb-2 ${selected ? 'text-[#009999]' : 'text-gray-400'}`}>
        {icon}
      </div>
      <h3 className={`font-bold text-sm ${selected ? 'text-[#009999]' : 'text-gray-900'}`}>
        {name}
      </h3>
      <p className="text-xs text-gray-500 mt-0.5">{description}</p>
    </button>
  )
}

function MultibancoDetailsView({
  details,
  copiedField,
  onCopy,
  formatPrice,
}: {
  details: MultibancoDetails
  copiedField: string | null
  onCopy: (text: string, field: string) => void
  formatPrice: (number: string, currencyCode: string) => string
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
        <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
        <div>
          <p className="font-bold text-green-800">Referência Multibanco Gerada</p>
          <p className="text-sm text-green-600">
            Efetue o pagamento num multibanco ou homebanking até {details.deadline}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        {/* Entity */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Entidade</p>
            <p className="text-2xl font-bold text-gray-900 tracking-wider">{details.entity}</p>
          </div>
          <button
            onClick={() => onCopy(details.entity, 'entity')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Copiar"
          >
            {copiedField === 'entity' ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <Copy className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>

        <hr className="border-gray-200" />

        {/* Reference */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Referência</p>
            <p className="text-2xl font-bold text-gray-900 tracking-wider">{details.reference}</p>
          </div>
          <button
            onClick={() => onCopy(details.reference, 'reference')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Copiar"
          >
            {copiedField === 'reference' ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <Copy className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>

        <hr className="border-gray-200" />

        {/* Amount */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Valor</p>
            <p className="text-2xl font-bold text-[#009999]">
              {formatPrice(details.amount, 'EUR')}
            </p>
          </div>
          <button
            onClick={() => onCopy(details.amount, 'amount')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Copiar"
          >
            {copiedField === 'amount' ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <Copy className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500 justify-center">
        <Clock className="h-4 w-4" />
        <span>Prazo de pagamento: <strong>{details.deadline}</strong></span>
      </div>

      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Nota:</strong> O seu pedido será processado automaticamente após a confirmação do pagamento.
          O pagamento pode demorar até 24 horas a ser confirmado após a realização.
        </p>
      </div>

      <Link
        href="/area-aluno"
        className="block w-full py-3 px-4 bg-[#009999] hover:bg-[#007a7a] text-white font-semibold rounded-lg transition-colors text-center"
      >
        Ir para Área do Aluno
      </Link>
    </div>
  )
}

function MbwayDetailsView({
  details,
  polling,
  formatPrice,
}: {
  details: MbwayDetails
  polling: boolean
  formatPrice: (number: string, currencyCode: string) => string
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <Smartphone className="h-6 w-6 text-blue-600 flex-shrink-0" />
        <div>
          <p className="font-bold text-blue-800">Pedido MB WAY Enviado</p>
          <p className="text-sm text-blue-600">{details.message}</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 text-center space-y-4">
        <div className="flex items-center justify-center">
          <div className="relative">
            <Smartphone className="h-16 w-16 text-[#009999]" />
            {polling && (
              <div className="absolute -top-1 -right-1">
                <span className="flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#009999] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-[#009999]"></span>
                </span>
              </div>
            )}
          </div>
        </div>

        <div>
          <p className="text-lg font-bold text-gray-900">
            Valor: {formatPrice(details.amount, 'EUR')}
          </p>
        </div>

        {polling && (
          <div className="flex items-center justify-center gap-2 text-[#009999]">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">A aguardar confirmação...</span>
          </div>
        )}

        <p className="text-sm text-gray-500">
          Confirme o pagamento na sua aplicação MB WAY dentro de 5 minutos.
        </p>
      </div>

      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Nota:</strong> Após a confirmação na app MB WAY, será redirecionado automaticamente para a página de confirmação.
        </p>
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
