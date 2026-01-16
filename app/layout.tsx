import { DraftAlert } from "@/components/misc/DraftAlert"
import { HeaderNav } from "@/components/navigation/HeaderNav"
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider"
import type { Metadata } from "next"
import type { ReactNode } from "react"

import "@/styles/globals.css"

export const metadata: Metadata = {
  title: {
    default: "EduLearn - Online Learning Platform",
    template: "%s | EduLearn",
  },
  description: "Learn without limits with our world-class online courses.",
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
          <footer className="bg-gray-900 text-white py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">EduLearn</h3>
                  <p className="text-gray-400">
                    Empowering learners worldwide with quality education.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Quick Links</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="/courses" className="hover:text-white">Browse Courses</a></li>
                    <li><a href="/instructors" className="hover:text-white">Become an Instructor</a></li>
                    <li><a href="/about" className="hover:text-white">About Us</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Support</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="/help" className="hover:text-white">Help Center</a></li>
                    <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
                    <li><a href="/faq" className="hover:text-white">FAQ</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Legal</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
                    <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2026 EduLearn. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
