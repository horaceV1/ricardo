"use client"

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"
import type { ReactNode } from "react"

export function RecaptchaProvider({ children }: { children: ReactNode }) {
  const reCaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
  
  // Always wrap with provider, even in development
  // This prevents context errors - it just won't load the script in dev
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
