"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import RecentActivity from '@/components/forms/RecentActivity'
import { User, Mail, Shield, Calendar, LogOut, Loader2, ShoppingBag, Settings, BookOpen, Download, FileText, Trash2, X, PlayCircle, ChevronRight } from 'lucide-react'

interface PurchasedProduct {
  product_id: string
  title: string
  variation_id: string
  order_id: string
  order_number: string
  purchased_date: string
  body?: {
    value: string
    summary: string
  }
  image?: {
    url: string
    alt: string
  }
  digital_media: Array<{
    fid: string
    filename: string
    filesize: number
    mime_type: string
    url: string
    title: string
  }>
  has_downloads: boolean
  curso?: {
    id: string
    nid: string
    title: string
    path: string
  }
}

export default function AccountPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout, refreshUser } = useAuth()
  const [purchasedProducts, setPurchasedProducts] = useState<PurchasedProduct[]>([])
  const [loadingPurchases, setLoadingPurchases] = useState(false)
  const [hiddenProducts, setHiddenProducts] = useState<Set<string>>(new Set())
  const [deletingProduct, setDeletingProduct] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/entrar')
    }
  }, [isAuthenticated, isLoading, router])

  // Refresh user data when page loads to get latest profile info
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshUser()
    }
  }, [isAuthenticated, refreshUser])

  // Fetch user's purchased products
  useEffect(() => {
    if (user) {
      setLoadingPurchases(true)
      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
      const tokensStr = localStorage.getItem('drupal_auth_tokens')
      const tokens = tokensStr ? JSON.parse(tokensStr) : null
      const token = tokens?.access_token
      fetch(`${baseUrl}/api/auth/purchases`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      })
        .then(res => res.json())
        .then(data => {
          setPurchasedProducts(data.data || [])
        })
        .catch(err => console.error('Failed to fetch purchases:', err))
        .finally(() => setLoadingPurchases(false))
    }
  }, [user])

  // Load hidden products from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('hiddenProducts')
    if (stored) {
      setHiddenProducts(new Set(JSON.parse(stored)))
    }
  }, [])

  const handleHideProduct = (productId: string) => {
    setDeletingProduct(productId)
    setTimeout(() => {
      const newHidden = new Set(hiddenProducts)
      newHidden.add(productId)
      setHiddenProducts(newHidden)
      localStorage.setItem('hiddenProducts', JSON.stringify([...newHidden]))
      setDeletingProduct(null)
    }, 300)
  }

  const handleRestoreProduct = (productId: string) => {
    const newHidden = new Set(hiddenProducts)
    newHidden.delete(productId)
    setHiddenProducts(newHidden)
    localStorage.setItem('hiddenProducts', JSON.stringify([...newHidden]))
  }

  // Filter out hidden products
  const visibleProducts = purchasedProducts.filter(p => !hiddenProducts.has(p.product_id))
  const hiddenProductsList = purchasedProducts.filter(p => hiddenProducts.has(p.product_id))

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
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

  // Debug: Log user data to console
  console.log('User data:', user)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#009999] to-[#007a7a] rounded-2xl p-8 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <User className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {user.field_first_name && user.field_last_name
                    ? `${user.field_first_name} ${user.field_last_name}`
                    : user.name}
                </h1>
                <p className="text-white/80 mt-1">{user.mail}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Account Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Informações da Conta</h2>
                <Link 
                  href="/conta/editar"
                  className="text-[#009999] hover:text-[#007a7a] transition-colors"
                >
                  <Settings className="h-5 w-5" />
                </Link>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <User className="h-6 w-6 text-[#009999] mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Nome de Usuário</p>
                    <p className="text-lg text-gray-900 mt-1">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Mail className="h-6 w-6 text-[#009999] mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-lg text-gray-900 mt-1">{user.mail}</p>
                  </div>
                </div>

                {user.field_phone && (
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <svg className="h-6 w-6 text-[#009999] mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Telefone</p>
                      <p className="text-lg text-gray-900 mt-1">{user.field_phone}</p>
                    </div>
                  </div>
                )}

                {user.field_nif && (
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <svg className="h-6 w-6 text-[#009999] mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">NIF</p>
                      <p className="text-lg text-gray-900 mt-1">{user.field_nif}</p>
                    </div>
                  </div>
                )}

                {(user.field_address || user.field_city || user.field_postal_code || user.field_country) && (
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <svg className="h-6 w-6 text-[#009999] mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Morada</p>
                      <div className="text-lg text-gray-900 mt-1 space-y-1">
                        {user.field_address && <p>{user.field_address}</p>}
                        <p>
                          {user.field_postal_code && <span>{user.field_postal_code}</span>}
                          {user.field_postal_code && user.field_city && <span> </span>}
                          {user.field_city && <span>{user.field_city}</span>}
                        </p>
                        {user.field_country && <p>{user.field_country}</p>}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Shield className="h-6 w-6 text-[#009999] mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Funções</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {user.roles.map((role) => (
                        <span
                          key={role}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#009999]/10 text-[#009999]"
                        >
                          {role === 'authenticated' ? 'Usuário Autenticado' :
                           role === 'administrator' ? 'Administrador' :
                           role === 'content_editor' ? 'Editor de Conteúdo' :
                           role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-[#009999] mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Membro desde</p>
                    <p className="text-lg text-gray-900 mt-1">{formatDate(user.created)}</p>
                  </div>
                </div>

                {user.login && user.login !== '0' && (
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="h-6 w-6 text-[#009999] mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Último acesso</p>
                      <p className="text-lg text-gray-900 mt-1">{formatDate(user.login)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* My Content */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Meu Conteúdo</h2>
                <Link 
                  href="/area-aluno"
                  className="text-[#009999] hover:text-[#007a7a] transition-colors text-sm font-medium"
                >
                  Ver Todos
                </Link>
              </div>
              
              {loadingPurchases ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[#009999] mx-auto mb-4" />
                  <p className="text-gray-600">Carregando conteúdo...</p>
                </div>
              ) : visibleProducts.length > 0 ? (
                <div className="space-y-4">
                  {/* Courses Quick Access */}
                  {visibleProducts.some(p => p.curso) && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Meus Cursos</h3>
                      <div className="space-y-2">
                        {visibleProducts
                          .filter(p => p.curso)
                          .map(product => (
                            <Link
                              key={product.product_id}
                              href={`/area-aluno/curso/${product.curso!.id}`}
                              className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#009999]/5 to-transparent border border-[#009999]/20 rounded-xl hover:border-[#009999] hover:shadow-md transition-all group"
                            >
                              <div className="flex-shrink-0 w-11 h-11 bg-[#009999] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                                <PlayCircle className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 group-hover:text-[#009999] transition-colors line-clamp-1">
                                  {product.curso!.title}
                                </h4>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  Comprado em {new Date(product.purchased_date).toLocaleDateString('pt-PT')}
                                </p>
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#009999] transition-colors flex-shrink-0" />
                            </Link>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Products with Downloads */}
                  {visibleProducts.some(p => p.has_downloads) && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Produtos Adquiridos</h3>
                    </div>
                  )}
                  {visibleProducts.filter(p => p.has_downloads || !p.curso).map((product) => (
                    <div 
                      key={product.product_id}
                      className={`block p-5 border border-gray-200 rounded-lg hover:border-[#009999] hover:shadow-md transition-all relative ${
                        deletingProduct === product.product_id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                      }`}
                    >
                      {/* Delete/Hide Button */}
                      <button
                        onClick={() => handleHideProduct(product.product_id)}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Remover da lista"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="flex items-start gap-4 mb-4 pr-10">
                        <div className="flex-shrink-0 w-12 h-12 bg-[#009999]/10 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-[#009999]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                            {product.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {product.body?.summary || 'Conteúdo exclusivo'}
                          </p>
                          <span className="text-xs text-gray-500">
                            Comprado em {new Date(product.purchased_date).toLocaleDateString('pt-PT')}
                          </span>
                        </div>
                      </div>
                      
                      {/* Downloads Section */}
                      {product.has_downloads && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2 mb-3">
                            <FileText className="h-4 w-4 text-[#009999]" />
                            <h4 className="text-sm font-semibold text-gray-900">Arquivos Disponíveis</h4>
                          </div>
                          <div className="space-y-2">
                            {product.digital_media.map((file) => (
                              <a
                                key={file.fid}
                                href={file.url}
                                download
                                className="flex items-center justify-between p-3 bg-gray-50 hover:bg-[#009999]/10 rounded-lg border border-gray-200 hover:border-[#009999] transition-all group"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white rounded group-hover:bg-[#009999] transition-colors">
                                    <Download className="h-4 w-4 text-[#009999] group-hover:text-white transition-colors" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900 text-sm">{file.title || file.filename}</p>
                                    <p className="text-xs text-gray-500">{formatFileSize(file.filesize)}</p>
                                  </div>
                                </div>
                                <span className="text-xs font-medium text-[#009999] group-hover:text-[#007a7a]">
                                  Download
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="mb-2 font-medium">Você ainda não comprou nenhum produto</p>
                  <p className="text-sm mb-4">Explore nossos cursos e conteúdos exclusivos</p>
                  <Link
                    href="/courses"
                    className="inline-flex items-center px-4 py-2 bg-[#009999] text-white rounded-lg hover:bg-[#007a7a] transition-colors"
                  >
                    Explorar Produtos
                  </Link>
                </div>
              )}

              {/* Hidden Products Section */}
              {hiddenProductsList.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Conteúdo Oculto ({hiddenProductsList.length})
                  </h3>
                  <div className="space-y-2">
                    {hiddenProductsList.map((product) => (
                      <div
                        key={product.product_id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <BookOpen className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-600 truncate">{product.title}</span>
                        </div>
                        <button
                          onClick={() => handleRestoreProduct(product.product_id)}
                          className="ml-4 text-xs text-[#009999] hover:text-[#007a7a] font-medium whitespace-nowrap"
                        >
                          Restaurar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div>
              <RecentActivity limit={10} showHeader={true} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Status da Conta</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    user.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">ID</span>
                  <span className="text-sm font-mono text-gray-900">{user.uid}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="space-y-3">
                <Link href="/area-aluno" className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-[#009999]" />
                  <span className="text-sm font-medium text-gray-700">Área do Aluno</span>
                </Link>
                <Link href="/conta/editar" className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
                  <Settings className="h-5 w-5 text-[#009999]" />
                  <span className="text-sm font-medium text-gray-700">Editar Perfil</span>
                </Link>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-[#009999]" />
                  <span className="text-sm font-medium text-gray-700">Alterar Senha</span>
                </button>
                <Link href="/pedidos" className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
                  <ShoppingBag className="h-5 w-5 text-[#009999]" />
                  <span className="text-sm font-medium text-gray-700">Meus Pedidos</span>
                </Link>
              </div>
            </div>

            {/* Admin Panel Link */}
            {user.roles.includes('administrator') && (
              <div className="bg-gradient-to-br from-[#ff8c00] to-[#cc7000] rounded-2xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Painel Administrativo</h3>
                <p className="text-sm text-white/80 mb-4">
                  Você tem acesso ao painel de administração do Drupal
                </p>
                <a
                  href={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/admin`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  Acessar Painel
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
