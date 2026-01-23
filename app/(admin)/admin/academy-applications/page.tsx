"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Building, Mail, Phone, Globe, User, CheckCircle, XCircle, Clock } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { toast } from "sonner"

interface AcademyApplication {
  id: string
  academyName: string
  description: string
  contactEmail: string
  contactPhone?: string
  websiteUrl?: string
  adminName: string
  adminEmail: string
  status: string
  rejectionReason?: string
  submittedAt: string
  reviewedAt?: string
  reviewer?: {
    id: string
    name: string
    email: string
  }
}

export default function AcademyApplicationsPage() {
  const [applications, setApplications] = useState<AcademyApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<AcademyApplication | null>(null)
  const [reviewDialog, setReviewDialog] = useState(false)
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve')
  const [rejectionReason, setRejectionReason] = useState("")
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      const response = await fetchWithAuth("/academy-applications")
      if (response.ok) {
        const data = await response.json()
        setApplications(data)
      } else {
        toast.error("Failed to load applications")
      }
    } catch (error) {
      console.error("Failed to load applications:", error)
      toast.error("Failed to load applications")
    } finally {
      setLoading(false)
    }
  }

  const handleReview = (application: AcademyApplication, action: 'approve' | 'reject') => {
    setSelectedApplication(application)
    setReviewAction(action)
    setRejectionReason("")
    setReviewDialog(true)
  }

  const submitReview = async () => {
    if (!selectedApplication) return

    setProcessing(true)
    try {
      const endpoint = reviewAction === 'approve' 
        ? `/academy-applications/${selectedApplication.id}/approve`
        : `/academy-applications/${selectedApplication.id}/reject`

      const body = reviewAction === 'reject' ? { reason: rejectionReason } : {}

      const response = await fetchWithAuth(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      })

      if (response.ok) {
        toast.success(`Application ${reviewAction}d successfully!`)
        setReviewDialog(false)
        loadApplications()
      } else {
        const error = await response.json()
        toast.error(error.message || `Failed to ${reviewAction} application`)
      }
    } catch (error) {
      console.error(`Failed to ${reviewAction} application:`, error)
      toast.error(`Failed to ${reviewAction} application`)
    } finally {
      setProcessing(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const pendingApplications = applications.filter(app => app.status === 'PENDING')
  const reviewedApplications = applications.filter(app => app.status !== 'PENDING')

  if (loading) {
    return <div className="text-center py-12">Loading applications...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Academy Applications</h2>
        <p className="text-muted-foreground">Review and manage academy registration requests</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingApplications.length})
          </TabsTrigger>
          <TabsTrigger value="reviewed">
            Reviewed ({reviewedApplications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingApplications.length > 0 ? (
            <div className="grid gap-6">
              {pendingApplications.map((application) => (
                <Card key={application.id} className="border-yellow-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Building className="h-5 w-5" />
                          {application.academyName}
                        </CardTitle>
                        <CardDescription>
                          Submitted {new Date(application.submittedAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(application.status)}
                          {application.status}
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Academy Information</h4>
                          <div className="space-y-2 text-sm">
                            <p><strong>Description:</strong> {application.description}</p>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{application.contactEmail}</span>
                            </div>
                            {application.contactPhone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{application.contactPhone}</span>
                              </div>
                            )}
                            {application.websiteUrl && (
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <a 
                                  href={application.websiteUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {application.websiteUrl}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Administrator</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{application.adminName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{application.adminEmail}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button 
                            size="sm" 
                            onClick={() => handleReview(application, 'approve')}
                            className="flex-1"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleReview(application, 'reject')}
                            className="flex-1"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending applications</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reviewed" className="space-y-4">
          {reviewedApplications.length > 0 ? (
            <div className="grid gap-4">
              {reviewedApplications.map((application) => (
                <Card key={application.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Building className="h-5 w-5" />
                          {application.academyName}
                        </CardTitle>
                        <CardDescription>
                          Reviewed {application.reviewedAt ? new Date(application.reviewedAt).toLocaleDateString() : 'N/A'}
                          {application.reviewer && ` by ${application.reviewer.name}`}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(application.status)}
                          {application.status}
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Admin:</strong> {application.adminName}</p>
                        <p><strong>Email:</strong> {application.adminEmail}</p>
                      </div>
                      <div>
                        <p><strong>Contact:</strong> {application.contactEmail}</p>
                        <p><strong>Submitted:</strong> {new Date(application.submittedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {application.rejectionReason && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>Rejection Reason:</strong> {application.rejectionReason}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No reviewed applications</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Approve' : 'Reject'} Academy Application
            </DialogTitle>
            <DialogDescription>
              {reviewAction === 'approve' 
                ? `Are you sure you want to approve "${selectedApplication?.academyName}"? This will create the academy and send setup instructions to the administrator.`
                : `Please provide a reason for rejecting "${selectedApplication?.academyName}".`
              }
            </DialogDescription>
          </DialogHeader>
          
          {reviewAction === 'reject' && (
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">Rejection Reason</Label>
              <Textarea
                id="rejectionReason"
                placeholder="Explain why this application is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                required
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitReview} 
              disabled={processing || (reviewAction === 'reject' && !rejectionReason.trim())}
              variant={reviewAction === 'approve' ? 'default' : 'destructive'}
            >
              {processing ? 'Processing...' : (reviewAction === 'approve' ? 'Approve' : 'Reject')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}