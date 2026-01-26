"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    setIsLoading(true)

    try {
      // Execute reCAPTCHA v3 if available (production only)
      if (executeRecaptcha) {
        await executeRecaptcha('login')
      }
      
      await login(formData)
      router.push('/conta')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login. Verifique suas credenciais.')
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-br from-[#009999] to-[#007a7a] rounded-full flex items-center justify-center">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Entrar na Conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Acesse sua conta da Clínica do Empresário
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-lg" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Nome de Usuário ou Email
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent transition-colors"
                placeholder="seu.email@exemplo.com"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-4 py-3 pr-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent transition-colors"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Remember & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#009999] focus:ring-[#009999] border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Lembrar-me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/recuperar-senha"
                className="font-medium text-[#009999] hover:text-[#007a7a] transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#009999] hover:bg-[#007a7a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#009999] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Entrar
                </>
              )}
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link
                href="/cadastrar"
                className="font-medium text-[#009999] hover:text-[#007a7a] transition-colors"
              >
                Cadastre-se agora
              </Link>
            </p>
          </div>
        </form>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-[#009999] transition-colors"
          >
            ← Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  )
}
