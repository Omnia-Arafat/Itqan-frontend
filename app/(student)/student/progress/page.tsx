"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { fetchWithAuth } from "@/lib/api"
import { toast } from "sonner"
import { BookOpen, Plus, TrendingUp } from "lucide-react"
import AddProgressDialog from "@/components/add-progress-dialog"

export default function ProgressPage() {
  const [progressRecords, setProgressRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    loadProgress()
  }, [])

  const loadProgress = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const response = await fetchWithAuth(`/users/${user.id}`)
      if (response.ok) {
        const userData = await response.json()
        setProgressRecords(userData.progress || [])
      }
    } catch (error) {
      console.error("Failed to load progress:", error)
      toast.error("Failed to load progress")
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats
  const totalPages = progressRecords.reduce((sum, p) => sum + 1, 0)
  const memorizedCount = progressRecords.filter(p => p.status === "MEMORIZED").length
  const reviewingCount = progressRecords.filter(p => p.status === "REVIEWING").length
  const weakCount = progressRecords.filter(p => p.status === "WEAK").length
  const progressPercent = (memorizedCount / 604) * 100 // 604 pages in Quran

  if (loading) {
    return <div className="text-center py-12">Loading progress...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Progress Tracker</h2>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Progress
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Memorized</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{memorizedCount}</div>
                <Progress value={progressPercent} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">{progressPercent.toFixed(1)}% of Quran</p>
            </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Reviewing</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{reviewingCount}</div>
                <p className="text-xs text-muted-foreground mt-2">Pages under review</p>
            </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Needs Work</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{weakCount}</div>
                <p className="text-xs text-muted-foreground mt-2">Pages marked weak</p>
            </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{totalPages}</div>
                <p className="text-xs text-muted-foreground mt-2">Progress entries</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary-600" />
            Progress History
          </CardTitle>
          <CardDescription>Your memorization and review records</CardDescription>
        </CardHeader>
        <CardContent>
          {progressRecords.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No progress records yet</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Progress
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {progressRecords.map((record: any) => (
                <div key={record.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{record.surah}</p>
                      <p className="text-sm text-muted-foreground">
                        Juz {record.juz} • Page {record.page}
                      </p>
                      {record.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{record.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={
                      record.status === "MEMORIZED" ? "bg-green-100 text-green-800" :
                      record.status === "REVIEWING" ? "bg-blue-100 text-blue-800" :
                      "bg-yellow-100 text-yellow-800"
                    }>
                      {record.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddProgressDialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        onSuccess={() => {
          setDialogOpen(false)
          loadProgress()
        }}
      />
    </div>
  )
}
