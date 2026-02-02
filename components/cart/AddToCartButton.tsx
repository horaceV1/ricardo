"use client"

import { useState } from "react"
import { useCart } from "@/contexts/CartContext"
import { Loader2, Check } from "lucide-react"

interface AddToCartButtonProps {
  variationId: string
  children: React.ReactNode
  className?: string
}

export function AddToCartButton({ variationId, children, className = "" }: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const [adding, setAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!variationId || adding) {
      return
    }
    
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

  return (
    <button
      onClick={handleClick}
      disabled={adding || showSuccess}
      className={`${className} ${
        showSuccess ? 'bg-green-600 hover:bg-green-600' : ''
      } disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
    >
      {adding ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Adicionando...</span>
        </>
      ) : showSuccess ? (
        <>
          <Check className="h-5 w-5" />
          <span>Adicionado!</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
