"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { AnimatedCounter } from "./animated-counter"

interface HeroSectionProps {
  academies: any[]
}

export function HeroSection({ academies }: HeroSectionProps) {
  const totalStudents = academies.reduce((total: number, academy: any) => 
    total + (academy._count?.userRoles || 0), 0
  )
  
  const totalHalaqas = academies.reduce((total: number, academy: any) => 
    total + (academy._count?.halaqas || 0), 0
  )

  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/landing-hero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/40" />
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
        >
          Master the Quran
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed"
        >
          Connect with expert teachers, track your progress, and perfect your recitation from anywhere in the world.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl font-semibold" 
              asChild
            >
              <Link href="/register">
                Start Your Journey
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.div>
              </Link>
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 bg-white/10 hover:bg-white/20 border-white/30 text-white backdrop-blur-sm rounded-xl font-semibold transition-all duration-300" 
              asChild
            >
              <Link href="/academies">
                Browse Academies
              </Link>
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Floating Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.1, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-3xl font-bold text-white mb-1">
              <AnimatedCounter value={academies.length} delay={1.6} />+
            </div>
            <div className="text-white/80 text-sm">Academies</div>
          </motion.div>
          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.1, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-3xl font-bold text-white mb-1">
              <AnimatedCounter value={totalStudents} delay={1.8} />+
            </div>
            <div className="text-white/80 text-sm">Students</div>
          </motion.div>
          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.1, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-3xl font-bold text-white mb-1">
              <AnimatedCounter value={totalHalaqas} delay={2.0} />+
            </div>
            <div className="text-white/80 text-sm">Halaqas</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}