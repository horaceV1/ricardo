'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale'
  delay?: number
}

export function AnimatedSection({
  children,
  className = '',
  animation = 'fadeIn',
  delay = 0,
}: AnimatedSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = sectionRef.current
    if (!element) return

    const animations = {
      fadeIn: { opacity: 0, y: 30 },
      slideUp: { opacity: 0, y: 60 },
      slideLeft: { opacity: 0, x: -60 },
      slideRight: { opacity: 0, x: 60 },
      scale: { opacity: 0, scale: 0.8 },
    }

    gsap.fromTo(
      element,
      animations[animation],
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration: 1,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [animation, delay])

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  )
}
