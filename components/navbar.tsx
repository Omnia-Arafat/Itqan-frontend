"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building, 
  Menu, 
  X, 
  BookOpen, 
  Users, 
  GraduationCap,
  LogIn,
  UserPlus
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: "/academies", label: "Academies", icon: Building },
    { href: "/halaqas", label: "Halaqas", icon: BookOpen },
    { href: "/help", label: "Help", icon: Users },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className={`text-xl font-bold transition-colors ${
                  scrolled ? 'text-gray-900' : 'text-white'
                }`}>
                  Itqan
                </span>
                <span className={`text-xs transition-colors ${
                  scrolled ? 'text-gray-600' : 'text-white/80'
                }`}>
                  Quran Academy Platform
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-white/10 ${
                    scrolled ? 'text-gray-700 hover:text-primary' : 'text-white/90 hover:text-white'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant={scrolled ? "outline" : "secondary"}
                size="sm"
                asChild
                className="transition-all"
              >
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                size="sm"
                asChild
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
              >
                <Link href="/register">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Get Started
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className={scrolled ? 'text-gray-900' : 'text-white'}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 mt-2 rounded-lg shadow-lg"
            >
              <div className="p-4 space-y-3">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" asChild>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Get Started
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}