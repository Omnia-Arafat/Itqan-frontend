import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar role="admin" />
      <main className="w-full">
        <div className="p-4 border-b flex items-center gap-4 bg-slate-50/50">
            <SidebarTrigger />
            <h1 className="font-semibold text-lg text-slate-900">Admin Portal</h1>
        </div>
        <div className="p-4">
            {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
