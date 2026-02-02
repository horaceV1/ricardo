"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Save, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    field_first_name: '',
    field_last_name: '',
    field_phone: '',
    field_address: '',
    field_city: '',
    field_postal_code: '',
    field_country: '',
  })

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/entrar')
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    if (user) {
      // Load user profile data
      loadProfileData()
    }
  }, [user])

  const loadProfileData = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
      const tokensStr = localStorage.getItem('drupal_auth_tokens')
      
      if (!tokensStr) return

      const tokens = JSON.parse(tokensStr)
      
      const response = await fetch(`${baseUrl}/api/auth/user`, {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setFormData({
          field_first_name: userData.field_first_name || '',
          field_last_name: userData.field_last_name || '',
          field_phone: userData.field_phone || '',
          field_address: userData.field_address || '',
          field_city: userData.field_city || '',
          field_postal_code: userData.field_postal_code || '',
          field_country: userData.field_country || '',
        })
      }
    } catch (err) {
      console.error('Failed to load profile:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
      const tokensStr = localStorage.getItem('drupal_auth_tokens')
      
      if (!tokensStr) {
        throw new Error('Not authenticated')
      }

      const tokens = JSON.parse(tokensStr)
      
      const response = await fetch(`${baseUrl}/api/auth/update-profile`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/conta')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#009999]" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Save className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Perfil Atualizado!
            </h2>
            <p className="text-gray-600">
              Redirecionando...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/conta"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Conta
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Editar Perfil</h1>
          <p className="mt-2 text-gray-600">
            Atualize suas informações pessoais
          </p>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label htmlFor="field_first_name" className="block text-sm font-medium text-gray-700 mb-2">
                Primeiro Nome
              </label>
              <input
                id="field_first_name"
                name="field_first_name"
                type="text"
                value={formData.field_first_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent"
                placeholder="João"
                disabled={isLoading}
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="field_last_name" className="block text-sm font-medium text-gray-700 mb-2">
                Sobrenome
              </label>
              <input
                id="field_last_name"
                name="field_last_name"
                type="text"
                value={formData.field_last_name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent"
                placeholder="Silva"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="field_phone" className="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <input
              id="field_phone"
              name="field_phone"
              type="tel"
              value={formData.field_phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent"
              placeholder="+351 123 456 789"
              disabled={isLoading}
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="field_address" className="block text-sm font-medium text-gray-700 mb-2">
              Morada
            </label>
            <input
              id="field_address"
              name="field_address"
              type="text"
              value={formData.field_address}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent"
              placeholder="Rua Exemplo, 123"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* City */}
            <div>
              <label htmlFor="field_city" className="block text-sm font-medium text-gray-700 mb-2">
                Cidade
              </label>
              <input
                id="field_city"
                name="field_city"
                type="text"
                value={formData.field_city}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent"
                placeholder="Lisboa"
                disabled={isLoading}
              />
            </div>

            {/* Postal Code */}
            <div>
              <label htmlFor="field_postal_code" className="block text-sm font-medium text-gray-700 mb-2">
                Código Postal
              </label>
              <input
                id="field_postal_code"
                name="field_postal_code"
                type="text"
                value={formData.field_postal_code}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent"
                placeholder="1000-001"
                disabled={isLoading}
              />
            </div>

            {/* Country */}
            <div>
              <label htmlFor="field_country" className="block text-sm font-medium text-gray-700 mb-2">
                País
              </label>
              <input
                id="field_country"
                name="field_country"
                type="text"
                value={formData.field_country}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent"
                placeholder="Portugal"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-[#009999] to-[#007a7a] hover:from-[#007a7a] hover:to-[#005f5f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#009999] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Salvar Alterações
                </>
              )}
            </button>
            <Link
              href="/conta"
              className="px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
