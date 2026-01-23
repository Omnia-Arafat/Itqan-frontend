"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Building, User, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/components/navbar"

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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <Navbar />
        <div className="pt-20 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white">
              <CardContent className="py-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                >
                  Application Submitted!
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-muted-foreground mb-6 text-lg"
                >
                  Thank you for your interest in joining the Itqan platform. We have received your academy application 
                  and will review it within 3-5 business days.
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="text-sm text-muted-foreground mb-8"
                >
                  You will receive an email confirmation shortly, and we'll notify you once the review is complete.
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="flex gap-4 justify-center"
                >
                  <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600" asChild>
                    <Link href="/">Return to Homepage</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50" asChild>
                    <Link href="/academies">Browse Academies</Link>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      {/* Header */}
      <div className="pt-20 bg-gradient-to-r from-green-600 to-green-500 text-white">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4 max-w-4xl mx-auto"
          >
            <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10">
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Join Itqan as an Academy</h1>
              <p className="text-xl text-white/90">Apply to bring your Islamic academy to our platform</p>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="hidden md:block"
            >
              <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center">
                <Building className="h-10 w-10 text-white" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`flex items-center gap-3 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <motion.div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    step >= 1 ? 'bg-primary text-white shadow-lg' : 'bg-muted text-muted-foreground'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  1
                </motion.div>
                <span className="font-medium">Academy Info</span>
              </div>
              <div className={`flex items-center gap-3 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <motion.div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    step >= 2 ? 'bg-primary text-white shadow-lg' : 'bg-muted text-muted-foreground'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  2
                </motion.div>
                <span className="font-medium">Administrator</span>
              </div>
              <div className={`flex items-center gap-3 ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                <motion.div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    step >= 3 ? 'bg-primary text-white shadow-lg' : 'bg-muted text-muted-foreground'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  3
                </motion.div>
                <span className="font-medium">Review</span>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-green-600 to-green-500 h-3 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Step 1: Academy Information */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-xl border-0">
                  <CardHeader className="text-center pb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      <Building className="h-12 w-12 text-primary mx-auto mb-4" />
                    </motion.div>
                    <CardTitle className="text-2xl">Academy Information</CardTitle>
                    <CardDescription className="text-lg">
                      Tell us about your Islamic academy and educational mission
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="academyName">Academy Name *</Label>
                      <Input
                        id="academyName"
                        placeholder="e.g., Al-Noor Islamic Academy"
                        value={formData.academyName}
                        onChange={(e) => handleInputChange('academyName', e.target.value)}
                        required
                        className="h-12"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your academy's mission, teaching methodology, and educational goals..."
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        required
                        className="resize-none"
                      />
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="contactEmail">Contact Email *</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          placeholder="info@academy.com"
                          value={formData.contactEmail}
                          onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                          required
                          className="h-12"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="contactPhone">Contact Phone</Label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={formData.contactPhone}
                          onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                          className="h-12"
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="websiteUrl">Website URL</Label>
                      <Input
                        id="websiteUrl"
                        type="url"
                        placeholder="https://www.academy.com"
                        value={formData.websiteUrl}
                        onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                        className="h-12"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex justify-end pt-4"
                    >
                      <Button onClick={handleNext} size="lg" className="px-8">
                        Next: Administrator Info
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Administrator Information */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-xl border-0">
                  <CardHeader className="text-center pb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      <User className="h-12 w-12 text-primary mx-auto mb-4" />
                    </motion.div>
                    <CardTitle className="text-2xl">Administrator Information</CardTitle>
                    <CardDescription className="text-lg">
                      Provide details for the primary academy administrator
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="adminName">Administrator Name *</Label>
                      <Input
                        id="adminName"
                        placeholder="Full name of the academy administrator"
                        value={formData.adminName}
                        onChange={(e) => handleInputChange('adminName', e.target.value)}
                        required
                        className="h-12"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="adminEmail">Administrator Email *</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        placeholder="admin@academy.com"
                        value={formData.adminEmail}
                        onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                        required
                        className="h-12"
                      />
                      <p className="text-sm text-muted-foreground">
                        This person will receive login credentials and have full administrative access to the academy.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex justify-between pt-4"
                    >
                      <Button variant="outline" onClick={handleBack} size="lg" className="px-8">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button onClick={handleNext} size="lg" className="px-8">
                        Review Application
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-xl border-0">
                  <CardHeader className="text-center pb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                    </motion.div>
                    <CardTitle className="text-2xl">Review Your Application</CardTitle>
                    <CardDescription className="text-lg">
                      Please review all information before submitting your academy application
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <Building className="h-5 w-5 text-primary" />
                          Academy Information
                        </h3>
                        <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 rounded-xl space-y-3 border">
                          <p><strong>Name:</strong> {formData.academyName}</p>
                          <p><strong>Description:</strong> {formData.description}</p>
                          <p><strong>Contact Email:</strong> {formData.contactEmail}</p>
                          {formData.contactPhone && <p><strong>Phone:</strong> {formData.contactPhone}</p>}
                          {formData.websiteUrl && <p><strong>Website:</strong> {formData.websiteUrl}</p>}
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <User className="h-5 w-5 text-primary" />
                          Administrator
                        </h3>
                        <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 rounded-xl space-y-3 border">
                          <p><strong>Name:</strong> {formData.adminName}</p>
                          <p><strong>Email:</strong> {formData.adminEmail}</p>
                        </div>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200"
                    >
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        What happens next?
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          Your application will be reviewed within 3-5 business days
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          You'll receive an email confirmation shortly
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          If approved, the administrator will receive setup instructions
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          You can then start inviting teachers and students to your academy
                        </li>
                      </ul>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex justify-between pt-4"
                    >
                      <Button variant="outline" onClick={handleBack} size="lg" className="px-8">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button 
                        onClick={handleSubmit} 
                        disabled={loading} 
                        size="lg" 
                        className="px-8 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                      >
                        {loading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                            />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Application
                            <CheckCircle className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}