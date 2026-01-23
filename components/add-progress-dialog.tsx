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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchWithAuth } from "@/lib/api"
import { toast } from "sonner"

interface AddProgressDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddProgressDialog({ open, onClose, onSuccess }: AddProgressDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    surah: "",
    juz: "",
    page: "",
    status: "MEMORIZED",
    notes: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      
      const response = await fetchWithAuth(`/users/${user.id}/progress`, {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          juz: parseInt(formData.juz),
          page: parseInt(formData.page),
        }),
      })

      if (response.ok) {
        toast.success("Progress added successfully!")
        setFormData({
          surah: "",
          juz: "",
          page: "",
          status: "MEMORIZED",
          notes: ""
        })
        onSuccess()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to add progress")
      }
    } catch (error) {
      console.error("Failed to add progress:", error)
      toast.error("Failed to add progress")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Progress Record</DialogTitle>
            <DialogDescription>
              Record your Quran memorization or review progress
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="surah">Surah Name *</Label>
              <Input
                id="surah"
                placeholder="e.g., Al-Mulk"
                value={formData.surah}
                onChange={(e) => setFormData({ ...formData, surah: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="juz">Juz *</Label>
                <Input
                  id="juz"
                  type="number"
                  min="1"
                  max="30"
                  placeholder="1-30"
                  value={formData.juz}
                  onChange={(e) => setFormData({ ...formData, juz: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="page">Page *</Label>
                <Input
                  id="page"
                  type="number"
                  min="1"
                  max="604"
                  placeholder="1-604"
                  value={formData.page}
                  onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEMORIZED">Memorized</SelectItem>
                  <SelectItem value="REVIEWING">Reviewing</SelectItem>
                  <SelectItem value="WEAK">Needs Work</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this progress..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Progress"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
