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
  columns: FooterColumn[]
}

const defaultFooter: FooterData = {
  brand_title: "Clínica do Empresário",
  brand_description: "Consultoria especializada e soluções práticas para o crescimento do seu negócio.",
  copyright: "© 2026 Clínica do Empresário. Todos os direitos reservados.",
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
            <p className="text-gray-300">{footer.brand_description}</p>
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
