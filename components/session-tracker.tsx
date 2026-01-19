"use client"

import { useEffect, useState } from "react"
import FloatingSessionWidget from "./floating-session-widget"
import { usePathname } from "next/navigation"

export default function SessionTracker() {
  const [activeSession, setActiveSession] = useState<{
    sessionId: string
    sessionTitle: string
    timestamp: number
  } | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    // Check for active session in localStorage
    const checkActiveSession = () => {
      const stored = localStorage.getItem('activeSession')
      if (stored) {
        try {
          const session = JSON.parse(stored)
          // Check if session is less than 4 hours old
          const fourHours = 4 * 60 * 60 * 1000
          if (Date.now() - session.timestamp < fourHours) {
            setActiveSession(session)
          } else {
            // Session expired, remove it
            localStorage.removeItem('activeSession')
            setActiveSession(null)
          }
        } catch (error) {
          console.error('Failed to parse active session', error)
          localStorage.removeItem('activeSession')
        }
      } else {
        setActiveSession(null)
      }
    }

    // Check on mount and whenever pathname changes
    checkActiveSession()

    // Poll every 5 seconds to detect changes
    const interval = setInterval(checkActiveSession, 5000)

    return () => clearInterval(interval)
  }, [pathname])

  if (!activeSession) return null

  return (
    <FloatingSessionWidget
      sessionId={activeSession.sessionId}
      sessionTitle={activeSession.sessionTitle}
      isLive={true}
    />
  )
}
