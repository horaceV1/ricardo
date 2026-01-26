"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
  fallbackUrl?: string
}

/**
 * Wrapper component that protects routes requiring authentication
 * Optionally checks for specific user roles
 */
export function ProtectedRoute({
  children,
  requiredRoles,
  fallbackUrl = '/entrar',
}: ProtectedRouteProps) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      router.push(fallbackUrl)
      return
    }

    // Check if user has required roles
    if (requiredRoles && requiredRoles.length > 0 && user) {
      const hasRequiredRole = requiredRoles.some(role => user.roles.includes(role))
      if (!hasRequiredRole) {
        router.push('/') // Redirect to home if lacking permissions
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRoles, fallbackUrl, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#009999] mx-auto mb-4" />
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Check roles
  if (requiredRoles && requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.some(role => user.roles.includes(role))
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h2>
            <p className="text-gray-600 mb-6">
              Você não tem permissão para acessar esta página.
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-[#009999] text-white rounded-lg hover:bg-[#007a7a] transition-colors font-semibold"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}

/**
 * Hook to check if user has specific permission
 */
export function usePermission(requiredRoles?: string[]): {
  hasPermission: boolean
  isLoading: boolean
} {
  const { user, isLoading } = useAuth()

  if (!requiredRoles || requiredRoles.length === 0) {
    return { hasPermission: true, isLoading }
  }

  if (!user) {
    return { hasPermission: false, isLoading }
  }

  const hasPermission = requiredRoles.some(role => user.roles.includes(role))
  return { hasPermission, isLoading }
}
