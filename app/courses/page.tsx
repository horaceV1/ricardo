import { drupal } from "@/lib/drupal"
import { CoursesClient } from "@/components/courses/CoursesClient"
import type { Metadata } from "next"
import type { DrupalNode } from "next-drupal"

export const metadata: Metadata = {
  title: "Nossas Formações - Clínica do Empresário",
  description: "Programas de consultoria e desenvolvimento empresarial personalizados para o crescimento do seu negócio.",
}

async function fetchTaxonomyTerms(vocabulary: string): Promise<{ id: string; name: string }[]> {
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || "https://darkcyan-stork-408379.hostingersite.com"
  try {
    const res = await fetch(`${baseUrl}/jsonapi/taxonomy_term/${vocabulary}`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data.data || []).map((term: any) => ({
      id: term.id,
      name: term.attributes.name,
    }))
  } catch {
    return []
  }
}

export default async function CoursesPage() {
  // Fetch commerce products and taxonomy terms in parallel
  const [mediaProducts, physicalProducts, categories, levels] = await Promise.all([
    drupal.getResourceCollection<DrupalNode[]>(
      "commerce_product--media",
      {
        params: {
          "filter[status]": 1,
          include: "variations,images,default_variation,field_categoria,field_nivel",
          sort: "-created",
        },
        next: {
          revalidate: 60,
        },
      }
    ).catch((error) => {
      console.error('Error fetching media products:', error)
      return []
    }),
    drupal.getResourceCollection<DrupalNode[]>(
      "commerce_product--physical",
      {
        params: {
          "filter[status]": 1,
          include: "variations,images,default_variation,field_categoria,field_nivel",
          sort: "-created",
        },
        next: {
          revalidate: 60,
        },
      }
    ).catch((error) => {
      console.error('Error fetching physical products:', error)
      return []
    }),
    fetchTaxonomyTerms("categorias_formacoes"),
    fetchTaxonomyTerms("nivel_formacoes"),
  ])

  const allProducts = [...(mediaProducts || []), ...(physicalProducts || [])]

  console.log('Fetched products:', allProducts.length)

  return (
    <CoursesClient
      initialCourses={allProducts}
      categories={categories}
      levels={levels}
    />
  )
}
