"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Video, VideoOff } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { toast } from "sonner"

interface StartLiveSessionButtonProps {
  halaqaId: string
  isLive?: boolean
  liveSessionId?: string
  onSessionUpdate?: () => void
}

export default function StartLiveSessionButton({ 
  halaqaId, 
  isLive = false, 
  liveSessionId,
  onSessionUpdate 
}: StartLiveSessionButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleStartSession = async () => {
    setLoading(true)
    try {
      const response = await fetchWithAuth(`/sessions/start-live/${halaqaId}`, {
        method: "POST",
      })

      if (response.ok) {
        toast.success("Live session started!")
        onSessionUpdate?.()
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

  const handleEndSession = async () => {
    if (!liveSessionId) return
    
    setLoading(true)
    try {
      const response = await fetchWithAuth(`/sessions/end-live/${liveSessionId}`, {
        method: "POST",
      })

      if (response.ok) {
        toast.success("Live session ended!")
        onSessionUpdate?.()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to end session")
      }
    } catch (error) {
      console.error("Failed to end session:", error)
      toast.error("Failed to end session")
    } finally {
      setLoading(false)
    }
  }

  if (isLive) {
    return (
      <Button 
        variant="destructive" 
        onClick={handleEndSession}
        disabled={loading}
        className="gap-2"
      >
        <VideoOff className="h-4 w-4" />
        {loading ? "Ending..." : "End Live Session"}
      </Button>
    )
  }

  return (
    <Button 
      onClick={handleStartSession}
      disabled={loading}
      className="gap-2 bg-red-600 hover:bg-red-700"
    >
      <Video className="h-4 w-4" />
      {loading ? "Starting..." : "Start Live Session"}
    </Button>
  )
}