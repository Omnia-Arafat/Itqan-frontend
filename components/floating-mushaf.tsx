"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Minimize2, Maximize2, BookOpen, ChevronLeft, ChevronRight } from "lucide-react"

interface Surah {
  id: number
  name_simple: string
  name_arabic: string
  verses_count: number
}

interface Verse {
  id: number
  verse_key: string
  text_uthmani: string
}

interface FloatingMushafProps {
  isOpen: boolean
  onClose: () => void
}

export default function FloatingMushaf({ isOpen, onClose }: FloatingMushafProps) {
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [selectedSurah, setSelectedSurah] = useState<number>(1)
  const [verses, setVerses] = useState<Verse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchSurahs()
    }
  }, [isOpen])

  useEffect(() => {
    if (selectedSurah && isOpen) {
      fetchVerses(selectedSurah)
    }
  }, [selectedSurah, isOpen])

  const fetchSurahs = async () => {
    try {
      const response = await fetch("http://localhost:3001/quran/surahs")
      const data = await response.json()
      setSurahs(data.chapters || [])
    } catch (error) {
      console.error("Failed to fetch surahs:", error)
    }
  }

  const fetchVerses = async (surahNumber: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:3001/quran/verses/${surahNumber}`)
      const data = await response.json()
      setVerses(data.verses || [])
    } catch (error) {
      console.error("Failed to fetch verses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const nextSurah = () => {
    if (selectedSurah < 114) {
      setSelectedSurah(selectedSurah + 1)
    }
  }

  const prevSurah = () => {
    if (selectedSurah > 1) {
      setSelectedSurah(selectedSurah - 1)
    }
  }

  if (!isOpen) return null

  const selectedSurahInfo = surahs.find(s => s.id === selectedSurah)

  return (
    <div 
      className="fixed bottom-4 left-4 z-50 shadow-2xl animate-in slide-in-from-bottom-5"
      style={{ 
        width: isMinimized ? '300px' : '600px',
        maxHeight: isMinimized ? '60px' : '80vh'
      }}
    >
      <Card className="border-2 border-primary-600">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <BookOpen className="h-4 w-4 text-primary-600" />
            {isMinimized ? 'Mushaf' : 'القرآن الكريم - Mushaf'}
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="space-y-4">
            {/* Surah Selector */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSurah}
                disabled={selectedSurah === 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <Select value={selectedSurah.toString()} onValueChange={(v) => setSelectedSurah(parseInt(v))}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {surahs.map((surah) => (
                    <SelectItem key={surah.id} value={surah.id.toString()}>
                      {surah.id}. {surah.name_arabic} - {surah.name_simple}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={nextSurah}
                disabled={selectedSurah === 114}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            {/* Verses Display */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 140px)' }}>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : (
                <div className="space-y-4 text-right" dir="rtl">
                  {/* Bismillah */}
                  {selectedSurah !== 1 && selectedSurah !== 9 && (
                    <div className="text-center text-2xl py-4 border-b">
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </div>
                  )}
                  
                  {verses.map((verse, index) => (
                    <div key={verse.id} className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <p className="text-xl leading-loose">
                        {verse.text_uthmani}
                        <span className="inline-block mx-2 text-primary-600 font-bold">
                          ({index + 1})
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedSurahInfo && (
              <div className="text-center text-sm text-muted-foreground border-t pt-2">
                {selectedSurahInfo.verses_count} verses
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}
