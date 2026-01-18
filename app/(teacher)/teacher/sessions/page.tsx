"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Play, Users } from "lucide-react"
import Link from "next/link"

export default function TeacherSessionsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Class Sessions</h2>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
            <Card key={i}>
                <CardContent className="flex items-center justify-between p-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">Surah Al-Baqarah Group {i}</h3>
                            {i === 1 && <Badge className="bg-green-500">Live Now</Badge>}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground gap-4">
                            <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4" />
                                <span>Dec 12, 2024</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4" />
                                <span>5:00 PM - 6:30 PM</span>
                            </div>
                            <div className="flex items-center">
                                <Users className="mr-2 h-4 w-4" />
                                <span>12/15 Attending</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">Attendance</Button>
                        <Button className={i === 1 ? "bg-red-600 hover:bg-red-700" : ""}>
                            {i === 1 ? (
                                <>
                                    <Play className="mr-2 h-4 w-4" />
                                    Join Session
                                </>
                            ) : (
                                "Start Session"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  )
}
