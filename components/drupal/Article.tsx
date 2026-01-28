import Image from "next/image"
import Link from "next/link"
import { absoluteUrl, formatDate } from "@/lib/utils"
import type { DrupalNode } from "next-drupal"
import { DynamicForm } from "@/components/forms/DynamicForm"
import { Calendar, User, ArrowLeft } from "lucide-react"

interface ArticleProps {
  node: DrupalNode & {
    dynamic_forms?: Array<{
      id: string
      label: string
      fields: Array<{
        label: string
        type: "texto" | "documento" | "imagem"
        required: boolean
        link?: string
      }>
    }>
  }
}

async function getArticleForms(nid: number) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
    const response = await fetch(`${baseUrl}/api/article-layout/${nid}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.forms || []
    }
  } catch (error) {
    console.error('Error fetching article forms:', error)
  }
  return []
}

export async function Article({ node, ...props }: ArticleProps) {
  // Fetch dynamic forms from Layout Builder
  const forms = await getArticleForms(node.drupal_internal__nid)

  const date = new Date(node.created).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#009999] to-[#005c5c] text-white py-20">
        {node.field_image && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${absoluteUrl(node.field_image.uri.url)})` }}
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

          <h1 className="text-4xl md:text-5xl font-black mb-6">{node.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-[#b3e6e6]">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{date}</span>
            </div>
            {node.uid?.display_name && (
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{node.uid.display_name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12" {...props}>
          {/* Featured Image */}
          {node.field_image && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <Image
                src={absoluteUrl(node.field_image.uri.url)}
                width={1200}
                height={600}
                alt={node.field_image.resourceIdObjMeta?.alt || node.title}
                className="w-full h-auto"
                priority
              />
            </div>
          )}

          {/* Body Content */}
          {node.body?.processed && (
            <div
              dangerouslySetInnerHTML={{ __html: node.body?.processed }}
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
            />
          )}
        </article>

        {/* Dynamic Forms from Layout Builder */}
        {forms && forms.length > 0 && (
          <div className="mt-8 space-y-8">
            {forms.map((form: any, index: number) => (
              <DynamicForm 
                key={index}
                formId={form.id}
                formTitle={form.label}
                fields={form.fields}
              />
            ))}
          </div>
        )}

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
