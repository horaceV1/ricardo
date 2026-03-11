"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock, CheckCircle, XCircle, AlertCircle, FileText, Calendar, Loader2, ArrowRight } from 'lucide-react'

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

export default function RecentActivity({ limit = 5, showHeader = true }: RecentActivityProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      setError(null)

      const tokensStr = localStorage.getItem('drupal_auth_tokens')
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      if (tokensStr) {
        const tokens = JSON.parse(tokensStr)
        if (tokens.access_token) {
          headers['Authorization'] = `Bearer ${tokens.access_token}`
        }
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/api/recent-activity`,
        { credentials: 'include', headers }
      )

      if (!response.ok) throw new Error('Failed to fetch activities')

      const data = await response.json()
      if (data.success) {
        setActivities(data.activities.slice(0, limit))
      }
    } catch (err) {
      console.error('Error fetching activities:', err)
      setError('Não foi possível carregar as atividades recentes')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'denied': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-orange-500" />
    }
  }

  const getStatusBadge = (status: string, statusLabel: string) => {
    const colors: Record<string, string> = {
      approved: 'bg-green-100 text-green-800 border-green-200',
      denied: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-orange-100 text-orange-800 border-orange-200',
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[status] || colors.pending}`}>
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
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#009999]" />
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
        <div className="flex items-center justify-center py-8 text-red-600">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm ml-2">{error}</p>
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
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">Nenhuma submissão ainda</p>
          <p className="text-xs mt-1 text-gray-400">As suas submissões aparecerão aqui</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {showHeader && (
        <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-[#009999]/5 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#009999]" />
                Atividade Recente
              </h2>
              <p className="text-xs text-gray-500 mt-1">Acompanhe o status das suas submissões</p>
            </div>
          </div>
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {activities.map((activity) => {
          const fieldApprovals = activity.field_approvals || {}
          const hasFieldApprovals = Object.keys(fieldApprovals).length > 0

          return (
            <div key={activity.id} className="p-4 sm:p-5 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{activity.form_name}</h3>
                    {getStatusBadge(activity.status, activity.status_label)}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                    <Calendar className="h-3 w-3" />
                    <span>Enviado: {activity.submitted_date_formatted}</span>
                  </div>
                  {/* Per-field approval pills */}
                  {hasFieldApprovals && (
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(fieldApprovals).map(([label, approval]) => (
                        <span
                          key={label}
                          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            approval.status === 'approved'
                              ? 'bg-green-50 text-green-700'
                              : approval.status === 'denied'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {approval.status === 'approved' ? (
                            <CheckCircle className="h-2.5 w-2.5" />
                          ) : approval.status === 'denied' ? (
                            <XCircle className="h-2.5 w-2.5" />
                          ) : (
                            <Clock className="h-2.5 w-2.5" />
                          )}
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Link to full submissions page */}
      <div className="p-4 bg-gray-50/80 border-t border-gray-100">
        <Link
          href="/conta/minhas-submissoes"
          className="flex items-center justify-center gap-2 text-sm font-medium text-[#009999] hover:text-[#007a7a] transition-colors no-underline"
        >
          Ver todas as submissões
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
