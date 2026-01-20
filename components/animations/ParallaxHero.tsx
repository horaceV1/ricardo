'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface ParallaxHeroProps {
  children: React.ReactNode
}

export function ParallaxHero({ children }: ParallaxHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const handleScroll = () => {
      const scrolled = window.scrollY
      gsap.to(hero, {
        y: scrolled * 0.5,
        duration: 0.5,
        ease: 'power2.out',
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={heroRef} className="will-change-transform">
      {children}
    </div>
  )
}
