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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlayCircle } from "lucide-react"
import { toast } from "sonner"
import { fetchWithAuth } from "@/lib/api"

interface StartImmediateSessionDialogProps {
  halaqas: Array<{ id: string; title: string }>
  onSuccess?: () => void
}

export default function StartImmediateSessionDialog({ halaqas, onSuccess }: StartImmediateSessionDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedHalaqaId, setSelectedHalaqaId] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedHalaqaId) {
      toast.error("Please select a halaqa")
      return
    }

    setLoading(true)

    try {
      const now = new Date()
      
      const response = await fetchWithAuth("/sessions", {
        method: "POST",
        body: JSON.stringify({
          halaqaId: selectedHalaqaId,
          date: now.toISOString(),
          status: "LIVE",
        }),
      })

      if (response.ok) {
        const session = await response.json()
        toast.success("Live session started!")
        setOpen(false)
        setSelectedHalaqaId("")
        onSuccess?.()
        
        // Navigate to session management page
        window.location.href = `/teacher/halaqas/${selectedHalaqaId}/sessions`
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to start session")
      }
    } catch (error) {
      console.error("Failed to start session:", error)
      toast.error("Failed to start session")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <PlayCircle className="h-4 w-4 mr-2" />
          Start Live Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Start Immediate Session</DialogTitle>
            <DialogDescription>
              Start a live session right now. Select the halaqa you want to teach.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="halaqa">Select Halaqa *</Label>
              <Select
                value={selectedHalaqaId}
                onValueChange={setSelectedHalaqaId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a halaqa" />
                </SelectTrigger>
                <SelectContent>
                  {halaqas.map((halaqa) => (
                    <SelectItem key={halaqa.id} value={halaqa.id}>
                      {halaqa.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-md">
              <strong>Note:</strong> This will create a live session starting now. You'll be redirected to manage the session.
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !selectedHalaqaId}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? "Starting..." : "Start Session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
