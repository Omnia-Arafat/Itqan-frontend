"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function QuranViewer() {
    const [page, setPage] = useState(1)

    const nextPage = () => setPage((p) => Math.min(p + 1, 604))
    const prevPage = () => setPage((p) => Math.max(p - 1, 1))

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between py-2">
                <CardTitle className="text-sm">Mushaf - Page {page}</CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={prevPage} disabled={page <= 1}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextPage} disabled={page >= 604}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-auto bg-amber-50 flex items-center justify-center relative">
                {/* Real Quran Page Image */}
                <img 
                    src={`https://android.quran.com/data/width_1024/page${page.toString().padStart(3, '0')}.png`} 
                    alt={`Quran Page ${page}`}
                    className="h-full w-auto object-contain max-h-full mx-auto shadow-lg"
                    onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/600x900?text=Page+Not+Found"
                    }}
                />
            </CardContent>
        </Card>
    )
}
