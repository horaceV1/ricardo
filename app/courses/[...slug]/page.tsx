"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Calendar, User, ArrowLeft, BookOpen, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface CursoPost {
  id: string
  nid: number
  title: string
  body: string
  created: string
  path: string
  image: {
    url: string
    alt: string
  }
  author: string
}

export default function CursoPostPage({ params }: { params: { slug: string[] } }) {
  const [post, setPost] = useState<CursoPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPostAndFind()
  }, [params.slug])

  const fetchPostAndFind = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
      
      const response = await fetch(
        `${baseUrl}/jsonapi/node/curso?include=field_image,uid&fields[node--curso]=drupal_internal__nid,title,body,created,path,field_image,uid&fields[file--file]=uri,url&fields[user--user]=display_name`
      )
      const data = await response.json()

      const fullPath = `/courses/${params.slug.join('/')}`
      const postData = data.data.find((p: any) => p.attributes.path?.alias === fullPath)

      if (postData) {
        const image = data.included?.find(
          (inc: any) => inc.type === 'file--file' && inc.id === postData.relationships.field_image?.data?.id
        )
        const author = data.included?.find(
          (inc: any) => inc.type === 'user--user' && inc.id === postData.relationships.uid?.data?.id
        )

        setPost({
          id: postData.id,
          nid: postData.attributes.drupal_internal__nid,
          title: postData.attributes.title,
          body: postData.attributes.body?.processed || postData.attributes.body?.value || '',
          created: postData.attributes.created,
          path: postData.attributes.path?.alias || '',
          image: {
            url: image?.attributes?.uri?.url || image?.attributes?.url || '',
            alt: postData.relationships.field_image?.data?.meta?.alt || postData.attributes.title,
          },
          author: author?.attributes?.display_name || 'Admin',
        })
      }
    } catch (error) {
      console.error('Error fetching curso post:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#009999]"></div>
          <p className="mt-4 text-gray-600">A carregar...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Curso não encontrado</h1>
          <Link href="/courses" className="text-[#009999] hover:underline">
            Voltar para Cursos
          </Link>
        </div>
      </div>
    )
  }

  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-[#009999] hover:text-[#007a7a] font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para Cursos
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      {post.image.url && (
        <div className="relative h-96 md:h-[500px] bg-gray-900">
          <Image
            src={`${baseUrl}${post.image.url}`}
            alt={post.image.alt}
            fill
            className="object-cover opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#009999] text-white rounded-full text-sm font-semibold">
                  <BookOpen className="h-4 w-4" />
                  Curso
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(post.created)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{post.author}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-[#009999] prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        </article>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-[#009999] to-[#005c5c] rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Interessado neste curso?</h2>
          <p className="text-[#b3e6e6] mb-6">
            Aceda à sua conta para mais informações e para se inscrever.
          </p>
          <Link
            href="/conta"
            className="inline-block px-6 py-3 bg-white text-[#009999] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Aceder à Minha Conta
          </Link>
        </div>
      </div>
    </div>
  )
}
