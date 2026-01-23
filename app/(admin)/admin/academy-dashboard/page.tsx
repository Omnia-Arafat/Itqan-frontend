"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Building, 
  Users, 
  BookOpen, 
  Settings, 
  Mail, 
  UserPlus, 
  BarChart3,
  Eye,
  EyeOff,
  Save,
  Plus
} from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { toast } from "sonner"

interface Academy {
  id: string
  name: string
  description?: string
  status: string
  visibility: string
  contactEmail?: string
  contactPhone?: string
  websiteUrl?: string
  logoUrl?: string
  establishedYear?: number
  _count: {
    userRoles: number
    halaqas: number
  }
  settings?: {
    enrollmentPolicy: string
    maxStudents?: number
    maxTeachers?: number
    allowPublicHalaqas: boolean
    requireApprovalForHalaqas: boolean
  }
}

export default function AcademyDashboardPage() {
  const [academy, setAcademy] = useState<Academy | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [invitations, setInvitations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [inviteDialog, setInviteDialog] = useState(false)
  const [inviteEmails, setInviteEmails] = useState("")
  const [inviteRole, setInviteRole] = useState("STUDENT")
  const [inviting, setInviting] = useState(false)

  // Form states for academy profile
  const [profileForm, setProfileForm] = useState({
    name: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
    websiteUrl: "",
    establishedYear: ""
  })

  // Form states for academy settings
  const [settingsForm, setSettingsForm] = useState({
    enrollmentPolicy: "OPEN",
    maxStudents: "",
    maxTeachers: "",
    allowPublicHalaqas: true,
    requireApprovalForHalaqas: false,
    visibility: "PUBLIC"
  })

  useEffect(() => {
    loadAcademyData()
  }, [])

  const loadAcademyData = async () => {
    try {
      // Get user's academy (assuming user is academy admin)
      const userResponse = await fetchWithAuth("/auth/profile")
      if (!userResponse.ok) throw new Error("Failed to get user profile")
      
      const userData = await userResponse.json()
      
      // Get user's academies
      const academiesResponse = await fetchWithAuth("/academies/user")
      if (!academiesResponse.ok) throw new Error("Failed to get user academies")
      
      const userAcademies = await academiesResponse.json()
      const adminAcademy = userAcademies.find((a: any) => a.userRole === 'ADMIN')
      
      if (!adminAcademy) {
        toast.error("You don't have admin access to any academy")
        return
      }

      // Get detailed academy info
      const academyResponse = await fetchWithAuth(`/academies/${adminAcademy.id}?details=true`)
      if (!academyResponse.ok) throw new Error("Failed to get academy details")
      
      const academyData = await academyResponse.json()
      setAcademy(academyData)

      // Set form data
      setProfileForm({
        name: academyData.name || "",
        description: academyData.description || "",
        contactEmail: academyData.contactEmail || "",
        contactPhone: academyData.contactPhone || "",
        websiteUrl: academyData.websiteUrl || "",
        establishedYear: academyData.establishedYear?.toString() || ""
      })

      setSettingsForm({
        enrollmentPolicy: academyData.settings?.enrollmentPolicy || "OPEN",
        maxStudents: academyData.settings?.maxStudents?.toString() || "",
        maxTeachers: academyData.settings?.maxTeachers?.toString() || "",
        allowPublicHalaqas: academyData.settings?.allowPublicHalaqas ?? true,
        requireApprovalForHalaqas: academyData.settings?.requireApprovalForHalaqas ?? false,
        visibility: academyData.visibility || "PUBLIC"
      })

      // Load users and invitations
      await Promise.all([
        loadAcademyUsers(academyData.id),
        loadAcademyInvitations(academyData.id)
      ])

    } catch (error) {
      console.error("Failed to load academy data:", error)
      toast.error("Failed to load academy data")
    } finally {
      setLoading(false)
    }
  }

  const loadAcademyUsers = async (academyId: string) => {
    try {
      const response = await fetchWithAuth(`/academies/${academyId}/users`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Failed to load users:", error)
    }
  }

  const loadAcademyInvitations = async (academyId: string) => {
    try {
      const response = await fetchWithAuth(`/academy-invitations?academyId=${academyId}`)
      if (response.ok) {
        const data = await response.json()
        setInvitations(data)
      }
    } catch (error) {
      console.error("Failed to load invitations:", error)
    }
  }

  const handleSaveProfile = async () => {
    if (!academy) return

    setSaving(true)
    try {
      const updateData = {
        ...profileForm,
        establishedYear: profileForm.establishedYear ? parseInt(profileForm.establishedYear) : null
      }

      const response = await fetchWithAuth(`/academies/${academy.id}`, {
        method: "PATCH",
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        toast.success("Academy profile updated successfully")
        loadAcademyData()
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      console.error("Failed to save profile:", error)
      toast.error("Failed to update academy profile")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSettings = async () => {
    if (!academy) return

    setSaving(true)
    try {
      const updateData = {
        ...settingsForm,
        maxStudents: settingsForm.maxStudents ? parseInt(settingsForm.maxStudents) : null,
        maxTeachers: settingsForm.maxTeachers ? parseInt(settingsForm.maxTeachers) : null
      }

      // Update academy visibility
      await fetchWithAuth(`/academies/${academy.id}`, {
        method: "PATCH",
        body: JSON.stringify({ visibility: settingsForm.visibility })
      })

      // Update academy settings
      const response = await fetchWithAuth(`/academies/${academy.id}/settings`, {
        method: "PATCH",
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        toast.success("Academy settings updated successfully")
        loadAcademyData()
      } else {
        throw new Error("Failed to update settings")
      }
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast.error("Failed to update academy settings")
    } finally {
      setSaving(false)
    }
  }

  const handleSendInvitations = async () => {
    if (!academy || !inviteEmails.trim()) return

    setInviting(true)
    try {
      const emails = inviteEmails
        .split(/[,\n]/)
        .map(email => email.trim())
        .filter(email => email.length > 0)

      const response = await fetchWithAuth("/academy-invitations", {
        method: "POST",
        body: JSON.stringify({
          academyId: academy.id,
          emails,
          role: inviteRole
        })
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(`Sent ${data.length} invitations successfully`)
        setInviteDialog(false)
        setInviteEmails("")
        loadAcademyInvitations(academy.id)
      } else {
        throw new Error("Failed to send invitations")
      }
    } catch (error) {
      console.error("Failed to send invitations:", error)
      toast.error("Failed to send invitations")
    } finally {
      setInviting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading academy dashboard...</p>
        </div>
      </div>
    )
  }

  if (!academy) {
    return (
      <div className="text-center py-12">
        <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Academy Access</h2>
        <p className="text-muted-foreground">You don't have admin access to any academy.</p>
      </div>
    )
  }

  const students = users.filter(u => u.role === 'STUDENT')
  const teachers = users.filter(u => u.role === 'TEACHER')
  const pendingInvitations = invitations.filter(i => i.status === 'PENDING')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">
              {academy.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{academy.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={academy.status === 'ACTIVE' ? 'default' : 'secondary'}>
                {academy.status}
              </Badge>
              <Badge variant={academy.visibility === 'PUBLIC' ? 'default' : 'outline'}>
                {academy.visibility === 'PUBLIC' ? (
                  <><Eye className="h-3 w-3 mr-1" /> Public</>
                ) : (
                  <><EyeOff className="h-3 w-3 mr-1" /> Private</>
                )}
              </Badge>
            </div>
          </div>
        </div>
        <Dialog open={inviteDialog} onOpenChange={setInviteDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Users
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Users to {academy.name}</DialogTitle>
              <DialogDescription>
                Send invitations to join your academy as students or teachers
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="TEACHER">Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emails">Email Addresses</Label>
                <Textarea
                  id="emails"
                  placeholder="Enter email addresses (one per line or comma-separated)"
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendInvitations} disabled={inviting || !inviteEmails.trim()}>
                {inviting ? "Sending..." : "Send Invitations"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{students.length}</p>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{teachers.length}</p>
                <p className="text-sm text-muted-foreground">Teachers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{academy._count.halaqas}</p>
                <p className="text-sm text-muted-foreground">Halaqas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <Mail className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{pendingInvitations.length}</p>
                <p className="text-sm text-muted-foreground">Pending Invites</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
          <TabsTrigger value="invitations">Invitations ({invitations.length})</TabsTrigger>
          <TabsTrigger value="profile">Academy Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Activity tracking coming soon...</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Halaqa
                </Button>
                <Button className="w-full justify-start" variant="outline" onClick={() => setInviteDialog(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Users
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4">
            {users.map((user) => (
              <Card key={user.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {user.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.role === 'ADMIN' ? 'default' : 'outline'}>
                        {user.role}
                      </Badge>
                      <Badge variant={user.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          <div className="grid gap-4">
            {invitations.map((invitation) => (
              <Card key={invitation.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{invitation.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Invited as {invitation.role} • {new Date(invitation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={
                      invitation.status === 'PENDING' ? 'default' :
                      invitation.status === 'ACCEPTED' ? 'default' : 'secondary'
                    }>
                      {invitation.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Academy Profile</CardTitle>
              <CardDescription>
                Update your academy's public information and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Academy Name</Label>
                  <Input
                    id="name"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="establishedYear">Established Year</Label>
                  <Input
                    id="establishedYear"
                    type="number"
                    value={profileForm.establishedYear}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, establishedYear: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={profileForm.description}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={profileForm.contactEmail}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={profileForm.contactPhone}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={profileForm.websiteUrl}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, websiteUrl: e.target.value }))}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Academy Settings</CardTitle>
              <CardDescription>
                Configure enrollment policies and academy preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="visibility">Academy Visibility</Label>
                  <Select value={settingsForm.visibility} onValueChange={(value) => setSettingsForm(prev => ({ ...prev, visibility: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLIC">Public - Visible in directory</SelectItem>
                      <SelectItem value="PRIVATE">Private - Invitation only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enrollmentPolicy">Enrollment Policy</Label>
                  <Select value={settingsForm.enrollmentPolicy} onValueChange={(value) => setSettingsForm(prev => ({ ...prev, enrollmentPolicy: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">Open - Anyone can join</SelectItem>
                      <SelectItem value="APPROVAL_REQUIRED">Approval Required</SelectItem>
                      <SelectItem value="INVITATION_ONLY">Invitation Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxStudents">Maximum Students</Label>
                    <Input
                      id="maxStudents"
                      type="number"
                      placeholder="No limit"
                      value={settingsForm.maxStudents}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, maxStudents: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxTeachers">Maximum Teachers</Label>
                    <Input
                      id="maxTeachers"
                      type="number"
                      placeholder="No limit"
                      value={settingsForm.maxTeachers}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, maxTeachers: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="allowPublicHalaqas"
                      checked={settingsForm.allowPublicHalaqas}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, allowPublicHalaqas: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="allowPublicHalaqas">Allow public halaqas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="requireApprovalForHalaqas"
                      checked={settingsForm.requireApprovalForHalaqas}
                      onChange={(e) => setSettingsForm(prev => ({ ...prev, requireApprovalForHalaqas: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="requireApprovalForHalaqas">Require approval for new halaqas</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={saving}>
                <Settings className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}