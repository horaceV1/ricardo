"use client"

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import {
  ArrowLeft,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  Calendar,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
  Paperclip,
  Search,
  Filter,
  ExternalLink,
  Eye,
  RefreshCw,
} from 'lucide-react'

interface FieldApproval {
  status: 'pending' | 'approved' | 'denied'
  note: string
  date: number | null
}

interface FieldData {
  label: string
  type: string
  approval_status: 'pending' | 'approved' | 'denied'
  approval_note: string
  approval_date: number | null
  filename?: string
  download_url?: string
  value?: string
}

interface Submission {
  submission_id: number
  form_id: string
  form_label: string
  created: number
  approval_status: 'pending' | 'approved' | 'denied'
  approval_note: string | null
  approval_date: number | null
  fields: FieldData[]
}

interface Message {
  id: number
  sender_id: number
  sender_name: string
  message: string
  file: { fid: number; filename: string; url: string } | null
  created: number
  is_current_user: boolean
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'denied'

export default function MinhasSubmissoesPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [messagesMap, setMessagesMap] = useState<Record<number, Message[]>>({})
  const [loadingMessagesId, setLoadingMessagesId] = useState<number | null>(null)
  const [newMessageMap, setNewMessageMap] = useState<Record<number, string>>({})
  const [sendingMessageId, setSendingMessageId] = useState<number | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/entrar')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions()
    }
  }, [isAuthenticated])

  const getAuthHeaders = (): HeadersInit => {
    const tokensStr = localStorage.getItem('drupal_auth_tokens')
    const headers: HeadersInit = { 'Content-Type': 'application/json' }
    if (tokensStr) {
      const tokens = JSON.parse(tokensStr)
      if (tokens.access_token) {
        headers['Authorization'] = `Bearer ${tokens.access_token}`
      }
    }
    return headers
  }

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/api/user-submissions`,
        { headers: getAuthHeaders(), credentials: 'include' }
      )
      if (!res.ok) throw new Error('Failed to fetch submissions')
      const data = await res.json()
      // Sort by created desc
      const sorted = (data as Submission[]).sort((a, b) => b.created - a.created)
      setSubmissions(sorted)
    } catch (err) {
      console.error('Error fetching submissions:', err)
      setError('Não foi possível carregar as submissões')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchSubmissions()
    setRefreshing(false)
  }

  const fetchMessages = async (submissionId: number) => {
    try {
      setLoadingMessagesId(submissionId)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/api/submission/${submissionId}/messages`,
        { headers: getAuthHeaders() }
      )
      if (res.ok) {
        const data = await res.json()
        setMessagesMap(prev => ({ ...prev, [submissionId]: data.messages || [] }))
      }
    } catch (err) {
      console.error('Error fetching messages:', err)
    } finally {
      setLoadingMessagesId(null)
    }
  }

  const handleSendMessage = async (submissionId: number) => {
    const text = (newMessageMap[submissionId] || '').trim()
    if (!text) return
    try {
      setSendingMessageId(submissionId)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/api/submission/${submissionId}/messages`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ message: text }),
        }
      )
      if (res.ok) {
        setNewMessageMap(prev => ({ ...prev, [submissionId]: '' }))
        await fetchMessages(submissionId)
      }
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setSendingMessageId(null)
    }
  }

  const handleExpand = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null)
    } else {
      setExpandedId(id)
      if (!messagesMap[id]) {
        fetchMessages(id)
      }
    }
  }

  const formatDate = (ts: number) => {
    return new Date(ts * 1000).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatMsgDate = (ts: number) => {
    return new Date(ts * 1000).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          label: 'Aprovado',
          icon: <CheckCircle className="h-4 w-4" />,
          badge: 'bg-green-100 text-green-800 border-green-200',
          dot: 'bg-green-500',
        }
      case 'denied':
        return {
          label: 'Negado',
          icon: <XCircle className="h-4 w-4" />,
          badge: 'bg-red-100 text-red-800 border-red-200',
          dot: 'bg-red-500',
        }
      default:
        return {
          label: 'Pendente',
          icon: <Clock className="h-4 w-4" />,
          badge: 'bg-orange-100 text-orange-800 border-orange-200',
          dot: 'bg-orange-500',
        }
    }
  }

  const getFieldStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { label: 'Aprovado', color: 'text-green-700 bg-green-50 border-green-200', icon: <CheckCircle className="h-3.5 w-3.5" /> }
      case 'denied':
        return { label: 'Negado', color: 'text-red-700 bg-red-50 border-red-200', icon: <XCircle className="h-3.5 w-3.5" /> }
      default:
        return { label: 'Pendente', color: 'text-orange-700 bg-orange-50 border-orange-200', icon: <Clock className="h-3.5 w-3.5" /> }
    }
  }

  // Filter submissions
  const filtered = submissions.filter(sub => {
    if (statusFilter !== 'all' && sub.approval_status !== statusFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const matchForm = sub.form_label.toLowerCase().includes(q)
      const matchField = sub.fields.some(f => f.label.toLowerCase().includes(q) || (f.value && f.value.toLowerCase().includes(q)))
      if (!matchForm && !matchField) return false
    }
    return true
  })

  // Stats
  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.approval_status === 'pending').length,
    approved: submissions.filter(s => s.approval_status === 'approved').length,
    denied: submissions.filter(s => s.approval_status === 'denied').length,
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader2 className="h-12 w-12 animate-spin text-[#009999]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/conta"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#009999] transition-colors mb-4 no-underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar à Conta
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Minhas Submissões</h1>
              <p className="text-gray-600 mt-1">Acompanhe e gerencie todas as suas candidaturas e documentos</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
            <p className="text-sm text-orange-600">Pendentes</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
            <p className="text-sm text-green-600">Aprovadas</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-red-100">
            <p className="text-sm text-red-600">Negadas</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{stats.denied}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar por formulário ou campo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#009999] focus:border-[#009999] outline-none"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'pending', 'approved', 'denied'] as StatusFilter[]).map((f) => {
                const labels: Record<StatusFilter, string> = { all: 'Todas', pending: 'Pendentes', approved: 'Aprovadas', denied: 'Negadas' }
                const isActive = statusFilter === f
                return (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-[#009999] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {labels[f]}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-[#009999] mb-4" />
              <p className="text-gray-500">Carregando submissões...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-12">
            <div className="flex flex-col items-center justify-center">
              <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
              <p className="text-red-600 font-medium">{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-4 px-4 py-2 bg-[#009999] text-white rounded-lg hover:bg-[#007a7a] transition-colors text-sm font-medium"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
            <div className="flex flex-col items-center justify-center">
              <FileText className="h-16 w-16 text-gray-200 mb-4" />
              {submissions.length === 0 ? (
                <>
                  <p className="text-lg text-gray-500 font-medium">Nenhuma submissão encontrada</p>
                  <p className="text-sm text-gray-400 mt-1">Quando submeter formulários, eles aparecerão aqui</p>
                </>
              ) : (
                <>
                  <p className="text-lg text-gray-500 font-medium">Nenhum resultado</p>
                  <p className="text-sm text-gray-400 mt-1">Tente alterar os filtros de pesquisa</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Submissions List */}
        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map((sub) => {
              const statusCfg = getStatusConfig(sub.approval_status)
              const isExpanded = expandedId === sub.submission_id
              const fileFields = sub.fields.filter(f => f.type === 'documento' || f.type === 'imagem')
              const textFields = sub.fields.filter(f => f.type === 'texto')
              const approvedCount = sub.fields.filter(f => f.approval_status === 'approved').length
              const totalFields = sub.fields.length

              return (
                <div
                  key={sub.submission_id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Card Header */}
                  <div
                    className="p-5 sm:p-6 cursor-pointer"
                    onClick={() => handleExpand(sub.submission_id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{sub.form_label}</h3>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusCfg.badge}`}>
                            {statusCfg.icon}
                            {statusCfg.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(sub.created)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5" />
                            {totalFields} campo{totalFields !== 1 ? 's' : ''}
                          </span>
                          {totalFields > 0 && (
                            <span className="flex items-center gap-1.5">
                              <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                              {approvedCount}/{totalFields} aprovados
                            </span>
                          )}
                        </div>

                        {/* Progress bar */}
                        {totalFields > 0 && (
                          <div className="mt-3 w-full max-w-xs">
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 rounded-full transition-all duration-500"
                                style={{ width: `${(approvedCount / totalFields) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Per-field status pills */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {sub.fields.map((field, i) => {
                            const fCfg = getFieldStatusConfig(field.approval_status)
                            return (
                              <span
                                key={i}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${fCfg.color}`}
                              >
                                {fCfg.icon}
                                {field.label}
                              </span>
                            )
                          })}
                        </div>
                      </div>

                      <button
                        className="p-2 text-gray-400 hover:text-[#009999] hover:bg-[#009999]/10 rounded-lg transition-colors flex-shrink-0"
                      >
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/50">
                      {/* Fields detail table */}
                      <div className="p-5 sm:p-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#009999]" />
                          Campos Submetidos
                        </h4>
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <div className="divide-y divide-gray-100">
                            {sub.fields.map((field, i) => {
                              const fCfg = getFieldStatusConfig(field.approval_status)
                              return (
                                <div key={i} className="p-4">
                                  <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-medium text-gray-800">{field.label}</span>
                                        <span className="text-xs text-gray-400 capitalize">({field.type})</span>
                                      </div>
                                      {/* Value */}
                                      {field.type === 'texto' && field.value && (
                                        <p className="text-sm text-gray-600 mt-1">{field.value}</p>
                                      )}
                                      {(field.type === 'documento' || field.type === 'imagem') && field.filename && (
                                        <div className="flex items-center gap-2 mt-1">
                                          <Paperclip className="h-3.5 w-3.5 text-gray-400" />
                                          <span className="text-sm text-gray-600">{field.filename}</span>
                                          {field.download_url && (
                                            <a
                                              href={field.download_url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="inline-flex items-center gap-1 text-xs text-[#009999] hover:text-[#007a7a] font-medium"
                                            >
                                              <Download className="h-3 w-3" />
                                              Descarregar
                                            </a>
                                          )}
                                        </div>
                                      )}
                                      {/* Approval note */}
                                      {field.approval_note && (
                                        <div className="mt-2 flex items-start gap-1.5 bg-gray-50 p-2 rounded">
                                          <MessageSquare className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                                          <p className="text-xs text-gray-600 italic">{field.approval_note}</p>
                                        </div>
                                      )}
                                    </div>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${fCfg.color}`}>
                                      {fCfg.icon}
                                      {fCfg.label}
                                    </span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Overall approval note */}
                      {sub.approval_note && (
                        <div className="px-5 sm:px-6 pb-4">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm font-medium text-blue-800 mb-1">Nota do revisor:</p>
                            <p className="text-sm text-blue-700">{sub.approval_note}</p>
                          </div>
                        </div>
                      )}

                      {/* Messages */}
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-[#009999]" />
                              Mensagens
                              {(messagesMap[sub.submission_id]?.length || 0) > 0 && (
                                <span className="text-xs bg-[#009999]/10 text-[#009999] rounded-full px-2 py-0.5">
                                  {messagesMap[sub.submission_id].length}
                                </span>
                              )}
                            </h4>
                          </div>

                          {/* Messages thread */}
                          <div className="max-h-72 overflow-y-auto p-3 space-y-2">
                            {loadingMessagesId === sub.submission_id ? (
                              <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-5 w-5 animate-spin text-[#009999]" />
                              </div>
                            ) : !messagesMap[sub.submission_id] || messagesMap[sub.submission_id].length === 0 ? (
                              <div className="text-center py-8">
                                <MessageSquare className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                                <p className="text-xs text-gray-400">Nenhuma mensagem ainda</p>
                                <p className="text-xs text-gray-400">Envie uma mensagem para comunicar com a equipa</p>
                              </div>
                            ) : (
                              messagesMap[sub.submission_id].map((msg) => (
                                <div
                                  key={msg.id}
                                  className={`flex ${msg.is_current_user ? 'justify-end' : 'justify-start'}`}
                                >
                                  <div
                                    className={`max-w-[80%] rounded-xl px-3 py-2 ${
                                      msg.is_current_user
                                        ? 'bg-[#009999] text-white'
                                        : 'bg-gray-100 text-gray-900'
                                    }`}
                                  >
                                    {!msg.is_current_user && (
                                      <p className="text-xs font-semibold mb-0.5 opacity-70">{msg.sender_name}</p>
                                    )}
                                    {msg.message && (
                                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                    )}
                                    {msg.file && (
                                      <a
                                        href={msg.file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center gap-1 text-xs mt-1 ${
                                          msg.is_current_user ? 'text-white/80 hover:text-white' : 'text-[#009999] hover:underline'
                                        }`}
                                      >
                                        <Paperclip className="h-3 w-3" />
                                        {msg.file.filename}
                                      </a>
                                    )}
                                    <p className={`text-[10px] mt-1 ${msg.is_current_user ? 'text-white/50' : 'text-gray-400'}`}>
                                      {formatMsgDate(msg.created)}
                                    </p>
                                  </div>
                                </div>
                              ))
                            )}
                            <div ref={messagesEndRef} />
                          </div>

                          {/* Send message */}
                          <div className="border-t border-gray-200 p-3">
                            <div className="flex items-end gap-2">
                              <textarea
                                value={newMessageMap[sub.submission_id] || ''}
                                onChange={(e) =>
                                  setNewMessageMap(prev => ({ ...prev, [sub.submission_id]: e.target.value }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSendMessage(sub.submission_id)
                                  }
                                }}
                                placeholder="Escrever mensagem..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#009999] focus:border-[#009999] outline-none resize-none"
                                rows={1}
                              />
                              <button
                                onClick={() => handleSendMessage(sub.submission_id)}
                                disabled={sendingMessageId === sub.submission_id || !(newMessageMap[sub.submission_id] || '').trim()}
                                className="p-2 bg-[#009999] text-white rounded-lg hover:bg-[#007a7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {sendingMessageId === sub.submission_id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Send className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
