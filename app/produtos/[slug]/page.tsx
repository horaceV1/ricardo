import { drupal } from "@/lib/drupal"
import { notFound } from "next/navigation"
import { 
  Star, 
  Clock, 
  Users, 
  BookOpen, 
  PlayCircle, 
  CheckCircle, 
  Award,
  Download,
  Globe,
  Smartphone,
  ShoppingCart
} from "lucide-react"
import { FadeIn } from "@/components/animations/FadeIn"
import { ScaleIn } from "@/components/animations/ScaleIn"
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren"
import { ImageWithFallback } from "@/components/ui/ImageWithFallback"
import { absoluteUrl, formatPrice } from "@/lib/utils"
import { AddToCartButton } from "@/components/cart/AddToCartButton"
import type { DrupalNode } from "next-drupal"
import type { Metadata } from "next"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const product = await drupal.getResourceByPath<DrupalNode>(`/product/${params.slug}`, {
      params: {
        include: "images,variations,default_variation",
      },
    })

    if (!product) {
      return {
        title: "Produto não encontrado",
      }
    }

    const variation = product.default_variation || product.variations?.[0]
    const price = variation?.price?.number || 0

    return {
      title: `${product.title} - Clínica do Empresário`,
      description: product.body?.summary || product.body?.value?.substring(0, 160) || "",
      openGraph: {
        title: product.title,
        description: product.body?.summary || "",
        images: product.images?.[0]?.uri?.url ? [absoluteUrl(product.images[0].uri.url)] : [],
      },
    }
  } catch {
    return {
      title: "Produto não encontrado",
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await drupal
    .getResourceByPath<DrupalNode>(`/product/${params.slug}`, {
      params: {
        include: "images,variations,default_variation",
      },
    })
    .catch(() => null)

  if (!product) {
    notFound()
  }

  const variation = product.default_variation || product.variations?.[0]
  const price = variation?.price?.number || 0
  const currencyCode = variation?.price?.currency_code || 'EUR'
  const variationId = variation?.id

  // Extract rich content from body
  const bodyValue = product.body?.processed || product.body?.value || ""
  const summary = product.body?.summary || ""

  // Course features (can be customized based on product fields)
  const features = [
    "Acesso vitalício ao conteúdo",
    "Certificado de conclusão",
    "Suporte direto com especialistas",
    "Material complementar incluído",
    "Atualizações gratuitas",
    "Acesso em qualquer dispositivo",
  ]

  // What you'll learn (can be extracted from body or custom field)
  const learningPoints = [
    "Estratégias avançadas de gestão empresarial",
    "Ferramentas práticas para crescimento",
    "Técnicas de otimização de processos",
    "Desenvolvimento de liderança",
    "Análise financeira e planejamento",
    "Marketing e vendas estratégicas",
  ]

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
                  <span className="text-sm font-medium">Programa Premium</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  {product.title}
                </h1>
                
                {summary && (
                  <p className="text-xl text-white/90 mb-8">
                    {summary}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-6 mb-8">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-medium">5.0</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    <span>1.200+ Empresários</span>
                  </div>
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
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* What You'll Learn */}
            <FadeIn delay={0.1}>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  O Que Você Vai Aprender
                </h2>
                <StaggerChildren>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {learningPoints.map((point, index) => (
                      <StaggerItem key={index}>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-6 w-6 text-[#009999] flex-shrink-0 mt-1" />
                          <span className="text-gray-700">{point}</span>
                        </div>
                      </StaggerItem>
                    ))}
                  </div>
                </StaggerChildren>
              </div>
            </FadeIn>

            {/* Course Description */}
            <FadeIn delay={0.2}>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Sobre Este Programa
                </h2>
                <div 
                  className="prose prose-lg max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: bodyValue }}
                />
              </div>
            </FadeIn>

            {/* Features */}
            <FadeIn delay={0.3}>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  O Que Está Incluído
                </h2>
                <StaggerChildren>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <StaggerItem key={index}>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                          <div className="h-10 w-10 bg-[#009999]/10 rounded-lg flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-[#009999]" />
                          </div>
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </div>
                      </StaggerItem>
                    ))}
                  </div>
                </StaggerChildren>
              </div>
            </FadeIn>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <FadeIn delay={0.4}>
              <div className="sticky top-8">
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                  {/* Price */}
                  <div className="text-center pb-6 border-b border-gray-200">
                    <div className="text-5xl font-bold text-[#009999] mb-2">
                      {formatPrice(price, currencyCode)}
                    </div>
                    <p className="text-gray-600">Pagamento único</p>
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
                        <Clock className="h-5 w-5" />
                        <span>Duração</span>
                      </div>
                      <span className="font-semibold text-gray-900">Auto-ritmo</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <BookOpen className="h-5 w-5" />
                        <span>Módulos</span>
                      </div>
                      <span className="font-semibold text-gray-900">12 Módulos</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <PlayCircle className="h-5 w-5" />
                        <span>Vídeos</span>
                      </div>
                      <span className="font-semibold text-gray-900">48 Aulas</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Download className="h-5 w-5" />
                        <span>Recursos</span>
                      </div>
                      <span className="font-semibold text-gray-900">24 Downloads</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Smartphone className="h-5 w-5" />
                        <span>Acesso</span>
                      </div>
                      <span className="font-semibold text-gray-900">Mobile & Desktop</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Award className="h-5 w-5" />
                        <span>Certificado</span>
                      </div>
                      <span className="font-semibold text-gray-900">Sim</span>
                    </div>
                  </div>

                  {/* Guarantee Badge */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="bg-gradient-to-r from-[#009999]/10 to-[#007a7a]/10 rounded-lg p-4 text-center">
                      <Award className="h-8 w-8 text-[#009999] mx-auto mb-2" />
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        Garantia de 30 Dias
                      </p>
                      <p className="text-xs text-gray-600">
                        100% de satisfação ou seu dinheiro de volta
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  )
}
