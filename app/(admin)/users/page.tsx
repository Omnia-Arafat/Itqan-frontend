"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, UserPlus, Mail } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Manage Users</h2>
        <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users by name, email, or role..." className="pl-8" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <Card>
        <CardContent className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Academy</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <TableRow key={i}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">
                                        U{i}
                                    </div>
                                    User Name {i}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary">{i % 3 === 0 ? "Teacher" : "Student"}</Badge>
                            </TableCell>
                            <TableCell>Al-Azhar Academy</TableCell>
                            <TableCell>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  )
}
