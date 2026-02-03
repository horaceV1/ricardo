"use client"

import { useEffect, useState } from 'react'
import { Clock, CheckCircle, XCircle, AlertCircle, FileText, Calendar } from 'lucide-react'

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
}

interface RecentActivityProps {
  limit?: number
  showHeader?: boolean
}

export default function RecentActivity({ limit, showHeader = true }: RecentActivityProps) {
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
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="h-6 w-6 text-[#009999]" />
            Atividade Recente
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Acompanhe o status das suas submissões
          </p>
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="p-6 hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {activity.form_name}
                  </h3>
                  {getStatusBadge(activity.status, activity.status_label)}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>Enviado: {activity.submitted_date_formatted}</span>
                  </div>
                  {activity.approval_date_formatted && (
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4" />
                      <span>Avaliado: {activity.approval_date_formatted}</span>
                    </div>
                  )}
                </div>

                {activity.approval_note && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Nota do Administrador:
                    </p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {activity.approval_note}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex-shrink-0">
                {getStatusIcon(activity.status)}
              </div>
            </div>
          </div>
        ))}
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
