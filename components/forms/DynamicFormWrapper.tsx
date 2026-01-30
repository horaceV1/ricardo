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
        
        // formId can be either UUID or internal ID
        // Try UUID first (if it contains dashes)
        const isUUID = String(formId).includes('-')
        let url = `${baseUrl}/jsonapi/dynamic_form/dynamic_form/${formId}`
        
        // If it's not a UUID, we need to fetch all and filter by drupal_internal__id
        if (!isUUID) {
          url = `${baseUrl}/jsonapi/dynamic_form/dynamic_form?filter[drupal_internal__id]=${formId}`
        }
        
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/vnd.api+json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch form data')
        }

        const json = await response.json()
        const form = isUUID ? json.data : json.data[0]
        
        if (!form) {
          throw new Error('Form not found')
        }

        // Parse the form fields from Drupal
        const fields: FormField[] = form.attributes.fields || []

        setFormData({
          id: form.attributes.drupal_internal__id || formId.toString(),
          title: form.attributes.name || form.attributes.label || 'Formulário',
          fields,
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
      className={className}
    />
  )
}
