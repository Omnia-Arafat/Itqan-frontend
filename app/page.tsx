import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Video, Users, Award } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
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
                    <Link href="/mushaf">Read Quran</Link>
                </Button>
            </div>
        </div>
      </section>

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
