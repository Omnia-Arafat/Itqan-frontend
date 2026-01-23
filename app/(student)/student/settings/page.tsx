"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { fetchWithAuth } from "@/lib/api"
import { toast } from "sonner"
import { User, Lock, Save } from "lucide-react"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profileData, setProfileData] = useState({
    name: "",
    email: ""
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}")
      const response = await fetchWithAuth(`/users/${userData.id}`)
      if (response.ok) {
        const data = await response.json()
        setUser(data)
        setProfileData({
          name: data.name,
          email: data.email
        })
      }
    } catch (error) {
      console.error("Failed to load user data:", error)
      toast.error("Failed to load user data")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetchWithAuth(`/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify(profileData)
      })

      if (response.ok) {
        const updated = await response.json()
        // Update localStorage
        localStorage.setItem("user", JSON.stringify(updated))
        toast.success("Profile updated successfully!")
      } else {
        toast.error("Failed to update profile")
      }
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setSaving(true)

    try {
      // Note: You'll need to implement password change endpoint in backend
      toast.info("Password change functionality coming soon")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error) {
      console.error("Failed to change password:", error)
      toast.error("Failed to change password")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading settings...</div>
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary-600" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                placeholder="Your full name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <Input value={user?.role || ""} disabled className="bg-gray-50" />
            </div>
            <div className="grid gap-2">
              <Label>Academy</Label>
              <Input value={user?.academy?.name || "Not assigned"} disabled className="bg-gray-50" />
            </div>
            <Separator />
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary-600" />
            Change Password
          </CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Enter current password"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Enter new password"
                required
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setProfileData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
                required
              />
            </div>
            <Separator />
            <Button type="submit" disabled={saving}>
              <Lock className="h-4 w-4 mr-2" />
              {saving ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Member since:</span>
            <span className="font-medium">{new Date(user?.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Progress Records:</span>
            <span className="font-medium">{user?.progress?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Enrolled Halaqas:</span>
            <span className="font-medium">{user?.enrollments?.length || 0}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
