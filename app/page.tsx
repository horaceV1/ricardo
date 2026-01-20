import { ArrowRight, Award, Users, BookOpen, TrendingUp } from "lucide-react"
import Link from "next/link"
import { drupal } from "@/lib/drupal"
import { CourseCard } from "@/components/courses/CourseCard"
import { FadeIn } from "@/components/animations/FadeIn"
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren"
import type { Metadata } from "next"
import type { DrupalNode } from "next-drupal"

export const metadata: Metadata = {
  title: "Learn Without Limits - Online Course Platform",
  description: "Start, switch, or advance your career with thousands of courses from world-class instructors.",
}

export default async function Home() {
  let featuredCourses: DrupalNode[] = []
  
  try {
    // Try to fetch commerce products first
    const products = await drupal.getResourceCollection<DrupalNode[]>(
      "commerce_product--default",
      {
        params: {
          "filter[status]": 1,
          "fields[commerce_product--default]": "title,body,path,images,variations",
          include: "images,variations,variations.images",
          sort: "-created",
          "page[limit]": 3,
        },
        next: {
          revalidate: 3600,
        },
      }
    )
    console.log("Products fetched:", products?.length || 0)
    featuredCourses = products || []
  } catch (error) {
    console.log("Products fetch error:", error)
    // Fallback to courses
    try {
      const courses = await drupal.getResourceCollection<DrupalNode[]>(
        "node--course",
        {
          params: {
            "filter[status]": 1,
            "fields[node--course]": "title,path,field_image,field_price,field_rating,field_students,field_duration,field_lessons,field_level,field_category,body,created",
            include: "field_image,field_category",
            sort: "-created",
            "page[limit]": 3,
          },
          next: {
            revalidate: 3600,
          },
        }
      )
      featuredCourses = courses || []
    } catch {
      // Final fallback to articles for testing
      try {
        const articles = await drupal.getResourceCollection<DrupalNode[]>(
          "node--article",
          {
            params: {
              "filter[status]": 1,
              "fields[node--article]": "title,path,field_image,uid,created,body",
              include: "field_image,uid",
              sort: "-created",
              "page[limit]": 3,
            },
            next: {
              revalidate: 3600,
            },
          }
        )
        featuredCourses = articles || []
      } catch {
        featuredCourses = []
      }
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <div>
                <h1 className="text-5xl md:text-6xl font-black mb-6">
                  Learn Without Limits
                </h1>
                <p className="text-xl text-blue-100 mb-8">
                  Start, switch, or advance your career with thousands of courses, Professional Certificates, and degrees from world-class universities and companies.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/courses"
                    className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center justify-center gap-2 font-semibold"
                  >
                    Explore Courses
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/instructors"
                    className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold text-center"
                  >
                    Become an Instructor
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mt-12">
                  <div>
                    <div className="text-3xl font-bold mb-1">50K+</div>
                    <div className="text-blue-200 text-sm">Active Students</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-1">300+</div>
                    <div className="text-blue-200 text-sm">Expert Instructors</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-1">1,000+</div>
                    <div className="text-blue-200 text-sm">Online Courses</div>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.2} className="hidden lg:block">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                  alt="Students learning online"
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerChildren staggerDelay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <StaggerItem>
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Expert Instructors</h3>
                  <p className="text-gray-600 text-sm">
                    Learn from industry professionals with real-world experience
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Certificates</h3>
                  <p className="text-gray-600 text-sm">
                    Earn certificates to showcase your achievements
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Community</h3>
                  <p className="text-gray-600 text-sm">
                    Join a vibrant community of learners worldwide
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Career Growth</h3>
                  <p className="text-gray-600 text-sm">
                    Advance your career with in-demand skills
                  </p>
                </div>
              </StaggerItem>
            </div>
          </StaggerChildren>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black mb-4">Featured Courses</h2>
              <p className="text-xl text-gray-600">
                Explore our most popular courses and start learning today
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mt-4 font-semibold"
              >
                View All Courses
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </FadeIn>

          <StaggerChildren staggerDelay={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.length > 0 ? (
                featuredCourses.map((course) => (
                  <StaggerItem key={course.id}>
                    <CourseCard course={course} />
                  </StaggerItem>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 text-lg mb-4">No courses available yet. Check back soon!</p>
                  <p className="text-sm text-gray-500">
                    Connection Status: {process.env.NEXT_PUBLIC_DRUPAL_BASE_URL ? '✅ Connected' : '❌ Not Configured'}
                  </p>
                  {process.env.NEXT_PUBLIC_DRUPAL_BASE_URL && (
                    <p className="text-xs text-gray-400 mt-2">
                      API: {process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}
                    </p>
                  )}
                </div>
              )}
            </div>
          </StaggerChildren>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <FadeIn direction="up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-black mb-6">Ready to Start Learning?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students already learning. Get unlimited access to all courses.
            </p>
            <Link
              href="/courses"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center gap-2 font-semibold"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  )
}
