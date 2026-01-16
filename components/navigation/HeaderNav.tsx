"use client"

import { Link } from "@/components/navigation/Link"
import { BookOpen, Search, ShoppingCart, Menu, X } from "lucide-react"
import { useState } from "react"

export function HeaderNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-black text-blue-600 no-underline hover:text-blue-700">
            <BookOpen className="w-8 h-8" />
            <span>EduLearn</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium no-underline">
              Home
            </Link>
            <Link href="/courses" className="text-gray-700 hover:text-blue-600 font-medium no-underline">
              Courses
            </Link>
            <Link href="/instructors" className="text-gray-700 hover:text-blue-600 font-medium no-underline">
              Instructors
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium no-underline">
              About
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-700 hover:text-blue-600 transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
            <Link
              href="/login"
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium no-underline"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium no-underline"
            >
              Sign Up
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
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium no-underline">
                Home
              </Link>
              <Link href="/courses" className="text-gray-700 hover:text-blue-600 font-medium no-underline">
                Courses
              </Link>
              <Link href="/instructors" className="text-gray-700 hover:text-blue-600 font-medium no-underline">
                Instructors
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium no-underline">
                About
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                <Link
                  href="/login"
                  className="px-4 py-2 text-center text-gray-700 hover:text-blue-600 font-medium no-underline"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-center no-underline"
                >
                  Sign Up
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
