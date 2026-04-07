import { drupal } from "@/lib/drupal"
import { TrainingsClient } from "@/components/trainings/TrainingsClient"
import type { Metadata } from "next"
import type { DrupalNode } from "next-drupal"

export const metadata: Metadata = {
  title: "Formações Presenciais - Clínica do Empresário",
  description:
    "Inscreva-se nas nossas formações presenciais. Eventos com data, local e número limitado de vagas. Garanta o seu bilhete!",
}

export default async function FormacoePresenciaisPage() {
  const trainings = await drupal
    .getResourceCollection<DrupalNode[]>("commerce_product--formacao_presencial", {
      params: {
        "filter[status]": 1,
        include:
          "variations,images,default_variation",
        sort: "field_training_date",
      },
      next: {
        revalidate: 60,
      },
    })
    .catch((error) => {
      console.error("Error fetching in-person trainings:", error)
      return []
    })

  console.log("Fetched in-person trainings:", trainings.length)

  return <TrainingsClient initialTrainings={trainings} />
}
