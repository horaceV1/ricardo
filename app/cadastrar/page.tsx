"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { register } from '@/lib/auth'
import { Eye, EyeOff, UserPlus, Loader2, CheckCircle2 } from 'lucide-react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

export default function RegisterPage() {
  const router = useRouter()
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    mail: '',
    pass: '',
    confirmPassword: '',
    field_first_name: '',
    field_last_name: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (formData.pass !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    // Validate password strength
    if (formData.pass.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres')
      return
    }

    setIsLoading(true)

    try {
      // Execute reCAPTCHA v3 if available (production only)
      if (executeRecaptcha) {
        await executeRecaptcha('register')
      }
      
      await register({
        name: formData.name,
        mail: formData.mail,
        pass: formData.pass,
        field_first_name: formData.field_first_name,
        field_last_name: formData.field_last_name,
      })
      
      setSuccess(true)
      setTimeout(() => {
        router.push('/entrar')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no cadastro. Tente novamente.')
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Cadastro Realizado com Sucesso!
            </h2>
            <p className="text-gray-600">
              Redirecionando para o login...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-br from-[#009999] to-[#007a7a] rounded-full flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Criar Nova Conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Junte-se à Clínica do Empresário
          </p>
        </div>

        {/* Registration Form */}
        <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-lg" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label htmlFor="field_first_name" className="block text-sm font-medium text-gray-700 mb-1">
                Primeiro Nome
              </label>
              <input
                id="field_first_name"
                name="field_first_name"
                type="text"
                value={formData.field_first_name}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent transition-colors"
                placeholder="João"
                disabled={isLoading}
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="field_last_name" className="block text-sm font-medium text-gray-700 mb-1">
                Sobrenome
              </label>
              <input
                id="field_last_name"
                name="field_last_name"
                type="text"
                value={formData.field_last_name}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent transition-colors"
                placeholder="Silva"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome de Usuário <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="username"
                required
                value={formData.name}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent transition-colors"
                placeholder="joaosilva"
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Escolha um nome de usuário único
              </p>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="mail" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="mail"
                name="mail"
                type="email"
                autoComplete="email"
                required
                value={formData.mail}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent transition-colors"
                placeholder="joao.silva@exemplo.com"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="pass" className="block text-sm font-medium text-gray-700 mb-1">
                Senha <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="pass"
                  name="pass"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.pass}
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
              <p className="mt-1 text-xs text-gray-500">
                Mínimo de 8 caracteres
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Senha <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-4 py-3 pr-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent transition-colors"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 mt-1 text-[#009999] focus:ring-[#009999] border-gray-300 rounded"
              disabled={isLoading}
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              Eu concordo com os{' '}
              <Link href="/termos" className="text-[#009999] hover:text-[#007a7a]">
                Termos de Serviço
              </Link>{' '}
              e{' '}
              <Link href="/privacidade" className="text-[#009999] hover:text-[#007a7a]">
                Política de Privacidade
              </Link>
            </label>
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
                  Criando conta...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Criar Conta
                </>
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link
                href="/entrar"
                className="font-medium text-[#009999] hover:text-[#007a7a] transition-colors"
              >
                Entrar agora
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
