"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Trash2, Users, Calendar } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ManageHalaqaPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [halaqa, setHalaqa] = useState<any>(null)
  const [halaqaId, setHalaqaId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "GENERAL",
  })

  useEffect(() => {
    params.then(p => {
      setHalaqaId(p.id)
    })
  }, [])

  useEffect(() => {
    if (halaqaId) {
      loadHalaqa()
    }
  }, [halaqaId])

  const loadHalaqa = async () => {
    if (!halaqaId) return
    
    try {
      const response = await fetchWithAuth(`/halaqas/${halaqaId}`)
      if (response.ok) {
        const data = await response.json()
        setHalaqa(data)
        setFormData({
          title: data.title || "",
          description: data.description || "",
          type: data.type || "GENERAL",
        })
      } else {
        toast.error("Failed to load halaqa")
      }
    } catch (error) {
      console.error("Failed to load halaqa:", error)
      toast.error("Failed to load halaqa")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!halaqaId) return
    
    setSaving(true)
    try {
      const response = await fetchWithAuth(`/halaqas/${halaqaId}`, {
        method: "PATCH",
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("Halaqa updated successfully!")
        loadHalaqa()
      } else {
        toast.error("Failed to update halaqa")
      }
    } catch (error) {
      console.error("Failed to update halaqa:", error)
      toast.error("Failed to update halaqa")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!halaqaId) return
    
    if (!confirm("Are you sure you want to delete this halaqa? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetchWithAuth(`/halaqas/${halaqaId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Halaqa deleted successfully!")
        router.push("/teacher/halaqas")
      } else {
        toast.error("Failed to delete halaqa")
      }
    } catch (error) {
      console.error("Failed to delete halaqa:", error)
      toast.error("Failed to delete halaqa")
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/teacher/halaqas">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold">Loading...</h2>
        </div>
      </div>
    )
  }

  if (!halaqa) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/teacher/halaqas">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold">Halaqa not found</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/teacher/halaqas">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold">Manage Halaqa</h2>
            <p className="text-muted-foreground">Edit halaqa details and settings</p>
          </div>
        </div>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Halaqa
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Halaqa Information</CardTitle>
            <CardDescription>Update the basic details of your halaqa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Halaqa title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the focus and goals..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GENERAL">General</SelectItem>
                  <SelectItem value="PRIVATE">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} disabled={saving || !formData.title}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-2xl font-bold">{halaqa.enrollments?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Enrolled Students</p>
              </div>
              <div>
                <div className="text-2xl font-bold">{halaqa.sessions?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Total Sessions</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline" asChild>
                <Link href={halaqaId ? `/teacher/halaqas/${halaqaId}/students` : "#"}>
                  <Users className="h-4 w-4 mr-2" />
                  View Students
                </Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link href={halaqaId ? `/teacher/halaqas/${halaqaId}/sessions` : "#"}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Sessions
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
