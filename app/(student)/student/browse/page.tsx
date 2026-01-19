"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, Users, UserPlus } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { toast } from "sonner"

interface Teacher {
  id: string
  name: string
  email: string
  teachingHalaqas: Halaqa[]
}

interface Halaqa {
  id: string
  title: string
  description?: string
  type: string
  teacher: {
    id: string
    name: string
  }
  enrollments?: any[]
}

export default function BrowsePage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [halaqas, setHalaqas] = useState<Halaqa[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [requestDialog, setRequestDialog] = useState(false)
  const [requestType, setRequestType] = useState<"SPECIFIC_TEACHER" | "SPECIFIC_HALAQA" | "ANY_TEACHER">("SPECIFIC_HALAQA")
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null)
  const [selectedHalaqaId, setSelectedHalaqaId] = useState<string | null>(null)
  const [requestMessage, setRequestMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [teachersRes, halaqasRes] = await Promise.all([
        fetchWithAuth("/users?role=TEACHER"),
        fetchWithAuth("/halaqas"),
      ])

      if (teachersRes.ok) {
        const teachersData = await teachersRes.json()
        setTeachers(teachersData)
      }

      if (halaqasRes.ok) {
        const halaqasData = await halaqasRes.json()
        setHalaqas(halaqasData)
      }
    } catch (error) {
      console.error("Failed to load data:", error)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const openRequestDialog = (type: typeof requestType, teacherId?: string, halaqaId?: string) => {
    setRequestType(type)
    setSelectedTeacherId(teacherId || null)
    setSelectedHalaqaId(halaqaId || null)
    setRequestMessage("")
    setRequestDialog(true)
  }

  const handleSubmitRequest = async () => {
    setSubmitting(true)
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")

      const requestData = {
        studentId: user.id,
        type: requestType,
        message: requestMessage,
        ...(selectedTeacherId && { teacherId: selectedTeacherId }),
        ...(selectedHalaqaId && { halaqaId: selectedHalaqaId }),
      }

      const response = await fetchWithAuth("/join-requests", {
        method: "POST",
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        toast.success("Request submitted successfully!")
        setRequestDialog(false)
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to submit request")
      }
    } catch (error) {
      console.error("Failed to submit request:", error)
      toast.error("Failed to submit request")
    } finally {
      setSubmitting(false)
    }
  }

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredHalaqas = halaqas.filter(
    (halaqa) =>
      halaqa.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      halaqa.teacher?.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Browse & Join</h2>
          <p className="text-muted-foreground">Find teachers and halaqas to join your Quran learning journey</p>
        </div>
        <Button onClick={() => openRequestDialog("ANY_TEACHER")}>
          <UserPlus className="h-4 w-4 mr-2" />
          Request Any Teacher
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search teachers or halaqas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary-600" />
            Available Halaqas
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredHalaqas.map((halaqa) => (
              <Card key={halaqa.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{halaqa.title}</CardTitle>
                      <CardDescription className="mt-1">
                        Teacher: {halaqa.teacher?.name || "Unknown"}
                      </CardDescription>
                    </div>
                    <Badge variant={halaqa.type === "PRIVATE" ? "secondary" : "default"}>
                      {halaqa.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {halaqa.description || "No description available"}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{halaqa.enrollments?.length || 0} students</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => openRequestDialog("SPECIFIC_HALAQA", halaqa.teacher.id, halaqa.id)}
                  >
                    Request to Join
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          {filteredHalaqas.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No halaqas found matching your search.
            </div>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary-600" />
            Available Teachers
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {filteredTeachers.map((teacher) => (
              <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{teacher.name}</CardTitle>
                  <CardDescription>{teacher.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Teaching {teacher.teachingHalaqas?.length || 0} Halaqas:</p>
                    <div className="flex flex-wrap gap-2">
                      {teacher.teachingHalaqas?.map((halaqa) => (
                        <Badge key={halaqa.id} variant="outline">
                          {halaqa.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => openRequestDialog("SPECIFIC_TEACHER", teacher.id)}
                  >
                    Request This Teacher
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          {filteredTeachers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No teachers found matching your search.
            </div>
          )}
        </div>
      </div>

      <Dialog open={requestDialog} onOpenChange={setRequestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Join Request</DialogTitle>
            <DialogDescription>
              {requestType === "SPECIFIC_HALAQA" && "Request to join a specific halaqa"}
              {requestType === "SPECIFIC_TEACHER" && "Request to join any halaqa from this teacher"}
              {requestType === "ANY_TEACHER" && "Request assignment to any available teacher"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Tell the teacher about your goals and why you'd like to join..."
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitRequest} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
