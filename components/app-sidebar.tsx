import { Calendar, Home, Inbox, Search, Settings, BookOpen, Video, Users, Award, FileText, Shield } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"

// Menu items for different roles
const menus = {
    student: [
        { title: "Dashboard", url: "/student/dashboard", icon: Home },
        { title: "My Halaqas", url: "/student/halaqas", icon: Video },
        { title: "Mushaf", url: "/mushaf", icon: BookOpen },
        { title: "Progress Tracker", url: "/student/progress", icon: Award },
        { title: "Notes", url: "/notes", icon: FileText },
        { title: "Settings", url: "/profile", icon: Settings },
    ],
    teacher: [
        { title: "Dashboard", url: "/teacher/dashboard", icon: Home },
        { title: "My Halaqas", url: "/teacher/halaqas", icon: Video },
        { title: "Mushaf", url: "/mushaf", icon: BookOpen },
        { title: "Class Sessions", url: "/teacher/sessions", icon: Users },
        { title: "Student Progress", url: "/teacher/progress", icon: Award },
        { title: "Settings", url: "/profile", icon: Settings },
    ],
    admin: [
        { title: "Dashboard", url: "/admin/dashboard", icon: Home },
        { title: "Mushaf", url: "/mushaf", icon: BookOpen },
        { title: "Manage Tenants", url: "/tenants", icon: Shield },
        { title: "Manage Users", url: "/users", icon: Users },
        { title: "Reports", url: "/reports", icon: FileText },
        { title: "Settings", url: "/settings", icon: Settings },
    ]
}

export function AppSidebar({ role = "student" }: { role?: "student" | "teacher" | "admin" }) {
  const items = menus[role] || menus.student

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Itqan Logo" width={32} height={32} />
            <span className="font-bold text-xl text-primary">Itqan</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Itqan Platform ({role})</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
