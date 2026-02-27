"use client"

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { register } from '@/lib/auth'
import { Eye, EyeOff, UserPlus, Loader2, CheckCircle2, Mail, ShieldCheck, AlertTriangle } from 'lucide-react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

// Password strength calculation
function getPasswordStrength(password: string) {
  let score = 0
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password),
  }

  if (checks.length) score++
  if (checks.uppercase) score++
  if (checks.lowercase) score++
  if (checks.number) score++
  if (checks.special) score++

  let label: string
  let color: string
  let bgColor: string

  if (score <= 2) {
    label = 'Fraca'
    color = 'text-red-600'
    bgColor = 'bg-red-500'
  } else if (score <= 3) {
    label = 'Média'
    color = 'text-yellow-600'
    bgColor = 'bg-yellow-500'
  } else if (score === 4) {
    label = 'Forte'
    color = 'text-blue-600'
    bgColor = 'bg-blue-500'
  } else {
    label = 'Muito Forte'
    color = 'text-green-600'
    bgColor = 'bg-green-500'
  }

  const isStrong = score >= 4

  return { score, checks, label, color, bgColor, isStrong }
}

export default function RegisterPage() {
  const router = useRouter()
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Email verification state
  const [verificationStep, setVerificationStep] = useState<'form' | 'verify' | 'verified'>('form')
  const [verificationCode, setVerificationCode] = useState('')
  const [sendingCode, setSendingCode] = useState(false)
  const [verifyingCode, setVerifyingCode] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [codeResent, setCodeResent] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    mail: '',
    pass: '',
    confirmPassword: '',
    field_first_name: '',
    field_last_name: '',
    field_phone: '',
    field_nif: '',
    field_address: '',
    field_city: '',
    field_postal_code: '',
    field_country: 'Portugal',
  })

  const passwordStrength = useMemo(() => getPasswordStrength(formData.pass), [formData.pass])

  // Send verification code
  const handleSendVerificationCode = useCallback(async () => {
    setError(null)
    setVerificationError(null)

    // Validate all required fields before sending code
    if (!formData.name || !formData.mail || !formData.pass || !formData.confirmPassword) {
      setError('Preencha todos os campos obrigatórios')
      return
    }

    if (formData.pass !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (!passwordStrength.isStrong) {
      setError('A senha não é forte o suficiente. Inclua letras maiúsculas, números e caracteres especiais.')
      return
    }

    // Validate NIF if provided
    if (formData.field_nif && !/^\d{9}$/.test(formData.field_nif)) {
      setError('O NIF deve conter exatamente 9 dígitos')
      return
    }

    setSendingCode(true)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
      const response = await fetch(`${baseUrl}/api/auth/send-verification-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.mail }),
      })

      let result
      try {
        result = await response.json()
      } catch {
        setError('Erro ao processar resposta do servidor.')
        return
      }

      if (!response.ok) {
        setError(result.error || 'Falha ao enviar código de verificação')
        return
      }

      setVerificationStep('verify')
    } catch (err) {
      console.error('Send verification code error:', err)
      setError('Erro de rede. Tente novamente.')
    } finally {
      setSendingCode(false)
    }
  }, [formData, passwordStrength.isStrong])

  // Resend code
  const handleResendCode = useCallback(async () => {
    setSendingCode(true)
    setVerificationError(null)
    setCodeResent(false)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
      const response = await fetch(`${baseUrl}/api/auth/send-verification-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.mail }),
      })

      if (response.ok) {
        setCodeResent(true)
        setVerificationCode('')
        setTimeout(() => setCodeResent(false), 3000)
      }
    } catch {
      setVerificationError('Erro ao reenviar código')
    } finally {
      setSendingCode(false)
    }
  }, [formData.mail])

  // Verify code and register
  const handleVerifyAndRegister = useCallback(async () => {
    if (verificationCode.length !== 6) {
      setVerificationError('Insira o código de 6 dígitos')
      return
    }

    setVerifyingCode(true)
    setVerificationError(null)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

      // Verify the code
      const verifyResponse = await fetch(`${baseUrl}/api/auth/verify-email-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.mail, code: verificationCode }),
      })

      const verifyResult = await verifyResponse.json()

      if (!verifyResponse.ok) {
        setVerificationError(verifyResult.error || 'Código inválido')
        setVerifyingCode(false)
        return
      }

      setVerificationStep('verified')

      // Now proceed with registration
      if (executeRecaptcha) {
        await executeRecaptcha('register')
      }

      await register({
        name: formData.name,
        mail: formData.mail,
        pass: formData.pass,
        field_first_name: formData.field_first_name,
        field_last_name: formData.field_last_name,
        field_phone: formData.field_phone,
        field_nif: formData.field_nif || undefined,
        field_address: formData.field_address,
        field_city: formData.field_city,
        field_postal_code: formData.field_postal_code,
        field_country: formData.field_country,
      })

      setSuccess(true)
      setTimeout(() => {
        router.push('/entrar')
      }, 2000)
    } catch (err) {
      setVerificationError(err instanceof Error ? err.message : 'Falha no cadastro. Tente novamente.')
      setVerificationStep('verify')
    } finally {
      setVerifyingCode(false)
    }
  }, [verificationCode, formData, executeRecaptcha, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // NIF: only allow digits, max 9
    if (name === 'field_nif') {
      const digits = value.replace(/\D/g, '').slice(0, 9)
      setFormData(prev => ({ ...prev, field_nif: digits }))
      return
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
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

  // Email verification step
  if (verificationStep === 'verify' || verificationStep === 'verified') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-gradient-to-br from-[#009999] to-[#007a7a] rounded-full flex items-center justify-center">
              {verificationStep === 'verified' ? (
                <ShieldCheck className="h-6 w-6 text-white" />
              ) : (
                <Mail className="h-6 w-6 text-white" />
              )}
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {verificationStep === 'verified' ? 'Email Verificado!' : 'Verificar Email'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {verificationStep === 'verified'
                ? 'A criar a sua conta...'
                : <>Enviámos um código de 6 dígitos para <strong className="text-gray-800">{formData.mail}</strong></>}
            </p>
          </div>

          {verificationStep === 'verified' ? (
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#009999] mx-auto mb-4" />
              <p className="text-gray-600">A criar a sua conta...</p>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
              {verificationError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {verificationError}
                </div>
              )}

              {codeResent && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  Novo código enviado com sucesso!
                </div>
              )}

              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Verificação
                </label>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="appearance-none block w-full px-4 py-4 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent text-center text-2xl tracking-[0.5em] font-mono"
                  placeholder="000000"
                  disabled={verifyingCode}
                  autoFocus
                />
                <p className="mt-2 text-xs text-gray-500 text-center">
                  O código expira em 15 minutos
                </p>
              </div>

              <button
                type="button"
                onClick={handleVerifyAndRegister}
                disabled={verifyingCode || verificationCode.length !== 6}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#009999] hover:bg-[#007a7a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#009999] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {verifyingCode ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    A verificar...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-5 w-5" />
                    Verificar e Criar Conta
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={sendingCode}
                  className="text-[#009999] hover:text-[#007a7a] font-medium disabled:opacity-50"
                >
                  {sendingCode ? 'A enviar...' : 'Reenviar código'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVerificationStep('form')
                    setVerificationCode('')
                    setVerificationError(null)
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ← Voltar ao formulário
                </button>
              </div>
            </div>
          )}
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
        <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-lg" onSubmit={(e) => { e.preventDefault(); handleSendVerificationCode(); }}>
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
                Nome de Utilizador <span className="text-red-500">*</span>
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
                Escolha um nome de utilizador único
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

            {/* Phone */}
            <div>
              <label htmlFor="field_phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                id="field_phone"
                name="field_phone"
                type="tel"
                autoComplete="tel"
                value={formData.field_phone}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent transition-colors"
                placeholder="+351 123 456 789"
                disabled={isLoading}
              />
            </div>

            {/* NIF */}
            <div>
              <label htmlFor="field_nif" className="block text-sm font-medium text-gray-700 mb-1">
                NIF <span className="text-gray-400 text-xs font-normal">(opcional)</span>
              </label>
              <input
                id="field_nif"
                name="field_nif"
                type="text"
                inputMode="numeric"
                value={formData.field_nif}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-4 py-3 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent transition-colors ${
                  formData.field_nif && formData.field_nif.length !== 9
                    ? 'border-red-300 bg-red-50'
                    : formData.field_nif.length === 9
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300'
                }`}
                placeholder="123456789"
                disabled={isLoading}
                maxLength={9}
              />
              {formData.field_nif && formData.field_nif.length !== 9 && (
                <p className="mt-1 text-xs text-red-500">
                  O NIF deve conter exatamente 9 dígitos ({formData.field_nif.length}/9)
                </p>
              )}
              {formData.field_nif.length === 9 && (
                <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> NIF válido
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="field_address" className="block text-sm font-medium text-gray-700 mb-1">
                Morada
              </label>
              <input
                id="field_address"
                name="field_address"
                type="text"
                autoComplete="street-address"
                value={formData.field_address}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent transition-colors"
                placeholder="Rua Exemplo, 123"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* City */}
            <div>
              <label htmlFor="field_city" className="block text-sm font-medium text-gray-700 mb-1">
                Cidade
              </label>
              <input
                id="field_city"
                name="field_city"
                type="text"
                autoComplete="address-level2"
                value={formData.field_city}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent transition-colors"
                placeholder="Lisboa"
                disabled={isLoading}
              />
            </div>

            {/* Postal Code */}
            <div>
              <label htmlFor="field_postal_code" className="block text-sm font-medium text-gray-700 mb-1">
                Código Postal
              </label>
              <input
                id="field_postal_code"
                name="field_postal_code"
                type="text"
                autoComplete="postal-code"
                value={formData.field_postal_code}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent transition-colors"
                placeholder="1000-001"
                disabled={isLoading}
              />
            </div>

            {/* Country */}
            <div>
              <label htmlFor="field_country" className="block text-sm font-medium text-gray-700 mb-1">
                País
              </label>
              <input
                id="field_country"
                name="field_country"
                type="text"
                autoComplete="country"
                value={formData.field_country}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent transition-colors"
                placeholder="Portugal"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-4">
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

              {/* Password Strength Meter */}
              {formData.pass && (
                <div className="mt-3 space-y-2">
                  {/* Strength Bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${passwordStrength.bgColor}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-semibold ${passwordStrength.color} min-w-[80px] text-right`}>
                      {passwordStrength.label}
                    </span>
                  </div>

                  {/* Criteria Checklist */}
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { key: 'length', label: 'Mín. 8 caracteres' },
                      { key: 'uppercase', label: 'Letra maiúscula' },
                      { key: 'lowercase', label: 'Letra minúscula' },
                      { key: 'number', label: 'Número' },
                      { key: 'special', label: 'Carácter especial' },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-1.5">
                        {passwordStrength.checks[key as keyof typeof passwordStrength.checks] ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                        ) : (
                          <div className="h-3.5 w-3.5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                        )}
                        <span className={`text-xs ${
                          passwordStrength.checks[key as keyof typeof passwordStrength.checks]
                            ? 'text-green-600'
                            : 'text-gray-400'
                        }`}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Weak password warning */}
                  {!passwordStrength.isStrong && formData.pass.length >= 4 && (
                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700">
                        A senha deve ser forte para criar uma conta. Inclua pelo menos uma letra maiúscula, um número e um carácter especial.
                      </p>
                    </div>
                  )}
                </div>
              )}
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
                  className={`appearance-none relative block w-full px-4 py-3 pr-12 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent transition-colors ${
                    formData.confirmPassword && formData.pass !== formData.confirmPassword
                      ? 'border-red-300'
                      : formData.confirmPassword && formData.pass === formData.confirmPassword
                      ? 'border-green-300'
                      : 'border-gray-300'
                  }`}
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
              {formData.confirmPassword && formData.pass !== formData.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">As senhas não coincidem</p>
              )}
              {formData.confirmPassword && formData.pass === formData.confirmPassword && (
                <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> As senhas coincidem
                </p>
              )}
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
              <Link href="/terms" className="text-[#009999] hover:text-[#007a7a]">
                Termos de Serviço
              </Link>{' '}
              e{' '}
              <Link href="/privacy" className="text-[#009999] hover:text-[#007a7a]">
                Política de Privacidade
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={sendingCode || !passwordStrength.isStrong || (formData.field_nif !== '' && formData.field_nif.length !== 9)}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#009999] hover:bg-[#007a7a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#009999] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {sendingCode ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  A enviar código...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-5 w-5" />
                  Verificar Email e Criar Conta
                </>
              )}
            </button>
            {!passwordStrength.isStrong && formData.pass.length > 0 && (
              <p className="mt-2 text-xs text-center text-amber-600">
                Reforce a sua senha para poder continuar
              </p>
            )}
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
