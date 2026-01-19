"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, GraduationCap, Clock, TrendingUp } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"
import Link from "next/link"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalHalaqas: 0,
    pendingRequests: 0,
  })
  const [recentRequests, setRecentRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [studentsRes, teachersRes, halaqasRes, requestsRes] = await Promise.all([
        fetchWithAuth("/users?role=STUDENT"),
        fetchWithAuth("/users?role=TEACHER"),
        fetchWithAuth("/halaqas"),
        fetchWithAuth("/join-requests"),
      ])

      if (studentsRes.ok) {
        const students = await studentsRes.json()
        setStats(prev => ({ ...prev, totalStudents: students.length }))
      }

      if (teachersRes.ok) {
        const teachers = await teachersRes.json()
        setStats(prev => ({ ...prev, totalTeachers: teachers.length }))
      }

      if (halaqasRes.ok) {
        const halaqas = await halaqasRes.json()
        setStats(prev => ({ ...prev, totalHalaqas: halaqas.length }))
      }

      if (requestsRes.ok) {
        const requests = await requestsRes.json()
        const pending = requests.filter((r: any) => r.status === "PENDING")
        setStats(prev => ({ ...prev, pendingRequests: pending.length }))
        setRecentRequests(requests.slice(0, 5))
      }
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
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
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">Overview of your Quran academy system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Link href="/admin/users?role=STUDENT" className="hover:underline">
                View all students →
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalTeachers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Link href="/admin/users?role=TEACHER" className="hover:underline">
                View all teachers →
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Halaqas</CardTitle>
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalHalaqas}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all teachers
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Link href="/admin/requests" className="hover:underline">
                Review requests →
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary-600" />
            Recent Join Requests
          </CardTitle>
          <CardDescription>Latest student requests to join halaqas</CardDescription>
        </CardHeader>
        <CardContent>
          {recentRequests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No recent requests</p>
          ) : (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{request.student?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {request.type === "SPECIFIC_HALAQA" && `Wants to join: ${request.halaqa?.title}`}
                      {request.type === "SPECIFIC_TEACHER" && `Wants teacher: ${request.teacher?.name}`}
                      {request.type === "ANY_TEACHER" && "Requesting any available teacher"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/admin/users">
          <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-2 hover:border-primary-300">
            <CardHeader>
              <CardTitle className="text-lg">Manage Users</CardTitle>
              <CardDescription>View and manage students and teachers</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/requests">
          <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-2 hover:border-primary-300">
            <CardHeader>
              <CardTitle className="text-lg">Review Requests</CardTitle>
              <CardDescription>Approve or reject join requests</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/reports">
          <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-2 hover:border-primary-300">
            <CardHeader>
              <CardTitle className="text-lg">View Reports</CardTitle>
              <CardDescription>Analytics and system reports</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
