"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Building, Users, BookOpen, Search } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get URL parameters
  const preselectedAcademy = searchParams.get('academy')
  const preselectedRole = searchParams.get('role')
  const invitationCode = searchParams.get('invitation')
  
  // Form state
  const [step, setStep] = useState(1)
  const [role, setRole] = useState(preselectedRole || "STUDENT")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedAcademy, setSelectedAcademy] = useState(preselectedAcademy || "")
  const [academySearch, setAcademySearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // Academy data
  const [academies, setAcademies] = useState<any[]>([])
  const [loadingAcademies, setLoadingAcademies] = useState(false)

  useEffect(() => {
    loadAcademies()
  }, [])

  const loadAcademies = async () => {
    setLoadingAcademies(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/academies/public`)
      if (response.ok) {
        const data = await response.json()
        setAcademies(data)
      }
    } catch (error) {
      console.error('Failed to load academies:', error)
    } finally {
      setLoadingAcademies(false)
    }
  }

  const filteredAcademies = academies.filter(academy =>
    academy.name.toLowerCase().includes(academySearch.toLowerCase()) ||
    academy.description?.toLowerCase().includes(academySearch.toLowerCase())
  )

  const selectedAcademyData = academies.find(a => a.id === selectedAcademy)

  const handleNext = () => {
    if (step === 1) {
      if (!name || !email || !password) {
        toast.error("Please fill in all required fields")
        return
      }
    }
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleRegister = async () => {
    setIsLoading(true)

    try {
      const registrationData = {
        name,
        email,
        password,
        role,
        academyId: selectedAcademy || undefined,
        invitationCode: invitationCode || undefined
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Registration failed")
      }

      const data = await response.json()
      
      // Store token and user data
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

    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              }`}>
                1
              </div>
              <span className="text-sm font-medium">Account Info</span>
            </div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              }`}>
                2
              </div>
              <span className="text-sm font-medium">Academy Selection</span>
            </div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 3 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              }`}>
                3
              </div>
              <span className="text-sm font-medium">Review</span>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Account Information */}
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Create Your Account</CardTitle>
              <CardDescription className="text-center">
                {invitationCode ? "Complete your invitation to join" : "Join Itqan to start your Quran journey"}
              </CardDescription>
            </CardHeader>
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
                <Select onValueChange={setRole} value={role}>
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
              <Button className="w-full" onClick={handleNext}>
                Next: Choose Academy
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </p>
            </CardFooter>
          </>
        )}

        {/* Step 2: Academy Selection */}
        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Choose Your Academy</CardTitle>
              <CardDescription className="text-center">
                Select an academy to join, or skip to join Itqan directly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search academies..."
                  value={academySearch}
                  onChange={(e) => setAcademySearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Academy Options */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {/* No Academy Option */}
                <Card 
                  className={`cursor-pointer transition-colors ${
                    selectedAcademy === "" ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedAcademy("")}
                >
                  <CardContent className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Join Itqan Directly</h3>
                        <p className="text-sm text-muted-foreground">
                          Start learning without joining a specific academy
                        </p>
                      </div>
                      {selectedAcademy === "" && (
                        <Badge variant="default">Selected</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Academy List */}
                {loadingAcademies ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading academies...
                  </div>
                ) : filteredAcademies.length > 0 ? (
                  filteredAcademies.map((academy) => (
                    <Card 
                      key={academy.id}
                      className={`cursor-pointer transition-colors ${
                        selectedAcademy === academy.id ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedAcademy(academy.id)}
                    >
                      <CardContent className="py-4">
                        <div className="flex items-start gap-3">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-lg font-bold text-primary">
                              {academy.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold truncate">{academy.name}</h3>
                              {selectedAcademy === academy.id && (
                                <Badge variant="default">Selected</Badge>
                              )}
                            </div>
                            {academy.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                {academy.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{academy._count?.userRoles || 0} members</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                <span>{academy._count?.halaqas || 0} halaqas</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No academies found matching your search
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Next: Review
              </Button>
            </CardFooter>
          </>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Review Your Registration</CardTitle>
              <CardDescription className="text-center">
                Please review your information before creating your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Account Information</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <p><strong>Name:</strong> {name}</p>
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Role:</strong> {role === 'STUDENT' ? 'Student' : 'Teacher'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Academy Selection</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    {selectedAcademyData ? (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {selectedAcademyData.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{selectedAcademyData.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedAcademyData._count?.userRoles || 0} members • {selectedAcademyData._count?.halaqas || 0} halaqas
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Itqan Platform</p>
                          <p className="text-sm text-muted-foreground">
                            Join directly without a specific academy
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {invitationCode && (
                  <div>
                    <h3 className="font-semibold mb-2">Invitation</h3>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        You're joining through an invitation code: <code className="font-mono">{invitationCode}</code>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button onClick={handleRegister} disabled={isLoading} className="flex-1">
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}
export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading registration form...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}