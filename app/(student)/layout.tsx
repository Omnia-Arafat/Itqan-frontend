import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import SessionTracker from "@/components/session-tracker"
import { RouteGuard } from "@/components/route-guard"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteGuard allowedRoles={["STUDENT"]}>
      <SidebarProvider>
        <AppSidebar role="student" />
        <main className="w-full">
          <div className="p-4 border-b flex items-center gap-4 bg-green-50/50">
              <SidebarTrigger />
              <h1 className="font-semibold text-lg text-green-900">Student Portal</h1>
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
