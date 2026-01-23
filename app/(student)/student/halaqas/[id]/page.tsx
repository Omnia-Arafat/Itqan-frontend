"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Video, BookOpen, Clock, ArrowLeft } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { toast } from "sonner"
import Link from "next/link"
import { format } from "date-fns"

interface Session {
  id: string
  date: string
  status: string
  createdAt: string
}

interface Halaqa {
  id: string
  title: string
  description: string
  type: string
  teacher: {
    id: string
    name: string
    email: string
  }
  academy: {
    id: string
    name: string
  }
  sessions: Session[]
  enrollments: any[]
  createdAt: string
}

export default function HalaqaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const halaqaId = params.id as string

  const [halaqa, setHalaqa] = useState<Halaqa | null>(null)
  const [loading, setLoading] = useState(true)
  const [liveSession, setLiveSession] = useState<Session | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
    loadHalaqaDetails()
  }, [halaqaId])

  const loadHalaqaDetails = async () => {
    try {
      const response = await fetchWithAuth(`/halaqas/${halaqaId}`)
      if (response.ok) {
        const data = await response.json()
        setHalaqa(data)
        
        // Check if user is enrolled
        if (user) {
          const enrolled = data.enrollments?.some((e: any) => e.userId === user.id)
          setIsEnrolled(enrolled)
        }
        
        // Find live session
        const live = data.sessions?.find((s: Session) => s.status === "LIVE")
        setLiveSession(live || null)
      } else {
        toast.error("Failed to load halaqa details")
        router.push("/student/halaqas")
      }
    } catch (error) {
      console.error("Error loading halaqa:", error)
      toast.error("Failed to load halaqa details")
      router.push("/student/halaqas")
    } finally {
      setLoading(false)
    }
  }

  const handleJoinLiveSession = () => {
    if (liveSession) {
      // Store session info for floating widget
      localStorage.setItem('activeSession', JSON.stringify({
        sessionId: liveSession.id,
        sessionTitle: halaqa?.title,
        timestamp: Date.now()
      }))
      router.push(`/student/session/${liveSession.id}`)
    }
  }

  const handleEnroll = async () => {
    try {
      const response = await fetchWithAuth("/enrollments", {
        method: "POST",
        body: JSON.stringify({ halaqaId }),
      })

      if (response.ok) {
        toast.success("Enrolled successfully!")
        loadHalaqaDetails()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to enroll")
      }
    } catch (error) {
      toast.error("Failed to enroll")
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/student/halaqas">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Loading...</h2>
            <p className="text-muted-foreground">Please wait</p>
          </div>
        </div>
      </div>
    )
  }

  if (!halaqa) {
    return null
  }

  const upcomingSessions = halaqa.sessions
    ?.filter((s) => s.status === "SCHEDULED")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  const completedSessions = halaqa.sessions
    ?.filter((s) => s.status === "COMPLETED")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/student/halaqas">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{halaqa.title}</h2>
            <p className="text-muted-foreground">with {halaqa.teacher.name}</p>
          </div>
        </div>
        
        {liveSession && isEnrolled && (
          <Button 
            size="lg" 
            className="gap-2 bg-red-600 hover:bg-red-700 animate-pulse"
            onClick={handleJoinLiveSession}
          >
            <Video className="h-5 w-5" />
            Join Live Session
          </Button>
        )}
        
        {!isEnrolled && halaqa.type === "GENERAL" && (
          <Button 
            size="lg" 
            className="gap-2"
            onClick={handleEnroll}
          >
            <Users className="h-5 w-5" />
            Join Halaqa
          </Button>
        )}
      </div>

      {/* Live Session Alert */}
      {liveSession && isEnrolled && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-600 animate-pulse" />
              <CardTitle className="text-red-900">Session is Live Now!</CardTitle>
            </div>
            <CardDescription className="text-red-700">
              Your teacher has started the session. Click the button above to join.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Enrollment Status */}
      {!isEnrolled && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Join this Halaqa</CardTitle>
            <CardDescription className="text-blue-700">
              {halaqa.type === "GENERAL" 
                ? "This is a general halaqa. You can join directly by clicking the button above."
                : "This is a private halaqa. You need to request to join from the teacher."
              }
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About this Halaqa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {halaqa.description || "No description available"}
              </p>
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingSessions && upcomingSessions.length > 0 ? (
                <div className="space-y-3">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {format(new Date(session.date), "PPP")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(session.date), "p")}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">Scheduled</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No upcoming sessions scheduled yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Completed Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {completedSessions && completedSessions.length > 0 ? (
                <div className="space-y-2">
                  {completedSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            {format(new Date(session.date), "PPP")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(session.date), "p")}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        Completed
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No completed sessions yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Halaqa Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {halaqa.type.toLowerCase()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Academy</p>
                  <p className="text-sm text-muted-foreground">
                    {halaqa.academy.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Students Enrolled</p>
                  <p className="text-sm text-muted-foreground">
                    {halaqa.enrollments?.length || 0} students
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Total Sessions</p>
                  <p className="text-sm text-muted-foreground">
                    {halaqa.sessions?.length || 0} sessions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teacher Card */}
          <Card>
            <CardHeader>
              <CardTitle>Teacher</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">
                    {halaqa.teacher.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{halaqa.teacher.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {halaqa.teacher.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
