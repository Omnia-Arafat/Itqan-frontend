"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

interface RouteGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userStr = localStorage.getItem("user")
        
        if (!userStr) {
          // No user logged in, redirect to login
          router.push("/")
          return
        }

        const user = JSON.parse(userStr)
        const userRole = user.role?.toUpperCase()

        if (!allowedRoles.includes(userRole)) {
          // User doesn't have permission, redirect to their dashboard
          if (userRole === "STUDENT") {
            router.push("/student/dashboard")
          } else if (userRole === "TEACHER") {
            router.push("/teacher/dashboard")
          } else if (userRole === "ADMIN") {
            router.push("/admin")
          } else {
            router.push("/")
          }
          return
        }

        // User is authorized
        setIsAuthorized(true)
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router, allowedRoles])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
