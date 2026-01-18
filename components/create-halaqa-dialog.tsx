"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { fetchWithAuth } from "@/lib/api"

interface CreateHalaqaDialogProps {
  onSuccess?: () => void
}

export default function CreateHalaqaDialog({ onSuccess }: CreateHalaqaDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "GENERAL",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      
      // Get teacher's academy (or use first academy for now)
      const academiesRes = await fetchWithAuth("/academies")
      const academies = await academiesRes.json()
      const academyId = academies[0]?.id

      if (!academyId) {
        toast.error("No academy found. Please contact admin.")
        return
      }

      const response = await fetchWithAuth("/halaqas", {
        method: "POST",
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          type: formData.type,
          teacherId: user.id,
          academyId: academyId,
        }),
      })

      if (response.ok) {
        toast.success("Halaqa created successfully!")
        setOpen(false)
        setFormData({ title: "", description: "", type: "GENERAL" })
        onSuccess?.()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to create halaqa")
      }
    } catch (error) {
      console.error("Failed to create halaqa:", error)
      toast.error("Failed to create halaqa")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Halaqa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Halaqa</DialogTitle>
            <DialogDescription>
              Create a new Quran study group for your students.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Surah Al-Baqarah Hifz"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the focus and goals of this halaqa..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.title}>
              {loading ? "Creating..." : "Create Halaqa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
