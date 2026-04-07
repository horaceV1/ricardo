"use client"

import { useState, useMemo } from "react"
import { Search, SlidersHorizontal, Calendar, MapPin, Filter } from "lucide-react"
import { TrainingCard } from "@/components/trainings/TrainingCard"
import { FadeIn } from "@/components/animations/FadeIn"
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren"
import { DrupalNode } from "next-drupal"

interface TrainingsClientProps {
  initialTrainings: DrupalNode[]
}

type FilterTab = "upcoming" | "past" | "all"

export function TrainingsClient({ initialTrainings }: TrainingsClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState<FilterTab>("upcoming")
  const [locationFilter, setLocationFilter] = useState("All")

  // Extract unique locations for filter
  const locations = useMemo(() => {
    const locs = new Set<string>()
    initialTrainings.forEach((t) => {
      if (t.field_location) locs.add(t.field_location)
    })
    return ["All", ...Array.from(locs).sort()]
  }, [initialTrainings])

  const now = new Date()

  const filteredTrainings = useMemo(() => {
    return initialTrainings
      .filter((training) => {
        // Tab filter (upcoming / past / all)
        if (activeTab === "upcoming") {
          const date = training.field_training_date
            ? new Date(training.field_training_date)
            : null
          if (date && date < now) return false
        } else if (activeTab === "past") {
          const date = training.field_training_date
            ? new Date(training.field_training_date)
            : null
          if (!date || date >= now) return false
        }

        // Location filter
        if (locationFilter !== "All" && training.field_location !== locationFilter) {
          return false
        }

        // Search filter
        if (searchQuery) {
          const q = searchQuery.toLowerCase()
          const matchesTitle = training.title?.toLowerCase().includes(q)
          const matchesBody = training.body?.summary?.toLowerCase().includes(q)
          const matchesLocation = training.field_location?.toLowerCase().includes(q)
          const matchesInstructor = training.field_instructor?.toLowerCase().includes(q)
          if (!matchesTitle && !matchesBody && !matchesLocation && !matchesInstructor) {
            return false
          }
        }

        return true
      })
      .sort((a, b) => {
        // Sort by date: upcoming first (ascending), past most recent first (descending)
        const dateA = a.field_training_date ? new Date(a.field_training_date).getTime() : 0
        const dateB = b.field_training_date ? new Date(b.field_training_date).getTime() : 0
        if (activeTab === "past") return dateB - dateA
        return dateA - dateB
      })
  }, [initialTrainings, activeTab, locationFilter, searchQuery, now])

  const upcomingCount = initialTrainings.filter((t) => {
    const d = t.field_training_date ? new Date(t.field_training_date) : null
    return d && d >= now
  }).length

  const pastCount = initialTrainings.filter((t) => {
    const d = t.field_training_date ? new Date(t.field_training_date) : null
    return d && d < now
  }).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#009999] to-[#005c5c] text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white rounded-full" />
          <div className="absolute bottom-5 right-20 w-60 h-60 border-4 border-white rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <FadeIn direction="down">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Calendar className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black">Formações Presenciais</h1>
              </div>
            </div>
            <p className="text-xl text-[#b3e6e6] max-w-2xl">
              Participe nas nossas formações presenciais. Garanta o seu lugar e venha
              aprender com os melhores profissionais.
            </p>
            {upcomingCount > 0 && (
              <div className="mt-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-semibold">
                  {upcomingCount} {upcomingCount === 1 ? "formação disponível" : "formações disponíveis"}
                </span>
              </div>
            )}
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <FadeIn direction="up" delay={0.1}>
          <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-xl shadow-sm w-fit">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "upcoming"
                  ? "bg-[#009999] text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Próximas ({upcomingCount})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "past"
                  ? "bg-[#009999] text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Anteriores ({pastCount})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "all"
                  ? "bg-[#009999] text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Todas ({initialTrainings.length})
            </button>
          </div>
        </FadeIn>

        {/* Search and Filters */}
        <FadeIn direction="up" delay={0.2}>
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Pesquisar formações por nome, local ou formador..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] bg-white"
                />
              </div>

              {/* Filter Toggle (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filtros
              </button>
            </div>

            {/* Location Filter */}
            {locations.length > 2 && (
              <div className={`${showFilters ? "block" : "hidden"} md:block`}>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-[#009999]" />
                    <label className="text-sm font-semibold text-gray-700">Local</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {locations.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => setLocationFilter(loc)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          locationFilter === loc
                            ? "bg-[#009999] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {loc === "All" ? "Todos" : loc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </FadeIn>

        {/* Results Count */}
        <FadeIn direction="up" delay={0.3}>
          <div className="mb-6">
            <p className="text-gray-600">
              Mostrando{" "}
              <span className="font-semibold">{filteredTrainings.length}</span>{" "}
              {filteredTrainings.length === 1 ? "formação" : "formações"}
            </p>
          </div>
        </FadeIn>

        {/* Trainings Grid */}
        <StaggerChildren
          key={`${activeTab}-${locationFilter}-${searchQuery}`}
          staggerDelay={0.1}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrainings.length > 0 ? (
              filteredTrainings.map((training) => (
                <StaggerItem key={training.id}>
                  <TrainingCard training={training} />
                </StaggerItem>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-semibold mb-2">
                  {activeTab === "upcoming"
                    ? "Não há formações agendadas de momento."
                    : activeTab === "past"
                    ? "Não há formações anteriores."
                    : "Nenhuma formação encontrada."}
                </p>
                <p className="text-gray-400">
                  Volte em breve para conferir as próximas formações presenciais.
                </p>
              </div>
            )}
          </div>
        </StaggerChildren>
      </div>
    </div>
  )
}
