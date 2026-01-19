"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Clock, CheckCircle, XCircle, User, Mail, MessageSquare } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { toast } from "sonner"

interface JoinRequest {
  id: string
  type: string
  status: string
  message?: string
  response?: string
  createdAt: string
  student: {
    id: string
    name: string
    email: string
  }
  teacher?: {
    id: string
    name: string
  }
  halaqa?: {
    id: string
    title: string
  }
}

interface Halaqa {
  id: string
  title: string
}

export default function TeacherRequestsPage() {
  const [requests, setRequests] = useState<JoinRequest[]>([])
  const [halaqas, setHalaqas] = useState<Halaqa[]>([])
  const [loading, setLoading] = useState(true)
  const [actionDialog, setActionDialog] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject" | "reassign">("approve")
  const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null)
  const [responseMessage, setResponseMessage] = useState("")
  const [selectedHalaqaId, setSelectedHalaqaId] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const [requestsRes, halaqasRes] = await Promise.all([
        fetchWithAuth(`/join-requests?role=TEACHER&userId=${user.id}`),
        fetchWithAuth(`/halaqas?teacherId=${user.id}`),
      ])

      if (requestsRes.ok) {
        const data = await requestsRes.json()
        setRequests(data)
      }

      if (halaqasRes.ok) {
        const data = await halaqasRes.json()
        setHalaqas(data)
      }
    } catch (error) {
      console.error("Failed to load data:", error)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const openActionDialog = (type: typeof actionType, request: JoinRequest) => {
    setActionType(type)
    setSelectedRequest(request)
    setResponseMessage("")
    setSelectedHalaqaId(request.halaqa?.id || "")
    setActionDialog(true)
  }

  const handleAction = async () => {
    if (!selectedRequest) return

    setSubmitting(true)
    try {
      if (actionType === "approve") {
        const response = await fetchWithAuth(`/join-requests/${selectedRequest.id}/approve`, {
          method: "POST",
          body: JSON.stringify({ halaqaId: selectedHalaqaId }),
        })

        if (response.ok) {
          toast.success("Request approved! Student enrolled successfully.")
          setActionDialog(false)
          loadData()
        } else {
          const error = await response.json()
          toast.error(error.message || "Failed to approve request")
        }
      } else {
        // Reject or Reassign
        const status = actionType === "reject" ? "REJECTED" : "REASSIGNED"
        const response = await fetchWithAuth(`/join-requests/${selectedRequest.id}`, {
          method: "PATCH",
          body: JSON.stringify({ status, response: responseMessage }),
        })

        if (response.ok) {
          toast.success(`Request ${actionType === "reject" ? "rejected" : "reassigned"} successfully`)
          setActionDialog(false)
          loadData()
        } else {
          const error = await response.json()
          toast.error(error.message || "Failed to update request")
        }
      }
    } catch (error) {
      console.error("Failed to process request:", error)
      toast.error("Failed to process request")
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "APPROVED":
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>
      case "REJECTED":
        return <Badge variant="default" className="bg-red-100 text-red-800">Rejected</Badge>
      case "REASSIGNED":
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Reassigned</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const pendingRequests = requests.filter((r) => r.status === "PENDING")
  const processedRequests = requests.filter((r) => r.status !== "PENDING")

  if (loading) {
    return <div className="text-center py-12">Loading requests...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Join Requests</h2>
        <p className="text-muted-foreground">Manage requests from students to join your halaqas</p>
      </div>

      {/* Pending Requests */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-yellow-600" />
          Pending Requests ({pendingRequests.length})
        </h3>

        {pendingRequests.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No pending requests at the moment.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pendingRequests.map((request) => (
              <Card key={request.id} className="border-l-4 border-l-yellow-400">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-gray-600" />
                        <CardTitle className="text-lg">{request.student.name}</CardTitle>
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {request.student.email}
                      </CardDescription>
                      <div className="text-sm">
                        <span className="font-medium">Request: </span>
                        {request.halaqa ? (
                          <span>Join "{request.halaqa.title}"</span>
                        ) : (
                          <span>Join any of your halaqas</span>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </CardHeader>
                {request.message && (
                  <CardContent className="pt-0">
                    <div className="flex gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Student's Message:</p>
                        <p className="text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
                          {request.message}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                )}
                <CardFooter className="border-t pt-4 flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    onClick={() => openActionDialog("approve", request)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openActionDialog("reject", request)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openActionDialog("reassign", request)}
                  >
                    Reassign to Admin
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Processed Requests ({processedRequests.length})</h3>
          <div className="grid gap-4">
            {processedRequests.map((request) => (
              <Card key={request.id} className="opacity-75">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{request.student.name}</CardTitle>
                      <CardDescription>
                        {request.halaqa?.title || "General request"}
                      </CardDescription>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </CardHeader>
                {request.response && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-1">Your Response:</p>
                    <p className="text-sm bg-gray-50 p-2 rounded">{request.response}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Action Dialog */}
      <Dialog open={actionDialog} onOpenChange={setActionDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" && "Approve Request"}
              {actionType === "reject" && "Reject Request"}
              {actionType === "reassign" && "Reassign to Admin"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" && "Select which halaqa to enroll the student in"}
              {actionType === "reject" && "Please provide a reason for rejection"}
              {actionType === "reassign" && "Provide a reason for reassigning to admin"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm font-medium">Student: {selectedRequest?.student.name}</p>
              <p className="text-sm text-muted-foreground">{selectedRequest?.student.email}</p>
            </div>

            {actionType === "approve" && (
              <div className="space-y-2">
                <Label htmlFor="halaqa-select">Select Halaqa *</Label>
                <Select value={selectedHalaqaId} onValueChange={setSelectedHalaqaId}>
                  <SelectTrigger id="halaqa-select">
                    <SelectValue placeholder="Choose a halaqa" />
                  </SelectTrigger>
                  <SelectContent>
                    {halaqas.map((halaqa) => (
                      <SelectItem key={halaqa.id} value={halaqa.id}>
                        {halaqa.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {(actionType === "reject" || actionType === "reassign") && (
              <div className="space-y-2">
                <Label htmlFor="response">
                  {actionType === "reject" ? "Reason for Rejection *" : "Reason for Reassignment *"}
                </Label>
                <Textarea
                  id="response"
                  placeholder={
                    actionType === "reject"
                      ? "Explain why you're rejecting this request..."
                      : "Explain why this should be handled by admin..."
                  }
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  rows={4}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={
                submitting ||
                (actionType === "approve" && !selectedHalaqaId) ||
                ((actionType === "reject" || actionType === "reassign") && !responseMessage.trim())
              }
              className={
                actionType === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : actionType === "reject"
                  ? "bg-red-600 hover:bg-red-700"
                  : ""
              }
            >
              {submitting ? "Processing..." : actionType === "approve" ? "Approve & Enroll" : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
