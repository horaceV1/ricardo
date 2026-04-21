import { DraftAlert } from "@/components/misc/DraftAlert"
import { HeaderNav } from "@/components/navigation/HeaderNav"
import { Footer } from "@/components/navigation/Footer"
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider"
import { RecaptchaProvider } from "@/components/providers/RecaptchaProvider"
import { AuthProvider } from "@/contexts/AuthContext"
import { CartProvider } from "@/contexts/CartContext"
import { CookieConsent } from "@/components/ui/CookieConsent"
import { WhatsAppButton } from "@/components/ui/WhatsAppButton"
import Script from "next/script"
import type { Metadata } from "next"
import type { ReactNode } from "react"

import "@/styles/globals.css"

export const metadata: Metadata = {
  title: {
    default: "Clínica do Empresário - Consultoria e Gestão Empresarial",
    template: "%s | Clínica do Empresário",
  },
  description: "Consultoria especializada para empresários. Diagnóstico, estratégia e resultados mensuráveis para o crescimento do seu negócio.",
  metadataBase: new URL("https://www.clinicadoempresario.pt"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: "https://www.clinicadoempresario.pt",
    siteName: "Clínica do Empresário",
    title: "Clínica do Empresário - Consultoria e Gestão Empresarial",
    description: "Consultoria especializada para empresários. Diagnóstico, estratégia e resultados mensuráveis para o crescimento do seu negócio.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Clínica do Empresário",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clínica do Empresário - Consultoria e Gestão Empresarial",
    description: "Consultoria especializada para empresários. Diagnóstico, estratégia e resultados mensuráveis para o crescimento do seu negócio.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="pt">
      <body className="bg-gray-50">
        <RecaptchaProvider>
          <AuthProvider>
            <CartProvider>
              <SmoothScrollProvider>
                <DraftAlert />
                <HeaderNav />
                <main>{children}</main>
          
          {/* Footer */}
          <Footer />
          <CookieConsent />
          <WhatsAppButton />
            </SmoothScrollProvider>
          </CartProvider>
        </AuthProvider>
        </RecaptchaProvider>
        {/* Mailchimp Connected Sites - must run on every page so Mailchimp can detect the site */}
        <Script
          id="mcjs"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/e0a7bc7769d6ab15c59d53f5e/1bec2970d4307ddbe9230a2bf.js");`,
          }}
        />
        {/* Meta Pixel */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1137530448499869');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1137530448499869&ev=PageView&noscript=1"
          />
        </noscript>
      </body>
    </html>
  )
}
