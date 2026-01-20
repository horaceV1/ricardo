import { DraftAlert } from "@/components/misc/DraftAlert"
import { HeaderNav } from "@/components/navigation/HeaderNav"
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider"
import type { Metadata } from "next"
import type { ReactNode } from "react"

import "@/styles/globals.css"

export const metadata: Metadata = {
  title: {
    default: "Clínica do Empresário - Soluções para seu Negócio",
    template: "%s | Clínica do Empresário",
  },
  description: "Produtos e serviços especializados para empresários e empreendedores.",
  icons: {
    icon: "/favicon.ico",
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
    <html lang="en">
      <body className="bg-gray-50">
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
                    Soluções especializadas para o sucesso do seu negócio.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-4 text-lg">Links Rápidos</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li><a href="/courses" className="hover:text-[#80d4d4] transition-colors">Produtos</a></li>
                    <li><a href="/instructors" className="hover:text-[#80d4d4] transition-colors">Especialistas</a></li>
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
                    <li><a href="/terms" className="hover:text-[#80d4d4] transition-colors">Termos de Serviço</a></li>
                    <li><a href="/privacy" className="hover:text-[#80d4d4] transition-colors">Política de Privacidade</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
                <p>&copy; 2026 Clínica do Empresário. Todos os direitos reservados.</p>
              </div>
            </div>
          </footer>
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
