"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Calendar, User, ArrowLeft, FileText, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { DynamicForm } from '@/components/forms/DynamicForm'

interface FormField {
  label: string
  type: "texto" | "documento" | "imagem"
  required: boolean
  link?: string
}

interface DynamicFormData {
  id: string
  label: string
  fields: FormField[]
  requireAuth: boolean
}

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
  dynamicFormIds: string[]
}

export default function IncentivoPostPage({ params }: { params: { slug: string[] } }) {
  const [post, setPost] = useState<IncentivoPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [dynamicForms, setDynamicForms] = useState<DynamicFormData[]>([])

  useEffect(() => {
    fetchPostAndFind()
  }, [params.slug])

  const fetchPostAndFind = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
      
      // Fetch articles including field_dynamic_form relationship
      const response = await fetch(
        `${baseUrl}/jsonapi/node/article?fields[node--article]=drupal_internal__nid,title,body,created,path,imagem,uid,field_dynamic_form`
      )
      const data = await response.json()

      const slugStr = params.slug.join('/')
      let postData = null

      // Primary: match by NID (links are now /incentivos/{nid})
      if (!isNaN(Number(slugStr))) {
        postData = data.data.find((p: any) => p.attributes.drupal_internal__nid === Number(slugStr))
      }

      // Fallback: try matching by path alias (various patterns)
      if (!postData) {
        const possiblePaths = [
          `/${slugStr}`,
          `/blog/${slugStr}`,
          `/incentivos/${slugStr}`,
        ]
        postData = data.data.find((p: any) => {
          const alias = p.attributes.path?.alias
          return alias && possiblePaths.includes(alias)
        })
      }

      // Last fallback: NID from last slug segment
      if (!postData) {
        const lastSegment = params.slug[params.slug.length - 1]
        if (lastSegment && !isNaN(Number(lastSegment))) {
          postData = data.data.find((p: any) => p.attributes.drupal_internal__nid === Number(lastSegment))
        }
      }

      if (postData) {
        // Fetch image from media entity if exists
        let imageUrl = ''
        let imageAlt = postData.attributes.title

        if (postData.relationships?.imagem?.data?.id) {
          try {
            const mediaResponse = await fetch(
              `${baseUrl}/jsonapi/media/image/${postData.relationships.imagem.data.id}?include=field_media_image&fields[file--file]=uri`
            )
            const mediaData = await mediaResponse.json()
            const fileEntity = mediaData.included?.find((inc: any) => inc.type === 'file--file')
            if (fileEntity) {
              imageUrl = baseUrl + fileEntity.attributes.uri.url
              imageAlt = mediaData.data.attributes?.name || imageAlt
            }
          } catch (e) {
            console.error('Error fetching media for incentivo:', e)
          }
        }

        // Fetch author name if exists
        let authorName = 'Admin'
        if (postData.relationships?.uid?.data?.id) {
          try {
            const userResponse = await fetch(
              `${baseUrl}/jsonapi/user/user/${postData.relationships.uid.data.id}?fields[user--user]=display_name`
            )
            const userData = await userResponse.json()
            authorName = userData.data?.attributes?.display_name || 'Admin'
          } catch (e) {
            console.error('Error fetching author:', e)
          }
        }

        // Extract dynamic form IDs from field_dynamic_form relationship
        const formRefs = postData.relationships?.field_dynamic_form?.data || []
        const dynamicFormIds = (Array.isArray(formRefs) ? formRefs : [formRefs])
          .filter((ref: any) => ref?.meta?.drupal_internal__target_id)
          .map((ref: any) => ref.meta.drupal_internal__target_id as string)

        setPost({
          id: postData.id,
          nid: postData.attributes.drupal_internal__nid,
          title: postData.attributes.title,
          body: postData.attributes.body?.processed || postData.attributes.body?.value || '',
          created: postData.attributes.created,
          path: postData.attributes.path?.alias || '',
          image: {
            url: imageUrl,
            alt: imageAlt,
          },
          author: authorName,
          dynamicFormIds,
        })

        // Fetch the actual dynamic form configurations
        if (dynamicFormIds.length > 0) {
          fetchDynamicForms(baseUrl, dynamicFormIds)
        }
      }
    } catch (error) {
      console.error('Error fetching incentivo post:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDynamicForms = async (baseUrl: string, formIds: string[]) => {
    try {
      const forms: DynamicFormData[] = []

      for (const formId of formIds) {
        try {
          const response = await fetch(`${baseUrl}/api/dynamic-form/${formId}`)
          if (response.ok) {
            const formData = await response.json()
            if (formData && !formData.error && formData.fields) {
              forms.push({
                id: formData.id || formId,
                label: formData.label || 'Formulário',
                fields: formData.fields || [],
                requireAuth: formData.require_auth || false,
              })
            }
          }
        } catch (e) {
          console.error(`Error fetching form ${formId}:`, e)
        }
      }

      setDynamicForms(forms)
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

      {/* Hero section - with or without image */}
      {post.image.url ? (
        <div className="relative h-96 md:h-[500px] bg-gray-900">
          <Image
            src={post.image.url}
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
      ) : (
        <div className="bg-gradient-to-r from-[#009999] to-[#007a7a] text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-black mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80">
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
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Body */}
        {post.body && (
          <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-[#009999] prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          </article>
        )}

        {/* Dynamic Forms */}
        {dynamicForms.length > 0 && (
          <div className="mt-12">
            {dynamicForms.map((form, index) => (
              <div key={form.id || index} className="mb-8">
                <div className="bg-gradient-to-br from-[#009999]/5 to-[#007a7a]/5 rounded-2xl p-8 border border-[#009999]/10">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="h-7 w-7 text-[#009999]" />
                    <h2 className="text-2xl font-bold text-gray-900">Formulário de Candidatura</h2>
                  </div>
                  <DynamicForm 
                    formId={form.id}
                    formTitle={form.label}
                    fields={form.fields}
                    requireAuth={form.requireAuth}
                  />
                </div>
              </div>
            ))}
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
