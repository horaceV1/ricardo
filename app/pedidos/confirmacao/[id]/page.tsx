"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CheckCircle, Package, User as UserIcon, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface OrderItem {
  title: string
  quantity: number
  total_price: {
    number: string
    currency_code: string
  }
}

interface Order {
  order_id: string
  order_number: string
  state: string
  total_price: {
    number: string
    currency_code: string
  }
  placed: string
  order_items: OrderItem[]
  customer: {
    name: string
    mail: string
  }
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const formatPrice = (number: string, currencyCode: string) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(number))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
        const response = await fetch(`${baseUrl}/api/order/${params.id}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          setOrder(data)
        } else {
          router.push('/pedidos')
        }
      } catch (error) {
        console.error('Error fetching order:', error)
        router.push('/pedidos')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchOrder()
    }
  }, [params.id, router])

  if (loading) {
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

  if (!order) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Pedido Confirmado!</h1>
          <p className="text-xl text-gray-600 mb-2">
            Obrigado pela sua compra, {order.customer.name}
          </p>
          <p className="text-gray-600">
            Enviamos um email de confirmação para{' '}
            <span className="font-semibold">{order.customer.mail}</span>
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          {/* Order Header */}
          <div className="pb-6 border-b border-gray-200 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Número do Pedido</p>
                <p className="text-2xl font-bold text-gray-900">#{order.order_number}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Data do Pedido</p>
                <p className="font-semibold text-gray-900">{formatDate(order.placed)}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-[#009999]" />
              Itens do Pedido
            </h2>
            <div className="space-y-4">
              {order.order_items.map((item, index) => (
                <div key={index} className="flex items-start justify-between py-4 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">Quantidade: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {formatPrice(item.total_price.number, item.total_price.currency_code)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-2xl font-bold">
              <span className="text-gray-900">Total Pago</span>
              <span className="text-[#009999]">
                {formatPrice(order.total_price.number, order.total_price.currency_code)}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-[#009999] to-[#007a7a] rounded-2xl shadow-sm p-8 text-white mb-6">
          <h2 className="text-2xl font-bold mb-4">Próximos Passos</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
              <span>Acesse seus cursos na área "Minha Conta"</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
              <span>Receba certificados após completar os cursos</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
              <span>Entre em contato conosco se precisar de ajuda</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/conta"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#009999] to-[#007a7a] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            <UserIcon className="h-5 w-5" />
            Ir para Minha Conta
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/courses"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white text-[#009999] border-2 border-[#009999] rounded-lg hover:bg-[#009999] hover:text-white transition-all font-semibold"
          >
            Explorar Mais Cursos
          </Link>
        </div>
      </div>
    </div>
  )
}
