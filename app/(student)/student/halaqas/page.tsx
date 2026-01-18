"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen } from "lucide-react"
import Link from "next/link"
import { fetchWithAuth } from "@/lib/api"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HalaqaCardSkeleton } from "@/components/ui/loading-skeleton"

export default function MyHalaqasPage() {
  const [myEnrollments, setMyEnrollments] = useState<any[]>([])
  const [availableHalaqas, setAvailableHalaqas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [enrollmentsRes, halaqasRes] = await Promise.all([
        fetchWithAuth("/enrollments/my"),
        fetchWithAuth("/halaqas")
      ])
      
      if (enrollmentsRes.ok) {
        const data = await enrollmentsRes.json()
        setMyEnrollments(Array.isArray(data) ? data : [])
      }
      
      if (halaqasRes.ok) {
        const data = await halaqasRes.json()
        setAvailableHalaqas(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Failed to load halaqas", error)
      toast.error("Failed to load halaqas")
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (halaqaId: string) => {
    try {
      const response = await fetchWithAuth("/enrollments", {
        method: "POST",
        body: JSON.stringify({ halaqaId }),
      })

      if (response.ok) {
        toast.success("Enrolled successfully!")
        loadData()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to enroll")
      }
    } catch (error) {
      toast.error("Failed to enroll")
    }
  }

  const handleUnenroll = async (enrollmentId: string) => {
    try {
      const response = await fetchWithAuth(`/enrollments/${enrollmentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Unenrolled successfully!")
        loadData()
      } else {
        toast.error("Failed to unenroll")
      }
    } catch (error) {
      toast.error("Failed to unenroll")
    }
  }

  const enrolledHalaqaIds = myEnrollments.map(e => e.halaqaId)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Halaqas</h2>
        <p className="text-muted-foreground">Manage your Quran study circles</p>
      </div>

      <Tabs defaultValue="my" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my">My Halaqas ({myEnrollments.length})</TabsTrigger>
          <TabsTrigger value="browse">Browse All</TabsTrigger>
        </TabsList>

        <TabsContent value="my" className="space-y-4">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <HalaqaCardSkeleton />
              <HalaqaCardSkeleton />
              <HalaqaCardSkeleton />
            </div>
          ) : myEnrollments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">You haven't enrolled in any halaqas yet.</p>
                <p className="text-sm text-muted-foreground mt-2">Browse available halaqas to get started!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myEnrollments.map((enrollment) => (
                <Card key={enrollment.id}>
                  <CardHeader>
                    <CardTitle>{enrollment.halaqa.title}</CardTitle>
                    <CardDescription>with {enrollment.halaqa.teacher.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="mr-2 h-4 w-4" />
                        <span>{enrollment.halaqa.type}</span>
                      </div>
                      {enrollment.halaqa.description && (
                        <p className="text-muted-foreground line-clamp-2">
                          {enrollment.halaqa.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button className="flex-1" variant="outline" onClick={() => handleUnenroll(enrollment.id)}>
                      Unenroll
                    </Button>
                    <Button className="flex-1" asChild>
                      <Link href={`/student/halaqas/${enrollment.halaqaId}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="browse" className="space-y-4">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <HalaqaCardSkeleton />
              <HalaqaCardSkeleton />
              <HalaqaCardSkeleton />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availableHalaqas.map((halaqa) => {
                const isEnrolled = enrolledHalaqaIds.includes(halaqa.id)
                return (
                  <Card key={halaqa.id}>
                    <CardHeader>
                      <CardTitle>{halaqa.title}</CardTitle>
                      <CardDescription>with {halaqa.teacher.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Users className="mr-2 h-4 w-4" />
                          <span>{halaqa.type}</span>
                        </div>
                        {halaqa.academy && (
                          <div className="text-muted-foreground">
                            {halaqa.academy.name}
                          </div>
                        )}
                        {halaqa.description && (
                          <p className="text-muted-foreground line-clamp-2">
                            {halaqa.description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      {isEnrolled ? (
                        <Button className="w-full" variant="outline" disabled>
                          Already Enrolled
                        </Button>
                      ) : (
                        <Button className="w-full" onClick={() => handleEnroll(halaqa.id)}>
                          Enroll Now
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
