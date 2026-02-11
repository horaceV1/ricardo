import Image from "next/image"
import Link from "next/link"
import { BookOpen, Calendar, Clock, ArrowRight, GraduationCap } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cursos - Clínica do Empresário",
  description: "Programas de formação e cursos especializados para o desenvolvimento e crescimento do seu negócio.",
}

interface Curso {
  id: string
  nid: number
  title: string
  body: string
  created: string
  path: string
  image?: {
    url: string
    alt: string
  }
}

async function getCursos(): Promise<Curso[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
    
    const response = await fetch(
      `${baseUrl}/jsonapi/node/cursos?include=imagem&sort=-created&fields[node--cursos]=drupal_internal__nid,title,body_curso,created,path,imagem&fields[media--image]=field_media_image&fields[file--file]=uri,url`,
      {
        next: { revalidate: 60 },
      }
    )

    if (!response.ok) {
      console.error('Failed to fetch cursos:', response.status)
      return []
    }

    const data = await response.json()

    return data.data.map((item: any) => {
      const mediaImage = data.included?.find(
        (inc: any) => inc.type === 'media--image' && inc.id === item.relationships?.imagem?.data?.id
      )
      const image = mediaImage ? data.included?.find(
        (inc: any) => inc.type === 'file--file' && inc.id === mediaImage.relationships?.field_media_image?.data?.id
      ) : null

      return {
        id: item.id,
        nid: item.attributes.drupal_internal__nid,
        title: item.attributes.title,
        body: item.attributes.body_curso?.processed || item.attributes.body_curso?.value || '',
        created: item.attributes.created,
        path: item.attributes.path?.alias || `/node/${item.attributes.drupal_internal__nid}`,
        image: image ? {
          url: image.attributes.uri?.url || image.attributes.url || '',
          alt: item.relationships?.field_image?.data?.meta?.alt || item.attributes.title,
        } : undefined,
      }
    })
  } catch (error) {
    console.error('Error fetching cursos:', error)
    return []
  }
}

export default async function CoursesPage() {
  const cursos = await getCursos()
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'

  console.log('Fetched cursos:', cursos.length)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#009999] to-[#007a7a] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <GraduationCap className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-4xl md:text-5xl font-black mb-6">
              Nossos Cursos
            </h1>
            <p className="text-xl text-[#b3e6e6] max-w-3xl mx-auto">
              Programas de formação especializados para impulsionar o seu desenvolvimento profissional e empresarial
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {cursos.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum curso disponível
            </h3>
            <p className="text-gray-600">
              Novos cursos serão publicados em breve. Fique atento!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cursos.map((curso) => (
              <Link
                key={curso.id}
                href={`/courses${curso.path}`}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Image */}
                {curso.image?.url ? (
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    <Image
                      src={`${baseUrl}${curso.image.url}`}
                      alt={curso.image.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#009999] to-[#007a7a] flex items-center justify-center">
                    <BookOpen className="h-20 w-20 text-white opacity-50" />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(curso.created).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#009999] transition-colors line-clamp-2">
                    {curso.title}
                  </h2>

                  <div
                    className="text-gray-600 text-sm mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: curso.body }}
                  />

                  <div className="flex items-center gap-2 text-[#009999] font-semibold group-hover:gap-4 transition-all">
                    <span>Ver detalhes</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
