"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"

export default function NotesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My Notes</h2>
        <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Note
        </Button>
      </div>

      <div className="grid gap-4">
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Surah Al-Mulk Reflections</CardTitle>
                <p className="text-sm text-muted-foreground">Dec 12, 2024</p>
            </CardHeader>
            <CardContent>
                <p className="text-sm">
                    Focus on the meaning of "Tabaarak". The sovereignty of Allah is absolute.
                    Need to improve pronunciation of 'Khalaqa' in verse 2.
                </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Tajweed Rules: Noon Sakinah</CardTitle>
                <p className="text-sm text-muted-foreground">Dec 10, 2024</p>
            </CardHeader>
            <CardContent>
                <p className="text-sm">
                    1. Izhar: Clear pronunciation (throat letters).
                    2. Idgham: Merging (with or without Ghunnah).
                    3. Iqlab: Changing to Meem.
                    4. Ikhfa: Hiding.
                </p>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
