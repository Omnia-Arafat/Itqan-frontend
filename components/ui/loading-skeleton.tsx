import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function HalaqaCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}

export function DashboardCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-3 w-3/4" />
      </CardContent>
    </Card>
  )
}

export function VerseSkeleton() {
  return (
    <div className="border-b pb-6">
      <div className="flex items-start gap-4">
        <Skeleton className="flex-shrink-0 w-8 h-8 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  )
}
