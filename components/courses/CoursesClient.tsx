"use client"

import { useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { CourseCard } from "@/components/courses/CourseCard"
import { FadeIn } from "@/components/animations/FadeIn"
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren"
import { DrupalNode } from "next-drupal"

interface CoursesClientProps {
  initialCourses: DrupalNode[]
}

export function CoursesClient({ initialCourses }: CoursesClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLevel, setSelectedLevel] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const categories = ["All", "Web Development", "Design", "Marketing", "Business"]
  const levels = ["All", "Beginner", "Intermediate", "Advanced"]

  const filteredCourses = initialCourses.filter((course) => {
    const matchesCategory =
      selectedCategory === "All" || course.field_category?.name === selectedCategory
    const matchesLevel = selectedLevel === "All" || course.field_level === selectedLevel
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.body?.summary?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesLevel && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="down">
            <h1 className="text-4xl md:text-5xl font-black mb-4">Explore Courses</h1>
            <p className="text-xl text-blue-100">
              Discover the perfect course to advance your skills
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
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filter Toggle (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </button>
            </div>

            {/* Filters */}
            <div className={`${showFilters ? "block" : "hidden"} md:block`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-sm">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedCategory === category
                            ? "bg-blue-600 text-white"
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
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Level</label>
                  <div className="flex flex-wrap gap-2">
                    {levels.map((level) => (
                      <button
                        key={level}
                        onClick={() => setSelectedLevel(level)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedLevel === level
                            ? "bg-blue-600 text-white"
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

        {/* Results Count */}
        <FadeIn direction="up" delay={0.3}>
          <div className="mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filteredCourses.length}</span> courses
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
                  No courses found. Try adjusting your filters.
                </p>
              </div>
            )}
          </div>
        </StaggerChildren>
      </div>
    </div>
  )
}
