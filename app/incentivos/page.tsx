import { FileText } from "lucide-react"
import { IncentivosClient } from "@/components/incentivos/IncentivosClient"

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
  /** True if ANY linked dynamic form has require_auth enabled. */
  requireAuth: boolean
}

export const metadata = {
  title: "Incentivos Governamentais - Clínica do Empresário",
  description: "Acesse formulários para candidatura a incentivos governamentais disponíveis para sua empresa.",
}

async function getIncentivos(): Promise<Incentivo[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'

    // Fetch lightweight form metadata once so we know which forms require auth.
    let formsMeta: Record<string, { require_auth: boolean }> = {}
    try {
      const metaResp = await fetch(`${baseUrl}/api/dynamic-forms-meta`, { next: { revalidate: 60 } })
      if (metaResp.ok) formsMeta = await metaResp.json()
    } catch (e) {
      console.error('Failed to fetch dynamic forms meta:', e)
    }
    
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
          requireAuth: dynamicFormIds.some((fid) => formsMeta[fid]?.require_auth === true),
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

      {incentivos.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-20">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum incentivo disponível
            </h3>
            <p className="text-gray-600">
              Novos incentivos serão publicados em breve. Volte mais tarde!
            </p>
          </div>
        </div>
      ) : (
        <IncentivosClient incentivos={incentivos} />
      )}
    </div>
  )
}
