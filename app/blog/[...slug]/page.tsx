"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, Tag, ArrowLeft, Share2 } from 'lucide-react'
import { DynamicForm } from '@/components/forms/DynamicForm'

interface BlogPost {
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
  tags: string[]
  dynamicFormId: string | null
}

export default function BlogPostPage({ params }: { params: { slug: string[] } }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<any[]>([])
  const [dynamicForms, setDynamicForms] = useState<any[]>([])

  useEffect(() => {
    fetchAllPostsAndFind()
  }, [params.slug])

  const fetchAllPostsAndFind = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
      
      // Fetch all posts to find the one with matching path
      const response = await fetch(
        `${baseUrl}/jsonapi/node/curso?include=field_image,uid,field_tags,field_dynamic_form&fields[node--curso]=drupal_internal__nid,title,corpo,created,path,field_image,uid,field_tags,field_dynamic_form&fields[file--file]=uri,url&fields[user--user]=display_name&fields[taxonomy_term--tags]=name&fields[dynamic_form--dynamic_form]=drupal_internal__id,name,fields`
      )
      const data = await response.json()

      // Construct the path from slug
      const fullPath = `/blog/${params.slug.join('/')}`
      
      // Find the post with matching path
      const postData = data.data.find((p: any) => p.attributes.path?.alias === fullPath)

      if (postData) {
        const image = data.included?.find(
          (inc: any) => inc.type === 'file--file' && inc.id === postData.relationships.field_image?.data?.id
        )
        const author = data.included?.find(
          (inc: any) => inc.type === 'user--user' && inc.id === postData.relationships.uid?.data?.id
        )
        const tags = postData.relationships.field_tags?.data?.map((tagRef: any) => {
          const tag = data.included?.find((inc: any) => inc.type === 'taxonomy_term--tags' && inc.id === tagRef.id)
          return tag?.attributes?.name || ''
        }).filter(Boolean) || []

        // Get dynamic form ID - use internal ID from meta as the API expects it
        const dynamicFormId = postData.relationships.field_dynamic_form?.data?.meta?.drupal_internal__target_id || null

        setPost({
          id: postData.id,
          nid: postData.attributes.drupal_internal__nid,
          title: postData.attributes.title,
          body: postData.attributes.corpo?.processed || postData.attributes.corpo?.value || '',
          created: postData.attributes.created,
          path: postData.attributes.path?.alias || '',
          image: {
            url: image?.attributes?.uri?.url || image?.attributes?.url || '',
            alt: postData.relationships.field_image?.data?.meta?.alt || postData.attributes.title,
          },
          author: author?.attributes?.display_name || 'Admin',
          tags,
          dynamicFormId: dynamicFormId,
        })

        // Fetch related posts
        if (tags.length > 0) {
          fetchRelatedPosts(tags[0], postData.id, data.data)
        }

        // Fetch dynamic forms from Layout Builder
        fetchDynamicForms(postData.attributes.drupal_internal__nid)
      }
    } catch (error) {
      console.error('Error fetching blog post:', error)
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

  const fetchRelatedPosts = async (tag: string, excludeId: string, allPosts: any[]) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
      
      const related = allPosts
        .filter((p: any) => p.id !== excludeId)
        .slice(0, 3)
        .map((p: any) => {
          const imageId = p.relationships.field_image?.data?.id
          return {
            id: p.id,
            title: p.attributes.title,
            path: p.attributes.path?.alias || `/blog/${p.id}`,
            imageId,
          }
        })

      // Fetch images for related posts
      if (related.length > 0) {
        const imageIds = related.map(r => r.imageId).filter(Boolean)
        if (imageIds.length > 0) {
          const imageResponse = await fetch(
            `${baseUrl}/jsonapi/file/file?filter[id][value]=${imageIds.join(',')}&filter[id][operator]=IN`
          )
          const imageData = await imageResponse.json()
          
          const relatedWithImages = related.map(r => {
            const image = imageData.data?.find((img: any) => img.id === r.imageId)
            return {
              ...r,
              image: {
                url: image?.attributes?.uri?.url || image?.attributes?.url || '',
                alt: r.title,
              }
            }
          })
          setRelatedPosts(relatedWithImages)
        } else {
          setRelatedPosts(related.map(r => ({ ...r, image: { url: '', alt: r.title } })))
        }
      }
    } catch (error) {
      console.error('Error fetching related posts:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copiado para a área de transferência!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009999]"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Artigo não encontrado</h1>
            <Link href="/blog" className="text-[#009999] hover:underline">
              Voltar ao blog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#009999] hover:text-[#007a7a] font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar ao Blog
          </Link>
        </div>
      </div>

      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{formatDate(post.created)}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>{post.author}</span>
              </div>
              <button
                onClick={sharePost}
                className="flex items-center gap-2 text-[#009999] hover:text-[#007a7a] font-semibold"
              >
                <Share2 className="h-5 w-5" />
                Partilhar
              </button>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-[#009999]/10 text-[#009999] text-sm font-semibold rounded-full"
                  >
                    <Tag className="h-4 w-4" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Featured Image */}
          {post.image.url && (
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden mb-12">
              <Image
                src={`${baseUrl}${post.image.url}`}
                alt={post.image.alt}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-[#009999] prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-img:rounded-xl mb-12"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

          {/* Dynamic Forms */}
          {dynamicForms.length > 0 && (
            <div className="mt-16 pt-12 border-t border-gray-200 space-y-12">
              {dynamicForms.map((form, index) => (
                <DynamicForm 
                  key={index}
                  formId={form.form_id || form.id}
                  formTitle={form.label}
                  fields={form.fields}
                />
              ))}
            </div>
          )}
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-white py-16 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Artigos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map(relatedPost => (
                <Link
                  key={relatedPost.id}
                  href={relatedPost.path}
                  className="group"
                >
                  <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                    {relatedPost.image.url && (
                      <Image
                        src={`${baseUrl}${relatedPost.image.url}`}
                        alt={relatedPost.image.alt}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#009999] transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
