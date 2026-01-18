import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar role="student" />
      <main className="w-full">
        <div className="p-4 border-b flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="font-semibold text-lg">Student Portal</h1>
        </div>
        <div className="p-4">
            {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
