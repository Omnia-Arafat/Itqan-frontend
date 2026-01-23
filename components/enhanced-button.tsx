"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { forwardRef } from "react"

interface EnhancedButtonProps {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  showArrow?: boolean
  animateArrow?: boolean
  className?: string
  onClick?: () => void
  asChild?: boolean
  href?: string
  disabled?: boolean
}

export const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    children, 
    variant = "primary", 
    size = "md", 
    showArrow = false, 
    animateArrow = false,
    className = "",
    onClick,
    asChild,
    disabled,
    ...props 
  }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case "primary":
          return "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg hover:shadow-xl"
        case "secondary":
          return "bg-gradient-to-r from-slate-600 to-slate-500 hover:from-slate-700 hover:to-slate-600 text-white shadow-lg hover:shadow-xl"
        case "outline":
          return "border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
        case "ghost":
          return "text-green-700 hover:bg-green-50"
        default:
          return "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg hover:shadow-xl"
      }
    }

    const getSizeStyles = () => {
      switch (size) {
        case "sm":
          return "px-4 py-2 text-sm rounded-lg"
        case "md":
          return "px-6 py-3 text-base rounded-xl"
        case "lg":
          return "px-8 py-4 text-lg rounded-xl"
        default:
          return "px-6 py-3 text-base rounded-xl"
      }
    }

    return (
      <motion.div
        whileHover={{ scale: 1.05, rotate: variant === "primary" ? 1 : -1 }}
        whileTap={{ scale: 0.95 }}
        className="inline-block"
      >
        <Button
          ref={ref}
          className={`
            ${getVariantStyles()} 
            ${getSizeStyles()} 
            font-semibold 
            transition-all 
            duration-300 
            transform-gpu
            ${className}
          `}
          onClick={onClick}
          asChild={asChild}
          disabled={disabled}
          {...props}
        >
          <span className="flex items-center gap-2">
            {children}
            {showArrow && (
              <motion.div
                animate={animateArrow ? { x: [0, 5, 0] } : {}}
                transition={animateArrow ? { duration: 1.5, repeat: Infinity } : {}}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            )}
          </span>
        </Button>
      </motion.div>
    )
  }
)

EnhancedButton.displayName = "EnhancedButton"