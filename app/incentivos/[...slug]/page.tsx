"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Calendar, User, ArrowLeft, FileText, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { DynamicForm } from '@/components/forms/DynamicForm'

interface IncentivoPost {
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

export default function IncentivoPostPage({ params }: { params: { slug: string[] } }) {
  const [post, setPost] = useState<IncentivoPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [dynamicForms, setDynamicForms] = useState<any[]>([])

  useEffect(() => {
    fetchPostAndFind()
  }, [params.slug])

  const fetchPostAndFind = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
      
      const response = await fetch(
        `${baseUrl}/jsonapi/node/article?include=field_image,uid&fields[node--article]=drupal_internal__nid,title,body,created,path,field_image,uid&fields[file--file]=uri,url&fields[user--user]=display_name`
      )
      const data = await response.json()

      const fullPath = `/incentivos/${params.slug.join('/')}`
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

        fetchDynamicForms(postData.attributes.drupal_internal__nid)
      }
    } catch (error) {
      console.error('Error fetching incentivo post:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDynamicForms = async (nid: number) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
      const response = await fetch(`${baseUrl}/api/article-layout/${nid}`)
      
      if (response.ok) {
        const data = await response.json()
        if (data.forms && Array.isArray(data.forms) && data.forms.length > 0) {
          setDynamicForms(data.forms)
        }
      }
    } catch (error) {
      console.error('Error fetching dynamic forms:', error)
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Incentivo não encontrado</h1>
          <Link href="/incentivos" className="text-[#009999] hover:underline">
            Voltar para Incentivos
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
            href="/incentivos"
            className="inline-flex items-center gap-2 text-[#009999] hover:text-[#007a7a] font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para Incentivos
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

        {/* Dynamic Forms */}
        {dynamicForms.length > 0 && (
          <div className="mt-12 bg-gradient-to-br from-[#009999]/5 to-[#007a7a]/5 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <FileText className="h-8 w-8 text-[#009999]" />
              <h2 className="text-3xl font-bold text-gray-900">Formulário de Candidatura</h2>
            </div>
            <div className="space-y-8">
              {dynamicForms.map((form, index) => (
                <DynamicForm 
                  key={index}
                  formId={form.form_id || form.id}
                  formTitle={form.label}
                  fields={form.fields}
                />
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-[#009999] to-[#005c5c] rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Precisa de Ajuda?</h2>
          <p className="text-[#b3e6e6] mb-6">
            Nossa equipa está disponível para esclarecer dúvidas sobre este incentivo.
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
