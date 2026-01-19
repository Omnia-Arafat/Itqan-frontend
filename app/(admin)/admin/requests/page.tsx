"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { Search, Clock, CheckCircle, XCircle, User, Mail, MessageSquare, Filter } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import { toast } from "sonner"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"

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
  teacher: {
    name: string
  }
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<JoinRequest[]>([])
  const [halaqas, setHalaqas] = useState<Halaqa[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [actionDialog, setActionDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject">("approve")
  const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null)
  const [responseMessage, setResponseMessage] = useState("")
  const [selectedHalaqaId, setSelectedHalaqaId] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [requestsRes, halaqasRes] = await Promise.all([
        fetchWithAuth("/join-requests"),
        fetchWithAuth("/halaqas"),
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
        const response = await fetchWithAuth(`/join-requests/${selectedRequest.id}`, {
          method: "PATCH",
          body: JSON.stringify({ status: "REJECTED", response: responseMessage }),
        })

        if (response.ok) {
          toast.success("Request rejected")
          setActionDialog(false)
          loadData()
        } else {
          const error = await response.json()
          toast.error(error.message || "Failed to reject request")
        }
      }
    } catch (error) {
      console.error("Failed to process request:", error)
      toast.error("Failed to process request")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteRequest = async () => {
    if (!selectedRequest) return

    try {
      const response = await fetchWithAuth(`/join-requests/${selectedRequest.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Request deleted successfully")
        loadData()
      } else {
        toast.error("Failed to delete request")
      }
    } catch (error) {
      console.error("Failed to delete request:", error)
      toast.error("Failed to delete request")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case "REASSIGNED":
        return <Badge className="bg-blue-100 text-blue-800">Reassigned</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.teacher?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.halaqa?.title.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const pendingCount = requests.filter(r => r.status === "PENDING").length
  const approvedCount = requests.filter(r => r.status === "APPROVED").length
  const rejectedCount = requests.filter(r => r.status === "REJECTED").length

  if (loading) {
    return <div className="text-center py-12">Loading requests...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Request Management</h2>
        <p className="text-muted-foreground">Review and manage all student join requests</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{requests.length}</div>
            <p className="text-xs text-muted-foreground">Total Requests</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student, teacher, or halaqa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="REASSIGNED">Reassigned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No requests found matching your filters.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredRequests.map((request) => (
            <Card
              key={request.id}
              className={`hover:shadow-md transition-shadow ${
                request.status === "PENDING" ? "border-l-4 border-l-yellow-400" : ""
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{request.student.name}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {request.student.email}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium">Request Type: </span>
                        {request.type === "SPECIFIC_HALAQA" && `Join "${request.halaqa?.title}"`}
                        {request.type === "SPECIFIC_TEACHER" && `Join ${request.teacher?.name}'s halaqa`}
                        {request.type === "ANY_TEACHER" && "Any available teacher"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {new Date(request.createdAt).toLocaleDateString()} at{" "}
                        {new Date(request.createdAt).toLocaleTimeString()}
                      </p>
                    </div>

                    {request.message && (
                      <div className="flex gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground mb-1">Message:</p>
                          <p className="text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
                            {request.message}
                          </p>
                        </div>
                      </div>
                    )}

                    {request.response && (
                      <div className="text-sm">
                        <p className="font-medium text-muted-foreground mb-1">Admin Response:</p>
                        <p className="bg-gray-50 p-2 rounded">{request.response}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(request.status)}
                    {request.status === "PENDING" && (
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          onClick={() => openActionDialog("approve", request)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openActionDialog("reject", request)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setSelectedRequest(request)
                        setDeleteDialog(true)
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Action Dialog */}
      <Dialog open={actionDialog} onOpenChange={setActionDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve Request" : "Reject Request"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "Select which halaqa to enroll the student in"
                : "Please provide a reason for rejection"}
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
                        <div className="flex flex-col">
                          <span>{halaqa.title}</span>
                          <span className="text-xs text-muted-foreground">
                            Teacher: {halaqa.teacher.name}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {actionType === "reject" && (
              <div className="space-y-2">
                <Label htmlFor="response">Reason for Rejection *</Label>
                <Textarea
                  id="response"
                  placeholder="Explain why you're rejecting this request..."
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
                (actionType === "reject" && !responseMessage.trim())
              }
              className={
                actionType === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {submitting ? "Processing..." : actionType === "approve" ? "Approve & Enroll" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        title="Delete Request"
        description="Are you sure you want to delete this join request?"
        itemName={selectedRequest?.student.name}
        onConfirm={handleDeleteRequest}
      />
    </div>
  )
}
