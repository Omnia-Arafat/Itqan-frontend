"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Video, Users, Award, ArrowRight, Globe } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { motion } from "framer-motion"
import { HeroSection } from "@/components/hero-section"
import { FeatureCard } from "@/components/feature-card"
import { AcademyCard } from "@/components/academy-card"
import { LiveHalaqaCard } from "@/components/live-halaqa-card"
import { EnhancedButton } from "@/components/enhanced-button"

export default function LandingPage() {
  const [publicHalaqas, setPublicHalaqas] = useState<any[]>([])
  const [academies, setAcademies] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [halaqasRes, academiesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/halaqas/public`).catch(() => null),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/academies`).catch(() => null)
        ])

        const halaqasData = halaqasRes?.ok ? await halaqasRes.json().catch(() => []) : []
        const academiesData = academiesRes?.ok ? await academiesRes.json().catch(() => []) : []

        setPublicHalaqas(halaqasData)
        setAcademies(academiesData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setPublicHalaqas([])
        setAcademies([])
      }
    }

    fetchData()
  }, [])

  const liveHalaqas = publicHalaqas.filter((h: any) => h.sessions?.some((s: any) => s.status === 'LIVE'))

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection academies={academies} />

      {/* Live Halaqas Section */}
      {liveHalaqas.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-red-50 to-pink-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.3, 1],
                    boxShadow: ["0 0 0 0 rgba(239, 68, 68, 0.7)", "0 0 0 10px rgba(239, 68, 68, 0)", "0 0 0 0 rgba(239, 68, 68, 0)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-4 w-4 rounded-full bg-red-500"
                />
                <motion.h2 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-bold text-red-900"
                >
                  Live Halaqas Now
                </motion.h2>
              </div>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-red-700 text-lg"
              >
                Join ongoing Quran study sessions
              </motion.p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {liveHalaqas.slice(0, 6).map((halaqa: any, index: number) => (
                <LiveHalaqaCard key={halaqa.id} halaqa={halaqa} index={index} />
              ))}
            </div>
            {liveHalaqas.length > 6 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-center mt-8"
              >
                <EnhancedButton variant="outline" asChild>
                  <Link href="/halaqas">View All Live Halaqas</Link>
                </EnhancedButton>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl font-bold text-slate-900 mb-4"
              whileInView={{ scale: [0.9, 1.05, 1] }}
              transition={{ duration: 0.6 }}
            >
              Why Choose Itqan?
            </motion.h2>
            <motion.p 
              className="text-xl text-slate-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Experience the future of Quran education with our comprehensive platform
            </motion.p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Video className="h-10 w-10 text-primary" />}
              title="Live Halaqas"
              description="Join real-time video sessions with qualified Sheikhs."
              delay={0}
            />
            <FeatureCard 
              icon={<BookOpen className="h-10 w-10 text-primary" />}
              title="Digital Mushaf"
              description="Read directly from high-quality Quran pages during class."
              delay={0.1}
            />
            <FeatureCard 
              icon={<Award className="h-10 w-10 text-primary" />}
              title="Progress Tracking"
              description="Visualize your Hifz and Tajweed improvements over time."
              delay={0.2}
            />
            <FeatureCard 
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Global Community"
              description="Learn alongside motivated students from around the globe."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Academies Section */}
      {academies.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <motion.h2 
                className="text-4xl font-bold text-slate-900 mb-4"
                whileInView={{ scale: [0.9, 1.05, 1] }}
                transition={{ duration: 0.6 }}
              >
                Partner Academies
              </motion.h2>
              <motion.p 
                className="text-xl text-slate-600"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Learn from qualified institutions worldwide
              </motion.p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {academies.slice(0, 8).map((academy: any, index: number) => (
                <AcademyCard key={academy.id} academy={academy} index={index} />
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <EnhancedButton showArrow animateArrow asChild>
                <Link href="/academies">View All Academies</Link>
              </EnhancedButton>
            </motion.div>
          </div>
        </section>
      )}

      {/* Academy Registration CTA */}
      <section className="py-20 bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+")`,
              backgroundRepeat: 'repeat'
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              whileInView={{ scale: [0.9, 1.05, 1] }}
              transition={{ duration: 0.6 }}
            >
              Bring Your Academy to Itqan
            </motion.h2>
            <motion.p 
              className="text-xl mb-8 text-green-100 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Join our growing network of Islamic academies. Manage your students, teachers, and halaqas 
              with our comprehensive platform designed for Quran education.
            </motion.p>
            
            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Users className="h-8 w-8 mb-4 mx-auto" />
                </motion.div>
                <h3 className="font-semibold mb-2">Manage Users</h3>
                <p className="text-sm text-white/80">Invite and manage students and teachers with role-based access</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                >
                  <BookOpen className="h-8 w-8 mb-4 mx-auto" />
                </motion.div>
                <h3 className="font-semibold mb-2">Create Halaqas</h3>
                <p className="text-sm text-white/80">Organize study circles and track student progress</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                >
                  <Globe className="h-8 w-8 mb-4 mx-auto" />
                </motion.div>
                <h3 className="font-semibold mb-2">Global Reach</h3>
                <p className="text-sm text-white/80">Connect with students worldwide through our platform</p>
              </motion.div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <EnhancedButton 
                variant="secondary" 
                size="lg" 
                showArrow 
                animateArrow
                className="bg-white text-green-600 hover:bg-green-50"
                asChild
              >
                <Link href="/academy-registration">Register Your Academy</Link>
              </EnhancedButton>
              <EnhancedButton 
                variant="outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                asChild
              >
                <Link href="/academies">Browse Existing Academies</Link>
              </EnhancedButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-slate-400">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Itqan</span>
              </div>
              <p className="text-sm">
                Connecting the global Muslim community through quality Quran education.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/academies" className="hover:text-white transition-colors">Academies</Link></li>
                <li><Link href="/halaqas" className="hover:text-white transition-colors">Halaqas</Link></li>
                <li><Link href="/mushaf" className="hover:text-white transition-colors">Digital Mushaf</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Academies</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/academy-registration" className="hover:text-white transition-colors">Register Academy</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Get Started</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
            <p>© 2024 Itqan Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
