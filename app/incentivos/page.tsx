import Image from "next/image"
import Link from "next/link"
import { FileText, ArrowRight, CheckCircle, Clock, XCircle } from "lucide-react"

interface Incentivo {
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
  dynamicFormIds: string[]
  disponibilidade?: string
}

export const metadata = {
  title: "Incentivos Governamentais - Clínica do Empresário",
  description: "Acesse formulários para candidatura a incentivos governamentais disponíveis para sua empresa.",
}

async function getIncentivos(): Promise<Incentivo[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
    
    // Simplified: fetch without nested includes to avoid timeouts
    const response = await fetch(
      `${baseUrl}/jsonapi/node/article?sort=-created&fields[node--article]=drupal_internal__nid,title,body,created,path,imagem,field_dynamic_form,field_disponibilidade&include=field_disponibilidade`,
      {
        next: { revalidate: 60 },
      }
    )

    if (!response.ok) {
      console.error('Failed to fetch incentivos:', response.status)
      return []
    }

    const data = await response.json()

    const incentivos: Incentivo[] = await Promise.all(
      data.data.map(async (item: any) => {
        // Extract summary from body field
        const bodyHtml = item.attributes.body?.processed || item.attributes.body?.value || ''

        // Fetch image from media entity if exists
        let image: { url: string; alt: string } | undefined = undefined

        if (item.relationships?.imagem?.data?.id) {
          try {
            const mediaResponse = await fetch(
              `${baseUrl}/jsonapi/media/image/${item.relationships.imagem.data.id}?include=field_media_image&fields[file--file]=uri`
            )
            const mediaData = await mediaResponse.json()
            const fileEntity = mediaData.included?.find((inc: any) => inc.type === 'file--file')
            if (fileEntity) {
              image = {
                url: baseUrl + fileEntity.attributes.uri.url,
                alt: mediaData.data.attributes?.name || item.attributes.title,
              }
            }
          } catch (e) {
            console.error('Error fetching media for incentivo:', e)
          }
        }

        // Extract dynamic form IDs from the relationship
        const formRefs = item.relationships?.field_dynamic_form?.data || []
        const dynamicFormIds = (Array.isArray(formRefs) ? formRefs : [formRefs])
          .filter((ref: any) => ref?.meta?.drupal_internal__target_id)
          .map((ref: any) => ref.meta.drupal_internal__target_id)

        // Extract disponibilidade term name from included data
        let disponibilidade: string | undefined
        const dispRef = item.relationships?.field_disponibilidade?.data
        if (dispRef?.id) {
          const term = data.included?.find((inc: any) => inc.type === 'taxonomy_term--disponibilidade_incentivos' && inc.id === dispRef.id)
          if (term) {
            disponibilidade = term.attributes.name
          }
        }

        return {
          id: item.id,
          nid: item.attributes.drupal_internal__nid,
          title: item.attributes.title,
          body: bodyHtml,
          created: item.attributes.created,
          path: `/incentivos/${item.attributes.drupal_internal__nid}`,
          image,
          dynamicFormIds,
          disponibilidade,
        }
      })
    )

    return incentivos
  } catch (error) {
    console.error('Error fetching incentivos:', error)
    return []
  }
}

export default async function IncentivosPage() {
  const incentivos = await getIncentivos()

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#009999] to-[#007a7a] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-black mb-6">
              Incentivos Governamentais
            </h1>
            <p className="text-xl text-[#b3e6e6] max-w-3xl mx-auto">
              Acesse formulários para candidatura a incentivos e apoios governamentais disponíveis para impulsionar o seu negócio
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {incentivos.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum incentivo disponível
            </h3>
            <p className="text-gray-600">
              Novos incentivos serão publicados em breve. Volte mais tarde!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {incentivos.map((incentivo) => (
              <Link
                key={incentivo.id}
                href={incentivo.path}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Image */}
                {incentivo.image?.url && (
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    <Image
                      src={incentivo.image.url}
                      alt={incentivo.image.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#009999] transition-colors line-clamp-2">
                    {incentivo.title}
                  </h2>

                  <div
                    className="text-gray-600 text-sm mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: incentivo.body }}
                  />

                  <div className="flex items-center gap-2 text-[#009999] font-semibold group-hover:gap-4 transition-all">
                    <span>Ver detalhes</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>

                {/* Disponibilidade Badge */}
                <div className="px-6 pb-6">
                  {(() => {
                    const disp = incentivo.disponibilidade?.toLowerCase() || ''
                    if (disp.includes('indispon')) {
                      return (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-xs font-semibold">
                          <XCircle className="h-4 w-4" />
                          {incentivo.disponibilidade}
                        </span>
                      )
                    }
                    if (disp.includes('brevemente')) {
                      return (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-full text-xs font-semibold">
                          <Clock className="h-4 w-4" />
                          {incentivo.disponibilidade}
                        </span>
                      )
                    }
                    if (disp.includes('dispon')) {
                      return (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                          <CheckCircle className="h-4 w-4" />
                          {incentivo.disponibilidade}
                        </span>
                      )
                    }
                    return (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                        <FileText className="h-4 w-4" />
                        Informação
                      </span>
                    )
                  })()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
