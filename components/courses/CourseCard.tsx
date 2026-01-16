"use client"

import { Star, Clock, Users, BookOpen } from "lucide-react"
import { DrupalNode } from "next-drupal"
import Link from "next/link"
import { FadeIn } from "@/components/animations/FadeIn"
import { ScaleIn } from "@/components/animations/ScaleIn"
import { ImageWithFallback } from "@/components/ui/ImageWithFallback"
import { absoluteUrl, formatPrice } from "@/lib/utils"

interface CourseCardProps {
  course: DrupalNode
}

export function CourseCard({ course }: CourseCardProps) {
  const price = course.field_price || 0
  const rating = course.field_rating || 0
  const students = course.field_students || 0
  const duration = course.field_duration || "N/A"
  const lessons = course.field_lessons || 0
  const level = course.field_level || "Beginner"
  const category = course.field_category?.name || "Uncategorized"

  return (
    <Link href={course.path?.alias || `/courses/${course.id}`} className="group block">
      <ScaleIn>
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div className="relative h-48 overflow-hidden">
            {course.field_image && (
              <ImageWithFallback
                src={absoluteUrl(course.field_image.uri.url)}
                alt={course.field_image.resourceIdObjMeta?.alt || course.title}
                width={400}
                height={200}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            )}
            <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full">
              <span className="text-sm font-medium">{level}</span>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-blue-600 font-medium">{category}</span>
            </div>

            <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {course.title}
            </h3>

            {course.body?.summary && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {course.body.summary}
              </p>
            )}

            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{lessons} lessons</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{rating}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{students.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-2xl font-bold text-blue-600">
                {formatPrice(price)}
              </div>
            </div>
          </div>
        </div>
      </ScaleIn>
    </Link>
  )
}
