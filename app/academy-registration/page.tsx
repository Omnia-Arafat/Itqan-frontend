"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Building, Mail, Phone, Globe, User, CheckCircle } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface ApplicationData {
  academyName: string
  description: string
  contactEmail: string
  contactPhone: string
  websiteUrl: string
  adminName: string
  adminEmail: string
}

export default function AcademyRegistrationPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<ApplicationData>({
    academyName: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
    websiteUrl: "",
    adminName: "",
    adminEmail: ""
  })

  const handleInputChange = (field: keyof ApplicationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step === 1) {
      if (!formData.academyName || !formData.description || !formData.contactEmail) {
        toast.error("Please fill in all required fields")
        return
      }
    }
    if (step === 2) {
      if (!formData.adminName || !formData.adminEmail) {
        toast.error("Please fill in all required fields")
        return
      }
    }
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      console.log('Submitting to:', `${apiUrl}/academy-applications`)
      console.log('Form data:', formData)
      
      const response = await fetch(`${apiUrl}/academy-applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (response.ok) {
        setSubmitted(true)
        toast.success("Academy application submitted successfully!")
      } else {
        const error = await response.json()
        console.error('Response error:', error)
        toast.error(error.message || "Failed to submit application")
      }
    } catch (error) {
      console.error("Failed to submit application:", error)
      toast.error("Failed to submit application. Please check if the backend server is running.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your interest in joining the Itqan platform. We have received your academy application 
              and will review it within 3-5 business days.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              You will receive an email confirmation shortly, and we'll notify you once the review is complete.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/">Return to Homepage</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/halaqas">Browse Halaqas</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Join Itqan as an Academy</h1>
              <p className="text-muted-foreground">Apply to bring your Islamic academy to our platform</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  1
                </div>
                <span className="text-sm font-medium">Academy Info</span>
              </div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  2
                </div>
                <span className="text-sm font-medium">Administrator</span>
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

          {/* Step 1: Academy Information */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Academy Information
                </CardTitle>
                <CardDescription>
                  Tell us about your Islamic academy and educational mission
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="academyName">Academy Name *</Label>
                  <Input
                    id="academyName"
                    placeholder="e.g., Al-Noor Islamic Academy"
                    value={formData.academyName}
                    onChange={(e) => handleInputChange('academyName', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your academy's mission, teaching methodology, and educational goals..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="info@academy.com"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Website URL</Label>
                  <Input
                    id="websiteUrl"
                    type="url"
                    placeholder="https://www.academy.com"
                    value={formData.websiteUrl}
                    onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleNext}>
                    Next: Administrator Info
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Administrator Information */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Administrator Information
                </CardTitle>
                <CardDescription>
                  Provide details for the primary academy administrator
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="adminName">Administrator Name *</Label>
                  <Input
                    id="adminName"
                    placeholder="Full name of the academy administrator"
                    value={formData.adminName}
                    onChange={(e) => handleInputChange('adminName', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Administrator Email *</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    placeholder="admin@academy.com"
                    value={formData.adminEmail}
                    onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    This person will receive login credentials and have full administrative access to the academy.
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleNext}>
                    Review Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Application</CardTitle>
                <CardDescription>
                  Please review all information before submitting your academy application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Academy Information</h3>
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <p><strong>Name:</strong> {formData.academyName}</p>
                      <p><strong>Description:</strong> {formData.description}</p>
                      <p><strong>Contact Email:</strong> {formData.contactEmail}</p>
                      {formData.contactPhone && <p><strong>Phone:</strong> {formData.contactPhone}</p>}
                      {formData.websiteUrl && <p><strong>Website:</strong> {formData.websiteUrl}</p>}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Administrator</h3>
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <p><strong>Name:</strong> {formData.adminName}</p>
                      <p><strong>Email:</strong> {formData.adminEmail}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your application will be reviewed within 3-5 business days</li>
                    <li>• You'll receive an email confirmation shortly</li>
                    <li>• If approved, the administrator will receive setup instructions</li>
                    <li>• You can then start inviting teachers and students to your academy</li>
                  </ul>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}