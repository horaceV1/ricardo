"use client"

import { Link } from "@/components/navigation/Link"
import { Menu, X, User, LogOut, ShoppingBag } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import { CartIcon } from "@/components/cart/CartIcon"

export function HeaderNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    setUserMenuOpen(false)
  }

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
            <CartIcon />
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="h-8 w-8 bg-gradient-to-br from-[#009999] to-[#007a7a] rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-semibold">{user.name}</span>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.mail}</p>
                    </div>
                    <Link
                      href="/conta"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 no-underline"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Minha Conta</span>
                    </Link>
                    <Link
                      href="/pedidos"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 no-underline"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Meus Pedidos</span>
                    </Link>
                    {user.roles.includes('administrator') && (
                      <a
                        href={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/admin`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700 no-underline"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span>Painel Admin</span>
                      </a>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-red-600 border-t border-gray-200 mt-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sair</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/entrar"
                  className="px-6 py-2 text-[#009999] hover:text-[#007a7a] font-semibold no-underline transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastrar"
                  className="px-6 py-2 bg-[#009999] text-white rounded-lg hover:bg-[#007a7a] transition-all font-semibold no-underline shadow-md"
                >
                  Cadastrar
                </Link>
              </>
            )}
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
                {isAuthenticated && user ? (
                  <>
                    <div className="px-4 py-2 bg-gray-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.mail}</p>
                    </div>
                    <Link
                      href="/conta"
                      className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all font-semibold text-center no-underline"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Minha Conta
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="px-6 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all font-semibold"
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/entrar"
                      className="px-6 py-2 border-2 border-[#009999] text-[#009999] rounded-lg hover:bg-[#009999] hover:text-white transition-all font-semibold text-center no-underline"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Entrar
                    </Link>
                    <Link
                      href="/cadastrar"
                      className="px-6 py-2 bg-[#009999] text-white rounded-lg hover:bg-[#007a7a] transition-all font-semibold text-center no-underline shadow-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Cadastrar
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
