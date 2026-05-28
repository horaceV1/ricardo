"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { FileText, ArrowRight, CheckCircle, Clock, XCircle, ChevronDown, Filter, Lock } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface Incentivo {
  id: string
  nid: number
  title: string
  body: string
  created: string
  path: string
  image?: {
    url: string
    alt: string
  }
  dynamicFormIds: string[]
  disponibilidade?: string
  requireAuth?: boolean
}

interface IncentivosClientProps {
  incentivos: Incentivo[]
}

const FILTER_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "disponivel", label: "Disponível", color: "text-green-700" },
  { value: "brevemente", label: "Brevemente", color: "text-yellow-700" },
  { value: "indisponivel", label: "Indisponível", color: "text-red-700" },
]

function getDisponibilidadeKey(disp?: string): string {
  const d = disp?.toLowerCase() || ""
  if (d.includes("indispon")) return "indisponivel"
  if (d.includes("brevemente")) return "brevemente"
  if (d.includes("dispon")) return "disponivel"
  return "other"
}

export function IncentivosClient({ incentivos }: IncentivosClientProps) {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  // Hide restricted incentivos completely from unauthenticated users.
  // While auth is still loading we hide them too to avoid a flash of restricted content.
  const visibleIncentivos = incentivos.filter((item) =>
    isAuthenticated ? true : !item.requireAuth
  )
  const hiddenCount = incentivos.length - visibleIncentivos.length

  const filteredIncentivos = visibleIncentivos.filter((item) => {
    if (selectedFilter === "all") return true
    return getDisponibilidadeKey(item.disponibilidade) === selectedFilter
  })

  const currentLabel = FILTER_OPTIONS.find((o) => o.value === selectedFilter)?.label || "Todos"

  return (
    <>
      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-sm">
              Mostrando <span className="font-semibold text-gray-900">{filteredIncentivos.length}</span>{" "}
              {filteredIncentivos.length === 1 ? "incentivo" : "incentivos"}
            </p>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Filter className="h-4 w-4 text-[#009999]" />
                <span>Disponibilidade:</span>
                <span className="font-semibold text-[#009999]">{currentLabel}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                    {FILTER_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedFilter(option.value)
                          setDropdownOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                          selectedFilter === option.value
                            ? "bg-[#009999]/5 text-[#009999] font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        {option.value === "disponivel" && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {option.value === "brevemente" && <Clock className="h-4 w-4 text-yellow-600" />}
                        {option.value === "indisponivel" && <XCircle className="h-4 w-4 text-red-600" />}
                        {option.value === "all" && <FileText className="h-4 w-4 text-gray-400" />}
                        {option.label}
                        {selectedFilter === option.value && (
                          <CheckCircle className="h-4 w-4 text-[#009999] ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Members-only notice for anonymous users when restricted incentivos exist */}
        {!isAuthenticated && !authLoading && hiddenCount > 0 && (
          <div className="mb-8 bg-gradient-to-r from-[#009999]/10 to-[#007a7a]/10 border border-[#009999]/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 bg-[#009999]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6 text-[#009999]" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">
                {hiddenCount === 1
                  ? "Existe 1 incentivo exclusivo para membros"
                  : `Existem ${hiddenCount} incentivos exclusivos para membros`}
              </h3>
              <p className="text-sm text-gray-600">
                Inicie sessão ou crie uma conta gratuita para aceder a todos os incentivos disponíveis.
              </p>
            </div>
            <Link
              href="/conta"
              className="px-5 py-2.5 bg-gradient-to-r from-[#009999] to-[#007a7a] text-white font-semibold rounded-lg hover:shadow-lg transition-all whitespace-nowrap"
            >
              Iniciar Sessão
            </Link>
          </div>
        )}

        {filteredIncentivos.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum incentivo encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Não existem incentivos com o estado &quot;{currentLabel}&quot;.
            </p>
            <button
              onClick={() => setSelectedFilter("all")}
              className="text-[#009999] font-semibold hover:underline"
            >
              Ver todos os incentivos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredIncentivos.map((incentivo) => (
              <Link
                key={incentivo.id}
                href={incentivo.path}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Image */}
                {incentivo.image?.url && (
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    <Image
                      src={incentivo.image.url}
                      alt={incentivo.image.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#009999] transition-colors line-clamp-2">
                    {incentivo.title}
                  </h2>

                  <div
                    className="text-gray-600 text-sm mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: incentivo.body }}
                  />

                  <div className="flex items-center gap-2 text-[#009999] font-semibold group-hover:gap-4 transition-all">
                    <span>Ver detalhes</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>

                {/* Disponibilidade Badge */}
                <div className="px-6 pb-6">
                  {(() => {
                    const key = getDisponibilidadeKey(incentivo.disponibilidade)
                    if (key === "indisponivel") {
                      return (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-xs font-semibold">
                          <XCircle className="h-4 w-4" />
                          {incentivo.disponibilidade}
                        </span>
                      )
                    }
                    if (key === "brevemente") {
                      return (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-full text-xs font-semibold">
                          <Clock className="h-4 w-4" />
                          {incentivo.disponibilidade}
                        </span>
                      )
                    }
                    if (key === "disponivel") {
                      return (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                          <CheckCircle className="h-4 w-4" />
                          {incentivo.disponibilidade}
                        </span>
                      )
                    }
                    return (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                        <FileText className="h-4 w-4" />
                        Informação
                      </span>
                    )
                  })()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
