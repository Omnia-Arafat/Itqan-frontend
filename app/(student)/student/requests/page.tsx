"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle, AlertCircle, Trash2 } from "lucide-react"
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
  teacher?: {
    id: string
    name: string
    email: string
  }
  halaqa?: {
    id: string
    title: string
  }
}

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<JoinRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null)

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const response = await fetchWithAuth(`/join-requests?role=STUDENT&userId=${user.id}`)

      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      } else {
        toast.error("Failed to load requests")
      }
    } catch (error) {
      console.error("Failed to load requests:", error)
      toast.error("Failed to load requests")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedRequest) return

    try {
      const response = await fetchWithAuth(`/join-requests/${selectedRequest.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Request cancelled successfully")
        loadRequests()
      } else {
        toast.error("Failed to cancel request")
      }
    } catch (error) {
      console.error("Failed to cancel request:", error)
      toast.error("Failed to cancel request")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-5 w-5" />
      case "APPROVED":
        return <CheckCircle className="h-5 w-5" />
      case "REJECTED":
        return <XCircle className="h-5 w-5" />
      case "REASSIGNED":
        return <AlertCircle className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
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

  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case "SPECIFIC_HALAQA":
        return "Specific Halaqa"
      case "SPECIFIC_TEACHER":
        return "Specific Teacher"
      case "ANY_TEACHER":
        return "Any Teacher"
      default:
        return type
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading your requests...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Join Requests</h2>
        <p className="text-muted-foreground">View and manage your requests to join halaqas</p>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">You haven't submitted any join requests yet.</p>
            <Button asChild>
              <a href="/student/browse">Browse Teachers & Halaqas</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      <CardTitle className="text-lg">
                        {request.halaqa?.title || request.teacher?.name || "General Request"}
                      </CardTitle>
                    </div>
                    <CardDescription>
                      <span className="font-medium">{getRequestTypeLabel(request.type)}</span>
                      {request.teacher && ` • Teacher: ${request.teacher.name}`}
                    </CardDescription>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {request.message && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Your Message:</p>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg">{request.message}</p>
                  </div>
                )}
                {request.response && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {request.status === "APPROVED" ? "Response:" : "Reason:"}
                    </p>
                    <p className="text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
                      {request.response}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Submitted {new Date(request.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
              {request.status === "PENDING" && (
                <CardFooter className="border-t pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      setSelectedRequest(request)
                      setDeleteDialog(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Cancel Request
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}

      <DeleteConfirmationDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        title="Cancel Request"
        description="Are you sure you want to cancel this join request?"
        itemName={selectedRequest?.halaqa?.title || selectedRequest?.teacher?.name}
        onConfirm={handleDelete}
      />
    </div>
  )
}
