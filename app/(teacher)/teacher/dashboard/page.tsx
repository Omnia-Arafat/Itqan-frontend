"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle, Clock, Users } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { fetchWithAuth } from "@/lib/api"

export default function TeacherDashboard() {
  const [sessions, setSessions] = useState<any[]>([])
  const [halaqas, setHalaqas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [sessionsRes, halaqasRes] = await Promise.all([
          fetchWithAuth("/sessions"),
          fetchWithAuth("/halaqas")
        ])
        
        if (sessionsRes.ok) setSessions(await sessionsRes.json())
        if (halaqasRes.ok) setHalaqas(await halaqasRes.json())
      } catch (error) {
        console.error("Failed to load dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Sessions</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{sessions.length}</div>
                <p className="text-xs text-muted-foreground">Scheduled sessions</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{halaqas.length}</div>
                <p className="text-xs text-muted-foreground">Active halaqas</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Hifz submissions</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {sessions.length > 0 ? sessions.slice(0, 3).map((session) => (
                        <div key={session.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                            <div>
                                <p className="font-medium">{session.halaqa?.name || "Session"}</p>
                                <p className="text-sm text-muted-foreground">{new Date(session.startTime).toLocaleTimeString()}</p>
                            </div>
                            <Button size="sm" asChild>
                                <Link href={`/teacher/sessions/${session.id}`}>Start</Link>
                            </Button>
                        </div>
                    )) : (
                        <p className="text-muted-foreground text-sm">No upcoming sessions.</p>
                    )}
                </div>
            </CardContent>
        </Card>
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Recent Student Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Ahmed Mohamed</p>
                            <p className="text-sm text-muted-foreground">Completed Surah Al-Mulk</p>
                        </div>
                        <span className="text-sm text-green-600 font-medium">Verified</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Omar Ali</p>
                            <p className="text-sm text-muted-foreground">Submitted recording</p>
                        </div>
                        <Button variant="outline" size="sm">Review</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
