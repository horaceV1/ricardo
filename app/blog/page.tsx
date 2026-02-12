"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, Tag, ArrowRight } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  summary: string
  created: string
  path: string
  image: {
    url: string
    alt: string
  }
  author: string
  tags: string[]
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
      // Simplified: fetch without nested includes to avoid timeouts
      const response = await fetch(
        `${baseUrl}/jsonapi/node/curso?sort=-created&fields[node--curso]=title,corpo,created,path,imagem,drupal_internal__nid`
      )
      const data = await response.json()

      const posts: BlogPost[] = await Promise.all(data.data.map(async (post: any) => {
        // Extract summary from corpo field (first 150 chars of processed HTML)
        const corpoText = post.attributes.corpo?.processed || ''
        const plainText = corpoText.replace(/<[^>]*>/g, '')
        const summary = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '')

        // Fetch image from media entity if exists
        let imageUrl = ''
        let imageAlt = post.attributes.title
        
        if (post.relationships.imagem?.data?.id) {
          try {
            const mediaResponse = await fetch(
              `${baseUrl}/jsonapi/media/image/${post.relationships.imagem.data.id}?include=field_media_image&fields[file--file]=uri`
            )
            const mediaData = await mediaResponse.json()
            const fileEntity = mediaData.included?.find((inc: any) => inc.type === 'file--file')
            if (fileEntity) {
              imageUrl = baseUrl + fileEntity.attributes.uri.url
              imageAlt = mediaData.data.attributes.name || imageAlt
            }
          } catch (e) {
            console.error('Error fetching media:', e)
          }
        }

        return {
          id: post.id,
          title: post.attributes.title,
          summary: summary,
          created: post.attributes.created,
          path: post.attributes.path?.alias || `/blog/${post.attributes.drupal_internal__nid}`,
          image: {
            url: imageUrl,
            alt: imageAlt,
          },
          author: 'Admin',
          tags: [],
        }
      }))

      setPosts(posts)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)))
  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags.includes(selectedTag))
    : posts

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#009999] to-[#007a7a] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Blog</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Descubra histórias, dicas e inspiração para o seu dia a dia
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedTag === null
                    ? 'bg-[#009999] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Todos
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    selectedTag === tag
                      ? 'bg-[#009999] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Image */}
              <Link href={post.path} className="block relative h-64 overflow-hidden">
                {post.image.url && (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'}${post.image.url}`}
                    alt={post.image.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </Link>

              {/* Content */}
              <div className="p-6">
                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.created)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                </div>

                {/* Title */}
                <Link href={post.path}>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#009999] transition-colors">
                    {post.title}
                  </h2>
                </Link>

                {/* Summary */}
                <p className="text-gray-600 mb-4 line-clamp-3">{post.summary}</p>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#009999]/10 text-[#009999] text-xs font-semibold rounded-full"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Read More */}
                <Link
                  href={post.path}
                  className="inline-flex items-center gap-2 text-[#009999] font-semibold hover:gap-3 transition-all"
                >
                  Ler mais
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">Nenhum artigo encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
