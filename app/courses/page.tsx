import { drupal } from "@/lib/drupal"
import { CoursesClient } from "@/components/courses/CoursesClient"
import type { Metadata } from "next"
import type { DrupalNode } from "next-drupal"

export const metadata: Metadata = {
  title: "Nossas Soluções - Clínica do Empresário",
  description: "Programas de consultoria e desenvolvimento empresarial personalizados para o crescimento do seu negócio.",
}

export default async function CoursesPage() {
  const courses = await drupal.getResourceCollection<DrupalNode[]>(
    "node--course",
    {
      params: {
        "filter[status]": 1,
        "fields[node--course]": "title,path,field_image,field_price,field_rating,field_students,field_duration,field_lessons,field_level,field_category,body,created",
        include: "field_image,field_category",
        sort: "-created",
      },
      next: {
        revalidate: 3600,
      },
    }
  ).catch(() => [])

  return <CoursesClient initialCourses={courses || []} />
}
