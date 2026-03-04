"use client"

import { useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { CourseCard } from "@/components/courses/CourseCard"
import { FadeIn } from "@/components/animations/FadeIn"
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren"
import { DrupalNode } from "next-drupal"

interface TaxonomyTerm {
  id: string
  name: string
}

interface CoursesClientProps {
  initialCourses: DrupalNode[]
  categories?: TaxonomyTerm[]
  levels?: TaxonomyTerm[]
}

export function CoursesClient({ initialCourses, categories = [], levels = [] }: CoursesClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLevel, setSelectedLevel] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const categoryNames = ["All", ...categories.map(c => c.name)]
  const levelNames = ["All", ...levels.map(l => l.name)]

  const filteredCourses = initialCourses.filter((course) => {
    // Get the category and level names from the included taxonomy term relationships
    const courseCategoryName = course.field_categoria?.name || course.field_categoria?.attributes?.name || null
    const courseLevelName = course.field_nivel?.name || course.field_nivel?.attributes?.name || null

    const matchesCategory = selectedCategory === "All" || courseCategoryName === selectedCategory
    const matchesLevel = selectedLevel === "All" || courseLevelName === selectedLevel
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.body?.summary?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesLevel && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#009999] to-[#005c5c] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="down">
            <h1 className="text-4xl md:text-5xl font-black mb-4">Nossas Formações</h1>
            <p className="text-xl text-[#b3e6e6]">
              Programas personalizados para o crescimento do seu negócio
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <FadeIn direction="up" delay={0.2}>
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar formações..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999]"
                />
              </div>

              {/* Filter Toggle (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filtros
              </button>
            </div>

            {/* Filters */}
            <div className={`${showFilters ? "block" : "hidden"} md:block`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-sm">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Categoria
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categoryNames.map((name) => (
                      <button
                        key={name}
                        onClick={() => setSelectedCategory(name)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedCategory === name
                            ? "bg-[#009999] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Nível</label>
                  <div className="flex flex-wrap gap-2">
                    {levelNames.map((name) => (
                      <button
                        key={name}
                        onClick={() => setSelectedLevel(name)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedLevel === name
                            ? "bg-[#009999] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Results Count */}
        <FadeIn direction="up" delay={0.3}>
          <div className="mb-6">
            <p className="text-gray-600">
              Mostrando <span className="font-semibold">
                {filteredCourses.length}
              </span> formações
            </p>
          </div>
        </FadeIn>

        {/* Courses Grid */}
        <StaggerChildren staggerDelay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <StaggerItem key={course.id}>
                  <CourseCard course={course} />
                </StaggerItem>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg">
                  Nenhum curso encontrado com os filtros selecionados.
                </p>
              </div>
            )}
          </div>
        </StaggerChildren>
      </div>
    </div>
  )
}
