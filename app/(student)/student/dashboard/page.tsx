"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { fetchWithAuth } from "@/lib/api"
import { DashboardCardSkeleton } from "@/components/ui/loading-skeleton"

export default function Page() {
  const [progress, setProgress] = useState<any[]>([])
  const [halaqas, setHalaqas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [progressRes, enrollmentsRes] = await Promise.all([
          fetchWithAuth("/progress"),
          fetchWithAuth("/enrollments/my")
        ])
        
        if (progressRes.ok) {
          const progressData = await progressRes.json()
          setProgress(Array.isArray(progressData) ? progressData : [])
        }
        if (enrollmentsRes.ok) {
          const enrollmentData = await enrollmentsRes.json()
          setHalaqas(Array.isArray(enrollmentData) ? enrollmentData.map((e: any) => e.halaqa) : [])
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="space-y-6">
        {/* Daily Verse Section */}
        <Card className="bg-primary text-primary-foreground overflow-hidden relative">
            <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 translate-x-12" />
            <CardHeader>
                <CardTitle className="text-lg font-medium opacity-90">Daily Verse</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
                <blockquote className="text-2xl font-arabic leading-loose text-center py-4">
                    "وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا"
                </blockquote>
                <p className="text-center text-sm opacity-80">
                    "And recite the Quran with measured recitation." (Surah Al-Muzzammil, 73:4)
                </p>
            </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              <>
                <DashboardCardSkeleton />
                <DashboardCardSkeleton />
                <DashboardCardSkeleton />
                <DashboardCardSkeleton />
              </>
            ) : (
              <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Total Hifz
                </CardTitle>
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{progress.length > 0 ? `${progress.length} Records` : "0 Juz"}</div>
                <p className="text-xs text-muted-foreground">
                    Based on tracked progress
                </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Active Halaqas
                </CardTitle>
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{halaqas.length}</div>
                <p className="text-xs text-muted-foreground">
                    Enrolled classes
                </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Tajweed Score
                </CardTitle>
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">8.5</div>
                <p className="text-xs text-muted-foreground">
                    Excellent progress
                </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Study Time
                </CardTitle>
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">12h</div>
                <p className="text-xs text-muted-foreground">
                    This week
                </p>
                </CardContent>
            </Card>
              </>
            )}
        </div>

        {/* Recent Activity */}
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    <div className="flex items-center">
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">Memorized Surah Al-Mulk</p>
                            <p className="text-sm text-muted-foreground">
                                2 days ago
                            </p>
                        </div>
                        <div className="ml-auto font-medium text-green-600">+1 Juz</div>
                    </div>
                    <div className="flex items-center">
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">Attended Halaqa</p>
                            <p className="text-sm text-muted-foreground">
                                3 days ago
                            </p>
                        </div>
                        <div className="ml-auto font-medium">1h 30m</div>
                    </div>
                    <div className="flex items-center">
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">Tajweed Practice</p>
                            <p className="text-sm text-muted-foreground">
                                4 days ago
                            </p>
                        </div>
                        <div className="ml-auto font-medium">45m</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
