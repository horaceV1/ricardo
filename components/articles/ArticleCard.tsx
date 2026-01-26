"use client"

import Link from "next/link"
import { DrupalNode } from "next-drupal"
import { Calendar, User, ArrowRight } from "lucide-react"

interface ArticleCardProps {
  article: DrupalNode
}

export function ArticleCard({ article }: ArticleCardProps) {
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
  const imageSrc = article.field_image?.uri?.url
    ? `${baseUrl}${article.field_image.uri.url}`
    : "/placeholder-article.jpg"

  const excerpt = article.body?.summary || article.body?.value?.substring(0, 150) + "..." || ""
  const date = new Date(article.created).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  return (
    <Link href={article.path?.alias || `/articles/${article.id}`}>
      <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageSrc}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="inline-block bg-[#009999] text-white text-xs px-3 py-1 rounded-full font-semibold">
              Artigo
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#009999] transition-colors line-clamp-2">
            {article.title}
          </h3>

          {/* Excerpt */}
          <div 
            className="text-gray-600 mb-4 line-clamp-3 flex-1"
            dangerouslySetInnerHTML={{ __html: excerpt }}
          />

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
            {article.uid?.display_name && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{article.uid.display_name}</span>
              </div>
            )}
          </div>

          {/* Read More */}
          <div className="flex items-center gap-2 text-[#009999] font-semibold group-hover:gap-4 transition-all">
            <span>Ler artigo</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  )
}
