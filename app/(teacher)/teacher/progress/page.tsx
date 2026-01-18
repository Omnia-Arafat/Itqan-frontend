"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, CheckCircle, XCircle } from "lucide-react"

export default function TeacherProgressPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Student Progress</h2>
        <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search student..." className="pl-8" />
        </div>
      </div>

      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
            <Card key={i}>
                <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                            AM
                        </div>
                        <div>
                            <p className="font-medium">Ahmed Mohamed</p>
                            <p className="text-sm text-muted-foreground">Surah Al-Mulk • Verses 1-30</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right mr-4">
                            <p className="text-sm font-medium">Submitted 2 hours ago</p>
                            <p className="text-xs text-muted-foreground">Audio Recording</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                            </Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Verify
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  )
}
