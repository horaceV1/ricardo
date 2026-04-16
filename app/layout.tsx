import { DraftAlert } from "@/components/misc/DraftAlert"
import { HeaderNav } from "@/components/navigation/HeaderNav"
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider"
import { RecaptchaProvider } from "@/components/providers/RecaptchaProvider"
import { AuthProvider } from "@/contexts/AuthContext"
import { CartProvider } from "@/contexts/CartContext"
import { CookieConsent } from "@/components/ui/CookieConsent"
import { WhatsAppButton } from "@/components/ui/WhatsAppButton"
import Image from "next/image"
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
          <footer className="bg-gradient-to-br from-gray-900 via-[#003d3d] to-gray-900 text-white py-16 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-[#80d4d4]">Clínica do Empresário</h3>
                  <p className="text-gray-300">
                    Consultoria especializada e soluções práticas para o crescimento do seu negócio.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-4 text-lg">Menu</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li><a href="/" className="hover:text-[#80d4d4] transition-colors">Início</a></li>
                    <li><a href="/courses" className="hover:text-[#80d4d4] transition-colors">Formações</a></li>
                    <li><a href="/formacoes-presenciais" className="hover:text-[#80d4d4] transition-colors">Formações Presenciais</a></li>
                    <li><a href="/about" className="hover:text-[#80d4d4] transition-colors">Sobre Nós</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4 text-lg">Suporte</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li><a href="/help" className="hover:text-[#80d4d4] transition-colors">Central de Ajuda</a></li>
                    <li><a href="/contact" className="hover:text-[#80d4d4] transition-colors">Contato</a></li>
                    <li><a href="/faq" className="hover:text-[#80d4d4] transition-colors">FAQ</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4 text-lg">Legal</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li><a href="/termos-utilizacao" className="hover:text-[#80d4d4] transition-colors">Termos de Utilização e Política de Privacidade</a></li>
                  </ul>
                </div>
              </div>
              {/* Payment Methods */}
              <div className="border-t border-gray-700 mt-8 pt-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-400">Métodos de pagamento aceites:</p>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-md p-1.5 hover:bg-white/20 transition-colors" title="Visa">
                      <Image src="/payment-icons/visa.svg" alt="Visa" width={48} height={30} className="h-[28px] w-auto" />
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-md p-1.5 hover:bg-white/20 transition-colors" title="Mastercard">
                      <Image src="/payment-icons/mastercard.svg" alt="Mastercard" width={48} height={30} className="h-[28px] w-auto" />
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-md p-1.5 hover:bg-white/20 transition-colors" title="PayPal">
                      <Image src="/payment-icons/paypal.svg" alt="PayPal" width={48} height={30} className="h-[28px] w-auto" />
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-md p-1.5 hover:bg-white/20 transition-colors" title="Multibanco">
                      <Image src="/payment-icons/multibanco.svg" alt="Multibanco" width={48} height={30} className="h-[28px] w-auto" />
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-md p-1.5 hover:bg-white/20 transition-colors" title="MB WAY">
                      <Image src="/payment-icons/mbway.svg" alt="MB WAY" width={48} height={30} className="h-[28px] w-auto" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Copyright & Livro de Reclamações */}
              <div className="border-t border-gray-700/50 mt-6 pt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-gray-300 text-sm">&copy; 2026 Clínica do Empresário. Todos os direitos reservados.</p>
                  <a
                    href="https://www.livroreclamacoes.pt/Pedido/Reclamacao"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-80 hover:opacity-100 transition-opacity"
                    title="Livro de Reclamações Eletrónico"
                  >
                    <Image
                      src="/LRE_Theme.Logo_White.png"
                      alt="Livro de Reclamações Eletrónico"
                      width={160}
                      height={40}
                      className="h-8 w-auto"
                    />
                  </a>
                </div>
              </div>
            </div>
            {/* Institutional PRR / Açores Banner */}
            <div className="mt-10 mx-auto max-w-4xl px-6 sm:px-10 lg:px-16">
              <a
                href="/Ficha-de-website.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <Image
                  src="/BARRA_ACORES_PRR.png"
                  alt="Barra Açores - Plano de Recuperação e Resiliência"
                  width={6846}
                  height={711}
                  className="w-full h-auto object-contain opacity-90 cursor-pointer hover:opacity-100 transition-opacity"
                  priority={false}
                />
              </a>
            </div>
          </footer>
          <CookieConsent />
          <WhatsAppButton />
            </SmoothScrollProvider>
          </CartProvider>
        </AuthProvider>
        </RecaptchaProvider>
        {/* Mailchimp Connected Sites */}
        <Script
          id="mcjs"
          strategy="lazyOnload"
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
