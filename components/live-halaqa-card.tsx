"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen } from "lucide-react"
import Link from "next/link"

interface LiveHalaqaCardProps {
  halaqa: any
  index: number
}

export function LiveHalaqaCard({ halaqa, index }: LiveHalaqaCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <Card className="border-red-200 hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{halaqa.title}</CardTitle>
            <motion.div
              animate={{ 
                opacity: [1, 0.5, 1],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Badge className="bg-red-600 text-white shadow-lg">LIVE</Badge>
            </motion.div>
          </div>
          <p className="text-sm text-muted-foreground">with {halaqa.teacher.name}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <Users className="mr-2 h-4 w-4" />
              <span>{halaqa.academy.name}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <BookOpen className="mr-2 h-4 w-4" />
              <span>{halaqa.enrollments?.length || 0} students</span>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
              <Button 
                size="sm" 
                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 rounded-lg font-medium transition-all duration-300" 
                asChild
              >
                <Link href="/register">Join to Watch</Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-lg font-medium transition-all duration-300" 
                asChild
              >
                <Link href={`/login`}>Login</Link>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}