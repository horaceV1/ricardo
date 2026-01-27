"use client"

import { useState } from "react"
import { FileUp, Send, CheckCircle, AlertCircle } from "lucide-react"

interface FormField {
  label: string
  type: "texto" | "documento"
  required: boolean
  link?: string
}

interface DynamicFormProps {
  formId: string
  formTitle: string
  fields: FormField[]
  className?: string
}

export function DynamicForm({ formId, formTitle, fields, className = "" }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, string | File | null>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (fieldIndex: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [`field_${fieldIndex}`]: value,
    }))
  }

  const handleFileChange = (fieldIndex: number, file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      [`field_${fieldIndex}`]: file,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
      const submitData = new FormData()
      
      submitData.append("form_id", formId)
      
      fields.forEach((field, index) => {
        const value = formData[`field_${index}`]
        if (value) {
          submitData.append(`field_${index}`, value as string | Blob)
          submitData.append(`field_${index}_label`, field.label)
        }
      })

      const response = await fetch(
        `${baseUrl}/api/dynamic-form/submit`,
        {
          method: "POST",
          body: submitData,
          credentials: "include",
        }
      )

      if (!response.ok) {
        throw new Error("Failed to submit form")
      }

      setSuccess(true)
      
      // Reset form
      const resetData: Record<string, string | File | null> = {}
      fields.forEach((field, index) => {
        resetData[`field_${index}`] = field.type === "documento" ? null : ""
      })
      setFormData(resetData)
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError("Erro ao enviar formulário. Por favor, tente novamente.")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={`bg-gradient-to-br from-[#009999]/5 to-[#005c5c]/5 rounded-2xl p-8 md:p-10 border border-[#009999]/10 ${className}`}>
      <div className="max-w-2xl mx-auto">
        <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
          {formTitle}
        </h3>
        <p className="text-gray-600 mb-6">
          Preencha o formulário abaixo para se candidatar
        </p>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900">Formulário enviado com sucesso!</p>
              <p className="text-sm text-green-700 mt-1">
                Recebemos sua submissão e entraremos em contato em breve.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-900">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === "texto" ? (
                <input
                  type="text"
                  required={field.required}
                  value={(formData[`field_${index}`] as string) || ""}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent transition-all"
                  placeholder={`Digite ${field.label.toLowerCase()}`}
                />
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="file"
                      required={field.required}
                      onChange={(e) =>
                        handleFileChange(index, e.target.files?.[0] || null)
                      }
                      className="hidden"
                      id={`file_${index}`}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <label
                      htmlFor={`file_${index}`}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-[#009999] hover:bg-[#009999]/5 cursor-pointer transition-all"
                    >
                      <FileUp className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700">
                        {formData[`field_${index}`]
                          ? (formData[`field_${index}`] as File).name
                          : "Selecionar arquivo"}
                      </span>
                    </label>
                  </div>
                  {field.link && (
                    <a
                      href={field.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-[#009999] hover:text-[#005c5c] hover:underline transition-colors"
                    >
                      Obter documento aqui →
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-4 bg-gradient-to-r from-[#009999] to-[#005c5c] text-white font-bold rounded-lg hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Enviar Formulário
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
