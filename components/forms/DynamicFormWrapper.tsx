"use client"

import { useEffect, useState } from 'react'
import { DynamicForm } from './DynamicForm'

interface FormField {
  label: string
  type: "texto" | "documento" | "imagem"
  required: boolean
  link?: string
}

interface DynamicFormData {
  id: string
  title: string
  fields: FormField[]
  requireAuth: boolean
}

interface DynamicFormWrapperProps {
  formId: string | number
  className?: string
}

export default function DynamicFormWrapper({ formId, className }: DynamicFormWrapperProps) {
  const [formData, setFormData] = useState<DynamicFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
        
        // Use the custom API endpoint that doesn't require authentication
        const url = `${baseUrl}/api/dynamic-form/${formId}`
        
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch form data')
        }

        const form = await response.json()
        
        if (!form || form.error) {
          throw new Error(form.error || 'Form not found')
        }

        // The API returns the form data directly
        const fields: FormField[] = form.fields || []

        setFormData({
          id: form.id || formId.toString(),
          title: form.label || 'Formulário',
          fields,
          requireAuth: form.require_auth || false,
        })
      } catch (err) {
        console.error('Error fetching form:', err)
        setError('Não foi possível carregar o formulário')
      } finally {
        setLoading(false)
      }
    }

    if (formId) {
      fetchFormData()
    }
  }, [formId])

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-2xl p-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !formData) {
    return null // Silently fail if form not found
  }

  return (
    <DynamicForm
      formId={formData.id}
      formTitle={formData.title}
      fields={formData.fields}
      requireAuth={formData.requireAuth}
      className={className}
    />
  )
}
