import { drupal } from "@/lib/drupal"
import { DrupalNode } from "next-drupal"
import { notFound } from "next/navigation"
import { Calendar, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

interface ArticlePageProps {
  params: {
    slug: string
  }
}

async function getArticle(slug: string): Promise<DrupalNode | null> {
  try {
    const articles = await drupal.getResourceCollection<DrupalNode[]>("node--article", {
      params: {
        "filter[path.alias]": `/${slug}`,
        "filter[status]": 1,
        include: "field_image,uid",
      },
    })
    
    return articles?.[0] || null
  } catch (error) {
    return null
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticle(params.slug)
  
  if (!article) {
    return {
      title: "Artigo não encontrado",
    }
  }

  return {
    title: `${article.title} - Clínica do Empresário`,
    description: article.body?.summary || article.body?.value?.substring(0, 160),
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.slug)

  if (!article) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
  const imageSrc = article.field_image?.uri?.url
    ? `${baseUrl}${article.field_image.uri.url}`
    : null

  const date = new Date(article.created).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#009999] to-[#005c5c] text-white py-20">
        {imageSrc && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${imageSrc})` }}
            />
            <div className="absolute inset-0 bg-black/50" />
          </>
        )}
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/courses"
            className="inline-flex items-center gap-2 text-[#b3e6e6] hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Cursos e Artigos
          </Link>

          <h1 className="text-4xl md:text-5xl font-black mb-6">{article.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-[#b3e6e6]">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{date}</span>
            </div>
            {article.uid?.display_name && (
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{article.uid.display_name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Featured Image */}
          {imageSrc && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img
                src={imageSrc}
                alt={article.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Body Content */}
          <div 
            className="prose prose-lg max-w-none
              prose-headings:text-gray-900 prose-headings:font-bold
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-[#009999] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900
              prose-ul:text-gray-700
              prose-ol:text-gray-700
              prose-li:text-gray-700
              prose-img:rounded-lg prose-img:shadow-md
              prose-blockquote:border-l-4 prose-blockquote:border-[#009999] prose-blockquote:pl-4 prose-blockquote:italic"
            dangerouslySetInnerHTML={{ __html: article.body?.value || '' }}
          />
        </article>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-[#009999] to-[#005c5c] rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Gostou deste conteúdo?</h2>
          <p className="text-[#b3e6e6] mb-6">
            Acesse sua conta para ver mais artigos exclusivos e cursos personalizados.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/conta"
              className="px-6 py-3 bg-white text-[#009999] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Acessar Minha Conta
            </Link>
            <Link
              href="/courses"
              className="px-6 py-3 bg-[#007a7a] text-white rounded-lg font-semibold hover:bg-[#005c5c] transition-colors"
            >
              Ver Mais Conteúdos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
