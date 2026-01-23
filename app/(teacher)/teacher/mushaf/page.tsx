"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Play, Pause, Search, BookOpen } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VerseSkeleton } from "@/components/ui/loading-skeleton"

interface Surah {
  id: number
  revelation_place: string
  name_simple: string
  name_arabic: string
  verses_count: number
}

interface Verse {
  id: number
  verse_key: string
  text_uthmani: string
  translations?: Array<{
    text: string
    resource_name: string
  }>
}

export default function MushafPage() {
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [selectedSurah, setSelectedSurah] = useState<number>(1)
  const [verses, setVerses] = useState<Verse[]>([])
  const [showTranslation, setShowTranslation] = useState(true)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSurahsLoading, setIsSurahsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [viewMode, setViewMode] = useState<"page" | "text">("text")
  const [pageImageLoading, setPageImageLoading] = useState(true)

  useEffect(() => {
    fetchSurahs()
  }, [])

  useEffect(() => {
    if (selectedSurah) {
      fetchVerses(selectedSurah)
    }
  }, [selectedSurah, showTranslation])

  const fetchSurahs = async () => {
    setIsSurahsLoading(true)
    try {
      console.log('Fetching surahs from:', 'http://localhost:3001/quran/surahs')
      const response = await fetch("http://localhost:3001/quran/surahs")
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Surahs response:', data)
      
      // Handle different response structures
      if (data.chapters) {
        setSurahs(data.chapters)
        console.log('Set surahs:', data.chapters.length)
      } else if (Array.isArray(data)) {
        setSurahs(data)
        console.log('Set surahs from array:', data.length)
      } else {
        console.error('Unexpected response structure:', data)
      }
    } catch (error) {
      console.error("Failed to fetch surahs:", error)
    } finally {
      setIsSurahsLoading(false)
    }
  }

  const fetchVerses = async (surahNumber: number) => {
    setIsLoading(true)
    try {
      const translations = showTranslation ? "131" : ""
      const url = `http://localhost:3001/quran/verses/${surahNumber}${translations ? `?translations=${translations}` : ''}`
      console.log('Fetching verses:', url)
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Verses data:', data)
      
      setVerses(data.verses || [])
    } catch (error) {
      console.error("Failed to fetch verses:", error)
      setVerses([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch(
        `http://localhost:3001/quran/search?q=${encodeURIComponent(searchQuery)}`
      )
      const data = await response.json()
      setSearchResults(data.search?.results || [])
    } catch (error) {
      console.error("Failed to search:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const nextPage = () => {
    setPageImageLoading(true)
    setPage((p) => Math.min(p + 1, 604))
  }
  const prevPage = () => {
    setPageImageLoading(true)
    setPage((p) => Math.max(p - 1, 1))
  }

  const selectedSurahInfo = surahs.find(s => s.id === selectedSurah)

  // Show initial loading screen until surahs are loaded
  if (isSurahsLoading && surahs.length === 0) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <BookOpen className="h-16 w-16 text-primary mx-auto animate-pulse" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Loading Mushaf...</h2>
              <p className="text-muted-foreground">Preparing the Noble Quran</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Mushaf - القرآن الكريم</h1>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={viewMode === "text" ? "default" : "outline"}
            onClick={() => setViewMode("text")}
          >
            Text View
          </Button>
          <Button
            variant={viewMode === "page" ? "default" : "outline"}
            onClick={() => setViewMode("page")}
          >
            Page View
          </Button>
        </div>
      </div>

      <Tabs defaultValue="read" className="space-y-4">
        <TabsList>
          <TabsTrigger value="read">Read Quran</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        <TabsContent value="read" className="space-y-4">
          {viewMode === "text" ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {!isSurahsLoading && surahs.length === 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={fetchSurahs}
                        >
                          Retry Loading Surahs
                        </Button>
                      )}
                      <Select
                        value={selectedSurah.toString()}
                        onValueChange={(value) => setSelectedSurah(parseInt(value))}
                        disabled={isSurahsLoading || surahs.length === 0}
                      >
                        <SelectTrigger className="w-[300px]">
                          <SelectValue placeholder={
                            isSurahsLoading 
                              ? "Loading surahs..." 
                              : surahs.length === 0 
                              ? "No surahs available" 
                              : "Select Surah"
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {surahs.length > 0 ? (
                            surahs.map((surah) => (
                              <SelectItem key={surah.id} value={surah.id.toString()}>
                                {surah.id}. {surah.name_simple} - {surah.name_arabic}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-4 text-sm text-muted-foreground text-center">
                              {isSurahsLoading ? "Loading..." : "Failed to load surahs"}
                            </div>
                          )}
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTranslation(!showTranslation)}
                      >
                        {showTranslation ? "Hide" : "Show"} Translation
                      </Button>
                    </div>

                    {selectedSurahInfo && (
                      <div className="text-sm text-muted-foreground">
                        {selectedSurahInfo.verses_count} verses • {selectedSurahInfo.revelation_place}
                      </div>
                    )}
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="space-y-6">
                      <div className="text-center py-6">
                        <BookOpen className="h-12 w-12 text-primary mx-auto animate-pulse mb-4" />
                        <p className="text-sm text-muted-foreground">Loading verses...</p>
                      </div>
                      <VerseSkeleton />
                      <VerseSkeleton />
                      <VerseSkeleton />
                      <VerseSkeleton />
                      <VerseSkeleton />
                    </div>
                  ) : verses.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No verses found. Please select a surah.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {verses.map((verse) => (
                        <div key={verse.id} className="border-b pb-6 last:border-0">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                              {verse.verse_key.split(":")[1]}
                            </div>
                            <div className="flex-1 space-y-3">
                              <p className="text-2xl leading-loose font-arabic text-right" dir="rtl">
                                {verse.text_uthmani}
                              </p>
                              {showTranslation && verse.translations && verse.translations[0] && (
                                <p className="text-muted-foreground">
                                  {verse.translations[0].text}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="h-[800px] flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <CardTitle className="text-sm">Mushaf - Page {page}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={prevPage} disabled={page <= 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    max="604"
                    value={page}
                    onChange={(e) => setPage(Math.min(Math.max(1, parseInt(e.target.value) || 1), 604))}
                    className="w-20 text-center"
                  />
                  <Button variant="outline" size="icon" onClick={nextPage} disabled={page >= 604}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-auto bg-amber-50 flex items-center justify-center relative">
                {pageImageLoading && (
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
                  className="h-full w-auto object-contain max-h-full mx-auto shadow-lg"
                  onLoad={() => setPageImageLoading(false)}
                  onLoadStart={() => setPageImageLoading(true)}
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/600x900?text=Page+Not+Found"
                    setPageImageLoading(false)
                  }}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search the Quran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Search for verses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={isLoading}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {isLoading && searchQuery && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-3">
                  <Search className="h-12 w-12 text-primary mx-auto animate-pulse" />
                  <p className="text-sm text-muted-foreground">Searching the Quran...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {!isLoading && searchResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Search Results ({searchResults.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {searchResults.map((result: any, index: number) => (
                    <div key={index} className="border-b pb-4 last:border-0">
                      <div className="font-medium text-sm text-primary mb-2">
                        Surah {result.verse_key}
                      </div>
                      <p className="text-lg font-arabic" dir="rtl">
                        {result.text}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {!isLoading && searchQuery && searchResults.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No results found for "{searchQuery}"
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
