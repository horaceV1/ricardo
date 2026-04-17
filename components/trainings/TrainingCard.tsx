"use client"

import { 
  Calendar, MapPin, Users, Clock, ShoppingCart, User, 
  AlertCircle, CheckCircle2 
} from "lucide-react"
import { DrupalNode } from "next-drupal"
import Link from "next/link"
import { FadeIn } from "@/components/animations/FadeIn"
import { ScaleIn } from "@/components/animations/ScaleIn"
import { ImageWithFallback } from "@/components/ui/ImageWithFallback"
import { absoluteUrl, formatPrice } from "@/lib/utils"
import { useCart } from "@/contexts/CartContext"
import { useState, useMemo } from "react"

interface TrainingCardProps {
  training: DrupalNode
}

function formatTrainingDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("pt-PT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatTrainingTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function TrainingCard({ training }: TrainingCardProps) {
  const { addToCart, loading } = useCart()
  const [adding, setAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const allVariations = useMemo(() => {
    const vars = training.variations || []
    return vars.filter((v: any) => v.status !== false && v.status !== 0)
  }, [training.variations])

  const hasMultipleVariations = allVariations.length > 1
  const variation = training.default_variation || allVariations[0]
  const price = parseFloat(variation?.price?.number || "0")
  const variationId = variation?.id
  const isPriceOnRequest = training.field_price_on_request === true || training.field_price_on_request === 1

  // Price range for multiple ticket types
  const priceRange = useMemo(() => {
    if (allVariations.length <= 1) return null
    const prices = allVariations
      .map((v: any) => parseFloat(v.price?.number || "0"))
      .filter((p: number) => p > 0)
    if (prices.length === 0) return null
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    if (min === max) return null
    return { min, max }
  }, [allVariations])

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
  const isAlmostFull = !isSoldOut && maxParticipants > 0 && availableSlots <= Math.ceil(maxParticipants * 0.2)
  
  // Check if the training date has passed
  const isPast = trainingDate ? new Date(trainingDate) < new Date() : false

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!variationId || isSoldOut || isPast) return

    setAdding(true)
    try {
      const success = await addToCart(variationId)
      if (success) {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
      }
    } finally {
      setAdding(false)
    }
  }

  const productPath = training.path?.alias || `/formacoes-presenciais/${training.id}`

  return (
    <Link href={productPath} className="group block h-full">
      <ScaleIn>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-transparent hover:border-[#009999] h-full flex flex-col">
          {/* Image */}
          <div className="relative h-52 overflow-hidden">
            {image ? (
              <ImageWithFallback
                src={absoluteUrl(image.uri?.url || image.url || image.attributes?.uri?.url)}
                alt={image.resourceIdObjMeta?.alt || image.meta?.alt || training.title}
                width={400}
                height={208}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#009999] to-[#005c5c] flex items-center justify-center">
                <Calendar className="w-16 h-16 text-white/40" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Status Badge */}
            {isPast ? (
              <div className="absolute top-4 right-4 bg-gray-600 text-white px-3 py-1.5 rounded-full shadow-lg">
                <span className="text-sm font-bold">Encerrada</span>
              </div>
            ) : isSoldOut ? (
              <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1.5 rounded-full shadow-lg">
                <span className="text-sm font-bold">Esgotado</span>
              </div>
            ) : isAlmostFull ? (
              <div className="absolute top-4 right-4 bg-[#ff8c00] text-white px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                <span className="text-sm font-bold">Últimas Vagas!</span>
              </div>
            ) : (
              <div className="absolute top-4 right-4 bg-[#009999] text-white px-3 py-1.5 rounded-full shadow-lg">
                <span className="text-sm font-bold">Presencial</span>
              </div>
            )}

            {/* Date Badge */}
            {trainingDate && (
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                <div className="text-xs font-bold text-[#009999] uppercase">
                  {new Date(trainingDate).toLocaleDateString("pt-PT", { month: "short" })}
                </div>
                <div className="text-2xl font-black text-gray-900 leading-none">
                  {new Date(trainingDate).getDate()}
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-black mb-3 line-clamp-2 group-hover:text-[#009999] transition-colors leading-tight">
              {training.title}
            </h3>

            {training.body?.summary && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                {training.body.summary}
              </p>
            )}

            {/* Details */}
            <div className="space-y-2.5 mb-4">
              {trainingDate && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-[#009999] flex-shrink-0" />
                  <span className="font-semibold capitalize">
                    {formatTrainingDate(trainingDate)}
                  </span>
                </div>
              )}
              {trainingDate && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-[#009999] flex-shrink-0" />
                  <span className="font-semibold">
                    {formatTrainingTime(trainingDate)}
                    {endDate && ` - ${formatTrainingTime(endDate)}`}
                  </span>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-[#009999] flex-shrink-0" />
                  <span className="font-semibold">{location}</span>
                </div>
              )}
              {instructor && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4 text-[#009999] flex-shrink-0" />
                  <span className="font-semibold">{instructor}</span>
                </div>
              )}
            </div>

            {/* Availability & Price */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
              <div>
                {maxParticipants > 0 && !isPast && (
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#009999]" />
                    <span className={`text-sm font-bold ${
                      isSoldOut ? 'text-red-600' : isAlmostFull ? 'text-[#ff8c00]' : 'text-gray-700'
                    }`}>
                      {isSoldOut 
                        ? 'Sem vagas' 
                        : `${availableSlots} ${availableSlots === 1 ? 'vaga' : 'vagas'}`
                      }
                    </span>
                  </div>
                )}
              </div>
              <div className="text-right">
                {isPriceOnRequest ? (
                  <div className="text-xl font-black text-[#009999]">Sob consulta</div>
                ) : priceRange ? (
                  <>
                    <div className="text-xs text-gray-500 font-medium">desde</div>
                    <div className="text-2xl font-black text-[#009999]">
                      {formatPrice(priceRange.min)}
                    </div>
                  </>
                ) : (
                  <div className="text-2xl font-black text-[#009999]">
                    {price > 0 ? formatPrice(price) : "Gratuito"}
                  </div>
                )}
              </div>
            </div>

            {/* Buy Button */}
            {!isPast && !isSoldOut && isPriceOnRequest && (
              <div className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-[#ff8c00] to-[#e67a00] text-white font-semibold hover:shadow-lg transition-all">
                Saber Mais
              </div>
            )}

            {!isPast && !isSoldOut && !isPriceOnRequest && variationId && price > 0 && (
              hasMultipleVariations ? (
                <div
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-[#ff8c00] to-[#e67a00] text-white font-semibold hover:shadow-lg transition-all"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Ver Bilhetes
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={adding || loading}
                  className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${
                    showSuccess
                      ? "bg-green-600 text-white"
                      : "bg-gradient-to-r from-[#ff8c00] to-[#e67a00] text-white"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {showSuccess
                    ? "✓ Bilhete Adicionado!"
                    : adding
                    ? "A adicionar..."
                    : "Comprar Bilhete"}
                </button>
              )
            )}

            {isPast && (
              <div className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-100 text-gray-500 font-semibold">
                <AlertCircle className="w-5 h-5" />
                Formação já realizada
              </div>
            )}

            {!isPast && isSoldOut && (
              <div className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-50 text-red-600 font-semibold">
                <AlertCircle className="w-5 h-5" />
                Vagas esgotadas
              </div>
            )}
          </div>
        </div>
      </ScaleIn>
    </Link>
  )
}
