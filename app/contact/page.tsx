"use client"

import { useState } from "react"
import { AnimatedSection } from "@/components/animations/AnimatedSection"
import { Send, CheckCircle, AlertCircle, MapPin, Phone, Mail, Clock } from "lucide-react"

const subjectOptions = [
  "Consultoria Estratégica",
  "Contabilidade e Finanças",
  "Marketing e Comunicação",
  "Desenvolvimento de Software",
  "Projetos de Investimento",
  "Formação e Capacitação",
  "IoT para Empresas",
  "Incentivos e Apoios",
  "Outro",
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    subscribeNewsletter: true,
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erro ao enviar mensagem.")
      }

      setSuccess(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        subscribeNewsletter: true,
      })

      setTimeout(() => setSuccess(false), 8000)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao enviar mensagem. Por favor, tente novamente."
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#009999] via-[#007a7a] to-[#005c5c] text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection animation="slideUp">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
                Entre em Contato
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Estamos aqui para ajudar o seu negócio a crescer. Fale connosco e
                descubra como podemos transformar os seus desafios em oportunidades.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            {
              icon: MapPin,
              title: "Morada",
              text: "Avenida 25 de Abril, nº 47, escritório 4.1, 2620-185 Odivelas",
              delay: 0,
            },
            {
              icon: Phone,
              title: "Telefone",
              text: "+351 211 164 404",
              href: "tel:+351211164404",
              delay: 0.1,
            },
            {
              icon: Mail,
              title: "Email",
              text: "geral@clinicadoempresario.com",
              href: "mailto:geral@clinicadoempresario.com",
              delay: 0.2,
            },
            {
              icon: Clock,
              title: "Horário",
              text: "Seg - Sex: 9:00 - 18:00",
              delay: 0.3,
            },
          ].map((item) => (
            <AnimatedSection key={item.title} animation="slideUp" delay={item.delay}>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow border border-gray-100">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#009999] to-[#007a7a] rounded-lg mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-sm text-[#009999] hover:text-[#007a7a] transition-colors font-medium"
                  >
                    {item.text}
                  </a>
                ) : (
                  <p className="text-sm text-gray-600">{item.text}</p>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Main Content: Form + Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            <AnimatedSection animation="slideLeft">
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
                  Envie-nos uma Mensagem
                </h2>
                <p className="text-gray-500 mb-8">
                  Preencha o formulário e entraremos em contato o mais rápido possível.
                </p>

                {success && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">
                        Mensagem enviada com sucesso!
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        Recebemos a sua mensagem e responderemos em breve. Obrigado pelo
                        seu contacto!
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-900">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Nome Completo
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="O seu nome"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Email
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone & Subject Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+351 912 345 678"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Assunto
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <select
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent focus:bg-white transition-all appearance-none"
                      >
                        <option value="" disabled>
                          Selecione um assunto
                        </option>
                        {subjectOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Mensagem
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Descreva como podemos ajudar..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009999] focus:border-transparent focus:bg-white transition-all resize-none"
                    />
                  </div>

                  {/* Newsletter checkbox */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="subscribeNewsletter"
                      name="subscribeNewsletter"
                      checked={formData.subscribeNewsletter}
                      onChange={handleCheckboxChange}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-[#009999] focus:ring-[#009999] accent-[#009999]"
                    />
                    <label
                      htmlFor="subscribeNewsletter"
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      Gostaria de receber a nossa newsletter com novidades, dicas e
                      oportunidades de negócio.
                    </label>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#009999] to-[#007a7a] text-white font-bold rounded-lg hover:from-[#008888] hover:to-[#006a6a] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#009999]/25 hover:shadow-xl hover:shadow-[#009999]/30"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        A enviar...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Enviar Mensagem
                      </>
                    )}
                  </button>
                </form>
              </div>
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatedSection animation="slideRight">
              {/* Map */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3109.876!2d-9.186!3d38.793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDQ3JzM0LjgiTiA5wrAxMScwOS42Ilc!5e0!3m2!1spt-PT!2spt!4v1!5m2!1spt-PT!2spt"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                  title="Localização Clínica do Empresário"
                />
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-1">A Nossa Localização</h3>
                  <p className="text-sm text-gray-600">
                    Avenida 25 de Abril, nº 47, escritório 4.1
                    <br />
                    2620-185 Odivelas, Portugal
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideRight" delay={0.1}>
              {/* FAQ / Quick Info */}
              <div className="bg-gradient-to-br from-[#009999]/5 to-[#005c5c]/5 rounded-2xl p-6 md:p-8 border border-[#009999]/10">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Perguntas Frequentes
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      q: "Quanto tempo demora a resposta?",
                      a: "Respondemos a todas as mensagens num prazo máximo de 24 horas úteis.",
                    },
                    {
                      q: "Posso agendar uma reunião?",
                      a: "Sim! Indique a sua preferência de data e horário na mensagem.",
                    },
                    {
                      q: "Oferecem consulta inicial gratuita?",
                      a: "Sim, a primeira consulta de diagnóstico é gratuita e sem compromisso.",
                    },
                  ].map((item) => (
                    <div key={item.q}>
                      <p className="text-sm font-semibold text-gray-900">{item.q}</p>
                      <p className="text-sm text-gray-600 mt-1">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideRight" delay={0.2}>
              {/* CTA Card */}
              <div className="bg-gradient-to-br from-[#009999] to-[#005c5c] rounded-2xl p-6 md:p-8 text-white">
                <h3 className="text-lg font-bold mb-2">Prefere ligar?</h3>
                <p className="text-white/80 text-sm mb-4">
                  A nossa equipa está disponível por telefone durante o horário de
                  funcionamento.
                </p>
                <a
                  href="tel:+351211164404"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#009999] font-bold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +351 211 164 404
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}
