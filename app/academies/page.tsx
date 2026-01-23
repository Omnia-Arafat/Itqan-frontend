"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Building, Users, BookOpen, Search, ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function AcademiesDirectoryPage() {
  const [academies, setAcademies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getPublicAcademies = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/academies/public`)
        if (response.ok) {
          const data = await response.json()
          setAcademies(data)
        }
      } catch (error) {
        console.error('Failed to fetch academies:', error)
      } finally {
        setLoading(false)
      }
    }

    getPublicAcademies()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading academies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Islamic Academies</h1>
                <p className="text-muted-foreground">Discover and join Quran academies from around the world</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <Link href="/academy-registration">
                  <Plus className="h-4 w-4 mr-2" />
                  Register Your Academy
                </Link>
              </Button>
              <Button asChild>
                <Link href="/register">Join as Student/Teacher</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search academies..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <Building className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{academies.length}</p>
                  <p className="text-sm text-muted-foreground">Active Academies</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {academies.reduce((total: number, academy: any) => 
                      total + (academy._count?.userRoles || 0), 0
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Students & Teachers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {academies.reduce((total: number, academy: any) => 
                      total + (academy._count?.halaqas || 0), 0
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Halaqas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Academy Grid */}
        {academies.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {academies.map((academy: any) => (
              <Card key={academy.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">
                          {academy.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{academy.name}</CardTitle>
                        {academy.establishedYear && (
                          <p className="text-sm text-muted-foreground">
                            Est. {academy.establishedYear}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge variant="secondary">Public</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {academy.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {academy.description}
                      </p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{academy._count?.userRoles || 0} members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{academy._count?.halaqas || 0} halaqas</span>
                      </div>
                    </div>

                    {academy.contactEmail && (
                      <div className="text-sm text-muted-foreground">
                        Contact: {academy.contactEmail}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1" asChild>
                        <Link href={`/academies/${academy.id}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/register?academy=${academy.id}`}>
                          Join Academy
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Academies Found</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to register your Islamic academy on our platform
            </p>
            <Button asChild>
              <Link href="/academy-registration">Register Your Academy</Link>
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Join the Itqan Community?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Whether you're looking to learn or teach, our platform connects you with qualified 
                Islamic academies and experienced teachers from around the world.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/register">Join as Student</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/register?role=teacher">Join as Teacher</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/academy-registration">Register Academy</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}