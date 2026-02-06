"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { 
  ShoppingBag, 
  Calendar, 
  Package, 
  CheckCircle, 
  Clock, 
  XCircle,
  ChevronRight,
  Loader2,
  FileText,
  Download,
  Eye
} from 'lucide-react'

interface OrderItem {
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

interface Order {
  order_id: string
  order_number: string
  state: string
  total_price: {
    number: string
    currency_code: string
  }
  placed: string
  completed?: string
  order_items: OrderItem[]
  customer: {
    name: string
    mail: string
  }
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/entrar')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true)
      
      // Get JWT token from localStorage
      const tokensStr = localStorage.getItem('drupal_auth_tokens')
      const tokens = tokensStr ? JSON.parse(tokensStr) : null
      const token = tokens?.access_token

      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
      const response = await fetch(`${baseUrl}/api/auth/orders`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log('[Orders] Fetched orders:', data)
        setOrders(data.data || [])
      } else {
        console.error('[Orders] Failed to fetch orders, status:', response.status)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoadingOrders(false)
    }
  }

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

  const getStatusInfo = (state: string) => {
    switch (state) {
      case 'completed':
        return {
          label: 'Concluído',
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
        }
      case 'draft':
        return {
          label: 'Rascunho',
          icon: FileText,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
        }
      case 'pending':
        return {
          label: 'Pendente',
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
        }
      case 'canceled':
        return {
          label: 'Cancelado',
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
        }
      default:
        return {
          label: state,
          icon: Clock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
        }
    }
  }

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.state === selectedStatus)

  const orderCounts = {
    all: orders.length,
    completed: orders.filter(o => o.state === 'completed').length,
    pending: orders.filter(o => o.state === 'pending').length,
    canceled: orders.filter(o => o.state === 'canceled').length,
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#009999] mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-[#009999] rounded-xl">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Meus Pedidos</h1>
              <p className="text-gray-600 mt-1">Histórico completo de suas compras</p>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-sm p-2 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedStatus === 'all'
                  ? 'bg-[#009999] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Todos ({orderCounts.all})
            </button>
            <button
              onClick={() => setSelectedStatus('completed')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedStatus === 'completed'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Concluídos ({orderCounts.completed})
            </button>
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedStatus === 'pending'
                  ? 'bg-yellow-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Pendentes ({orderCounts.pending})
            </button>
            <button
              onClick={() => setSelectedStatus('canceled')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedStatus === 'canceled'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Cancelados ({orderCounts.canceled})
            </button>
          </div>
        </div>

        {/* Orders List */}
        {loadingOrders ? (
          <div className="text-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-[#009999] mx-auto mb-4" />
            <p className="text-gray-600">Carregando pedidos...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.state)
              const StatusIcon = statusInfo.icon

              return (
                <div
                  key={order.order_id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-[#009999]/10 rounded-xl flex items-center justify-center">
                            <Package className="h-6 w-6 text-[#009999]" />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-bold text-gray-900">
                              Pedido #{order.order_number}
                            </h3>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bgColor} ${statusInfo.color}`}>
                              <StatusIcon className="h-3.5 w-3.5" />
                              {statusInfo.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" />
                              {formatDate(order.placed)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Package className="h-4 w-4" />
                              {order.order_items.length} {order.order_items.length === 1 ? 'item' : 'itens'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Total</p>
                        <p className="text-2xl font-bold text-[#009999]">
                          {formatPrice(order.total_price.number, order.total_price.currency_code)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4">Itens do Pedido</h4>
                    <div className="space-y-3">
                      {order.order_items.map((item, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="h-5 w-5 text-[#009999]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{item.title}</p>
                              <p className="text-sm text-gray-600">
                                Quantidade: {item.quantity} × {formatPrice(item.unit_price.number, item.unit_price.currency_code)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-semibold text-gray-900">
                              {formatPrice(item.total_price.number, item.total_price.currency_code)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="px-6 pb-6 flex flex-wrap gap-3">
                    {order.state === 'completed' && (
                      <>
                        <Link
                          href={`/pedidos/confirmacao/${order.order_id}`}
                          className="flex items-center gap-2 px-4 py-2 bg-[#009999] text-white rounded-lg hover:bg-[#007a7a] transition-colors font-medium text-sm"
                        >
                          <Eye className="h-4 w-4" />
                          Ver Detalhes
                        </Link>
                        <Link
                          href="/conta"
                          className="flex items-center gap-2 px-4 py-2 bg-white text-[#009999] border-2 border-[#009999] rounded-lg hover:bg-[#009999] hover:text-white transition-colors font-medium text-sm"
                        >
                          <Download className="h-4 w-4" />
                          Acessar Conteúdo
                        </Link>
                      </>
                    )}
                    {order.state === 'pending' && (
                      <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium text-sm">
                        <Clock className="h-4 w-4" />
                        Aguardando Pagamento
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <ShoppingBag className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {selectedStatus === 'all' ? 'Nenhum pedido encontrado' : `Nenhum pedido ${getStatusInfo(selectedStatus).label.toLowerCase()}`}
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedStatus === 'all' 
                ? 'Você ainda não fez nenhuma compra'
                : 'Não há pedidos com este status no momento'}
            </p>
            {selectedStatus === 'all' && (
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#009999] text-white rounded-lg hover:bg-[#007a7a] transition-colors font-semibold"
              >
                Explorar Cursos
                <ChevronRight className="h-5 w-5" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
