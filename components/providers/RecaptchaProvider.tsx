"use client"

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"
import type { ReactNode } from "react"

export function RecaptchaProvider({ children }: { children: ReactNode }) {
  const isProduction = process.env.NODE_ENV === 'production'
  const reCaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  
  // Only use reCAPTCHA in production or if explicitly configured
  if (!isProduction || !reCaptchaKey) {
    return <>{children}</>
  }

  return (
    <GoogleReCaptchaProvider 
      reCaptchaKey={reCaptchaKey}
      scriptProps={{
        async: true,
        defer: true,
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  )
}
