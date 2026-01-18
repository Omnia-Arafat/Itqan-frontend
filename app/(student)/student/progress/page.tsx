"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Progress Tracker</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Hifz</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">2 Juz</div>
                <Progress value={6.6} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">6.6% of Quran</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Tajweed Score</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">8.5 / 10</div>
                <p className="text-xs text-muted-foreground mt-2">Based on last 5 sessions</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">95%</div>
                <p className="text-xs text-muted-foreground mt-2">Missed 1 session this month</p>
            </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="hifz" className="space-y-4">
        <TabsList>
            <TabsTrigger value="hifz">Hifz Log</TabsTrigger>
            <TabsTrigger value="tajweed">Tajweed Mistakes</TabsTrigger>
        </TabsList>
        <TabsContent value="hifz" className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Memorization</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-4">
                            <div>
                                <p className="font-medium">Surah Al-Mulk</p>
                                <p className="text-sm text-muted-foreground">Verses 1-30</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-green-600">Completed</p>
                                <p className="text-sm text-muted-foreground">2 days ago</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-b pb-4">
                            <div>
                                <p className="font-medium">Surah Al-Qalam</p>
                                <p className="text-sm text-muted-foreground">Verses 1-15</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-yellow-600">In Progress</p>
                                <p className="text-sm text-muted-foreground">Started 5 days ago</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="tajweed">
            <Card>
                <CardHeader>
                    <CardTitle>Common Mistakes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-4">
                            <div>
                                <p className="font-medium">Ghunnah</p>
                                <p className="text-sm text-muted-foreground">Missed nasal sound in Noon Sakinah</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-red-600">3 times</p>
                                <p className="text-sm text-muted-foreground">Last session</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
