import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-slate-900">Page Not Found</h2>
      <p className="mt-2 text-center text-slate-600 max-w-md">
        Sorry, we couldn't find the page you're looking for. It might have been removed or doesn't exist.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}
