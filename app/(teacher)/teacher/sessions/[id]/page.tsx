"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Users } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import LiveHalaqa to avoid SSR issues with Jitsi
const LiveHalaqa = dynamic(() => import("@/components/live-halaqa"), { ssr: false })

export default function TeacherSessionPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Class Session</h2>
            <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Dec 12, 2024</span>
                </div>
                <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>5:00 PM - 6:30 PM</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Live Now</Badge>
            </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">End Session</Button>
            <Button>Manage Students</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
                <CardHeader className="bg-slate-950 text-white">
                    <CardTitle>Live Classroom (Teacher View)</CardTitle>
                </CardHeader>
                <CardContent className="p-0 aspect-video bg-slate-900">
                    <LiveHalaqa 
                        roomName={`itqan-session-${params.id}`} 
                        displayName="Sheikh Ahmed" 
                    />
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Session Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Group</span>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="mr-2 h-4 w-4" />
                            Surah Al-Baqarah Group
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Topic</span>
                        <span className="text-sm text-muted-foreground">Surah Al-Baqarah (1-10)</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Attendance</span>
                        <span className="text-sm text-muted-foreground">12/15 Present</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        Verify Student Recitation
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                        <Clock className="mr-2 h-4 w-4" />
                        Extend Session Time
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
