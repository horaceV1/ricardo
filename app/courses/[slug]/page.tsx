import { drupal } from "@/lib/drupal"
import { notFound } from "next/navigation"
import { 
  Star, 
  Clock, 
  Users, 
  BookOpen, 
  PlayCircle, 
  CheckCircle, 
  Award,
  Download,
  Globe,
  Smartphone
} from "lucide-react"
import { FadeIn } from "@/components/animations/FadeIn"
import { ScaleIn } from "@/components/animations/ScaleIn"
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren"
import { ImageWithFallback } from "@/components/ui/ImageWithFallback"
import { absoluteUrl, formatPrice } from "@/lib/utils"
import type { DrupalNode } from "next-drupal"
import type { Metadata } from "next"

interface CoursePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  if (!process.env.NEXT_PUBLIC_DRUPAL_BASE_URL) {
    return { title: "Course" }
  }

  const course = await drupal
    .getResourceByPath<DrupalNode>(`/courses/${params.slug}`, {
      params: {
        include: "field_image,field_category,uid",
      },
    })
    .catch(() => null)

  if (!course) {
    return {
      title: "Course Not Found",
    }
  }

  return {
    title: `${course.title} - Online Course`,
    description: course.body?.summary || course.body?.value?.substring(0, 160),
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await drupal
    .getResourceByPath<DrupalNode>(`/courses/${params.slug}`, {
      params: {
        include: "field_image,field_category,uid",
      },
    })
    .catch(() => null)

  if (!course) {
    notFound()
  }

  const price = course.field_price || 0
  const rating = course.field_rating || 0
  const students = course.field_students || 0
  const duration = course.field_duration || "N/A"
  const lessons = course.field_lessons || 0
  const level = course.field_level || "Beginner"
  const category = course.field_category?.name || "Uncategorized"
  const instructor = course.uid?.display_name || "Anonymous"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FadeIn direction="up">
                <div className="mb-4">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {category}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4">{course.title}</h1>
                {course.body?.summary && (
                  <p className="text-xl text-blue-100 mb-6">{course.body.summary}</p>
                )}

                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-semibold">{rating}</span>
                    <span className="text-blue-200">({students.toLocaleString()} students)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{students.toLocaleString()} enrolled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-blue-200">Created by</span>
                  <span className="font-semibold">{instructor}</span>
                </div>
              </FadeIn>
            </div>

            <div className="lg:col-span-1">
              <ScaleIn delay={0.2}>
                <div className="bg-white rounded-lg shadow-xl p-6 text-gray-900 sticky top-6">
                  {course.field_image && (
                    <div className="relative h-48 rounded-lg overflow-hidden mb-6">
                      <ImageWithFallback
                        src={absoluteUrl(course.field_image.uri.url)}
                        alt={course.field_image.resourceIdObjMeta?.alt || course.title}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-colors cursor-pointer">
                        <PlayCircle className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  )}

                  <div className="text-4xl font-black text-blue-600 mb-6">
                    {formatPrice(price)}
                  </div>

                  <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-3">
                    Enroll Now
                  </button>
                  <button className="w-full border-2 border-gray-300 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                    Add to Cart
                  </button>

                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Smartphone className="w-5 h-5 text-green-600" />
                      <span>Access on mobile and TV</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Award className="w-5 h-5 text-green-600" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Download className="w-5 h-5 text-green-600" />
                      <span>Downloadable resources</span>
                    </div>
                  </div>
                </div>
              </ScaleIn>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <FadeIn direction="up" delay={0.3}>
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <h2 className="text-3xl font-black mb-6">What You'll Learn</h2>
                <StaggerChildren staggerDelay={0.05}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Build real-world projects",
                      "Master key concepts",
                      "Best practices and patterns",
                      "Industry-standard tools",
                      "Problem-solving skills",
                      "Professional workflows",
                    ].map((item, index) => (
                      <StaggerItem key={index}>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      </StaggerItem>
                    ))}
                  </div>
                </StaggerChildren>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.4}>
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-black mb-6">Course Description</h2>
                {course.body?.value && (
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: course.body.value }}
                  />
                )}
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-1">
            <FadeIn direction="up" delay={0.5}>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-2xl font-black mb-4">Course Features</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-700">
                      <BookOpen className="w-5 h-5" />
                      <span>Lessons</span>
                    </div>
                    <span className="font-semibold">{lessons}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-5 h-5" />
                      <span>Duration</span>
                    </div>
                    <span className="font-semibold">{duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Globe className="w-5 h-5" />
                      <span>Language</span>
                    </div>
                    <span className="font-semibold">English</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Award className="w-5 h-5" />
                      <span>Level</span>
                    </div>
                    <span className="font-semibold">{level}</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  )
}
