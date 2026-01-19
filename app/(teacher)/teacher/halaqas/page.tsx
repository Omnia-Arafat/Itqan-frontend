"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Settings, Calendar, BookOpen, Edit } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { toast } from "sonner"
import { HalaqaCardSkeleton } from "@/components/ui/loading-skeleton"
import Link from "next/link"
import CreateHalaqaDialog from "@/components/create-halaqa-dialog"

export default function TeacherHalaqasPage() {
  const [halaqas, setHalaqas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHalaqas()
  }, [])

  const loadHalaqas = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const response = await fetchWithAuth(`/halaqas?teacherId=${user.id}`)
      
      if (response.ok) {
        const data = await response.json()
        setHalaqas(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Failed to load halaqas", error)
      toast.error("Failed to load halaqas")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Halaqas</h2>
          <p className="text-muted-foreground">Manage your teaching groups</p>
        </div>
        <CreateHalaqaDialog onSuccess={loadHalaqas} />
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <HalaqaCardSkeleton />
          <HalaqaCardSkeleton />
          <HalaqaCardSkeleton />
        </div>
      ) : halaqas.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">You haven't created any halaqas yet.</p>
            <p className="text-sm text-muted-foreground mt-2">Click "Create New Halaqa" to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {halaqas.map((halaqa) => (
            <Card 
              key={halaqa.id} 
              className="flex flex-col hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary-500"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight line-clamp-1">
                          {halaqa.title}
                        </CardTitle>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="default" 
                        className={halaqa.type === "PRIVATE" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}
                      >
                        {halaqa.type}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-1 h-3 w-3" />
                        <span className="font-medium">{halaqa.enrollments?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                {halaqa.description ? (
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {halaqa.description}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No description provided
                  </p>
                )}
                {halaqa.academy && (
                  <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
                    📚 {halaqa.academy.name}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-2 pt-4 border-t">
                <div className="grid grid-cols-2 w-full gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                    asChild
                  >
                    <Link href={`/teacher/halaqas/${halaqa.id}`}>
                      <Edit className="h-3 w-3 mr-1" />
                      Manage
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                    asChild
                  >
                    <Link href={`/teacher/halaqas/${halaqa.id}/students`}>
                      <Users className="h-3 w-3 mr-1" />
                      Students
                    </Link>
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300"
                  asChild
                >
                  <Link href={`/teacher/halaqas/${halaqa.id}/sessions`}>
                    <Calendar className="h-3 w-3 mr-1" />
                    Sessions
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
