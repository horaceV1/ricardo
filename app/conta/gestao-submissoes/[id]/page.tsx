"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  FileText,
  Download,
  MessageSquare,
  Send,
  Paperclip,
  UserCheck,
  Users,
  ChevronDown,
  RefreshCw,
  ExternalLink,
  X,
} from "lucide-react"

interface FieldApproval {
  label: string
  type: string
  approval_status: string
  approval_note: string
  approval_date: string | null
  filename?: string
  download_url?: string
  value?: string
}

interface Assignment {
  worker_uid: number
  worker_name: string
  worker_email: string
  assigned_at: number | null
}

interface Submission {
  submission_id: number
  form_id: string
  form_label: string
  email: string
  created: number
  approval_status: string
  approval_note: string
  approval_date: string | null
  fields: FieldApproval[]
  assignment: Assignment | null
  message_count: number
}

interface Worker {
  uid: number
  name: string
  email: string
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

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending: { label: "Pendente", color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200", icon: Clock },
  approved: { label: "Aprovado", color: "text-green-700", bg: "bg-green-50 border-green-200", icon: CheckCircle },
  denied: { label: "Recusado", color: "text-red-700", bg: "bg-red-50 border-red-200", icon: XCircle },
  partial: { label: "Parcial", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: AlertTriangle },
}

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.pending
}

function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getAuthHeaders(): HeadersInit {
  const tokensStr = localStorage.getItem("drupal_auth_tokens")
  const headers: HeadersInit = { "Content-Type": "application/json" }
  if (tokensStr) {
    const tokens = JSON.parse(tokensStr)
    if (tokens.access_token) {
      headers["Authorization"] = `Bearer ${tokens.access_token}`
    }
  }
  return headers
}

function getAuthToken(): string | null {
  const tokensStr = localStorage.getItem("drupal_auth_tokens")
  if (!tokensStr) return null
  const tokens = JSON.parse(tokensStr)
  return tokens.access_token || null
}

export default function SubmissionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const submissionId = params.id as string
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Field approval
  const [approvingField, setApprovingField] = useState<string | null>(null)
  const [approvalNote, setApprovalNote] = useState("")
  const [approvalModalField, setApprovalModalField] = useState<string | null>(null)
  const [approvalAction, setApprovalAction] = useState<"approved" | "denied" | "pending">("approved")

  // Workers
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loadingWorkers, setLoadingWorkers] = useState(false)
  const [showWorkerDropdown, setShowWorkerDropdown] = useState(false)
  const [assigningWorker, setAssigningWorker] = useState(false)

  // Messages
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [sendingMessage, setSendingMessage] = useState(false)
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [uploadingFile, setUploadingFile] = useState(false)

  const isAllowed = user?.roles?.includes("administrator") || user?.roles?.includes("tecnico")
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

  // Fetch submission detail
  const fetchSubmission = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`${baseUrl}/api/management/submissions`, {
        headers: getAuthHeaders(),
      })

      if (!res.ok) throw new Error("Erro ao carregar")
      const data = await res.json()
      const found = data.submissions?.find((s: Submission) => s.submission_id === Number(submissionId))

      if (!found) {
        setError("Submissão não encontrada")
        return
      }

      setSubmission(found)
    } catch (err) {
      console.error(err)
      setError("Erro ao carregar submissão")
    } finally {
      setLoading(false)
    }
  }, [baseUrl, submissionId])

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      setLoadingMessages(true)
      const res = await fetch(`${baseUrl}/api/submission/${submissionId}/messages`, {
        headers: getAuthHeaders(),
      })

      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
      }
    } catch (err) {
      console.error("Error fetching messages:", err)
    } finally {
      setLoadingMessages(false)
    }
  }, [baseUrl, submissionId])

  // Fetch workers
  const fetchWorkers = useCallback(async () => {
    try {
      setLoadingWorkers(true)
      const res = await fetch(`${baseUrl}/api/workers`, {
        headers: getAuthHeaders(),
      })

      if (res.ok) {
        const data = await res.json()
        setWorkers(data.workers || [])
      }
    } catch (err) {
      console.error("Error fetching workers:", err)
    } finally {
      setLoadingWorkers(false)
    }
  }, [baseUrl])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/entrar")
      return
    }
    if (!authLoading && user && !isAllowed) {
      router.push("/conta")
      return
    }
    if (isAuthenticated && isAllowed) {
      fetchSubmission()
      fetchMessages()
      fetchWorkers()
    }
  }, [authLoading, isAuthenticated, user, isAllowed, router, fetchSubmission, fetchMessages, fetchWorkers])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Approve/deny field
  const handleFieldApproval = async (fieldLabel: string, status: "approved" | "denied" | "pending", note: string) => {
    try {
      setApprovingField(fieldLabel)

      const res = await fetch(`${baseUrl}/api/management/submission/${submissionId}/approve-field`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          field_label: fieldLabel,
          status,
          note,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erro ao atualizar")
      }

      // Refresh submission
      await fetchSubmission()
      setApprovalModalField(null)
      setApprovalNote("")
    } catch (err) {
      console.error(err)
      alert("Erro ao atualizar aprovação do campo")
    } finally {
      setApprovingField(null)
    }
  }

  // Assign worker
  const handleAssignWorker = async (workerUid: number | null) => {
    try {
      setAssigningWorker(true)
      const res = await fetch(`${baseUrl}/api/submission/${submissionId}/assign`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ worker_uid: workerUid }),
      })

      if (!res.ok) throw new Error("Erro ao atribuir")
      await fetchSubmission()
      setShowWorkerDropdown(false)
    } catch (err) {
      console.error(err)
      alert("Erro ao atribuir técnico")
    } finally {
      setAssigningWorker(false)
    }
  }

  // Upload file
  const handleUploadFile = async (): Promise<number | null> => {
    if (!attachedFile) return null

    try {
      setUploadingFile(true)
      const token = getAuthToken()
      const formData = new FormData()
      formData.append("file", attachedFile)

      const res = await fetch(`${baseUrl}/api/submission/message/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()
      return data.fid || null
    } catch (err) {
      console.error(err)
      alert("Erro ao enviar ficheiro")
      return null
    } finally {
      setUploadingFile(false)
    }
  }

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() && !attachedFile) return

    try {
      setSendingMessage(true)

      let fileId = null
      if (attachedFile) {
        fileId = await handleUploadFile()
      }

      const body: Record<string, unknown> = {}
      if (newMessage.trim()) body.message = newMessage.trim()
      if (fileId) body.file_id = fileId

      const res = await fetch(`${baseUrl}/api/submission/${submissionId}/messages`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error("Erro ao enviar mensagem")

      setNewMessage("")
      setAttachedFile(null)
      await fetchMessages()
    } catch (err) {
      console.error(err)
      alert("Erro ao enviar mensagem")
    } finally {
      setSendingMessage(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#009999]" />
      </div>
    )
  }

  if (!isAllowed) return null

  if (error || !submission) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center py-20">
            <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
            <p className="text-gray-700 font-medium mb-2">{error || "Submissão não encontrada"}</p>
            <Link
              href="/conta/gestao-submissoes"
              className="mt-4 px-4 py-2 bg-[#009999] text-white rounded-lg text-sm font-medium hover:bg-[#007a7a] transition-colors"
            >
              Voltar à lista
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const overallConfig = getStatusConfig(submission.approval_status)
  const OverallIcon = overallConfig.icon

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#009999] to-[#007a7a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/conta/gestao-submissoes"
              className="text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
                  {submission.form_label}
                </h1>
                <span className="text-white/50 text-sm font-mono">#{submission.submission_id}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-white/70 text-sm">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {submission.email || "Sem email"}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDate(submission.created)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${overallConfig.bg} ${overallConfig.color}`}>
                <OverallIcon className="h-3.5 w-3.5" />
                {overallConfig.label}
              </span>
              <button
                onClick={() => {
                  fetchSubmission()
                  fetchMessages()
                }}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Fields */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#009999]" />
                  Campos do Formulário
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {submission.fields.map((field, index) => {
                  const fieldConfig = getStatusConfig(field.approval_status)
                  const FieldIcon = fieldConfig.icon
                  const isModalOpen = approvalModalField === field.label

                  return (
                    <div key={index} className="p-5 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-gray-900">{field.label}</h4>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${fieldConfig.bg} ${fieldConfig.color}`}>
                              <FieldIcon className="h-3 w-3" />
                              {fieldConfig.label}
                            </span>
                          </div>

                          {/* Value or File */}
                          {field.filename ? (
                            <div className="flex items-center gap-2 mt-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{field.filename}</span>
                              {field.download_url && (
                                <a
                                  href={field.download_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-[#009999] hover:underline font-medium"
                                >
                                  <Download className="h-3 w-3" />
                                  Descarregar
                                </a>
                              )}
                            </div>
                          ) : field.value ? (
                            <p className="text-sm text-gray-600 mt-1 break-words">{field.value}</p>
                          ) : (
                            <p className="text-sm text-gray-400 mt-1 italic">Sem valor</p>
                          )}

                          {/* Approval note */}
                          {field.approval_note && (
                            <p className="text-xs text-gray-500 mt-2 bg-gray-100 rounded-lg px-3 py-2">
                              <span className="font-medium">Nota:</span> {field.approval_note}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {field.approval_status !== "approved" && (
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                handleFieldApproval(field.label, "approved", "")
                              }}
                              disabled={approvingField === field.label}
                              className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50"
                              title="Aprovar"
                            >
                              {approvingField === field.label ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              setApprovalModalField(field.label)
                              setApprovalAction("denied")
                              setApprovalNote(field.approval_note || "")
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                            title="Recusar com nota"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Approval Modal */}
                      {isModalOpen && (
                        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-sm font-semibold text-gray-900">
                              {approvalAction === "denied" ? "Recusar" : "Atualizar"} campo
                            </h5>
                            <button
                              onClick={() => {
                                setApprovalModalField(null)
                                setApprovalNote("")
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <button
                              onClick={() => setApprovalAction("denied")}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                approvalAction === "denied"
                                  ? "bg-red-100 text-red-700 border border-red-200"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              Recusar
                            </button>
                            <button
                              onClick={() => setApprovalAction("pending")}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                approvalAction === "pending"
                                  ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              Pendente
                            </button>
                            <button
                              onClick={() => setApprovalAction("approved")}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                approvalAction === "approved"
                                  ? "bg-green-100 text-green-700 border border-green-200"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              Aprovar
                            </button>
                          </div>

                          <textarea
                            value={approvalNote}
                            onChange={(e) => setApprovalNote(e.target.value)}
                            placeholder="Nota (opcional)..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#009999] focus:border-[#009999] outline-none resize-none"
                            rows={2}
                          />

                          <div className="flex justify-end gap-2 mt-3">
                            <button
                              onClick={() => {
                                setApprovalModalField(null)
                                setApprovalNote("")
                              }}
                              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleFieldApproval(field.label, approvalAction, approvalNote)}
                              disabled={approvingField === field.label}
                              className="px-4 py-1.5 bg-[#009999] text-white text-sm font-medium rounded-lg hover:bg-[#007a7a] transition-colors disabled:opacity-50"
                            >
                              {approvingField === field.label ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Confirmar"
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Messages Section */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-[#009999]" />
                  Mensagens
                  {messages.length > 0 && (
                    <span className="text-xs bg-[#009999]/10 text-[#009999] rounded-full px-2 py-0.5 font-medium">
                      {messages.length}
                    </span>
                  )}
                </h2>
              </div>

              {/* Messages List */}
              <div className="max-h-96 overflow-y-auto p-4 space-y-3">
                {loadingMessages ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#009999]" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Nenhuma mensagem ainda</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.is_current_user ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl px-4 py-3 ${
                          msg.is_current_user
                            ? "bg-[#009999] text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        {!msg.is_current_user && (
                          <p className="text-xs font-semibold mb-1 opacity-70">{msg.sender_name}</p>
                        )}
                        {msg.message && <p className="text-sm whitespace-pre-wrap">{msg.message}</p>}
                        {msg.file && (
                          <a
                            href={msg.file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1.5 text-xs mt-2 ${
                              msg.is_current_user ? "text-white/80 hover:text-white" : "text-[#009999] hover:underline"
                            }`}
                          >
                            <Paperclip className="h-3 w-3" />
                            {msg.file.filename}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        <p className={`text-xs mt-1 ${msg.is_current_user ? "text-white/50" : "text-gray-400"}`}>
                          {formatDate(msg.created)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Send Message */}
              <div className="border-t border-gray-100 p-4">
                {attachedFile && (
                  <div className="flex items-center gap-2 mb-2 bg-gray-50 rounded-lg px-3 py-2">
                    <Paperclip className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 truncate flex-1">{attachedFile.name}</span>
                    <button
                      onClick={() => setAttachedFile(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <div className="flex items-end gap-2">
                  <label className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
                    <Paperclip className="h-5 w-5" />
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) setAttachedFile(file)
                        e.target.value = ""
                      }}
                    />
                  </label>

                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    placeholder="Escrever mensagem..."
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#009999] focus:border-[#009999] outline-none resize-none max-h-24"
                    rows={1}
                  />

                  <button
                    onClick={handleSendMessage}
                    disabled={sendingMessage || uploadingFile || (!newMessage.trim() && !attachedFile)}
                    className="p-2.5 bg-[#009999] text-white rounded-xl hover:bg-[#007a7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingMessage || uploadingFile ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assignment */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-[#009999]" />
                  Técnico Atribuído
                </h3>
              </div>

              <div className="p-5">
                {submission.assignment ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#009999]/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-[#009999]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {submission.assignment.worker_name}
                        </p>
                        <p className="text-xs text-gray-500">{submission.assignment.worker_email}</p>
                      </div>
                    </div>
                    {submission.assignment.assigned_at && (
                      <p className="text-xs text-gray-400">
                        Atribuído em {formatDate(submission.assignment.assigned_at)}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">Nenhum técnico atribuído</p>
                )}

                <div className="relative mt-4">
                  <button
                    onClick={() => setShowWorkerDropdown(!showWorkerDropdown)}
                    disabled={assigningWorker || loadingWorkers}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-between disabled:opacity-50"
                  >
                    <span>{submission.assignment ? "Reatribuir" : "Atribuir técnico"}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showWorkerDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {showWorkerDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowWorkerDropdown(false)} />
                      <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20 max-h-48 overflow-y-auto">
                        {submission.assignment && (
                          <button
                            onClick={() => handleAssignWorker(null)}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Remover atribuição
                          </button>
                        )}
                        {workers.map((worker) => (
                          <button
                            key={worker.uid}
                            onClick={() => handleAssignWorker(worker.uid)}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                              submission.assignment?.worker_uid === worker.uid
                                ? "bg-[#009999]/5 text-[#009999] font-semibold"
                                : "text-gray-700"
                            }`}
                          >
                            <p className="font-medium">{worker.name}</p>
                            <p className="text-xs text-gray-400">{worker.email}</p>
                          </button>
                        ))}
                        {workers.length === 0 && !loadingWorkers && (
                          <p className="px-4 py-3 text-sm text-gray-400">Sem técnicos disponíveis</p>
                        )}
                        {loadingWorkers && (
                          <div className="flex items-center justify-center py-3">
                            <Loader2 className="h-4 w-4 animate-spin text-[#009999]" />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Status Summary */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#009999]" />
                  Resumo dos Campos
                </h3>
              </div>

              <div className="p-5 space-y-3">
                {(() => {
                  const pending = submission.fields.filter((f) => f.approval_status === "pending").length
                  const approved = submission.fields.filter((f) => f.approval_status === "approved").length
                  const denied = submission.fields.filter((f) => f.approval_status === "denied").length
                  const total = submission.fields.length

                  return (
                    <>
                      {/* Progress bar */}
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
                        {approved > 0 && (
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${(approved / total) * 100}%` }}
                          />
                        )}
                        {denied > 0 && (
                          <div
                            className="h-full bg-red-500"
                            style={{ width: `${(denied / total) * 100}%` }}
                          />
                        )}
                        {pending > 0 && (
                          <div
                            className="h-full bg-yellow-400"
                            style={{ width: `${(pending / total) * 100}%` }}
                          />
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center py-2 bg-green-50 rounded-lg">
                          <p className="text-lg font-bold text-green-700">{approved}</p>
                          <p className="text-xs text-green-600">Aprovados</p>
                        </div>
                        <div className="text-center py-2 bg-yellow-50 rounded-lg">
                          <p className="text-lg font-bold text-yellow-700">{pending}</p>
                          <p className="text-xs text-yellow-600">Pendentes</p>
                        </div>
                        <div className="text-center py-2 bg-red-50 rounded-lg">
                          <p className="text-lg font-bold text-red-700">{denied}</p>
                          <p className="text-xs text-red-600">Recusados</p>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>

            {/* Submission Details */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="text-sm font-bold text-gray-900">Detalhes</h3>
              </div>

              <div className="p-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">ID</span>
                  <span className="font-mono text-gray-900">#{submission.submission_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Formulário</span>
                  <span className="text-gray-900 font-medium text-right max-w-[160px] truncate">
                    {submission.form_label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Criado</span>
                  <span className="text-gray-900">{formatDate(submission.created)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="text-gray-900 truncate max-w-[160px]">{submission.email || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mensagens</span>
                  <span className="text-gray-900">{messages.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
