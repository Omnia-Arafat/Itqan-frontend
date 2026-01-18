"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Users, Video, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { fetchWithAuth } from "@/lib/api"

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([])
  const [academies, setAcademies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [usersRes, academiesRes] = await Promise.all([
          fetchWithAuth("/users"),
          fetchWithAuth("/academies")
        ])
        
        if (usersRes.ok) setUsers(await usersRes.json())
        if (academiesRes.ok) setAcademies(await academiesRes.json())
      } catch (error) {
        console.error("Failed to load dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Admin Overview</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Academies</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{academies.length}</div>
                <p className="text-xs text-muted-foreground">Registered academies</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">56</div>
                <p className="text-xs text-muted-foreground">Right now</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Growth</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">+12%</div>
                <p className="text-xs text-muted-foreground">MoM Revenue</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Recent Registrations</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {users.length > 0 ? users.slice(0, 5).map((user) => (
                        <div key={user.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center gap-4">
                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.role} • {user.email}</p>
                                </div>
                            </div>
                            <span className="text-xs text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                    )) : (
                        <p className="text-muted-foreground text-sm">No recent registrations.</p>
                    )}
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Server Status</span>
                        <span className="text-sm text-green-600 font-medium">Operational</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Database Load</span>
                        <span className="text-sm text-yellow-600 font-medium">Medium (45%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Storage Usage</span>
                        <span className="text-sm text-green-600 font-medium">12% (120GB/1TB)</span>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
