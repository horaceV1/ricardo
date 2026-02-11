import Image from "next/image"
import Link from "next/link"
import { FileText, Calendar, ArrowRight, CheckCircle } from "lucide-react"

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
}

export const metadata = {
  title: "Incentivos Governamentais - Clínica do Empresário",
  description: "Acesse formulários para candidatura a incentivos governamentais disponíveis para sua empresa.",
}

async function getIncentivos(): Promise<Incentivo[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
    
    const response = await fetch(
      `${baseUrl}/jsonapi/node/article?include=field_image&sort=-created&fields[node--article]=drupal_internal__nid,title,body,created,path,field_image&fields[file--file]=uri,url`,
      {
        next: { revalidate: 60 },
      }
    )

    if (!response.ok) {
      console.error('Failed to fetch incentivos:', response.status)
      return []
    }

    const data = await response.json()

    return data.data.map((item: any) => {
      const image = data.included?.find(
        (inc: any) => inc.type === 'file--file' && inc.id === item.relationships?.field_image?.data?.id
      )

      return {
        id: item.id,
        nid: item.attributes.drupal_internal__nid,
        title: item.attributes.title,
        body: item.attributes.body?.processed || item.attributes.body?.value || '',
        created: item.attributes.created,
        path: item.attributes.path?.alias || `/node/${item.attributes.drupal_internal__nid}`,
        image: image ? {
          url: image.attributes.uri?.url || image.attributes.url || '',
          alt: item.relationships?.field_image?.data?.meta?.alt || item.attributes.title,
        } : undefined,
      }
    })
  } catch (error) {
    console.error('Error fetching incentivos:', error)
    return []
  }
}

export default async function IncentivosPage() {
  const incentivos = await getIncentivos()
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'

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
                href={`/incentivos${incentivo.path}`}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Image */}
                {incentivo.image?.url && (
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    <Image
                      src={`${baseUrl}${incentivo.image.url}`}
                      alt={incentivo.image.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(incentivo.created).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

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

                {/* Badge */}
                <div className="px-6 pb-6">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                    <CheckCircle className="h-4 w-4" />
                    Candidatura Disponível
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
