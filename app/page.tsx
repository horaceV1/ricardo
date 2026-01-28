import { ArrowRight, Award, Users, Target, TrendingUp, CheckCircle, Star } from "lucide-react"
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

export default async function Home() {
  let featuredCourses: DrupalNode[] = []
  
  try {
    // Fetch the curso-1 media product
    const curso1 = await drupal.getResource<DrupalNode>(
      "commerce_product--media",
      "72d8b57c-9575-4eb5-abbe-8be6f36e2e5f",
      {
        params: {
          "fields[commerce_product--media]": "title,body,path,images,variations",
          include: "images,variations",
        },
        next: {
          revalidate: 3600,
        },
      }
    )
    
    // Fetch additional media products for the featured section
    const products = await drupal.getResourceCollection<DrupalNode[]>(
      "commerce_product--media",
      {
        params: {
          "filter[status]": 1,
          "filter[id][operator]": "NOT IN",
          "filter[id][value]": ["72d8b57c-9575-4eb5-abbe-8be6f36e2e5f"],
          "fields[commerce_product--media]": "title,body,path,images,variations",
          include: "images,variations",
          sort: "-created",
          "page[limit]": 2,
        },
        next: {
          revalidate: 3600,
        },
      }
    )
    
    // Combine: Curso 1 first, then other products
    if (curso1) {
      featuredCourses = [curso1, ...(products || [])]
    } else if (products && products.length > 0) {
      featuredCourses = products
    }
  } catch (error) {
    console.log("Products fetch error:", error)
    featuredCourses = []
  }

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#009999] via-[#007a7a] to-[#005c5c] text-white overflow-hidden">
        {/* Decorative background elements */}
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
                  <span className="text-sm font-semibold">Soluções Premium para Empresários</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                  Transforme Seu<br />
                  <span className="text-[#80d4d4]">Negócio</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-[#b3e6e6] mb-8 leading-relaxed">
                  Consultoria especializada e soluções práticas para empresários que buscam crescimento sustentável e resultados consistentes.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link
                    href="/courses"
                    className="bg-[#ff8c00] text-white px-8 py-4 rounded-lg hover:bg-[#cc7000] transition-all inline-flex items-center justify-center gap-2 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Conheça Nossas Soluções
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/about"
                    className="border-2 border-white/50 text-white px-8 py-4 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all font-bold text-center"
                  >
                    Saiba Mais
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6">
                  <AnimatedSection animation="fadeIn" delay={0.2}>
                    <div className="text-center lg:text-left">
                      <div className="text-4xl font-black mb-1 text-[#80d4d4]">15+</div>
                      <div className="text-[#b3e6e6] text-sm font-semibold">Anos de Experiência</div>
                    </div>
                  </AnimatedSection>
                  <AnimatedSection animation="fadeIn" delay={0.3}>
                    <div className="text-center lg:text-left">
                      <div className="text-4xl font-black mb-1 text-[#80d4d4]">300+</div>
                      <div className="text-[#b3e6e6] text-sm font-semibold">Empresas Atendidas</div>
                    </div>
                  </AnimatedSection>
                  <AnimatedSection animation="fadeIn" delay={0.4}>
                    <div className="text-center lg:text-left">
                      <div className="text-4xl font-black mb-1 text-[#80d4d4]">95%</div>
                      <div className="text-[#b3e6e6] text-sm font-semibold">Taxa de Sucesso</div>
                    </div>
                  </AnimatedSection>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideLeft" delay={0.2} className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#ff8c00] to-[#80d4d4] rounded-3xl blur-2xl opacity-30"></div>
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop"
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
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
                Nossos <span className="text-[#009999]">Diferenciais</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Metodologia comprovada, expertise real e foco total nos resultados do seu negócio
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatedSection animation="slideUp" delay={0.1}>
              <div className="text-center p-6 rounded-xl hover:shadow-xl transition-all group cursor-pointer bg-gradient-to-br from-[#e6f7f7] to-white border-2 border-transparent hover:border-[#009999]">
                <div className="bg-[#009999] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Diagnóstico Preciso</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Análise profunda para identificar oportunidades e desafios
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideUp" delay={0.2}>
              <div className="text-center p-6 rounded-xl hover:shadow-xl transition-all group cursor-pointer bg-gradient-to-br from-[#fff5e6] to-white border-2 border-transparent hover:border-[#ff8c00]">
                <div className="bg-[#ff8c00] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Expertise Comprovada</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Consultores com vivência prática em gestão empresarial
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideUp" delay={0.3}>
              <div className="text-center p-6 rounded-xl hover:shadow-xl transition-all group cursor-pointer bg-gradient-to-br from-[#e6f7f7] to-white border-2 border-transparent hover:border-[#009999]">
                <div className="bg-[#009999] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Atendimento Personalizado</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Soluções customizadas para a realidade do seu negócio
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideUp" delay={0.4}>
              <div className="text-center p-6 rounded-xl hover:shadow-xl transition-all group cursor-pointer bg-gradient-to-br from-[#fff5e6] to-white border-2 border-transparent hover:border-[#ff8c00]">
                <div className="bg-[#ff8c00] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Resultados Mensuráveis</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Acompanhamento contínuo com métricas claras de evolução
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-[#e6f7f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
                Nossas <span className="text-[#009999]">Soluções</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
                Programas de consultoria e desenvolvimento empresarial sob medida
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 text-[#009999] hover:text-[#007a7a] font-bold text-lg transition-colors"
              >
                Ver Todas as Soluções
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
                <p className="text-gray-600 text-lg mb-4">Nossas soluções serão disponibilizadas em breve.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeIn">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
                O Que Dizem Nossos <span className="text-[#009999]">Clientes</span>
              </h2>
              <p className="text-xl text-gray-600">
                Histórias reais de transformação empresarial
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <AnimatedSection key={i} animation="scale" delay={0.1 * i}>
                <div className="bg-gradient-to-br from-white to-[#e6f7f7] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-[#b3e6e6]">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-[#ff8c00]" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed italic">
                    "A consultoria da Clínica do Empresário foi fundamental para reestruturar nosso negócio. Aumentamos o faturamento em 45% em apenas 6 meses!"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#009999] rounded-full"></div>
                    <div>
                      <div className="font-bold text-gray-900">João Silva</div>
                      <div className="text-sm text-gray-600">CEO, Empresa Tech</div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#009999] to-[#005c5c] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#ff8c00] rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="scale">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Agende Sua Consulta Inicial
            </h2>
            <p className="text-xl text-[#b3e6e6] mb-8 max-w-2xl mx-auto">
              Faça uma análise gratuita do seu negócio e descubra como podemos ajudá-lo a alcançar novos patamares
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-[#ff8c00] text-white px-8 py-4 rounded-lg hover:bg-[#cc7000] transition-all inline-flex items-center justify-center gap-2 font-bold shadow-lg hover:shadow-xl"
              >
                Agendar Consulta Gratuita
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/about"
                className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all font-bold"
              >
                Conheça Nossa Metodologia
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
