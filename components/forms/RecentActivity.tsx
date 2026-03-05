"use client"

import { useEffect, useState, useRef } from 'react'
import { Clock, CheckCircle, XCircle, AlertCircle, FileText, Calendar, Trash2, Loader2, ChevronDown, ChevronUp, MessageSquare, Send, Paperclip, ExternalLink, X as XIcon } from 'lucide-react'

interface FieldApproval {
  status: 'pending' | 'approved' | 'denied'
  note: string
  date: number | null
}

interface Activity {
  id: number
  form_name: string
  form_id: string
  submitted_date: number
  submitted_date_formatted: string
  status: 'pending' | 'approved' | 'denied'
  status_label: string
  status_color: 'orange' | 'green' | 'red'
  approval_note?: string
  approval_date?: number
  approval_date_formatted?: string
  field_approvals?: Record<string, FieldApproval>
}

interface RecentActivityProps {
  limit?: number
  showHeader?: boolean
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

export default function RecentActivity({ limit, showHeader = true }: RecentActivityProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false)
  const [clearingAll, setClearingAll] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [messagesMap, setMessagesMap] = useState<Record<number, Message[]>>({})
  const [loadingMessagesId, setLoadingMessagesId] = useState<number | null>(null)
  const [newMessageMap, setNewMessageMap] = useState<Record<number, string>>({})
  const [sendingMessageId, setSendingMessageId] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
      } else {
        console.error('Failed to send message')
      }
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setSendingMessageId(null)
    }
  }

  const handleExpandSubmission = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null)
    } else {
      setExpandedId(id)
      if (!messagesMap[id]) {
        fetchMessages(id)
      }
    }
  }

  const formatMsgDate = (ts: number) => {
    return new Date(ts * 1000).toLocaleDateString('pt-PT', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    })
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get JWT token from localStorage
      const tokensStr = localStorage.getItem('drupal_auth_tokens')
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      
      if (tokensStr) {
        const tokens = JSON.parse(tokensStr)
        if (tokens.access_token) {
          headers['Authorization'] = `Bearer ${tokens.access_token}`
        }
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/api/recent-activity`,
        {
          credentials: 'include',
          headers,
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch activities')
      }

      const data = await response.json()
      
      if (data.success) {
        const activityList = limit ? data.activities.slice(0, limit) : data.activities
        setActivities(activityList)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      console.error('Error fetching activities:', err)
      setError('Não foi possível carregar as atividades recentes')
    } finally {
      setLoading(false)
    }
  }

  const deleteSubmission = async (submissionId: number) => {
    if (!confirm('Tem certeza que deseja excluir esta submissão? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      setDeletingId(submissionId)

      // Get JWT token from localStorage
      const tokensStr = localStorage.getItem('drupal_auth_tokens')
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      
      if (tokensStr) {
        const tokens = JSON.parse(tokensStr)
        if (tokens.access_token) {
          headers['Authorization'] = `Bearer ${tokens.access_token}`
        }
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/api/submission/${submissionId}/delete`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers,
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete submission')
      }

      const data = await response.json()
      
      if (data.success) {
        // Remove from local state
        setActivities(activities.filter(a => a.id !== submissionId))
      } else {
        throw new Error(data.message || 'Failed to delete submission')
      }
    } catch (err) {
      console.error('Error deleting submission:', err)
      alert('Erro ao excluir submissão. Por favor, tente novamente.')
    } finally {
      setDeletingId(null)
    }
  }

  const clearAllSubmissions = async () => {
    try {
      setClearingAll(true)

      // Get JWT token from localStorage
      const tokensStr = localStorage.getItem('drupal_auth_tokens')
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      
      if (tokensStr) {
        const tokens = JSON.parse(tokensStr)
        if (tokens.access_token) {
          headers['Authorization'] = `Bearer ${tokens.access_token}`
        }
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/api/submissions/clear-all`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers,
        }
      )

      if (!response.ok) {
        throw new Error('Failed to clear submissions')
      }

      const data = await response.json()
      
      if (data.success) {
        // Clear local state
        setActivities([])
        setShowClearAllConfirm(false)
      } else {
        throw new Error(data.message || 'Failed to clear submissions')
      }
    } catch (err) {
      console.error('Error clearing submissions:', err)
      alert('Erro ao limpar submissões. Por favor, tente novamente.')
    } finally {
      setClearingAll(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'denied':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-orange-500" />
    }
  }

  const getStatusBadge = (status: string, statusLabel: string) => {
    const colors = {
      approved: 'bg-green-100 text-green-800 border-green-200',
      denied: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-orange-100 text-orange-800 border-orange-200',
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
          colors[status as keyof typeof colors] || colors.pending
        }`}
      >
        {getStatusIcon(status)}
        {statusLabel}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        {showHeader && (
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FileText className="h-6 w-6 text-[#009999]" />
            Atividade Recente
          </h2>
        )}
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009999]"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        {showHeader && (
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FileText className="h-6 w-6 text-[#009999]" />
            Atividade Recente
          </h2>
        )}
        <div className="flex items-center justify-center py-12">
          <div className="text-center text-red-600">
            <AlertCircle className="h-12 w-12 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        {showHeader && (
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FileText className="h-6 w-6 text-[#009999]" />
            Atividade Recente
          </h2>
        )}
        <div className="text-center py-12 text-gray-500">
          <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Nenhuma atividade ainda</p>
          <p className="text-sm mt-2">Suas submissões de formulários aparecerão aqui</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {showHeader && (
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#009999]/5 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FileText className="h-6 w-6 text-[#009999]" />
                Atividade Recente
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Acompanhe o status das suas submissões
              </p>
            </div>
            {activities.length > 0 && (
              <button
                onClick={() => setShowClearAllConfirm(true)}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Limpar Tudo
              </button>
            )}
          </div>
        </div>
      )}

      {/* Clear All Confirmation Dialog */}
      {showClearAllConfirm && (
        <div className="p-6 bg-red-50 border-b border-red-200">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Confirmar exclusão de todas as submissões
              </h3>
              <p className="text-sm text-red-800 mb-4">
                Tem certeza que deseja excluir TODAS as suas submissões? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={clearAllSubmissions}
                  disabled={clearingAll}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {clearingAll && <Loader2 className="h-4 w-4 animate-spin" />}
                  Sim, Excluir Tudo
                </button>
                <button
                  onClick={() => setShowClearAllConfirm(false)}
                  disabled={clearingAll}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {activities.map((activity) => {
          const fieldApprovals = activity.field_approvals || {}
          const hasFieldApprovals = Object.keys(fieldApprovals).length > 0
          const isExpanded = expandedId === activity.id

          return (
            <div
              key={activity.id}
              className="hover:bg-gray-50/50 transition-colors duration-200"
            >
              {/* Main row */}
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {activity.form_name}
                      </h3>
                      {getStatusBadge(activity.status, activity.status_label)}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Enviado: {activity.submitted_date_formatted}</span>
                      </div>
                    </div>

                    {/* Per-field approval summary pills */}
                    {hasFieldApprovals && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {Object.entries(fieldApprovals).map(([label, approval]) => (
                          <span
                            key={label}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                              approval.status === 'approved'
                                ? 'bg-green-50 text-green-700'
                                : approval.status === 'denied'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {approval.status === 'approved' ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : approval.status === 'denied' ? (
                              <XCircle className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {hasFieldApprovals && (
                      <button
                        onClick={() => handleExpandSubmission(activity.id)}
                        className="p-2 text-gray-500 hover:text-[#009999] hover:bg-[#009999]/10 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    )}
                    {!hasFieldApprovals && (
                      <button
                        onClick={() => handleExpandSubmission(activity.id)}
                        className="p-2 text-gray-500 hover:text-[#009999] hover:bg-[#009999]/10 rounded-lg transition-colors"
                        title="Ver mensagens"
                      >
                        <MessageSquare className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteSubmission(activity.id)}
                      disabled={deletingId === activity.id}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Excluir submissão"
                    >
                      {deletingId === activity.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded per-field details */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-4">
                  {/* Field approvals */}
                  {hasFieldApprovals && (
                  <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-100/80 border-b border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700">
                        Estado de cada documento
                      </h4>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {Object.entries(fieldApprovals).map(([label, approval]) => (
                        <div key={label} className="px-4 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span className="text-sm font-medium text-gray-800 truncate">{label}</span>
                            </div>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                                approval.status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : approval.status === 'denied'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}
                            >
                              {approval.status === 'approved' ? (
                                <CheckCircle className="h-3.5 w-3.5" />
                              ) : approval.status === 'denied' ? (
                                <XCircle className="h-3.5 w-3.5" />
                              ) : (
                                <Clock className="h-3.5 w-3.5" />
                              )}
                              {approval.status === 'approved'
                                ? 'Aprovado'
                                : approval.status === 'denied'
                                ? 'Negado'
                                : 'Pendente'}
                            </span>
                          </div>
                          {approval.note && (
                            <div className="mt-2 ml-6 flex items-start gap-1.5">
                              <MessageSquare className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-gray-600 italic">
                                {approval.note}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  )}

                  {/* Messages section */}
                  <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-100/80 border-b border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-[#009999]" />
                        Mensagens
                        {(messagesMap[activity.id]?.length || 0) > 0 && (
                          <span className="text-xs bg-[#009999]/10 text-[#009999] rounded-full px-2 py-0.5">
                            {messagesMap[activity.id].length}
                          </span>
                        )}
                      </h4>
                    </div>

                    {/* Message thread */}
                    <div className="max-h-64 overflow-y-auto p-3 space-y-2">
                      {loadingMessagesId === activity.id ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="h-5 w-5 animate-spin text-[#009999]" />
                        </div>
                      ) : !messagesMap[activity.id] || messagesMap[activity.id].length === 0 ? (
                        <div className="text-center py-6">
                          <MessageSquare className="h-8 w-8 text-gray-200 mx-auto mb-1" />
                          <p className="text-xs text-gray-400">Nenhuma mensagem</p>
                        </div>
                      ) : (
                        messagesMap[activity.id].map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.is_current_user ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-xl px-3 py-2 ${
                                msg.is_current_user
                                  ? 'bg-[#009999] text-white'
                                  : 'bg-white text-gray-900 border border-gray-200'
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

                    {/* Send message input */}
                    <div className="border-t border-gray-200 p-3">
                      <div className="flex items-end gap-2">
                        <textarea
                          value={newMessageMap[activity.id] || ''}
                          onChange={(e) =>
                            setNewMessageMap(prev => ({ ...prev, [activity.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              handleSendMessage(activity.id)
                            }
                          }}
                          placeholder="Escrever mensagem..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#009999] focus:border-[#009999] outline-none resize-none"
                          rows={1}
                        />
                        <button
                          onClick={() => handleSendMessage(activity.id)}
                          disabled={sendingMessageId === activity.id || !(newMessageMap[activity.id] || '').trim()}
                          className="p-2 bg-[#009999] text-white rounded-lg hover:bg-[#007a7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {sendingMessageId === activity.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {activities.length > 0 && limit && (
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <button
            onClick={fetchActivities}
            className="text-sm text-[#009999] hover:text-[#007777] font-medium transition-colors"
          >
            Atualizar
          </button>
        </div>
      )}
    </div>
  )
}
