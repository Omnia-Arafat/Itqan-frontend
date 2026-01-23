import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import SessionTracker from "@/components/session-tracker"
import { RouteGuard } from "@/components/route-guard"

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteGuard allowedRoles={["TEACHER"]}>
      <SidebarProvider>
        <AppSidebar role="teacher" />
        <main className="w-full">
          <div className="p-4 border-b flex items-center gap-4 bg-blue-50/50">
              <SidebarTrigger />
              <h1 className="font-semibold text-lg text-blue-900">Teacher Portal</h1>
          </div>
          <div className="p-4">
              {children}
          </div>
        </main>
        <SessionTracker />
      </SidebarProvider>
    </RouteGuard>
  )
}
