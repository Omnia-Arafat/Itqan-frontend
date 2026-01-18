"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, FileText, Video } from "lucide-react"
import Link from "next/link"

export default function HalaqaDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Surah Al-Baqarah Hifz</h2>
            <p className="text-muted-foreground">Sheikh Ahmed Al-Masri • Mon, Wed, Fri</p>
        </div>
        <Button size="lg">
            <Video className="mr-2 h-4 w-4" />
            Join Live Session
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                <div className="space-y-1">
                                    <p className="font-medium">Session {i}: Verses {i*10}-{(i*10)+10}</p>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar className="mr-2 h-3 w-3" />
                                        <span>Dec {10+i}, 2024</span>
                                        <Clock className="ml-4 mr-2 h-3 w-3" />
                                        <span>5:00 PM</span>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/dashboard/session/${i}`}>View Details</Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>My Notes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="p-3 bg-slate-50 rounded-lg text-sm">
                            <p className="font-medium mb-1">Last Session</p>
                            <p className="text-muted-foreground">Focus on Makharij of letter 'Qaf'.</p>
                        </div>
                        <Button variant="ghost" className="w-full text-primary">
                            <FileText className="mr-2 h-4 w-4" />
                            View All Notes
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
