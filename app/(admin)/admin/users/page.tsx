"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, GraduationCap, Search, UserPlus, Trash2, BookOpen } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { toast } from "sonner"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"

interface User {
  id: string
  name: string
  email: string
  role: string
  academy?: {
    id: string
    name: string
  }
  enrollments?: Array<{
    id: string
    halaqa: {
      id: string
      title: string
    }
  }>
  teachingHalaqas?: Array<{
    id: string
    title: string
  }>
}

interface Halaqa {
  id: string
  title: string
  teacher: {
    name: string
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [halaqas, setHalaqas] = useState<Halaqa[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [assignDialog, setAssignDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedHalaqaId, setSelectedHalaqaId] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [usersRes, halaqasRes] = await Promise.all([
        fetchWithAuth("/users"),
        fetchWithAuth("/halaqas"),
      ])

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData)
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

  const handleAssignToHalaqa = async () => {
    if (!selectedUser || !selectedHalaqaId) return

    setSubmitting(true)
    try {
      const response = await fetchWithAuth(`/users/${selectedUser.id}/assign-halaqa`, {
        method: "POST",
        body: JSON.stringify({ halaqaId: selectedHalaqaId }),
      })

      if (response.ok) {
        toast.success("Student assigned to halaqa successfully!")
        setAssignDialog(false)
        setSelectedHalaqaId("")
        loadData()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to assign student")
      }
    } catch (error) {
      console.error("Failed to assign student:", error)
      toast.error("Failed to assign student")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      const response = await fetchWithAuth(`/users/${selectedUser.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("User deleted successfully")
        loadData()
      } else {
        toast.error("Failed to delete user")
      }
    } catch (error) {
      console.error("Failed to delete user:", error)
      toast.error("Failed to delete user")
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    if (activeTab === "students") return matchesSearch && user.role === "STUDENT"
    if (activeTab === "teachers") return matchesSearch && user.role === "TEACHER"
    return matchesSearch
  })

  const studentCount = users.filter(u => u.role === "STUDENT").length
  const teacherCount = users.filter(u => u.role === "TEACHER").length

  if (loading) {
    return <div className="text-center py-12">Loading users...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">Manage students and teachers in your academy</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            All Users ({users.length})
          </TabsTrigger>
          <TabsTrigger value="students">
            <Users className="h-4 w-4 mr-2" />
            Students ({studentCount})
          </TabsTrigger>
          <TabsTrigger value="teachers">
            <GraduationCap className="h-4 w-4 mr-2" />
            Teachers ({teacherCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No users found matching your search.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            user.role === "STUDENT" ? "bg-blue-100" : 
                            user.role === "TEACHER" ? "bg-green-100" : "bg-gray-100"
                          }`}>
                            {user.role === "STUDENT" ? (
                              <Users className="h-6 w-6 text-blue-600" />
                            ) : user.role === "TEACHER" ? (
                              <GraduationCap className="h-6 w-6 text-green-600" />
                            ) : (
                              <Users className="h-6 w-6 text-gray-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{user.name}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 items-center">
                          <Badge className={
                            user.role === "STUDENT" ? "bg-blue-100 text-blue-800" :
                            user.role === "TEACHER" ? "bg-green-100 text-green-800" :
                            "bg-gray-100 text-gray-800"
                          }>
                            {user.role}
                          </Badge>
                          {user.academy && (
                            <Badge variant="outline" className="text-xs">
                              📚 {user.academy.name}
                            </Badge>
                          )}
                        </div>

                        {user.role === "STUDENT" && user.enrollments && user.enrollments.length > 0 && (
                          <div className="mt-2 text-sm">
                            <p className="font-medium text-muted-foreground mb-1">Enrolled in:</p>
                            <div className="flex flex-wrap gap-2">
                              {user.enrollments.map((enrollment) => (
                                <Badge key={enrollment.id} variant="outline">
                                  {enrollment.halaqa.title}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {user.role === "TEACHER" && user.teachingHalaqas && user.teachingHalaqas.length > 0 && (
                          <div className="mt-2 text-sm">
                            <p className="font-medium text-muted-foreground mb-1">Teaching:</p>
                            <div className="flex flex-wrap gap-2">
                              {user.teachingHalaqas.map((halaqa) => (
                                <Badge key={halaqa.id} variant="outline">
                                  {halaqa.title}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {user.role === "STUDENT" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setAssignDialog(true)
                            }}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Assign
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            setSelectedUser(user)
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
        </TabsContent>
      </Tabs>

      {/* Assign to Halaqa Dialog */}
      <Dialog open={assignDialog} onOpenChange={setAssignDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Assign Student to Halaqa</DialogTitle>
            <DialogDescription>
              Select a halaqa to enroll {selectedUser?.name} in
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm font-medium">{selectedUser?.name}</p>
              <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="halaqa-select">Select Halaqa *</Label>
              <Select value={selectedHalaqaId} onValueChange={setSelectedHalaqaId}>
                <SelectTrigger id="halaqa-select">
                  <SelectValue placeholder="Choose a halaqa" />
                </SelectTrigger>
                <SelectContent>
                  {halaqas.map((halaqa) => (
                    <SelectItem key={halaqa.id} value={halaqa.id}>
                      <div className="flex flex-col">
                        <span>{halaqa.title}</span>
                        <span className="text-xs text-muted-foreground">
                          Teacher: {halaqa.teacher.name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAssignToHalaqa}
              disabled={submitting || !selectedHalaqaId}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? "Assigning..." : "Assign to Halaqa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        itemName={selectedUser?.name}
        onConfirm={handleDeleteUser}
      />
    </div>
  )
}
