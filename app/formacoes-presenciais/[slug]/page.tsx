import { drupal } from "@/lib/drupal"
import { notFound } from "next/navigation"
import type { DrupalNode } from "next-drupal"
import type { Metadata } from "next"
import { TrainingDetail } from "@/components/trainings/TrainingDetail"

interface TrainingPageProps {
  params: { slug: string }
}

export async function generateMetadata({
  params,
}: TrainingPageProps): Promise<Metadata> {
  const training = await fetchTraining(params.slug)
  if (!training) return { title: "Formação Não Encontrada" }

  return {
    title: `${training.title} - Formação Presencial`,
    description:
      training.body?.summary ||
      `Inscreva-se na formação presencial: ${training.title}`,
    openGraph: {
      title: `${training.title} - Formação Presencial`,
      description:
        training.body?.summary || `Formação presencial: ${training.title}`,
      type: "website",
    },
  }
}

async function fetchTraining(slug: string): Promise<DrupalNode | null> {
  const apiParams = {
    include: "variations,images,default_variation",
    "fields[commerce_product--formacao_presencial]":
      "title,path,body,images,variations,default_variation,field_training_date,field_training_end_date,field_location,field_location_address,field_max_participants,field_current_participants,field_instructor,field_included_items,field_price_on_request,status",
  }

  try {
    // Try to fetch by path alias first
    const training = await drupal.getResourceByPath<DrupalNode>(
      `/formacoes-presenciais/${slug}`,
      { params: apiParams }
    )
    return training
  } catch {
    // Fallback: try as UUID
    try {
      const training = await drupal.getResource<DrupalNode>(
        "commerce_product--formacao_presencial",
        slug,
        { params: apiParams }
      )
      return training
    } catch {
      return null
    }
  }
}

export default async function TrainingPage({ params }: TrainingPageProps) {
  const training = await fetchTraining(params.slug)
  if (!training) notFound()

  return <TrainingDetail training={training} />
}
