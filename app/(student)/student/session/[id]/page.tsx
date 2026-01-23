"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Video, Users, Clock } from "lucide-react"
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
  }
}

export default function LiveSessionPage() {
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
          router.push(`/student/halaqas/${data.halaqa.id}`)
        }
      } else {
        toast.error("Session not found")
        router.push("/student/halaqas")
      }
    } catch (error) {
      console.error("Error loading session:", error)
      toast.error("Failed to load session")
      router.push("/student/halaqas")
    } finally {
      setLoading(false)
    }
  }

  const handleLeaveSession = () => {
    localStorage.removeItem('activeSession')
    router.push(`/student/halaqas/${session?.halaqa.id}`)
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
              <Link href="/student/halaqas">Back to Halaqas</Link>
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
          <Button variant="ghost" size="icon" onClick={handleLeaveSession}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-semibold">{session.halaqa.title}</h1>
            <p className="text-sm text-muted-foreground">
              with {session.halaqa.teacher.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            LIVE
          </div>
          <Button variant="outline" onClick={handleLeaveSession}>
            Leave Session
          </Button>
        </div>
      </div>

      {/* Video Conference */}
      <div className="flex-1 p-4">
        <LiveHalaqa 
          roomName={`halaqa-${session.halaqa.id}-${sessionId}`}
          displayName={user?.name || "Student"}
        />
      </div>
    </div>
  )
}