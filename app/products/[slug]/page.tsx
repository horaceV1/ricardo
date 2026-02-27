import { drupal } from "@/lib/drupal"
import { notFound } from "next/navigation"
import { 
  Clock, 
  Award,
  Globe,
  ShoppingCart,
  MapPin
} from "lucide-react"
import { FadeIn } from "@/components/animations/FadeIn"
import { ScaleIn } from "@/components/animations/ScaleIn"
import { ImageWithFallback } from "@/components/ui/ImageWithFallback"
import { absoluteUrl, formatPrice } from "@/lib/utils"
import { AddToCartButton } from "@/components/cart/AddToCartButton"
import type { DrupalNode } from "next-drupal"
import type { Metadata } from "next"

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getProduct(slug: string): Promise<DrupalNode | null> {
  try {
    // Try to fetch by path first
    const product = await drupal.getResourceByPath<DrupalNode>(`/products/${slug}`, {
      params: {
        include: "images,variations,default_variation",
      },
      next: { revalidate: 60 },
    })
    if (product) return product
  } catch (error) {
    console.error('Error fetching product by path:', error)
  }

  // Fallback: try to fetch all products and find by slug
  try {
    const products = await drupal.getResourceCollection<DrupalNode[]>(
      "commerce_product--media",
      {
        params: {
          "filter[status]": 1,
          include: "variations,images,default_variation",
        },
        next: { revalidate: 60 },
      }
    )
    
    return products.find(p => 
      p.path?.alias === `/products/${slug}` ||
      p.path?.alias?.endsWith(`/${slug}`) || 
      p.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === slug
    ) || null
  } catch (fallbackError) {
    console.error('Error fetching products collection:', fallbackError)
    return null
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return {
      title: "Produto não encontrado | Clínica do Empresário",
    }
  }

  return {
    title: `${product.title} - Clínica do Empresário`,
    description: product.body?.summary || product.body?.value?.replace(/<[^>]+>/g, '').substring(0, 160) || "",
    openGraph: {
      title: product.title,
      description: product.body?.summary || "",
      images: product.images?.[0]?.uri?.url ? [absoluteUrl(product.images[0].uri.url)] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const variation = product.default_variation || product.variations?.[0]
  const price = variation?.price?.number || 0
  const currencyCode = variation?.price?.currency_code || 'EUR'
  const variationId = variation?.id

  // Extract rich content from body
  const bodyValue = product.body?.processed || product.body?.value || ""

  // Extract a short intro from the first paragraph of the body
  const introMatch = bodyValue.match(/<p>(.*?)<\/p>/s)
  const introText = introMatch ? introMatch[1].replace(/<[^>]+>/g, '').trim() : ""

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#009999] to-[#007a7a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                  <Award className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Clínica do Empresário</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  {product.title}
                </h1>
                
                {introText && (
                  <p className="text-xl text-white/90 mb-8">
                    {introText}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-6 mb-8">
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    <span>Português</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  {variationId && (
                    <AddToCartButton
                      variationId={variationId}
                      className="bg-white text-[#009999] hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center gap-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Comprar Agora - {formatPrice(price, currencyCode)}
                    </AddToCartButton>
                  )}
                </div>
              </div>

              {/* Right Content - Image */}
              <ScaleIn>
                <div className="relative">
                  {product.images?.[0] && (
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                      <ImageWithFallback
                        src={absoluteUrl(product.images[0].uri.url)}
                        alt={product.images[0].resourceIdObjMeta?.alt || product.title}
                        fill
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  )}
                </div>
              </ScaleIn>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Main Content from CMS */}
          <div className="lg:col-span-2">
            <FadeIn delay={0.1}>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div 
                  className="prose prose-lg max-w-none text-gray-700
                    prose-headings:text-gray-900 prose-headings:font-bold
                    prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200
                    prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-[#009999]
                    prose-p:leading-relaxed prose-p:mb-4
                    prose-ul:my-4 prose-li:my-1
                    prose-strong:text-gray-900"
                  dangerouslySetInnerHTML={{ __html: bodyValue }}
                />
              </div>
            </FadeIn>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <FadeIn delay={0.2}>
              <div className="sticky top-8 space-y-6">
                {/* Price & CTA Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                  {/* Price */}
                  <div className="text-center pb-6 border-b border-gray-200">
                    <div className="text-5xl font-bold text-[#009999] mb-2">
                      {formatPrice(price, currencyCode)}
                    </div>
                  </div>

                  {/* CTA Button */}
                  {variationId && (
                    <AddToCartButton
                      variationId={variationId}
                      className="w-full bg-[#009999] hover:bg-[#007a7a] text-white px-6 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Adicionar ao Carrinho
                    </AddToCartButton>
                  )}

                  {/* Quick Info */}
                  <div className="space-y-4 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Globe className="h-5 w-5" />
                        <span>Idioma</span>
                      </div>
                      <span className="font-semibold text-gray-900">Português</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Award className="h-5 w-5" />
                        <span>Certificado</span>
                      </div>
                      <span className="font-semibold text-gray-900">Sim</span>
                    </div>
                  </div>
                </div>

                {/* Contact Card */}
                <div className="bg-gradient-to-br from-[#009999]/5 to-[#007a7a]/10 rounded-2xl p-6 border border-[#009999]/20">
                  <h3 className="font-bold text-gray-900 mb-3">Tem dúvidas?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Entre em contacto connosco para mais informações ou para solicitar uma proposta personalizada.
                  </p>
                  <a 
                    href="/contact" 
                    className="inline-flex items-center gap-2 text-[#009999] hover:text-[#007a7a] font-semibold text-sm transition-colors"
                  >
                    <MapPin className="h-4 w-4" />
                    Contactar-nos
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  )
}
