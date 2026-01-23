"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Clock, Video } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { toast } from "sonner"
import Link from "next/link"
import LiveHalaqa from "@/components/live-halaqa"

interface Session {
  id: string
  date: string
  status: string
  halaqa: {
    id: string
    title: string
    teacher: {
      id: string
      name: string
    }
    enrollments: any[]
  }
  attendances: any[]
}

export default function TeacherLiveSessionPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id as string

  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
    loadSession()
  }, [sessionId])

  const loadSession = async () => {
    try {
      const response = await fetchWithAuth(`/sessions/${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        setSession(data)
        
        if (data.status !== "LIVE") {
          toast.error("This session is not currently live")
          router.push(`/teacher/halaqas/${data.halaqa.id}`)
        }
      } else {
        toast.error("Session not found")
        router.push("/teacher/halaqas")
      }
    } catch (error) {
      console.error("Error loading session:", error)
      toast.error("Failed to load session")
      router.push("/teacher/halaqas")
    } finally {
      setLoading(false)
    }
  }

  const handleEndSession = async () => {
    try {
      const response = await fetchWithAuth(`/sessions/end-live/${sessionId}`, {
        method: "POST",
      })

      if (response.ok) {
        toast.success("Session ended successfully!")
        router.push(`/teacher/halaqas/${session?.halaqa.id}`)
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to end session")
      }
    } catch (error) {
      console.error("Failed to end session:", error)
      toast.error("Failed to end session")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading session...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Session not found</p>
            <Button className="mt-4" asChild>
              <Link href="/teacher/halaqas">Back to Halaqas</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-background border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/teacher/halaqas/${session.halaqa.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="font-semibold">{session.halaqa.title}</h1>
            <p className="text-sm text-muted-foreground">
              Teaching Session
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            <span>{session.halaqa.enrollments?.length || 0} enrolled</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            LIVE
          </div>
          <Button variant="destructive" onClick={handleEndSession}>
            End Session
          </Button>
        </div>
      </div>

      {/* Video Conference */}
      <div className="flex-1 p-4">
        <LiveHalaqa 
          roomName={`halaqa-${session.halaqa.id}-${sessionId}`}
          displayName={user?.name || "Teacher"}
        />
      </div>
    </div>
  )
}