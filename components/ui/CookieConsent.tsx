"use client"

import { useState, useEffect } from 'react'
import { X, Cookie } from 'lucide-react'

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShowBanner(false)
  }

  const rejectCookies = () => {
    localStorage.setItem('cookie-consent', 'rejected')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 animate-slide-up">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#009999]/20 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-[#009999] to-[#007a7a] rounded-xl flex items-center justify-center">
                <Cookie className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">
                Utilizamos Cookies
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Este website utiliza cookies para melhorar a sua experiência de navegação, 
                analisar o tráfego do site e personalizar conteúdo. Ao continuar a navegar, 
                concorda com a nossa{' '}
                <a 
                  href="/privacy-policy" 
                  className="text-[#009999] font-semibold hover:underline"
                >
                  Política de Privacidade
                </a>
                .
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={rejectCookies}
                className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                Rejeitar
              </button>
              <button
                onClick={acceptCookies}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#009999] to-[#007a7a] text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Aceitar Cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
