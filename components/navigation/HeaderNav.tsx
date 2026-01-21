"use client"

import { Link } from "@/components/navigation/Link"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export function HeaderNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity">
            <Image 
              src="/brand/logo-horizontal.png" 
              alt="Clínica do Empresário" 
              width={200} 
              height={50}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-[#009999] font-semibold no-underline transition-colors">
              Início
            </Link>
            <Link href="/courses" className="text-gray-700 hover:text-[#009999] font-semibold no-underline transition-colors">
              Soluções
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-[#009999] font-semibold no-underline transition-colors">
              Sobre
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-[#009999] font-semibold no-underline transition-colors">
              Contato
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-2 border-2 border-[#009999] text-[#009999] rounded-lg hover:bg-[#009999] hover:text-white transition-all font-semibold no-underline"
            >
              Agende sua Consulta
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-gray-700 hover:text-[#009999] font-semibold no-underline transition-colors">
                Início
              </Link>
              <Link href="/courses" className="text-gray-700 hover:text-[#009999] font-semibold no-underline transition-colors">
                Soluções
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-[#009999] font-semibold no-underline transition-colors">
                Sobre
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-[#009999] font-semibold no-underline transition-colors">
                Contato
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                <Link
                  href="/contact"
                  className="px-6 py-2 bg-[#009999] text-white rounded-lg hover:bg-[#007a7a] transition-all font-semibold text-center no-underline shadow-md"
                >
                  Agende sua Consulta
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
