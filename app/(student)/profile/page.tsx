"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Profile & Settings</h2>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your public profile details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input id="name" defaultValue="Ahmed Mohamed" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" defaultValue="ahmed@example.com" disabled />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Save Changes</Button>
                </CardFooter>
            </Card>
        </TabsContent>
        <TabsContent value="password">
            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Ensure your account is secure.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="current">Current Password</Label>
                        <Input id="current" type="password" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="new">New Password</Label>
                        <Input id="new" type="password" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Update Password</Button>
                </CardFooter>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
