"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import LiveHalaqa to avoid SSR issues with Jitsi
const LiveHalaqa = dynamic(() => import("@/components/live-halaqa"), { ssr: false })
const FloatingMushaf = dynamic(() => import("@/components/floating-mushaf"), { ssr: false })

export default function SessionDetailsPage({ params }: { params: { id: string } }) {
  return (
    <>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Session Details</h2>
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
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
                <CardHeader className="bg-slate-950 text-white">
                    <CardTitle>Live Classroom</CardTitle>
                </CardHeader>
                <CardContent className="p-0 aspect-video bg-slate-900">
                    <LiveHalaqa 
                        roomName={`itqan-session-${params.id}`} 
                        displayName="Student Name" 
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
                        <span className="text-sm font-medium">Teacher</span>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <User className="mr-2 h-4 w-4" />
                            Sheikh Ahmed
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Topic</span>
                        <span className="text-sm text-muted-foreground">Surah Al-Baqarah (1-10)</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>My Remarks</CardTitle>
                </CardHeader>
                <CardContent>
                    <textarea 
                        className="w-full min-h-[150px] p-3 rounded-md border text-sm"
                        placeholder="Write your notes here..."
                    />
                    <Button className="w-full mt-4">Save Notes</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
    <FloatingMushaf isOpen={false} onClose={() => {}} />
    </>
  )
}
