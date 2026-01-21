import { Building2, TrendingUp, Users, Target, Lightbulb, BarChart3, DollarSign, Megaphone, Code, Briefcase, GraduationCap, Cpu } from "lucide-react"
import { AnimatedSection } from "@/components/animations/AnimatedSection"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sobre Nós - Clínica do Empresário",
  description: "Conheça a Clínica do Empresário e os nossos serviços especializados de consultoria e gestão empresarial.",
}

const services = [
  {
    icon: Target,
    title: "Consultoria Estratégica",
    description: "A nossa consultoria estratégica é mais do que um serviço — é a parceria que a sua empresa precisa para crescer de forma sustentável e estruturada.",
    features: [
      "Definir a Estratégia: Clarificamos a sua visão, identificamos o seu mercado e desenhamos um plano de ação claro",
      "Otimizar a Estrutura: Criamos bases sólidas, desde a estruturação de equipas até ao planeamento económico e financeiro",
      "Impulsionar o Mercado: Implementamos estratégias de marketing para que a sua marca se destaque",
      "Digitalizar a Empresa: Concebemos soluções digitais que simplificam processos e aumentam a eficiência",
      "Capacitar as Pessoas: Investimos no conhecimento da sua equipa através de formação prática"
    ],
    color: "from-[#009999] to-[#007a7a]"
  },
  {
    icon: BarChart3,
    title: "Contabilidade Financeira",
    description: "A nossa contabilidade financeira vai além do registo de números. Oferecemos um serviço completo que garante a saúde financeira e legal do seu negócio.",
    features: [
      "Processamento e Lançamento de Transações: Registamos todas as suas receitas e despesas",
      "Preparação de Demonstrações Financeiras: Criamos relatórios essenciais para uma visão clara da saúde financeira",
      "Gestão de Obrigações Fiscais: Garantimos que todas as declarações são submetidas atempadamente",
      "Análise e Relatórios: Fornecemos análises detalhadas do desempenho financeiro",
      "Consultoria Financeira: Oferecemos apoio contínuo para planeamento e estratégias financeiras"
    ],
    color: "from-[#0099cc] to-[#007a99]"
  },
  {
    icon: TrendingUp,
    title: "Contabilidade de Gestão",
    description: "Transformamos números em conhecimento estratégico. A nossa abordagem fornece-lhe a informação para liderar o seu negócio de forma mais inteligente e rentável.",
    features: [
      "Análise de Custos e Rentabilidade: Identificamos os seus centros de custo e de lucro",
      "Orçamentação e Planeamento: Definimos orçamentos claros e realistas com base em dados históricos",
      "Controlo Orçamental: Monitorizamos o desempenho identificando desvios em tempo real",
      "Análise de Desempenho: Criamos relatórios com KPIs para avaliar a performance do seu negócio",
      "Apoio à Decisão de Investimento: Avaliamos a viabilidade económica de novos projetos"
    ],
    color: "from-[#009999] to-[#007a7a]"
  },
  {
    icon: DollarSign,
    title: "Finanças Empresariais",
    description: "Transformamos as suas finanças de uma preocupação em uma vantagem competitiva. Ajudamos a sua empresa a tomar as melhores decisões para o crescimento.",
    features: [
      "Análise e Planeamento Financeiro: Avaliamos a saúde financeira e criamos projeções realistas",
      "Gestão do Capital Circulante: Otimizamos o ciclo financeiro garantindo liquidez suficiente",
      "Apoio a Decisões de Investimento: Avaliamos a viabilidade e o ROI de novos projetos",
      "Otimização de Estruturas de Financiamento: Aconselhamos sobre as melhores formas de financiar o negócio"
    ],
    color: "from-[#0099cc] to-[#007a99]"
  },
  {
    icon: Megaphone,
    title: "Marketing e Comunicação",
    description: "Desenhamos e implementamos estratégias que geram impacto real e reforçam a sua presença no mercado, online e offline.",
    features: [
      "Marketing Estratégico: Definimos a sua proposta de valor única e encontramos o seu público ideal",
      "Comunicação Integrada: Criamos uma mensagem coesa em todos os canais de comunicação",
      "Marketing Digital: Construímos a sua presença online com estratégias de conteúdo e redes sociais",
      "Comunicação Externa e Relações-Públicas: Criamos uma reputação positiva e imagem de confiança",
      "Apoio a Eventos: Planeamento e execução de eventos para networking e reforço da marca"
    ],
    color: "from-[#009999] to-[#007a7a]"
  },
  {
    icon: Code,
    title: "Desenvolvimento de Software",
    description: "Transformamos os seus desafios de negócio em soluções digitais que geram valor. Não nos limitamos a escrever código, construímos ferramentas para o crescimento.",
    features: [
      "Software Personalizado à Medida: Desenvolvemos aplicações e sistemas únicos adaptados às suas necessidades",
      "Integração e Automação de Processos: Eliminamos tarefas manuais ligando os seus sistemas",
      "Websites e Aplicações Web: Desenvolvemos plataformas otimizadas para a experiência do utilizador",
      "Consultoria Tecnológica: Aconselhamos sobre as ferramentas certas para impulsionar a sua estratégia digital"
    ],
    color: "from-[#0099cc] to-[#007a99]"
  },
  {
    icon: Briefcase,
    title: "Projetos de Investimento",
    description: "Transformamos a sua visão de futuro em projetos de investimento estratégicos e rentáveis. Acompanhamos desde a conceção até à implementação.",
    features: [
      "Estudo de Viabilidade Económica e Financeira: Avaliamos a sustentabilidade e rentabilidade do projeto",
      "Análise de Mercado: Validamos a procura e a competitividade do seu projeto",
      "Apoio na Candidatura a Incentivos: Identificamos as melhores fontes de financiamento e apoios",
      "Acompanhamento e Gestão de Projeto: Garantimos a execução no prazo e dentro do orçamento"
    ],
    color: "from-[#009999] to-[#007a7a]"
  },
  {
    icon: GraduationCap,
    title: "Formação e Capacitação",
    description: "A nossa formação vai além da teoria. Desenhamos programas práticos e personalizados, focados em gerar impacto real no seu negócio.",
    features: [
      "Programas de Formação à Medida: Desenvolvemos formações customizadas adaptadas aos seus objetivos",
      "Workshops e Sessões de Capacitação: Organizamos sessões interativas para aprender novas competências",
      "Mentoria e Coaching: Oferecemos sessões para desenvolver capacidades de liderança e gestão",
      "Desenvolvimento de Competências Digitais: Ajudamos a dominar ferramentas e plataformas digitais essenciais"
    ],
    color: "from-[#0099cc] to-[#007a99]"
  },
  {
    icon: Cpu,
    title: "IoT para Empresas",
    description: "Traduzimos o potencial da IoT em soluções práticas. Implementamos sistemas inteligentes que otimizam a sua operação e impulsionam o crescimento.",
    features: [
      "Consultoria e Estratégia de Implementação: Identificamos as melhores oportunidades para aplicar a IoT",
      "Automação e Otimização de Processos: Automatizamos tarefas repetitivas e otimizamos a produção",
      "Monitorização e Análise de Dados: Implementamos sensores que recolhem dados em tempo real",
      "Criação de Soluções Personalizadas: Desenvolvemos soluções IoT à medida do seu desafio"
    ],
    color: "from-[#009999] to-[#007a7a]"
  }
]

const partnerships = [
  "Seguros",
  "Financiamento",
  "Segurança e Higiene no Trabalho",
  "Engenharia Mecânica",
  "Engenharia Civil",
  "Arquitetura",
  "O seu negócio"
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#009999] via-[#007a7a] to-[#005c5c] text-white py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ff8c00] rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeIn">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-black mb-6">
                Sobre a <span className="text-[#80d4d4]">Clínica do Empresário</span>
              </h1>
              <p className="text-xl md:text-2xl text-[#b3e6e6] max-w-4xl mx-auto leading-relaxed">
                Transformamos a sua visão em realidade, construindo uma empresa sólida, rentável e preparada para o futuro.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeIn">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
                Os Nossos <span className="text-[#009999]">Serviços</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Soluções completas e integradas para todas as áreas do seu negócio
              </p>
            </div>
          </AnimatedSection>

          <div className="space-y-16">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <AnimatedSection key={service.title} animation="slideUp" delay={0.1 * index}>
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                        <p className="text-gray-700 mb-4 leading-relaxed">{service.description}</p>
                        
                        <ul className="space-y-3">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#009999] mt-2"></div>
                              <span className="text-gray-600 leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* Partnerships Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-[#e6f7f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
                Serviços de Apoio <span className="text-[#009999]">(Parcerias)</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Rede de parceiros especializados para apoiar todas as necessidades do seu negócio
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {partnerships.map((partnership, index) => (
              <AnimatedSection key={partnership} animation="scale" delay={0.05 * index}>
                <div className={`
                  p-6 rounded-xl text-center font-semibold text-gray-800 transition-all hover:scale-105 border-2
                  ${partnership === "O seu negócio" 
                    ? "bg-[#80d4d4] border-[#009999] shadow-lg" 
                    : "bg-white border-gray-200 hover:border-[#009999] hover:shadow-md"
                  }
                `}>
                  {partnership}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#009999] to-[#005c5c] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection animation="scale">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Pronto Para Transformar o Seu Negócio?
            </h2>
            <p className="text-xl text-[#b3e6e6] mb-8">
              Entre em contacto connosco e descubra como podemos ajudar a sua empresa a crescer
            </p>
            <a
              href="/contact"
              className="inline-block bg-[#ff8c00] text-white px-10 py-4 rounded-lg hover:bg-[#cc7000] transition-all font-bold shadow-lg hover:shadow-xl text-lg"
            >
              Agendar Consulta Gratuita
            </a>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
