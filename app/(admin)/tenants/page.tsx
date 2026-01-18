"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Building, Plus, Search, MoreHorizontal } from "lucide-react"

export default function AdminTenantsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Manage Academies</h2>
        <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Academy
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search academies..." className="pl-8" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
            <Card key={i}>
                <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Al-Azhar Online Academy {i}</h3>
                            <p className="text-sm text-muted-foreground">Cairo, Egypt • 150 Students</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-sm font-medium">Subscription</p>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                        </div>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  )
}
