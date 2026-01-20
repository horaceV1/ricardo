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
  // Check if it's a commerce product or a node
  const isProduct = course.type?.includes('commerce_product')
  
  // Handle both course nodes and commerce products
  const price = isProduct ? (course.variations?.[0]?.price?.number || 0) : (course.field_price || 0)
  const rating = course.field_rating || 4.5
  const students = course.field_students || 100
  const duration = course.field_duration || "Self-paced"
  const lessons = course.field_lessons || 10
  const level = course.field_level || "Beginner"
  const category = course.field_category?.name || course.type?.replace('node--', '').replace('commerce_product--', '') || "General"
  
  // Get image - products use 'images', nodes use 'field_image'
  const image = isProduct ? course.images?.[0] : course.field_image

  return (
    <Link href={course.path?.alias || `/courses/${course.id}`} className="group block h-full">
      <ScaleIn>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-[#009999] h-full flex flex-col">
          <div className="relative h-56 overflow-hidden">
            {image && (
              <ImageWithFallback
                src={absoluteUrl(image.uri?.url || image.url)}
                alt={image.resourceIdObjMeta?.alt || course.title}
                width={400}
                height={224}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-4 right-4 bg-[#009999] text-white px-4 py-1.5 rounded-full shadow-lg">
              <span className="text-sm font-bold">{level}</span>
            </div>
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
              <span className="text-sm font-bold text-[#009999]">{category}</span>
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-black mb-3 line-clamp-2 group-hover:text-[#009999] transition-colors leading-tight">
              {course.title}
            </h3>

            {course.body?.summary && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                {course.body.summary}
              </p>
            )}

            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#009999]" />
                <span className="font-semibold">{duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#009999]" />
                <span className="font-semibold">{lessons} lições</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 fill-[#ff8c00] text-[#ff8c00]" />
                  <span className="text-sm font-bold text-gray-900">{rating}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-[#009999]" />
                  <span className="font-semibold">{students.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-2xl font-black text-[#009999]">
                {formatPrice(price)}
              </div>
            </div>
          </div>
        </div>
      </ScaleIn>
    </Link>
  )
}
