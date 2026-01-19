"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, Clock, Users, BookOpen, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { fetchWithAuth } from "@/lib/api"
import { toast } from "sonner"

export default function TeacherDashboard() {
  const [sessions, setSessions] = useState<any[]>([])
  const [halaqas, setHalaqas] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([])
  const [recentProgress, setRecentProgress] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}")
        
        const [sessionsRes, halaqasRes, requestsRes] = await Promise.all([
          fetchWithAuth("/sessions"),
          fetchWithAuth(`/halaqas?teacherId=${user.id}`),
          fetchWithAuth(`/join-requests?role=TEACHER&userId=${user.id}`)
        ])
        
        if (sessionsRes.ok) {
          const allSessions = await sessionsRes.json()
          // Filter sessions for teacher's halaqas
          setSessions(allSessions)
        }
        if (halaqasRes.ok) setHalaqas(await halaqasRes.json())
        if (requestsRes.ok) setRequests(await requestsRes.json())
      } catch (error) {
        console.error("Failed to load dashboard data", error)
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const todaySessions = sessions.filter(s => {
    const sessionDate = new Date(s.date)
    return sessionDate >= today && sessionDate < tomorrow && s.status === "SCHEDULED"
  })

  const upcomingSessions = sessions
    .filter(s => new Date(s.date) >= today && s.status === "SCHEDULED")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  const pendingRequests = requests.filter(r => r.status === "PENDING")

  const totalStudents = halaqas.reduce((sum, h) => sum + (h.enrollments?.length || 0), 0)

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here's your overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Sessions</CardTitle>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{todaySessions.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Scheduled sessions</p>
            </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-green-600" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{halaqas.length}</div>
                <p className="text-xs text-muted-foreground mt-1">{totalStudents} total students</p>
            </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{pendingRequests.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <Link href="/teacher/requests" className="hover:underline">
                    Review requests →
                  </Link>
                </p>
            </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{totalStudents}</div>
                <p className="text-xs text-muted-foreground mt-1">Across all halaqas</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary-600" />
                  Upcoming Sessions
                </CardTitle>
                <CardDescription>Your scheduled teaching sessions</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {upcomingSessions.length > 0 ? upcomingSessions.map((session) => {
                      const sessionDate = new Date(session.date)
                      const isToday = sessionDate >= today && sessionDate < tomorrow
                      
                      return (
                        <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                  <Calendar className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-medium">{session.halaqa?.title || "Session"}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {sessionDate.toLocaleDateString()} at {sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                            {isToday && (
                              <Badge className="bg-blue-100 text-blue-800">Today</Badge>
                            )}
                        </div>
                      )
                    }) : (
                        <p className="text-muted-foreground text-sm text-center py-8">No upcoming sessions scheduled.</p>
                    )}
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/teacher/halaqas">Manage Sessions</Link>
                  </Button>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary-600" />
                  Pending Requests
                </CardTitle>
                <CardDescription>Students wanting to join your halaqas</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {pendingRequests.length > 0 ? pendingRequests.slice(0, 3).map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <Users className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium">{request.student?.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {request.type === "SPECIFIC_HALAQA" ? request.halaqa?.title : "Wants to join"}
                                    </p>
                                </div>
                            </div>
                            <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                        </div>
                    )) : (
                        <p className="text-muted-foreground text-sm text-center py-8">No pending requests.</p>
                    )}
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/teacher/requests">View All Requests</Link>
                  </Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
