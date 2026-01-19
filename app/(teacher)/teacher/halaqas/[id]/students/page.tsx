"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Mail, Trash2 } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { toast } from "sonner"
import Link from "next/link"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"

interface Student {
  id: string
  user: {
    id: string
    name: string
    email: string
  }
  status: string
  createdAt: string
}

export default function HalaqaStudentsPage({ params }: { params: Promise<{ id: string }> }) {
  const [students, setStudents] = useState<Student[]>([])
  const [halaqa, setHalaqa] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [halaqaId, setHalaqaId] = useState<string | null>(null)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

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
      const [halaqaRes, enrollmentsRes] = await Promise.all([
        fetchWithAuth(`/halaqas/${halaqaId}`),
        fetchWithAuth(`/enrollments?halaqaId=${halaqaId}`),
      ])

      if (halaqaRes.ok) {
        const halaqaData = await halaqaRes.json()
        setHalaqa(halaqaData)
      }

      if (enrollmentsRes.ok) {
        const enrollmentsData = await enrollmentsRes.json()
        setStudents(enrollmentsData)
      }
    } catch (error) {
      console.error("Failed to load data:", error)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveStudent = async () => {
    if (!selectedStudent) return

    try {
      const response = await fetchWithAuth(`/enrollments/${selectedStudent.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Student removed successfully")
        loadData()
      } else {
        toast.error("Failed to remove student")
      }
    } catch (error) {
      console.error("Failed to remove student:", error)
      toast.error("Failed to remove student")
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={halaqaId ? `/teacher/halaqas/${halaqaId}` : "/teacher/halaqas"}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold">Students</h2>
          <p className="text-muted-foreground">{halaqa?.title || "Halaqa"}</p>
        </div>
      </div>

      {students.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No students enrolled yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {students.map((enrollment) => (
            <Card key={enrollment.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{enrollment.user.name}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {enrollment.user.email}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">{enrollment.status}</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setSelectedStudent(enrollment)
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
        title="Remove Student"
        description="Are you sure you want to remove this student from the halaqa?"
        itemName={selectedStudent?.user.name}
        onConfirm={handleRemoveStudent}
      />
    </div>
  )
}
