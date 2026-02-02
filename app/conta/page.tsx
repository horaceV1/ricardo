"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { User, Mail, Shield, Calendar, LogOut, Loader2, ShoppingBag, Settings, BookOpen } from 'lucide-react'

export default function AccountPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout, refreshUser } = useAuth()
  const [userArticles, setUserArticles] = useState<any[]>([])
  const [loadingArticles, setLoadingArticles] = useState(false)

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

  // Fetch user's articles (simulated as "purchased" content)
  useEffect(() => {
    if (user) {
      setLoadingArticles(true)
      // For demo, we'll fetch all articles
      // In production, you'd filter by user purchases/access
      fetch(`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/node/article?filter[status]=1&sort=-created&page[limit]=5`, {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          setUserArticles(data.data || [])
        })
        .catch(err => console.error('Failed to fetch articles:', err))
        .finally(() => setLoadingArticles(false))
    }
  }, [user])

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
                  href="/courses"
                  className="text-[#009999] hover:text-[#007a7a] transition-colors text-sm font-medium"
                >
                  Ver Todos
                </Link>
              </div>
              
              {loadingArticles ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[#009999] mx-auto mb-4" />
                  <p className="text-gray-600">Carregando conteúdo...</p>
                </div>
              ) : userArticles.length > 0 ? (
                <div className="space-y-4">
                  {userArticles.map((article) => (
                    <Link 
                      key={article.id}
                      href={article.attributes.path?.alias || `/articles/${article.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-[#009999] hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-[#009999]/10 rounded-lg flex items-center justify-center group-hover:bg-[#009999] transition-colors">
                          <BookOpen className="w-6 h-6 text-[#009999] group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-[#009999] transition-colors mb-1 line-clamp-1">
                            {article.attributes.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {article.attributes.body?.summary || 'Artigo exclusivo'}
                          </p>
                          <span className="text-xs text-gray-500">
                            {new Date(article.attributes.created).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="mb-4">Você ainda não possui conteúdo</p>
                  <Link
                    href="/courses"
                    className="inline-flex items-center px-4 py-2 bg-[#009999] text-white rounded-lg hover:bg-[#007a7a] transition-colors"
                  >
                    Explorar Conteúdos
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Atividade Recente</h2>
              <div className="text-center py-12 text-gray-500">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Nenhuma atividade recente</p>
              </div>
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
                <Link href="/conta/editar" className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
                  <Settings className="h-5 w-5 text-[#009999]" />
                  <span className="text-sm font-medium text-gray-700">Editar Perfil</span>
                </Link>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-[#009999]" />
                  <span className="text-sm font-medium text-gray-700">Alterar Senha</span>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
                  <ShoppingBag className="h-5 w-5 text-[#009999]" />
                  <span className="text-sm font-medium text-gray-700">Meus Pedidos</span>
                </button>
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
