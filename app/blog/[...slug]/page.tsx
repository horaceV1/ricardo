"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, Tag, ArrowLeft, Share2 } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  body: string
  created: string
  image: {
    url: string
    alt: string
  }
  author: string
  tags: string[]
}

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<any[]>([])

  useEffect(() => {
    if (params.slug) {
      fetchBlogPost()
    }
  }, [params.slug])

  const fetchBlogPost = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
      
      // Fetch by path alias
      const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug
      const response = await fetch(
        `${baseUrl}/jsonapi/node/article?filter[path.alias]=/blog/${slug}&include=field_image,uid,field_tags&fields[node--article]=title,body,created,field_image,uid,field_tags&fields[file--file]=uri,url&fields[user--user]=display_name&fields[taxonomy_term--tags]=name`
      )
      const data = await response.json()

      if (data.data && data.data[0]) {
        const postData = data.data[0]
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

        setPost({
          id: postData.id,
          title: postData.attributes.title,
          body: postData.attributes.body?.processed || postData.attributes.body?.value || '',
          created: postData.attributes.created,
          image: {
            url: image?.attributes?.uri?.url || image?.attributes?.url || '',
            alt: postData.relationships.field_image?.data?.meta?.alt || postData.attributes.title,
          },
          author: author?.attributes?.display_name || 'Admin',
          tags,
        })

        // Fetch related posts (same tag)
        if (tags.length > 0) {
          fetchRelatedPosts(tags[0], postData.id)
        }
      }
    } catch (error) {
      console.error('Error fetching blog post:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedPosts = async (tag: string, excludeId: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
      const response = await fetch(
        `${baseUrl}/jsonapi/node/article?include=field_image&sort=-created&page[limit]=3&fields[node--article]=title,path,field_image&fields[file--file]=uri,url`
      )
      const data = await response.json()

      const related = data.data
        .filter((p: any) => p.id !== excludeId)
        .slice(0, 3)
        .map((p: any) => {
          const image = data.included?.find(
            (inc: any) => inc.type === 'file--file' && inc.id === p.relationships.field_image?.data?.id
          )
          return {
            id: p.id,
            title: p.attributes.title,
            path: p.attributes.path?.alias || `/blog/${p.id}`,
            image: {
              url: image?.attributes?.uri?.url || image?.attributes?.url || '',
              alt: p.attributes.title,
            },
          }
        })

      setRelatedPosts(related)
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
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-[#009999] prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
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
