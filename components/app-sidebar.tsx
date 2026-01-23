"use client"

import { Calendar, Home, Inbox, Search, Settings, BookOpen, Video, Users, Award, FileText, Shield, LogOut } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

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
import { Button } from "@/components/ui/button"

// Menu items for different roles
const menus = {
    student: [
        { title: "Dashboard", url: "/student/dashboard", icon: Home },
        { title: "Browse Halaqas", url: "/student/browse", icon: Search },
        { title: "My Halaqas", url: "/student/halaqas", icon: Video },
        { title: "Mushaf", url: "/student/mushaf", icon: BookOpen },
        { title: "Progress Tracker", url: "/student/progress", icon: Award },
        { title: "My Requests", url: "/student/requests", icon: Inbox },
        { title: "Settings", url: "/student/settings", icon: Settings },
    ],
    teacher: [
        { title: "Dashboard", url: "/teacher/dashboard", icon: Home },
        { title: "My Halaqas", url: "/teacher/halaqas", icon: Video },
        { title: "Mushaf", url: "/teacher/mushaf", icon: BookOpen },
        { title: "Join Requests", url: "/teacher/requests", icon: Inbox },
        { title: "Settings", url: "/teacher/settings", icon: Settings },
    ],
    admin: [
        { title: "Dashboard", url: "/admin", icon: Home },
        { title: "Mushaf", url: "/admin/mushaf", icon: BookOpen },
        { title: "Manage Users", url: "/admin/users", icon: Users },
        { title: "Join Requests", url: "/admin/requests", icon: Inbox },
        { title: "Settings", url: "/admin/settings", icon: Settings },
    ]
}

export function AppSidebar({ role = "student" }: { role?: "student" | "teacher" | "admin" }) {
  const items = menus[role] || menus.student
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
        <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-white p-1.5 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
              <Image src="/logo.png" alt="Itqan Logo" width={28} height={28} />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Itqan</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2 px-3">
            {role === "student" && "Student Portal"}
            {role === "teacher" && "Teacher Portal"}
            {role === "admin" && "Admin Portal"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2">
              {items.map((item) => {
                const isActive = pathname === item.url || pathname?.startsWith(item.url + "/")
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className="group relative"
                    >
                      <Link 
                        href={item.url}
                        className={
                          isActive 
                            ? "bg-primary/10 text-primary font-medium border-l-4 border-primary pl-3" 
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground pl-4 border-l-4 border-transparent hover:border-primary/20"
                        }
                      >
                        <item.icon className={isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground"} />
                        <span className="transition-colors">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
