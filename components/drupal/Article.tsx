import Image from "next/image"
import { absoluteUrl, formatDate } from "@/lib/utils"
import type { DrupalNode } from "next-drupal"
import { DynamicForm } from "@/components/forms/DynamicForm"

interface ArticleProps {
  node: DrupalNode & {
    dynamic_forms?: Array<{
      id: string
      label: string
      fields: Array<{
        label: string
        type: "texto" | "documento" | "imagem"
        required: boolean
        link?: string
      }>
    }>
  }
}

async function getArticleForms(nid: number) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
    const response = await fetch(`${baseUrl}/api/article-layout/${nid}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.forms || []
    }
  } catch (error) {
    console.error('Error fetching article forms:', error)
  }
  return []
}

export async function Article({ node, ...props }: ArticleProps) {
  // Fetch dynamic forms from Layout Builder
  const forms = await getArticleForms(node.drupal_internal__nid)
  return (
    <article {...props}>
      <h1 className="mb-4 text-6xl font-black leading-tight">{node.title}</h1>
      <div className="mb-4 text-gray-600">
        {node.uid?.display_name ? (
          <span>
            Posted by{" "}
            <span className="font-semibold">{node.uid?.display_name}</span>
          </span>
        ) : null}
        <span> - {formatDate(node.created)}</span>
      </div>
      {node.field_image && (
        <figure>
          <Image
            src={absoluteUrl(node.field_image.uri.url)}
            width={768}
            height={400}
            alt={node.field_image.resourceIdObjMeta.alt || ""}
            priority
          />
          {node.field_image.resourceIdObjMeta.title && (
            <figcaption className="py-2 text-sm text-center text-gray-600">
              {node.field_image.resourceIdObjMeta.title}
            </figcaption>
          )}
        </figure>
      )}
      {node.body?.processed && (
        <div
          dangerouslySetInnerHTML={{ __html: node.body?.processed }}
          className="mt-6 font-serif text-xl leading-loose prose"
        />
      )}

      {/* Dynamic Forms from Layout Builder */}
      {forms && forms.length > 0 && (
        <div className="mt-12 space-y-8">
          {forms.map((form: any, index: number) => (
            <DynamicForm 
              key={index}
              formId={form.id}
              formTitle={form.label}
              fields={form.fields}
            />
          ))}
        </div>
      )}
    </article>
  )
}
