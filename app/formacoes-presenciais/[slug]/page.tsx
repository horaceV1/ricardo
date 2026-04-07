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
  try {
    // Try to fetch by path alias first
    const training = await drupal.getResourceByPath<DrupalNode>(
      `/formacoes-presenciais/${slug}`,
      {
        params: {
          include: "variations,images,default_variation",
        },
      }
    )
    return training
  } catch {
    // Fallback: try as UUID
    try {
      const training = await drupal.getResource<DrupalNode>(
        "commerce_product--formacao_presencial",
        slug,
        {
          params: {
            include: "variations,images,default_variation",
          },
        }
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
