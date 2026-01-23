import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Video, Users, Award, Calendar, Clock } from "lucide-react"
import Link from "next/link"

async function getPublicHalaqas() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/halaqas/public`, {
      cache: 'no-store'
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch public halaqas:', error)
  }
  return []
}

async function getAcademies() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/academies`, {
      cache: 'no-store'
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch academies:', error)
  }
  return []
}

export default async function LandingPage() {
  const [publicHalaqas, academies] = await Promise.all([
    getPublicHalaqas(),
    getAcademies()
  ])

  const liveHalaqas = publicHalaqas.filter((h: any) => h.sessions?.some((s: any) => s.status === 'LIVE'))

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white overflow-hidden">
        <div 
            className="absolute inset-0 z-0"
            style={{
                backgroundImage: "url('/landing-hero.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                Master the Quran
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
                Connect with expert teachers, track your progress, and perfect your recitation from anywhere in the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90" asChild>
                    <Link href="/register">Start Your Journey</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 hover:bg-white/20 border-white text-white" asChild>
                    <Link href="/login">Login</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 hover:bg-white/20 border-white text-white" asChild>
                    <Link href="/academies">Browse Academies</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 hover:bg-white/20 border-white text-white" asChild>
                    <Link href="/halaqas">Browse Halaqas</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 hover:bg-white/20 border-white text-white" asChild>
                    <Link href="/mushaf">Read Quran</Link>
                </Button>
            </div>
        </div>
      </section>

      {/* Academy Registration CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bring Your Academy to Itqan
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-3xl mx-auto">
            Join our growing network of Islamic academies. Manage your students, teachers, and halaqas 
            with our comprehensive platform designed for Quran education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <Link href="/academy-registration">Register Your Academy</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link href="/academies">Browse Existing Academies</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Live Halaqas Section */}
      {liveHalaqas.length > 0 && (
        <section className="py-16 bg-red-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-red-600 animate-pulse" />
                <h2 className="text-3xl font-bold text-red-900">Live Halaqas Now</h2>
              </div>
              <p className="text-red-700">Join ongoing Quran study sessions</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {liveHalaqas.slice(0, 6).map((halaqa: any) => (
                <Card key={halaqa.id} className="border-red-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{halaqa.title}</CardTitle>
                      <Badge className="bg-red-600 text-white animate-pulse">LIVE</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">with {halaqa.teacher.name}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="mr-2 h-4 w-4" />
                        <span>{halaqa.academy.name}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>{halaqa.enrollments?.length || 0} students</span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" className="flex-1" asChild>
                        <Link href="/register">Join to Watch</Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/login`}>Login</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {liveHalaqas.length > 6 && (
              <div className="text-center mt-8">
                <Button variant="outline" asChild>
                  <Link href="/halaqas">View All Live Halaqas</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Public Halaqas Section */}
      {publicHalaqas.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Available Halaqas</h2>
              <p className="text-slate-600">Join these public Quran study circles</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {publicHalaqas.slice(0, 6).map((halaqa: any) => (
                <Card key={halaqa.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{halaqa.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">with {halaqa.teacher.name}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="mr-2 h-4 w-4" />
                        <span>{halaqa.academy.name}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>{halaqa.enrollments?.length || 0} students enrolled</span>
                      </div>
                      {halaqa.description && (
                        <p className="text-muted-foreground line-clamp-2 mt-2">
                          {halaqa.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" asChild>
                        <Link href="/register">Join Halaqa</Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href="/login">Login</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {publicHalaqas.length > 6 && (
              <div className="text-center mt-8">
                <Button asChild>
                  <Link href="/register">View All Halaqas</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Academies Section */}
      {academies.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Partner Academies</h2>
              <p className="text-slate-600">Learn from qualified institutions worldwide</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {academies.slice(0, 8).map((academy: any) => (
                <Card key={academy.id} className="text-center">
                  <CardContent className="pt-6">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {academy.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2">{academy.name}</h3>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/register">Join Academy</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Why Choose Itqan?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeatureCard 
                    icon={<Video className="h-10 w-10 text-primary" />}
                    title="Live Halaqas"
                    description="Join real-time video sessions with qualified Sheikhs."
                />
                <FeatureCard 
                    icon={<BookOpen className="h-10 w-10 text-primary" />}
                    title="Digital Mushaf"
                    description="Read directly from high-quality Quran pages during class."
                />
                <FeatureCard 
                    icon={<Award className="h-10 w-10 text-primary" />}
                    title="Progress Tracking"
                    description="Visualize your Hifz and Tajweed improvements over time."
                />
                <FeatureCard 
                    icon={<Users className="h-10 w-10 text-primary" />}
                    title="Community"
                    description="Learn alongside motivated students from around the globe."
                />
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-900 text-slate-400 text-center">
        <p>© 2024 Itqan Platform. All rights reserved.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
                <div className="mb-4">{icon}</div>
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}
