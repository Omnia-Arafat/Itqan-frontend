"use client"

import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import { useEffect, useRef } from "react"

interface AnimatedCounterProps {
  value: number
  duration?: number
  delay?: number
  className?: string
  suffix?: string
}

export function AnimatedCounter({ 
  value, 
  duration = 2, 
  delay = 0, 
  className = "", 
  suffix = "" 
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { 
    duration: duration * 1000,
    bounce: 0.25
  })
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView && value > 0) {
      const timer = setTimeout(() => {
        motionValue.set(value)
      }, delay * 1000)
      return () => clearTimeout(timer)
    }
  }, [motionValue, isInView, value, delay])

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        const roundedValue = Math.floor(latest)
        ref.current.textContent = `${roundedValue}${suffix}`
      }
    })
    return unsubscribe
  }, [springValue, suffix])

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.5, delay }}
    >
      0{suffix}
    </motion.span>
  )
}