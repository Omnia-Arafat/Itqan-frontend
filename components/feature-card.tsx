"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  delay?: number
}

export function FeatureCard({ icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 h-full bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <motion.div 
            className="mb-4"
            whileHover={{ 
              scale: 1.2, 
              rotate: [0, -10, 10, 0],
              transition: { duration: 0.5 }
            }}
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: delay * 2
            }}
          >
            {icon}
          </motion.div>
          <motion.h3 
            className="text-xl font-semibold"
            whileHover={{ scale: 1.05 }}
          >
            {title}
          </motion.h3>
        </CardHeader>
        <CardContent>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            {description}
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  )
}