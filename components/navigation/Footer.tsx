"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

interface FooterLink {
  text: string
  url: string
  external: boolean
}

interface FooterColumn {
  title: string
  links: FooterLink[]
}

interface FooterData {
  brand_title: string
  brand_description: string
  copyright: string
  facebook_url: string
  instagram_url: string
  columns: FooterColumn[]
}

const defaultFooter: FooterData = {
  brand_title: "Clínica do Empresário",
  brand_description: "Consultoria especializada e soluções práticas para o crescimento do seu negócio.",
  copyright: "© 2026 Clínica do Empresário. Todos os direitos reservados.",
  facebook_url: "",
  instagram_url: "",
  columns: [
    {
      title: "Menu",
      links: [
        { text: "Início", url: "/", external: false },
        { text: "Formações Online", url: "/courses", external: false },
        { text: "Formações Presenciais", url: "/formacoes-presenciais", external: false },
        { text: "Sobre Nós", url: "/about", external: false },
      ],
    },
    {
      title: "Suporte",
      links: [
        { text: "Central de Ajuda", url: "/help", external: false },
        { text: "Contato", url: "/contact", external: false },
        { text: "FAQ", url: "/faq", external: false },
      ],
    },
    {
      title: "Legal",
      links: [
        { text: "Termos de Utilização e Política de Privacidade", url: "/termos-utilizacao", external: false },
      ],
    },
  ],
}

export function Footer() {
  const [footer, setFooter] = useState<FooterData>(defaultFooter)

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || "https://darkcyan-stork-408379.hostingersite.com"
    fetch(`${baseUrl}/api/footer`)
      .then((res) => res.json())
      .then((data: FooterData) => {
        if (data.brand_title) setFooter(data)
      })
      .catch(() => {
        // Keep defaults on error
      })
  }, [])

  // Grid columns: branding + dynamic columns
  const totalCols = 1 + footer.columns.length
  const gridClass =
    totalCols <= 2
      ? "grid-cols-1 md:grid-cols-2"
      : totalCols === 3
      ? "grid-cols-1 md:grid-cols-3"
      : "grid-cols-1 md:grid-cols-4"

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-[#003d3d] to-gray-900 text-white py-16 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid ${gridClass} gap-8`}>
          {/* Branding */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-[#80d4d4]">{footer.brand_title}</h3>
            <p className="text-gray-300 mb-5">{footer.brand_description}</p>
            {(footer.facebook_url || footer.instagram_url) && (
              <div className="flex items-center gap-4">
                {footer.facebook_url && (
                  <a
                    href={footer.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                    aria-label="Facebook"
                  >
                    <svg
                      className="w-6 h-6 text-gray-400 group-hover:text-[#80d4d4] transition-colors"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                )}
                {footer.instagram_url && (
                  <a
                    href={footer.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                    aria-label="Instagram"
                  >
                    <svg
                      className="w-6 h-6 text-gray-400 group-hover:text-[#80d4d4] transition-colors"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C16.67.014 16.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Dynamic columns */}
          {footer.columns.map((col, i) => (
            <div key={i}>
              <h4 className="font-bold mb-4 text-lg">{col.title}</h4>
              <ul className="space-y-2 text-gray-300">
                {col.links.map((link, j) =>
                  link.external ? (
                    <li key={j}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#80d4d4] transition-colors"
                      >
                        {link.text}
                      </a>
                    </li>
                  ) : (
                    <li key={j}>
                      <Link href={link.url} className="hover:text-[#80d4d4] transition-colors">
                        {link.text}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">Métodos de pagamento aceites:</p>
            <div className="flex items-center gap-3">
              {["visa", "mastercard", "paypal", "multibanco", "mbway"].map((method) => (
                <div
                  key={method}
                  className="bg-white/10 backdrop-blur-sm rounded-md p-1.5 hover:bg-white/20 transition-colors"
                  title={method.charAt(0).toUpperCase() + method.slice(1)}
                >
                  <Image
                    src={`/payment-icons/${method}.svg`}
                    alt={method.charAt(0).toUpperCase() + method.slice(1)}
                    width={48}
                    height={30}
                    className="h-[28px] w-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright & Livro de Reclamações */}
        <div className="border-t border-gray-700/50 mt-6 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-300 text-sm">{footer.copyright}</p>
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
        <a href="/Ficha-de-website.pdf" target="_blank" rel="noopener noreferrer" download>
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
  )
}
