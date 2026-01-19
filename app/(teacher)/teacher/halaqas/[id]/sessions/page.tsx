"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, Edit, Trash2 } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { toast } from "sonner"
import Link from "next/link"
import CreateSessionDialog from "@/components/create-session-dialog"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"

interface Session {
  id: string
  date: string
  status: string
  createdAt: string
}

export default function HalaqaSessionsPage({ params }: { params: Promise<{ id: string }> }) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [halaqa, setHalaqa] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [halaqaId, setHalaqaId] = useState<string | null>(null)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)

  useEffect(() => {
    params.then(p => {
      setHalaqaId(p.id)
    })
  }, [])

  useEffect(() => {
    if (halaqaId) {
      loadData()
    }
  }, [halaqaId])

  const loadData = async () => {
    if (!halaqaId) return

    try {
      const [halaqaRes, sessionsRes] = await Promise.all([
        fetchWithAuth(`/halaqas/${halaqaId}`),
        fetchWithAuth(`/sessions?halaqaId=${halaqaId}`),
      ])

      if (halaqaRes.ok) {
        const halaqaData = await halaqaRes.json()
        setHalaqa(halaqaData)
      }

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json()
        setSessions(sessionsData)
      }
    } catch (error) {
      console.error("Failed to load data:", error)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (sessionId: string, newStatus: string) => {
    try {
      const response = await fetchWithAuth(`/sessions/${sessionId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success("Session status updated")
        loadData()
      } else {
        toast.error("Failed to update status")
      }
    } catch (error) {
      console.error("Failed to update status:", error)
      toast.error("Failed to update status")
    }
  }

  const handleDeleteSession = async () => {
    if (!selectedSession) return

    try {
      const response = await fetchWithAuth(`/sessions/${selectedSession.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Session deleted successfully")
        loadData()
      } else {
        toast.error("Failed to delete session")
      }
    } catch (error) {
      console.error("Failed to delete session:", error)
      toast.error("Failed to delete session")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
      case "LIVE":
        return <Badge className="bg-green-100 text-green-800">Live</Badge>
      case "COMPLETED":
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={halaqaId ? `/teacher/halaqas/${halaqaId}` : "/teacher/halaqas"}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold">Sessions</h2>
            <p className="text-muted-foreground">{halaqa?.title || "Halaqa"}</p>
          </div>
        </div>
        {halaqaId && <CreateSessionDialog halaqaId={halaqaId} onSuccess={loadData} />}
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No sessions scheduled yet.</p>
            <p className="text-sm text-muted-foreground mt-2">Click "Create Session" to schedule your first session!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <Card key={session.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {new Date(session.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.date).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={session.status}
                      onValueChange={(value) => handleStatusChange(session.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                        <SelectItem value="LIVE">Live</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setSelectedSession(session)
                        setDeleteDialog(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <DeleteConfirmationDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        title="Delete Session"
        description="Are you sure you want to delete this session?"
        itemName={selectedSession ? new Date(selectedSession.date).toLocaleDateString() : ""}
        onConfirm={handleDeleteSession}
      />
    </div>
  )
}
