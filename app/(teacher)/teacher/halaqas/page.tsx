"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users, Settings, Calendar } from "lucide-react"
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
            <Card key={halaqa.id} className="flex flex-col">
              <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
                <div className="space-y-1">
                  <CardTitle className="text-lg line-clamp-1">{halaqa.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{halaqa.type}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span>{halaqa.enrollments?.length || 0} Students</span>
                </div>
                {halaqa.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {halaqa.description}
                  </p>
                )}
                {halaqa.academy && (
                  <p className="text-xs text-muted-foreground">
                    {halaqa.academy.name}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-2 pt-4">
                <div className="flex w-full gap-2">
                  <Button variant="outline" className="flex-1" size="sm" asChild>
                    <Link href={`/teacher/halaqas/${halaqa.id}/students`}>
                      <Users className="h-4 w-4 mr-1" />
                      Students
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1" size="sm" asChild>
                    <Link href={`/teacher/halaqas/${halaqa.id}/sessions`}>
                      <Calendar className="h-4 w-4 mr-1" />
                      Sessions
                    </Link>
                  </Button>
                </div>
                <Button className="w-full" size="sm" asChild>
                  <Link href={`/teacher/halaqas/${halaqa.id}`}>Manage Halaqa</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
