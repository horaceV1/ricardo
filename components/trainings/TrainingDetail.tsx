"use client"

import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  ShoppingCart,
  Share2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Mail,
  Phone,
  Ticket,
} from "lucide-react"
import { DrupalNode } from "next-drupal"
import Link from "next/link"
import { useState } from "react"
import { FadeIn } from "@/components/animations/FadeIn"
import { ScaleIn } from "@/components/animations/ScaleIn"
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren"
import { ImageWithFallback } from "@/components/ui/ImageWithFallback"
import { absoluteUrl, formatPrice } from "@/lib/utils"
import { useCart } from "@/contexts/CartContext"

interface TrainingDetailProps {
  training: DrupalNode
}

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("pt-PT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function TrainingDetail({ training }: TrainingDetailProps) {
  const { addToCart, loading } = useCart()
  const [adding, setAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const variation = training.default_variation || training.variations?.[0]
  const price = variation?.price?.number || 0
  const variationId = variation?.id

  const trainingDate = training.field_training_date
  const endDate = training.field_training_end_date
  const location = training.field_location || ""
  const locationAddress = training.field_location_address || ""
  const maxParticipants = training.field_max_participants || 0
  const currentParticipants = training.field_current_participants || 0
  const instructor = training.field_instructor || ""
  const image = training.images?.[0]

  const availableSlots = maxParticipants - currentParticipants
  const isSoldOut = maxParticipants > 0 && availableSlots <= 0
  const isAlmostFull =
    !isSoldOut && maxParticipants > 0 && availableSlots <= Math.ceil(maxParticipants * 0.2)
  const isPast = trainingDate ? new Date(trainingDate) < new Date() : false

  const occupancyPercentage =
    maxParticipants > 0
      ? Math.min(100, Math.round((currentParticipants / maxParticipants) * 100))
      : 0

  const handleAddToCart = async () => {
    if (!variationId || isSoldOut || isPast) return

    setAdding(true)
    try {
      // Add tickets one by one (quantity handling)
      let allSuccess = true
      for (let i = 0; i < quantity; i++) {
        const success = await addToCart(variationId)
        if (!success) {
          allSuccess = false
          break
        }
      }
      if (allSuccess) {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
    } finally {
      setAdding(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: training.title,
          text: `Formação presencial: ${training.title}`,
          url: window.location.href,
        })
      } catch {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert("Link copiado para a área de transferência!")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#009999] to-[#005c5c] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-80 h-80 border-4 border-white rounded-full" />
          <div className="absolute bottom-0 left-10 w-40 h-40 border-4 border-white rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          {/* Breadcrumb */}
          <FadeIn direction="down">
            <Link
              href="/formacoes-presenciais"
              className="inline-flex items-center gap-2 text-[#b3e6e6] hover:text-white transition-colors mb-6 no-underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-semibold">Voltar às Formações Presenciais</span>
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Info */}
            <div className="lg:col-span-2">
              <FadeIn direction="up">
                {/* Status */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {isPast ? (
                    <span className="bg-gray-500/30 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Encerrada
                    </span>
                  ) : isSoldOut ? (
                    <span className="bg-red-500/30 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Esgotado
                    </span>
                  ) : isAlmostFull ? (
                    <span className="bg-[#ff8c00]/30 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                      Últimas Vagas!
                    </span>
                  ) : (
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Inscrições Abertas
                    </span>
                  )}
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Presencial
                  </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
                  {training.title}
                </h1>

                {training.body?.summary && (
                  <p className="text-xl text-[#b3e6e6] mb-6">{training.body.summary}</p>
                )}

                {/* Key Details */}
                <div className="flex flex-wrap items-center gap-6 text-[#b3e6e6]">
                  {trainingDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span className="font-semibold capitalize">
                        {formatFullDate(trainingDate)}
                      </span>
                    </div>
                  )}
                  {trainingDate && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <span className="font-semibold">
                        {formatTime(trainingDate)}
                        {endDate && ` - ${formatTime(endDate)}`}
                      </span>
                    </div>
                  )}
                  {location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span className="font-semibold">{location}</span>
                    </div>
                  )}
                </div>
              </FadeIn>
            </div>

            {/* Ticket Card */}
            <div className="lg:col-span-1">
              <ScaleIn delay={0.2}>
                <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-900 sticky top-24">
                  {/* Image */}
                  {image && (
                    <div className="relative h-44 rounded-xl overflow-hidden mb-5">
                      <ImageWithFallback
                        src={absoluteUrl(
                          image.uri?.url || image.url || image.attributes?.uri?.url
                        )}
                        alt={
                          image.resourceIdObjMeta?.alt ||
                          image.meta?.alt ||
                          training.title
                        }
                        width={400}
                        height={176}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-black text-[#009999]">
                      {price > 0 ? formatPrice(price) : "Gratuito"}
                    </span>
                    {price > 0 && (
                      <span className="text-sm text-gray-500">/ bilhete</span>
                    )}
                  </div>

                  {/* Availability Bar */}
                  {maxParticipants > 0 && !isPast && (
                    <div className="mb-5">
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-gray-600 font-medium">
                          {currentParticipants} / {maxParticipants} inscritos
                        </span>
                        <span
                          className={`font-bold ${
                            isSoldOut
                              ? "text-red-600"
                              : isAlmostFull
                              ? "text-[#ff8c00]"
                              : "text-[#009999]"
                          }`}
                        >
                          {isSoldOut
                            ? "Esgotado"
                            : `${availableSlots} ${
                                availableSlots === 1 ? "vaga" : "vagas"
                              }`}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isSoldOut
                              ? "bg-red-500"
                              : isAlmostFull
                              ? "bg-[#ff8c00]"
                              : "bg-[#009999]"
                          }`}
                          style={{ width: `${occupancyPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Quantity Selector (if not sold out and not past) */}
                  {!isPast && !isSoldOut && variationId && price > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Quantidade de Bilhetes
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-lg font-bold hover:bg-gray-100 transition-colors"
                        >
                          −
                        </button>
                        <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                        <button
                          onClick={() =>
                            setQuantity(
                              Math.min(
                                maxParticipants > 0 ? availableSlots : 10,
                                quantity + 1
                              )
                            )
                          }
                          className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-lg font-bold hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      {quantity > 1 && (
                        <p className="text-sm text-gray-500 mt-1.5">
                          Total:{" "}
                          <span className="font-bold text-[#009999]">
                            {formatPrice(price * quantity)}
                          </span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Buy Button */}
                  {!isPast && !isSoldOut && variationId && price > 0 && (
                    <button
                      onClick={handleAddToCart}
                      disabled={adding || loading}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl ${
                        showSuccess
                          ? "bg-green-600 text-white"
                          : "bg-gradient-to-r from-[#ff8c00] to-[#e67a00] text-white hover:from-[#e67a00] hover:to-[#cc6600]"
                      }`}
                    >
                      {showSuccess ? (
                        <>
                          <CheckCircle className="w-6 h-6" />
                          {quantity === 1
                            ? "Bilhete Adicionado!"
                            : `${quantity} Bilhetes Adicionados!`}
                        </>
                      ) : adding ? (
                        <>
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          A adicionar...
                        </>
                      ) : (
                        <>
                          <Ticket className="w-6 h-6" />
                          {quantity === 1
                            ? "Comprar Bilhete"
                            : `Comprar ${quantity} Bilhetes`}
                        </>
                      )}
                    </button>
                  )}

                  {isPast && (
                    <div className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-gray-100 text-gray-500 font-bold">
                      <AlertCircle className="w-5 h-5" />
                      Formação já realizada
                    </div>
                  )}

                  {!isPast && isSoldOut && (
                    <div className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-red-50 text-red-600 font-bold">
                      <AlertCircle className="w-5 h-5" />
                      Vagas esgotadas
                    </div>
                  )}

                  {/* Share */}
                  <button
                    onClick={handleShare}
                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    Partilhar
                  </button>

                  {/* Trust Indicators */}
                  <div className="mt-5 pt-5 border-t border-gray-200 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span>Confirmação imediata por email</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span>Pagamento seguro</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span>Material incluído</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span>Certificado de participação</span>
                    </div>
                  </div>
                </div>
              </ScaleIn>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {training.body?.value && (
              <FadeIn direction="up" delay={0.3}>
                <div className="bg-white rounded-2xl shadow-md p-8">
                  <h2 className="text-3xl font-black mb-6">Sobre esta Formação</h2>
                  <div
                    className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-[#009999]"
                    dangerouslySetInnerHTML={{ __html: training.body.value }}
                  />
                </div>
              </FadeIn>
            )}

            {/* What's Included */}
            <FadeIn direction="up" delay={0.4}>
              <div className="bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-3xl font-black mb-6">O que está incluído</h2>
                <StaggerChildren staggerDelay={0.05}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Acesso à formação presencial",
                      "Material de apoio",
                      "Certificado de participação",
                      "Coffee break incluído",
                      "Networking com outros participantes",
                      "Acompanhamento pós-formação",
                    ].map((item, index) => (
                      <StaggerItem key={index}>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-[#009999] mt-0.5 flex-shrink-0" />
                          <span className="font-medium">{item}</span>
                        </div>
                      </StaggerItem>
                    ))}
                  </div>
                </StaggerChildren>
              </div>
            </FadeIn>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Event Details Card */}
            <FadeIn direction="up" delay={0.5}>
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-2xl font-black mb-5">Detalhes do Evento</h3>
                <div className="space-y-5">
                  {trainingDate && (
                    <div className="flex items-start gap-3">
                      <div className="bg-[#009999]/10 p-2.5 rounded-lg">
                        <Calendar className="w-5 h-5 text-[#009999]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Data</p>
                        <p className="font-bold capitalize">{formatFullDate(trainingDate)}</p>
                      </div>
                    </div>
                  )}

                  {trainingDate && (
                    <div className="flex items-start gap-3">
                      <div className="bg-[#009999]/10 p-2.5 rounded-lg">
                        <Clock className="w-5 h-5 text-[#009999]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Horário</p>
                        <p className="font-bold">
                          {formatTime(trainingDate)}
                          {endDate && ` às ${formatTime(endDate)}`}
                        </p>
                      </div>
                    </div>
                  )}

                  {location && (
                    <div className="flex items-start gap-3">
                      <div className="bg-[#009999]/10 p-2.5 rounded-lg">
                        <MapPin className="w-5 h-5 text-[#009999]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Local</p>
                        <p className="font-bold">{location}</p>
                        {locationAddress && (
                          <p className="text-sm text-gray-500 mt-0.5">{locationAddress}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {instructor && (
                    <div className="flex items-start gap-3">
                      <div className="bg-[#009999]/10 p-2.5 rounded-lg">
                        <User className="w-5 h-5 text-[#009999]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Formador</p>
                        <p className="font-bold">{instructor}</p>
                      </div>
                    </div>
                  )}

                  {maxParticipants > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="bg-[#009999]/10 p-2.5 rounded-lg">
                        <Users className="w-5 h-5 text-[#009999]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Vagas</p>
                        <p className="font-bold">
                          {maxParticipants} vagas (
                          {isSoldOut ? (
                            <span className="text-red-600">esgotado</span>
                          ) : (
                            <span className="text-[#009999]">
                              {availableSlots} disponíveis
                            </span>
                          )}
                          )
                        </p>
                      </div>
                    </div>
                  )}

                  {price > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="bg-[#009999]/10 p-2.5 rounded-lg">
                        <Ticket className="w-5 h-5 text-[#009999]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Preço</p>
                        <p className="font-bold text-[#009999]">
                          {formatPrice(price)} / bilhete
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>

            {/* Contact Card */}
            <FadeIn direction="up" delay={0.6}>
              <div className="bg-gradient-to-br from-[#009999] to-[#005c5c] rounded-2xl shadow-md p-6 text-white">
                <h3 className="text-xl font-black mb-3">Tem dúvidas?</h3>
                <p className="text-[#b3e6e6] text-sm mb-4">
                  Entre em contacto connosco para mais informações sobre esta formação.
                </p>
                <div className="space-y-3">
                  <a
                    href="mailto:info@clinicadoempresario.pt"
                    className="flex items-center gap-2 text-white hover:text-[#b3e6e6] transition-colors no-underline text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    info@clinicadoempresario.pt
                  </a>
                </div>
                <Link
                  href="/contact"
                  className="mt-4 block text-center bg-white text-[#009999] px-4 py-2.5 rounded-lg font-bold hover:bg-gray-100 transition-colors no-underline text-sm"
                >
                  Contactar-nos
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  )
}
