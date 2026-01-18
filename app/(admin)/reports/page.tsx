"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Activity, Users, Clock } from "lucide-react"

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>

      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="progress">Student Progress</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>
        <TabsContent value="attendance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Attendance Rate</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">88%</div>
                        <p className="text-xs text-muted-foreground">+2% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                        <Video className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">450</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Session Duration</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">58m</div>
                        <p className="text-xs text-muted-foreground">Target: 60m</p>
                    </CardContent>
                </Card>
            </div>
            <Card className="h-[400px] flex items-center justify-center bg-slate-50 border-dashed">
                <div className="text-center text-muted-foreground">
                    <BarChart className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>Attendance Chart Visualization Placeholder</p>
                </div>
            </Card>
        </TabsContent>
        <TabsContent value="progress">
            <Card>
                <CardHeader>
                    <CardTitle>Hifz Completion Rates</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        <div className="flex items-center">
                            <div className="w-full space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Juz 30 (Amma)</span>
                                    <span className="text-sm text-muted-foreground">45% Completed</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[45%]" />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="w-full space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Juz 1 (Al-Baqarah)</span>
                                    <span className="text-sm text-muted-foreground">20% Completed</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[20%]" />
                                </div>
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

function Video(props: any) {
    return (
        <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        >
        <path d="m22 8-6 4 6 4V8Z" />
        <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
        </svg>
    )
}
