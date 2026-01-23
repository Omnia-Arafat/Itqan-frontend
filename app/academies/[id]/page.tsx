import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Users, BookOpen, Mail, Phone, Globe, ArrowLeft, Calendar, Video } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

async function getAcademy(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/academies/${id}?details=true`, {
      cache: 'no-store'
    })
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch academy:', error)
  }
  return null
}

export default async function AcademyProfilePage({ params }: { params: { id: string } }) {
  const academy = await getAcademy(params.id)

  if (!academy) {
    notFound()
  }

  const students = academy.userRoles?.filter((role: any) => role.role === 'STUDENT') || []
  const teachers = academy.userRoles?.filter((role: any) => role.role === 'TEACHER') || []
  const publicHalaqas = academy.halaqas?.filter((halaqa: any) => halaqa.type === 'GENERAL') || []

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/academies">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {academy.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{academy.name}</h1>
                <div className="flex items-center gap-4 mt-2">
                  {academy.establishedYear && (
                    <span className="text-muted-foreground">Est. {academy.establishedYear}</span>
                  )}
                  <Badge variant={academy.visibility === 'PUBLIC' ? 'default' : 'secondary'}>
                    {academy.visibility}
                  </Badge>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    {academy.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button asChild>
              <Link href={`/register?academy=${academy.id}`}>Join Academy</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/register?academy=${academy.id}&role=teacher`}>Join as Teacher</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="halaqas">Halaqas ({publicHalaqas.length})</TabsTrigger>
                <TabsTrigger value="teachers">Teachers ({teachers.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>About {academy.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {academy.description || "No description available for this academy."}
                    </p>
                  </CardContent>
                </Card>

                {/* Statistics */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="py-6 text-center">
                      <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold">{students.length}</p>
                      <p className="text-sm text-muted-foreground">Students</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="py-6 text-center">
                      <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold">{teachers.length}</p>
                      <p className="text-sm text-muted-foreground">Teachers</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="py-6 text-center">
                      <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold">{academy.halaqas?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">Halaqas</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="halaqas" className="space-y-4">
                {publicHalaqas.length > 0 ? (
                  <div className="grid gap-4">
                    {publicHalaqas.map((halaqa: any) => (
                      <Card key={halaqa.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{halaqa.title}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                with {halaqa.teacher?.name}
                              </p>
                            </div>
                            <Badge variant="outline">{halaqa.type}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {halaqa.description && (
                              <p className="text-sm text-muted-foreground">
                                {halaqa.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{halaqa._count?.enrollments || 0} students</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Created {new Date(halaqa.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" asChild>
                                <Link href={`/register?academy=${academy.id}&halaqa=${halaqa.id}`}>
                                  Join Halaqa
                                </Link>
                              </Button>
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/halaqas/${halaqa.id}`}>View Details</Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No public halaqas available</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="teachers" className="space-y-4">
                {teachers.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {teachers.map((teacherRole: any) => (
                      <Card key={teacherRole.id}>
                        <CardContent className="py-6">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-lg font-semibold text-primary">
                                {teacherRole.user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{teacherRole.user.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Joined {new Date(teacherRole.joinedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No teachers listed publicly</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {academy.contactEmail && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{academy.contactEmail}</p>
                    </div>
                  </div>
                )}
                
                {academy.contactPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{academy.contactPhone}</p>
                    </div>
                  </div>
                )}

                {academy.websiteUrl && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Website</p>
                      <a 
                        href={academy.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}

                {academy.address && (
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{academy.address}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href={`/register?academy=${academy.id}`}>
                    Join as Student
                  </Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link href={`/register?academy=${academy.id}&role=teacher`}>
                    Apply as Teacher
                  </Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/academies">
                    Browse Other Academies
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Academy Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Academy Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Founded:</span>
                  <span>{academy.establishedYear || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Joined Itqan:</span>
                  <span>{new Date(academy.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Members:</span>
                  <span>{academy._count?.userRoles || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Halaqas:</span>
                  <span>{academy._count?.halaqas || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}