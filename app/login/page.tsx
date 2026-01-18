"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error("Invalid credentials")
      }

      const data = await response.json()
      console.log("Login response:", data)
      
      // Store token (in real app, use secure cookie or session)
      localStorage.setItem("token", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))

      toast.success("Login successful!")
      
      // Redirect based on role
      const role = data.user.role?.toUpperCase()
      console.log("Redirecting for role:", role)

      if (role === "STUDENT") {
        router.push("/student/dashboard")
      } else if (role === "TEACHER") {
        router.push("/teacher/dashboard")
      } else if (role === "ADMIN") {
        router.push("/admin/dashboard")
      } else {
        console.warn("Unknown role, redirecting to home")
        router.push("/")
      }

    } catch (error) {
      toast.error("Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
            backgroundImage: "url('/login-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>

      <Card className="w-full max-w-sm z-10 bg-white/95 backdrop-blur shadow-2xl border-0">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to Itqan</CardTitle>
          <CardDescription>
            Sign in to continue your Quran journey
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
            <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                    id="email" 
                    type="email" 
                    placeholder="m@example.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            </CardContent>
            <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            </CardFooter>
        </form>
        <div className="text-center text-sm p-4">
            Don&apos;t have an account? <Link href="/register" className="underline">Sign up</Link>
        </div>
      </Card>
    </div>
  )
}
