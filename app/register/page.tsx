"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function RegisterPage() {
  const [role, setRole] = useState("STUDENT")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      })

      if (!response.ok) {
        throw new Error("Registration failed")
      }

      const data = await response.json()
      // Store token
      localStorage.setItem("token", data.access_token)
      localStorage.setItem("user", JSON.stringify(data.user))

      toast.success("Registration successful!")
      
      // Redirect based on role
      if (data.user.role === "STUDENT") {
        router.push("/student/dashboard")
      } else if (data.user.role === "TEACHER") {
        router.push("/teacher/dashboard")
      } else if (data.user.role === "ADMIN") {
        router.push("/admin/dashboard")
      } else {
        router.push("/")
      }

    } catch (error) {
      toast.error("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">Join Itqan to start your Quran journey</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                    id="name" 
                    placeholder="Ahmed Mohamed" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                    id="email" 
                    type="email" 
                    placeholder="m@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="role">I am a...</Label>
                <Select onValueChange={setRole} defaultValue={role}>
                <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="TEACHER">Teacher</SelectItem>
                </SelectContent>
                </Select>
            </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Creating Account..." : `Sign Up as ${role === 'STUDENT' ? 'Student' : 'Teacher'}`}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                Login
                </Link>
            </p>
            </CardFooter>
        </form>
      </Card>
    </div>
  )
}
