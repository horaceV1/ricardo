'use client'

import { useEffect, useState } from 'react'

interface LegalPageProps {
  slug: string
  title: string
  fallbackContent: React.ReactNode
}

export function LegalPage({ slug, title, fallbackContent }: LegalPageProps) {
  const [drupalBody, setDrupalBody] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'

    fetch(`${baseUrl}/api/legal-page/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data?.body && data.body.length > 100) {
          setDrupalBody(data.body)
        }
      })
      .catch(() => {
        // Fallback to static content
      })
      .finally(() => setLoading(false))
  }, [slug])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>

        {drupalBody ? (
          <div
            className="prose prose-lg max-w-none text-gray-700 legal-page-content"
            dangerouslySetInnerHTML={{ __html: drupalBody }}
          />
        ) : (
          <div className="prose prose-lg max-w-none text-gray-700">
            {fallbackContent}
          </div>
        )}
      </div>
    </div>
  )
}
