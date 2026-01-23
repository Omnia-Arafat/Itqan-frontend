"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, BookOpen } from "lucide-react"
import Link from "next/link"

interface AcademyCardProps {
  academy: any
  index: number
}

export function AcademyCard({ academy, index }: AcademyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <Link href={`/academies/${academy.id}`} className="block">
        <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-md cursor-pointer bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <motion.div 
              whileHover={{ scale: 1.15, rotate: 5 }}
              className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-2xl font-bold text-primary">
                {academy.name.charAt(0).toUpperCase()}
              </span>
            </motion.div>
            <h3 className="font-semibold mb-2">{academy.name}</h3>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-4">
              <motion.span
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-1"
              >
                <Users className="h-3 w-3" />
                {academy._count?.userRoles || 0} members
              </motion.span>
              <span>•</span>
              <motion.span
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-1"
              >
                <BookOpen className="h-3 w-3" />
                {academy._count?.halaqas || 0} halaqas
              </motion.span>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full border-green-200 text-green-700 hover:bg-green-50 rounded-lg font-medium transition-all duration-300"
              >
                View Details
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}