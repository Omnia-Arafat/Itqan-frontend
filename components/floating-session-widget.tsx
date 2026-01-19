"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, X, Maximize2 } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

interface FloatingSessionWidgetProps {
  sessionId: string
  sessionTitle: string
  isLive: boolean
}

export default function FloatingSessionWidget({ sessionId, sessionTitle, isLive }: FloatingSessionWidgetProps) {
  const [visible, setVisible] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Show widget only when NOT on the session page
    const isOnSessionPage = pathname?.includes(`/session/${sessionId}`)
    setVisible(isLive && !isOnSessionPage)

    // Store active session in localStorage
    if (isLive) {
      localStorage.setItem('activeSession', JSON.stringify({
        sessionId,
        sessionTitle,
        timestamp: Date.now()
      }))
    }
  }, [pathname, sessionId, isLive])

  const handleClose = () => {
    setVisible(false)
    localStorage.removeItem('activeSession')
  }

  const handleMaximize = () => {
    router.push(`/teacher/session/${sessionId}`)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5">
      <Card className="w-80 shadow-2xl border-2 border-primary-600 bg-white">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Video className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">{sessionTitle}</p>
                <Badge className="bg-green-500 text-white text-xs animate-pulse">● LIVE</Badge>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Button 
              onClick={handleMaximize}
              className="w-full"
              size="sm"
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              Return to Session
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Your live session is still active
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
