"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function FloatingMushaf() {
  const [page, setPage] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const nextPage = () => {
    setImageLoading(true)
    setPage((p) => Math.min(p + 1, 604))
  }
  const prevPage = () => {
    setImageLoading(true)
    setPage((p) => Math.max(p - 1, 1))
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 right-6 rounded-full shadow-lg z-50 h-14 w-14 p-0"
          title="Open Mushaf"
        >
          <BookOpen className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Mushaf - Page {page}
          </SheetTitle>
        </SheetHeader>
        
        <div className="px-6 pb-4 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevPage}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Input
            type="number"
            min="1"
            max="604"
            value={page}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 1
              setPage(Math.min(Math.max(1, val), 604))
            }}
            className="w-20 text-center"
          />
          
          <Button
            variant="outline"
            size="icon"
            onClick={nextPage}
            disabled={page >= 604}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-[calc(100vh-180px)] overflow-auto bg-amber-50 flex items-center justify-center px-6 pb-6 relative">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-amber-50 z-10">
              <div className="text-center space-y-3">
                <BookOpen className="h-12 w-12 text-primary mx-auto animate-pulse" />
                <p className="text-sm text-muted-foreground">Loading page {page}...</p>
              </div>
            </div>
          )}
          <img
            src={`https://android.quran.com/data/width_1024/page${page.toString().padStart(3, '0')}.png`}
            alt={`Quran Page ${page}`}
            className="w-full h-auto object-contain max-h-full mx-auto shadow-lg rounded"
            onLoad={() => setImageLoading(false)}
            onLoadStart={() => setImageLoading(true)}
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/600x900?text=Page+Not+Found"
              setImageLoading(false)
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
