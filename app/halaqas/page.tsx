"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Video, Users, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function PublicHalaqasPage() {
  const [publicHalaqas, setPublicHalaqas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getPublicHalaqas = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/halaqas/public`)
        if (response.ok) {
          const data = await response.json()
          setPublicHalaqas(data)
        }
      } catch (error) {
        console.error('Failed to fetch public halaqas:', error)
      } finally {
        setLoading(false)
      }
    }

    getPublicHalaqas()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading halaqas...</p>
        </div>
      </div>
    )
  }

  const liveHalaqas = publicHalaqas.filter((h: any) => h.sessions?.some((s: any) => s.status === 'LIVE'))
  const regularHalaqas = publicHalaqas.filter((h: any) => !h.sessions?.some((s: any) => s.status === 'LIVE'))

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Public Halaqas</h1>
              <p className="text-muted-foreground">Join Quran study circles from around the world</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/register">Join to Participate</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Live Halaqas */}
        {liveHalaqas.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-3 w-3 rounded-full bg-red-600 animate-pulse" />
              <h2 className="text-2xl font-bold text-red-900">Live Now</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveHalaqas.map((halaqa: any) => (
                <Card key={halaqa.id} className="border-red-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{halaqa.title}</CardTitle>
                      <Badge className="bg-red-600 text-white animate-pulse">LIVE</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">with {halaqa.teacher.name}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="mr-2 h-4 w-4" />
                        <span>{halaqa.academy.name}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>{halaqa.enrollments?.length || 0} students</span>
                      </div>
                      {halaqa.description && (
                        <p className="text-muted-foreground line-clamp-2 mt-2">
                          {halaqa.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" asChild>
                        <Link href="/register">Join to Watch</Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href="/login">Login</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Regular Halaqas */}
        {regularHalaqas.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Available Halaqas</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularHalaqas.map((halaqa: any) => (
                <Card key={halaqa.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{halaqa.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">with {halaqa.teacher.name}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="mr-2 h-4 w-4" />
                        <span>{halaqa.academy.name}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>{halaqa.enrollments?.length || 0} students enrolled</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>{halaqa.sessions?.length || 0} sessions held</span>
                      </div>
                      {halaqa.description && (
                        <p className="text-muted-foreground line-clamp-2 mt-2">
                          {halaqa.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" asChild>
                        <Link href="/register">Join Halaqa</Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href="/login">Login</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {publicHalaqas.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No Public Halaqas Available</h3>
            <p className="text-muted-foreground mb-6">
              Check back later or register to create your own halaqa
            </p>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}