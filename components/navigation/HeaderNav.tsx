"use client"

import { Link } from "@/components/navigation/Link"
import { Search, ShoppingCart, Menu, X } from "lucide-react"
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
              Produtos
            </Link>
            <Link href="/instructors" className="text-gray-700 hover:text-[#009999] font-semibold no-underline transition-colors">
              Especialistas
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-[#009999] font-semibold no-underline transition-colors">
              Sobre
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 text-gray-700 hover:text-[#009999] transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-700 hover:text-[#009999] transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-[#ff8c00] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                0
              </span>
            </button>
            <Link
              href="/login"
              className="px-4 py-2 text-gray-700 hover:text-[#009999] font-semibold no-underline transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 bg-[#009999] text-white rounded-lg hover:bg-[#007a7a] transition-all font-semibold no-underline shadow-md hover:shadow-lg"
            >
              Cadastrar
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
                Produtos
              </Link>
              <Link href="/instructors" className="text-gray-700 hover:text-[#009999] font-semibold no-underline transition-colors">
                Especialistas
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-[#009999] font-semibold no-underline transition-colors">
                Sobre
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                <Link
                  href="/login"
                  className="px-4 py-2 text-center text-gray-700 hover:text-[#009999] font-semibold no-underline transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2 bg-[#009999] text-white rounded-lg hover:bg-[#007a7a] transition-all font-semibold text-center no-underline shadow-md"
                >
                  Cadastrar
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
