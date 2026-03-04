import { ArrowRight, Award, Users, Target, TrendingUp, Star } from "lucide-react"
import Link from "next/link"
import { drupal } from "@/lib/drupal"
import { CourseCard } from "@/components/courses/CourseCard"
import type { Metadata } from "next"
import type { DrupalNode } from "next-drupal"
import { AnimatedSection } from "@/components/animations/AnimatedSection"

export const metadata: Metadata = {
  title: "Clínica do Empresário - Consultoria e Gestão Empresarial",
  description: "Consultoria especializada e soluções práticas para empresários que buscam crescimento sustentável e resultados consistentes.",
}

// Feature icons mapped by index
const featureIcons = [Target, Award, Users, TrendingUp]
const featureColors = [
  { bg: 'bg-[#009999]', card: 'from-[#e6f7f7] to-white', border: 'hover:border-[#009999]' },
  { bg: 'bg-[#ff8c00]', card: 'from-[#fff5e6] to-white', border: 'hover:border-[#ff8c00]' },
  { bg: 'bg-[#009999]', card: 'from-[#e6f7f7] to-white', border: 'hover:border-[#009999]' },
  { bg: 'bg-[#ff8c00]', card: 'from-[#fff5e6] to-white', border: 'hover:border-[#ff8c00]' },
]

/**
 * Renders CKEditor5 rich text HTML preserving fonts, colors, sizes.
 * Strips wrapping <p> tags when used inline (e.g. inside headings).
 */
function RichText({ html, className, as: Tag = 'div', inline = false }: {
  html: string
  className?: string
  as?: keyof JSX.IntrinsicElements
  inline?: boolean
}) {
  if (!html) return null
  let processed = html.trim()
  if (inline) {
    // Strip all <p> and </p> tags to avoid nesting block elements inside
    // inline/heading contexts (h1, h2, h3, span, etc.)
    processed = processed.replace(/<\/?p>/g, '')
  }
  return <Tag className={`drupal-content ${className || ''}`} dangerouslySetInnerHTML={{ __html: processed }} />
}

/**
 * Strips all HTML tags from a string for use in plain text contexts.
 */
function stripHtml(html: string): string {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').trim()
}

interface HomepageData {
  hero: {
    badge: string
    title: string
    highlight: string
    subtitle: string
    image: string
    cta: { text: string; link: string }
    cta2: { text: string; link: string }
  }
  stats: { value: string; label: string }[]
  features: {
    title: string
    subtitle: string
    items: { title: string; description: string }[]
  }
  formations: {
    title: string
    subtitle: string
  }
  testimonials: {
    title: string
    subtitle: string
    items: { text: string; name: string; role: string }[]
  }
  cta: {
    title: string
    subtitle: string
    button: { text: string; link: string }
    button2: { text: string; link: string }
  }
}

const defaults: HomepageData = {
  hero: {
    badge: 'Formações Premium para Empresários',
    title: 'Transforme Seu Negócio',
    highlight: 'Negócio',
    subtitle: 'Consultoria especializada e soluções práticas para empresários que buscam crescimento sustentável e resultados consistentes.',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop',
    cta: { text: 'Conheça Nossas Formações', link: '/courses' },
    cta2: { text: 'Saiba Mais', link: '/about' },
  },
  stats: [
    { value: '15+', label: 'Anos de Experiência' },
    { value: '300+', label: 'Empresas Atendidas' },
    { value: '95%', label: 'Taxa de Sucesso' },
  ],
  features: {
    title: 'Nossos Diferenciais',
    subtitle: 'Metodologia comprovada, expertise real e foco total nos resultados do seu negócio',
    items: [
      { title: 'Diagnóstico Preciso', description: 'Análise profunda para identificar oportunidades e desafios' },
      { title: 'Expertise Comprovada', description: 'Consultores com vivência prática em gestão empresarial' },
      { title: 'Atendimento Personalizado', description: 'Soluções customizadas para a realidade do seu negócio' },
      { title: 'Resultados Mensuráveis', description: 'Acompanhamento contínuo com métricas claras de evolução' },
    ],
  },
  formations: {
    title: 'Nossas Formações',
    subtitle: 'Programas de consultoria e desenvolvimento empresarial sob medida',
  },
  testimonials: {
    title: 'O Que Dizem Nossos Clientes',
    subtitle: 'Histórias reais de transformação empresarial',
    items: [
      { text: 'A consultoria da Clínica do Empresário foi fundamental para reestruturar nosso negócio. Aumentamos o faturamento em 45% em apenas 6 meses!', name: 'João Silva', role: 'CEO, Empresa Tech' },
      { text: 'A consultoria da Clínica do Empresário foi fundamental para reestruturar nosso negócio. Aumentamos o faturamento em 45% em apenas 6 meses!', name: 'João Silva', role: 'CEO, Empresa Tech' },
      { text: 'A consultoria da Clínica do Empresário foi fundamental para reestruturar nosso negócio. Aumentamos o faturamento em 45% em apenas 6 meses!', name: 'João Silva', role: 'CEO, Empresa Tech' },
    ],
  },
  cta: {
    title: 'Agende Sua Consulta Inicial',
    subtitle: 'Faça uma análise gratuita do seu negócio e descubra como podemos ajudá-lo a alcançar novos patamares',
    button: { text: 'Agendar Consulta Gratuita', link: '/contact' },
    button2: { text: 'Conheça Nossa Metodologia', link: '/about' },
  },
}

async function getHomepageData(): Promise<HomepageData> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'https://darkcyan-stork-408379.hostingersite.com'
    const res = await fetch(`${baseUrl}/api/homepage`, {
      next: { revalidate: 300 },
    })

    if (!res.ok) return defaults

    const json = await res.json()
    const d = json.data

    if (!d) return defaults

    // Merge with defaults — use API data if present, otherwise defaults
    return {
      hero: {
        badge: d.hero?.badge || defaults.hero.badge,
        title: d.hero?.title || defaults.hero.title,
        highlight: d.hero?.highlight || defaults.hero.highlight,
        subtitle: d.hero?.subtitle || defaults.hero.subtitle,
        image: d.hero?.image || defaults.hero.image,
        cta: {
          text: d.hero?.cta?.text || defaults.hero.cta.text,
          link: d.hero?.cta?.link || defaults.hero.cta.link,
        },
        cta2: {
          text: d.hero?.cta2?.text || defaults.hero.cta2.text,
          link: d.hero?.cta2?.link || defaults.hero.cta2.link,
        },
      },
      stats: (d.stats || defaults.stats).map((s: { value: string; label: string }, i: number) => ({
        value: s.value || defaults.stats[i]?.value || '',
        label: s.label || defaults.stats[i]?.label || '',
      })),
      features: {
        title: d.features?.title || defaults.features.title,
        subtitle: d.features?.subtitle || defaults.features.subtitle,
        items: (d.features?.items || defaults.features.items).map((f: { title: string; description: string }, i: number) => ({
          title: f.title || defaults.features.items[i]?.title || '',
          description: f.description || defaults.features.items[i]?.description || '',
        })),
      },
      formations: {
        title: d.formations?.title || defaults.formations.title,
        subtitle: d.formations?.subtitle || defaults.formations.subtitle,
      },
      testimonials: {
        title: d.testimonials?.title || defaults.testimonials.title,
        subtitle: d.testimonials?.subtitle || defaults.testimonials.subtitle,
        items: (d.testimonials?.items || defaults.testimonials.items).map((t: { text: string; name: string; role: string }, i: number) => ({
          text: t.text || defaults.testimonials.items[i]?.text || '',
          name: t.name || defaults.testimonials.items[i]?.name || '',
          role: t.role || defaults.testimonials.items[i]?.role || '',
        })),
      },
      cta: {
        title: d.cta?.title || defaults.cta.title,
        subtitle: d.cta?.subtitle || defaults.cta.subtitle,
        button: {
          text: d.cta?.button?.text || defaults.cta.button.text,
          link: d.cta?.button?.link || defaults.cta.button.link,
        },
        button2: {
          text: d.cta?.button2?.text || defaults.cta.button2.text,
          link: d.cta?.button2?.link || defaults.cta.button2.link,
        },
      },
    }
  } catch (err) {
    console.error('Failed to fetch homepage data:', err)
    return defaults
  }
}

/**
 * Renders the hero title, replacing the highlight word with a styled span.
 */
function renderHeroTitle(title: string, highlight: string) {
  if (!highlight || !title.includes(highlight)) {
    return <>{title}</>
  }
  const parts = title.split(highlight)
  return (
    <>
      {parts[0]}<br />
      <span className="text-[#80d4d4]">{highlight}</span>
      {parts.slice(1).join(highlight)}
    </>
  )
}

export default async function Home() {
  // Fetch homepage data and featured courses in parallel
  const [hp, featuredCourses] = await Promise.all([
    getHomepageData(),
    (async () => {
      try {
        const products = await drupal.getResourceCollection<DrupalNode[]>(
          "commerce_product--media",
          {
            params: {
              "filter[status]": 1,
              include: "images,variations,default_variation,field_categoria,field_nivel",
              sort: "-created",
              "page[limit]": 3,
            },
            next: { revalidate: 60 },
          }
        )
        return products || []
      } catch {
        return []
      }
    })(),
  ])

  // Filter out empty testimonials (text is now HTML, strip tags to check)
  const validTestimonials = hp.testimonials.items.filter(t => stripHtml(t.text) && t.name)

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#009999] via-[#007a7a] to-[#005c5c] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ff8c00] rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="slideRight">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                  <Star className="w-4 h-4 text-[#ff8c00]" fill="currentColor" />
                  <RichText html={hp.hero.badge} as="span" inline className="text-sm font-semibold" />
                </div>

                {hp.hero.title ? (
                  <RichText html={hp.hero.title} as="h1" inline className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight" />
                ) : (
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                    {renderHeroTitle(defaults.hero.title, defaults.hero.highlight)}
                  </h1>
                )}

                <RichText html={hp.hero.subtitle} as="div" className="text-xl md:text-2xl text-[#b3e6e6] mb-8 leading-relaxed" />

                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link
                    href={hp.hero.cta.link}
                    className="bg-[#ff8c00] text-white px-8 py-4 rounded-lg hover:bg-[#cc7000] transition-all inline-flex items-center justify-center gap-2 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {hp.hero.cta.text}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href={hp.hero.cta2.link}
                    className="border-2 border-white/50 text-white px-8 py-4 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all font-bold text-center"
                  >
                    {hp.hero.cta2.text}
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6">
                  {hp.stats.map((stat, i) => (
                    <AnimatedSection key={i} animation="fadeIn" delay={0.2 + i * 0.1}>
                      <div className="text-center lg:text-left">
                        <div className="text-4xl font-black mb-1 text-[#80d4d4]">{stat.value}</div>
                        <div className="text-[#b3e6e6] text-sm font-semibold">{stat.label}</div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideLeft" delay={0.2} className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#ff8c00] to-[#80d4d4] rounded-3xl blur-2xl opacity-30"></div>
                <img
                  src={hp.hero.image}
                  alt="Empresários em reunião estratégica"
                  className="relative rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeIn">
            <div className="text-center mb-16">
              <RichText html={hp.features.title} as="h2" inline className="text-4xl md:text-5xl font-black mb-4 text-gray-900" />
              <RichText html={hp.features.subtitle} as="div" className="text-xl text-gray-600 max-w-3xl mx-auto" />
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {hp.features.items.map((feature, i) => {
              const Icon = featureIcons[i % featureIcons.length]
              const color = featureColors[i % featureColors.length]
              return (
                <AnimatedSection key={i} animation="slideUp" delay={0.1 * (i + 1)}>
                  <div className={`text-center p-6 rounded-xl hover:shadow-xl transition-all group cursor-pointer bg-gradient-to-br ${color.card} border-2 border-transparent ${color.border}`}>
                    <div className={`${color.bg} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <RichText html={feature.title} as="h3" inline className="text-xl font-bold mb-2 text-gray-900" />
                    <RichText html={feature.description} as="div" className="text-gray-600 text-sm leading-relaxed" />
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-[#e6f7f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeIn">
            <div className="text-center mb-12">
              <RichText html={hp.formations.title} as="h2" inline className="text-4xl md:text-5xl font-black mb-4 text-gray-900" />
              <RichText html={hp.formations.subtitle} as="div" className="text-xl text-gray-600 max-w-3xl mx-auto mb-6" />
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 text-[#009999] hover:text-[#007a7a] font-bold text-lg transition-colors"
              >
                Ver Todas as Formações
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.length > 0 ? (
              featuredCourses.map((course, index) => (
                <AnimatedSection key={course.id} animation="slideUp" delay={0.1 * (index + 1)}>
                  <CourseCard course={course} />
                </AnimatedSection>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg mb-4">Nossas formações serão disponibilizadas em breve.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      {validTestimonials.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="fadeIn">
              <div className="text-center mb-16">
                <RichText html={hp.testimonials.title} as="h2" inline className="text-4xl md:text-5xl font-black mb-4 text-gray-900" />
                <RichText html={hp.testimonials.subtitle} as="div" className="text-xl text-gray-600" />
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {validTestimonials.map((testimonial, i) => (
                <AnimatedSection key={i} animation="scale" delay={0.1 * (i + 1)}>
                  <div className="bg-gradient-to-br from-white to-[#e6f7f7] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-[#b3e6e6]">
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 text-[#ff8c00]" fill="currentColor" />
                      ))}
                    </div>
                    <div className="text-gray-700 mb-6 leading-relaxed italic">
                      &ldquo;<RichText html={testimonial.text} as="span" inline />&rdquo;
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#009999] rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#009999] to-[#005c5c] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#ff8c00] rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="scale">
            <RichText html={hp.cta.title} as="h2" inline className="text-4xl md:text-5xl font-black mb-6" />
            <RichText html={hp.cta.subtitle} as="div" className="text-xl text-[#b3e6e6] mb-8 max-w-2xl mx-auto" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={hp.cta.button.link}
                className="bg-[#ff8c00] text-white px-8 py-4 rounded-lg hover:bg-[#cc7000] transition-all inline-flex items-center justify-center gap-2 font-bold shadow-lg hover:shadow-xl"
              >
                {hp.cta.button.text}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href={hp.cta.button2.link}
                className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all font-bold"
              >
                {hp.cta.button2.text}
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
