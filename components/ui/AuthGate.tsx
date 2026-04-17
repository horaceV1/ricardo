"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Lock } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

interface AuthGateProps {
  /** Whether this content requires authentication */
  requiresAuth: boolean
  children: ReactNode
}

/**
 * Wraps content that may require authentication.
 * When requiresAuth is true and user is not logged in,
 * shows a blurred overlay prompting login/register.
 */
export function AuthGate({ requiresAuth, children }: AuthGateProps) {
  const { isAuthenticated } = useAuth()

  if (!requiresAuth || isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="relative min-h-[60vh]">
      {/* Blurred content preview */}
      <div className="opacity-20 blur-sm pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 text-center max-w-md mx-4 border border-gray-100">
          <div className="w-16 h-16 bg-[#009999]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-[#009999]" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            Conteúdo Exclusivo
          </h2>
          <p className="text-gray-600 mb-6">
            Este conteúdo está disponível apenas para utilizadores registados.
            Inicie sessão ou crie uma conta para aceder.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/entrar"
              className="px-6 py-3 bg-gradient-to-r from-[#009999] to-[#005c5c] text-white font-bold rounded-xl hover:shadow-lg transition-all no-underline"
            >
              Iniciar Sessão
            </Link>
            <Link
              href="/conta"
              className="px-6 py-3 border-2 border-[#009999] text-[#009999] font-bold rounded-xl hover:bg-[#009999]/5 transition-all no-underline"
            >
              Criar Conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
