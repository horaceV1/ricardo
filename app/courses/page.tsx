import { drupal } from "@/lib/drupal"
import { CoursesClient } from "@/components/courses/CoursesClient"
import type { Metadata } from "next"
import type { DrupalNode } from "next-drupal"

export const metadata: Metadata = {
  title: "Nossas Soluções - Clínica do Empresário",
  description: "Programas de consultoria e desenvolvimento empresarial personalizados para o crescimento do seu negócio.",
}

export default async function CoursesPage() {
  // Fetch commerce products (both media and physical types)
  const [mediaProducts, physicalProducts] = await Promise.all([
    drupal.getResourceCollection<DrupalNode[]>(
      "commerce_product--media",
      {
        params: {
          "filter[status]": 1,
          include: "variations,images,default_variation",
          sort: "-created",
        },
        next: {
          revalidate: 3600,
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
          include: "variations,images,default_variation",
          sort: "-created",
        },
        next: {
          revalidate: 3600,
        },
      }
    ).catch((error) => {
      console.error('Error fetching physical products:', error)
      return []
    })
  ])

  const allProducts = [...(mediaProducts || []), ...(physicalProducts || [])]

  console.log('Fetched products:', allProducts.length)

  return <CoursesClient initialCourses={allProducts} />
}
