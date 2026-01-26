"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, BookOpen } from "lucide-react"
import { CourseCard } from "@/components/courses/CourseCard"
import { ArticleCard } from "@/components/articles/ArticleCard"
import { FadeIn } from "@/components/animations/FadeIn"
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren"
import { DrupalNode } from "next-drupal"

interface CoursesClientProps {
  initialCourses: DrupalNode[]
  articles?: DrupalNode[]
}

export function CoursesClient({ initialCourses, articles = [] }: CoursesClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLevel, setSelectedLevel] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState<'courses' | 'articles'>('courses')

  const categories = ["All", "Consultoria Estratégica", "Gestão Financeira", "Marketing", "Vendas", "Recursos Humanos"]
  const levels = ["All", "Iniciante", "Intermediário", "Avançado"]

  const filteredCourses = initialCourses.filter((course) => {
    const matchesCategory =
      selectedCategory === "All" || course.field_category?.name === selectedCategory
    const matchesLevel = selectedLevel === "All" || course.field_level === selectedLevel
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.body?.summary?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesLevel && matchesSearch
  })

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.body?.summary?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#009999] to-[#005c5c] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="down">
            <h1 className="text-4xl md:text-5xl font-black mb-4">Nossas Soluções</h1>
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
                  placeholder="Buscar soluções..."
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
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedCategory === category
                            ? "bg-[#009999] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Nível</label>
                  <div className="flex flex-wrap gap-2">
                    {levels.map((level) => (
                      <button
                        key={level}
                        onClick={() => setSelectedLevel(level)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedLevel === level
                            ? "bg-[#009999] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Tabs */}
        <FadeIn direction="up" delay={0.25}>
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('courses')}
              className={`pb-3 px-4 font-semibold transition-colors relative ${
                activeTab === 'courses'
                  ? 'text-[#009999]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Cursos
              {activeTab === 'courses' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#009999]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className={`pb-3 px-4 font-semibold transition-colors relative flex items-center gap-2 ${
                activeTab === 'articles'
                  ? 'text-[#009999]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Artigos
              {articles.length > 0 && (
                <span className="bg-[#009999] text-white text-xs px-2 py-0.5 rounded-full">
                  {articles.length}
                </span>
              )}
              {activeTab === 'articles' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#009999]" />
              )}
            </button>
          </div>
        </FadeIn>

        {/* Results Count */}
        <FadeIn direction="up" delay={0.3}>
          <div className="mb-6">
            <p className="text-gray-600">
              Mostrando <span className="font-semibold">
                {activeTab === 'courses' ? filteredCourses.length : filteredArticles.length}
              </span> {activeTab === 'courses' ? 'soluções' : 'artigos'}
            </p>
          </div>
        </FadeIn>

        {/* Courses/Articles Grid */}
        <StaggerChildren staggerDelay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeTab === 'courses' ? (
              filteredCourses.length > 0 ? (
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
              )
            ) : (
              filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <StaggerItem key={article.id}>
                    <ArticleCard article={article} />
                  </StaggerItem>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 text-lg">
                    Nenhum artigo encontrado.
                  </p>
                </div>
              )
            )}
          </div>
        </StaggerChildren>
      </div>
    </div>
  )
}
