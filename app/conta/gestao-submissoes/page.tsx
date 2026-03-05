"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import {
  FileText,
  Search,
  Filter,
  ChevronDown,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  Users,
  MessageSquare,
  Eye,
  BarChart3,
  Inbox,
  UserCheck,
  RefreshCw,
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

interface AvailableForm {
  id: string
  label: string
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

export default function GestaoSubmissoesPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [availableForms, setAvailableForms] = useState<AvailableForm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [formFilter, setFormFilter] = useState("all")
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const [formDropdownOpen, setFormDropdownOpen] = useState(false)

  const isAllowed = user?.roles?.includes("administrator") || user?.roles?.includes("tecnico")

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const tokensStr = localStorage.getItem("drupal_auth_tokens")
      if (!tokensStr) {
        setError("Sessão expirada. Faça login novamente.")
        return
      }

      const tokens = JSON.parse(tokensStr)
      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

      const res = await fetch(`${baseUrl}/api/management/submissions`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.access_token}`,
        },
      })

      if (!res.ok) {
        if (res.status === 403) {
          setError("Sem permissão para aceder a esta página.")
          return
        }
        throw new Error("Erro ao carregar submissões")
      }

      const data = await res.json()
      setSubmissions(data.submissions || [])
      setAvailableForms(data.available_forms || [])
    } catch (err) {
      console.error("Error fetching submissions:", err)
      setError("Erro ao carregar submissões. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }, [])

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
      fetchSubmissions()
    }
  }, [authLoading, isAuthenticated, user, isAllowed, router, fetchSubmissions])

  // Filter submissions locally
  const filteredSubmissions = submissions.filter((s) => {
    if (statusFilter !== "all" && s.approval_status !== statusFilter) return false
    if (formFilter !== "all" && s.form_id !== formFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const matchesEmail = s.email.toLowerCase().includes(q)
      const matchesId = s.submission_id.toString().includes(q)
      const matchesForm = s.form_label.toLowerCase().includes(q)
      if (!matchesEmail && !matchesId && !matchesForm) return false
    }
    return true
  })

  // Stats
  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => s.approval_status === "pending").length,
    approved: submissions.filter((s) => s.approval_status === "approved").length,
    denied: submissions.filter((s) => s.approval_status === "denied").length,
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#009999]" />
      </div>
    )
  }

  if (!isAllowed) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#009999] to-[#007a7a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/conta"
              className="text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Gestão de Submissões
              </h1>
              <p className="text-white/70 text-sm mt-1">
                Gerir candidaturas e documentos dos clientes
              </p>
            </div>
            <button
              onClick={fetchSubmissions}
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-white/80" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                  <p className="text-xs text-white/60">Total</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-yellow-300" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.pending}</p>
                  <p className="text-xs text-white/60">Pendentes</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-300" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.approved}</p>
                  <p className="text-xs text-white/60">Aprovados</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <XCircle className="h-8 w-8 text-red-300" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.denied}</p>
                  <p className="text-xs text-white/60">Recusados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar por email, ID ou formulário..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#009999] focus:border-[#009999] outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setStatusDropdownOpen(!statusDropdownOpen)
                  setFormDropdownOpen(false)
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                <Filter className="h-4 w-4 text-[#009999]" />
                <span>Estado:</span>
                <span className="font-semibold text-[#009999]">
                  {statusFilter === "all" ? "Todos" : getStatusConfig(statusFilter).label}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${statusDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {statusDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setStatusDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20">
                    {[
                      { value: "all", label: "Todos" },
                      { value: "pending", label: "Pendente" },
                      { value: "approved", label: "Aprovado" },
                      { value: "denied", label: "Recusado" },
                      { value: "partial", label: "Parcial" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setStatusFilter(opt.value)
                          setStatusDropdownOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                          statusFilter === opt.value
                            ? "bg-[#009999]/5 text-[#009999] font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Form Filter */}
            {availableForms.length > 1 && (
              <div className="relative">
                <button
                  onClick={() => {
                    setFormDropdownOpen(!formDropdownOpen)
                    setStatusDropdownOpen(false)
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  <FileText className="h-4 w-4 text-[#009999]" />
                  <span>Formulário:</span>
                  <span className="font-semibold text-[#009999] max-w-[120px] truncate">
                    {formFilter === "all"
                      ? "Todos"
                      : availableForms.find((f) => f.id === formFilter)?.label || formFilter}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${formDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {formDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setFormDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20 max-h-64 overflow-y-auto">
                      <button
                        onClick={() => {
                          setFormFilter("all")
                          setFormDropdownOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                          formFilter === "all" ? "bg-[#009999]/5 text-[#009999] font-semibold" : "text-gray-700"
                        }`}
                      >
                        Todos os formulários
                      </button>
                      {availableForms.map((form) => (
                        <button
                          key={form.id}
                          onClick={() => {
                            setFormFilter(form.id)
                            setFormDropdownOpen(false)
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                            formFilter === form.id ? "bg-[#009999]/5 text-[#009999] font-semibold" : "text-gray-700"
                          }`}
                        >
                          {form.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <p className="text-gray-500 text-xs mt-3">
            Mostrando <span className="font-semibold text-gray-700">{filteredSubmissions.length}</span> de{" "}
            <span className="font-semibold text-gray-700">{submissions.length}</span> submissões
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-[#009999] mb-4" />
            <p className="text-gray-500">A carregar submissões...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
            <p className="text-gray-700 font-medium mb-2">Erro</p>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <button
              onClick={fetchSubmissions}
              className="px-4 py-2 bg-[#009999] text-white rounded-lg text-sm font-medium hover:bg-[#007a7a] transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Inbox className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma submissão encontrada</h3>
            <p className="text-gray-500 text-sm mb-4">
              {searchQuery || statusFilter !== "all" || formFilter !== "all"
                ? "Ajuste os filtros para ver mais resultados."
                : "Ainda não existem submissões de formulários."}
            </p>
            {(searchQuery || statusFilter !== "all" || formFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                  setFormFilter("all")
                }}
                className="text-[#009999] font-semibold hover:underline text-sm"
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => {
              const config = getStatusConfig(submission.approval_status)
              const StatusIcon = config.icon

              // Count field approvals
              const totalFields = submission.fields.length
              const approvedFields = submission.fields.filter((f) => f.approval_status === "approved").length
              const deniedFields = submission.fields.filter((f) => f.approval_status === "denied").length

              return (
                <Link
                  key={submission.submission_id}
                  href={`/conta/gestao-submissoes/${submission.submission_id}`}
                  className="block bg-white rounded-xl border border-gray-200 hover:border-[#009999]/30 hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Left: Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-mono text-gray-400">#{submission.submission_id}</span>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {config.label}
                          </span>
                          {submission.message_count > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                              <MessageSquare className="h-3 w-3" />
                              {submission.message_count}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#009999] transition-colors truncate">
                          {submission.form_label}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
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

                      {/* Right: Meta */}
                      <div className="flex items-center gap-4 sm:gap-6">
                        {/* Field progress */}
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                            <FileText className="h-3 w-3" />
                            Campos
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-green-600">{approvedFields}</span>
                            <span className="text-xs text-gray-300">/</span>
                            {deniedFields > 0 && (
                              <>
                                <span className="text-xs font-bold text-red-600">{deniedFields}</span>
                                <span className="text-xs text-gray-300">/</span>
                              </>
                            )}
                            <span className="text-xs font-bold text-gray-600">{totalFields}</span>
                          </div>
                        </div>

                        {/* Assignment */}
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                            <UserCheck className="h-3 w-3" />
                            Técnico
                          </div>
                          <p className="text-xs font-medium text-gray-700 max-w-[100px] truncate">
                            {submission.assignment?.worker_name || "—"}
                          </p>
                        </div>

                        {/* View */}
                        <div className="hidden sm:flex items-center">
                          <Eye className="h-5 w-5 text-gray-300 group-hover:text-[#009999] transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
