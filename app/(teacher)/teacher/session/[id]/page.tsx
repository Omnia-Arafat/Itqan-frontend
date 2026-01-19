"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchWithAuth } from "@/lib/api"
import { toast } from "sonner"
import { Users, Clock, CheckCircle, XCircle, PlayCircle, StopCircle, Eye, Video, UserCircle, BookOpen, ArrowRight, ArrowUp, ArrowDown } from "lucide-react"
import Link from "next/link"

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export default function LiveSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const [sessionId, setSessionId] = useState<string>("")
  const [session, setSession] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])
  const [attendance, setAttendance] = useState<any[]>([])
  const [queue, setQueue] = useState<string[]>([])
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null)
  const [studentProgress, setStudentProgress] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [jitsiLoading, setJitsiLoading] = useState(true)
  const [jitsiError, setJitsiError] = useState<string | null>(null)
  const [meetingActive, setMeetingActive] = useState(false)
  const jitsiContainer = useRef<HTMLDivElement>(null)
  const jitsiApi = useRef<any>(null)

  useEffect(() => {
    params.then(p => setSessionId(p.id))
  }, [params])

  useEffect(() => {
    if (!sessionId) return
    loadSessionData()
    loadJitsiScript()
  }, [sessionId])

  const loadJitsiScript = () => {
    if (document.getElementById('jitsi-script')) {
      // Script already loaded, check if we can initialize
      return
    }
    
    const script = document.createElement('script')
    script.id = 'jitsi-script'
    script.src = 'https://meet.jit.si/external_api.js'
    script.async = true
    document.body.appendChild(script)
  }

  const initJitsi = () => {
    if (!jitsiContainer.current) {
      console.log('Jitsi container not ready')
      return
    }
    
    if (jitsiApi.current) {
      console.log('Jitsi already initialized')
      return
    }

    if (!window.JitsiMeetExternalAPI) {
      console.log('Jitsi API not loaded yet')
      return
    }

    // Create room name from session ID in a format that bypasses lobby
    // Remove all special chars and make it look random to Jitsi
    const cleanId = sessionId.replace(/[^a-zA-Z0-9]/g, '')
    const roomName = `Room${cleanId.substring(0, 20)}`
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    console.log('Initializing Jitsi meeting:', roomName)
    setJitsiLoading(true)
    setJitsiError(null)

    try {
      jitsiApi.current = new window.JitsiMeetExternalAPI('meet.jit.si', {
        roomName,
        parentNode: jitsiContainer.current,
        width: '100%',
        height: '100%',
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: false,
          disableDeepLinking: true,
          startAudioOnly: false,
          enableWelcomePage: false,
          enableNoisyMicDetection: false,
          // Disable lobby/waiting room
          enableLobbyChat: false,
          lobby: {
            autoKnock: true,
            enableChat: false
          },
          // Make meeting more accessible
          requireDisplayName: false,
          enableInsecureRoomNameWarning: false,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'chat', 'raisehand',
            'videoquality', 'filmstrip', 'tileview', 'settings'
          ],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
        },
        userInfo: {
          displayName: user.name || 'Teacher',
          email: user.email || '',
        }
      })

      // Event listeners
      jitsiApi.current.addEventListener('videoConferenceJoined', () => {
        console.log('Joined Jitsi conference')
        setJitsiLoading(false)
        setMeetingActive(true)
        toast.success('Connected to video session')
      })

      jitsiApi.current.addEventListener('participantJoined', (participant: any) => {
        console.log('Participant joined:', participant.displayName)
        toast.info(`${participant.displayName} joined the session`)
      })

      jitsiApi.current.addEventListener('participantLeft', (participant: any) => {
        console.log('Participant left:', participant.displayName)
        toast.info(`${participant.displayName} left the session`)
      })

      jitsiApi.current.addEventListener('videoConferenceLeft', () => {
        console.log('Left Jitsi conference')
        setMeetingActive(false)
      })

      jitsiApi.current.addEventListener('readyToClose', () => {
        console.log('Jitsi ready to close')
        if (jitsiApi.current) {
          jitsiApi.current.dispose()
          jitsiApi.current = null
        }
      })

      jitsiApi.current.addEventListener('errorOccurred', (error: any) => {
        console.error('Jitsi error:', error)
        setJitsiLoading(false)
        
        // Handle specific error types
        let errorMessage = 'Failed to connect to video session'
        if (error.message) {
          if (error.message.includes('membersOnly') || error.message.includes('lobby')) {
            errorMessage = 'Room is in lobby mode. The first person to join becomes the host and can admit others.'
          } else if (error.message.includes('connection')) {
            errorMessage = 'Connection failed. Please check your internet connection.'
          } else {
            errorMessage = error.message
          }
        }
        
        setJitsiError(errorMessage)
        toast.error(errorMessage)
      })

      // Keep loading visible longer - wait for Jitsi to fully load
      setTimeout(() => {
        // Only hide if there's no error
        if (!jitsiError) {
          setJitsiLoading(false)
        }
      }, 10000)

    } catch (error) {
      console.error('Failed to initialize Jitsi:', error)
      setJitsiLoading(false)
      setJitsiError('Failed to load video meeting. Please refresh the page.')
      toast.error('Failed to initialize video meeting. Please try again.')
    }
  }

  const retryJitsi = () => {
    setJitsiError(null)
    setJitsiLoading(true)
    if (jitsiApi.current) {
      jitsiApi.current.dispose()
      jitsiApi.current = null
    }
    setTimeout(() => initJitsi(), 500)
  }

  const loadSessionData = async () => {
    try {
      const [sessionRes, attendanceRes] = await Promise.all([
        fetchWithAuth(`/sessions/${sessionId}`),
        fetchWithAuth(`/sessions/${sessionId}/attendance`)
      ])

      if (sessionRes.ok) {
        const sessionData = await sessionRes.json()
        setSession(sessionData)
        
        // Load enrolled students for this halaqa
        if (sessionData.halaqaId) {
          const halaqaRes = await fetchWithAuth(`/halaqas/${sessionData.halaqaId}`)
          if (halaqaRes.ok) {
            const halaqaData = await halaqaRes.json()
            const enrolledStudents = halaqaData.enrollments?.map((e: any) => e.user) || []
            setStudents(enrolledStudents)
            
            // Initialize queue with enrolled students
            if (queue.length === 0 && enrolledStudents.length > 0) {
              setQueue(enrolledStudents.map((s: any) => s.id))
            }
          }
        }
      }

      if (attendanceRes.ok) {
        setAttendance(await attendanceRes.json())
      }
    } catch (error) {
      console.error("Failed to load session data:", error)
      toast.error("Failed to load session data")
    } finally {
      setLoading(false)
    }
  }

  const loadStudentProgress = async (studentId: string) => {
    try {
      const response = await fetchWithAuth(`/users/${studentId}`)
      if (response.ok) {
        const userData = await response.json()
        setStudentProgress(userData.progress || [])
      }
    } catch (error) {
      console.error("Failed to load student progress:", error)
    }
  }

  const handleNextTurn = () => {
    if (queue.length === 0) {
      toast.info("No students in queue")
      return
    }

    const nextStudentId = queue[0]
    setCurrentStudentId(nextStudentId)
    setQueue(queue.slice(1))
    loadStudentProgress(nextStudentId)
    toast.success("Moved to next student")
  }

  const handleSkipStudent = (studentId: string) => {
    const newQueue = queue.filter(id => id !== studentId)
    newQueue.push(studentId) // Move to end
    setQueue(newQueue)
    toast.info("Student moved to end of queue")
  }

  const moveStudentUp = (studentId: string) => {
    const index = queue.indexOf(studentId)
    if (index <= 0) return
    
    const newQueue = [...queue]
    ;[newQueue[index - 1], newQueue[index]] = [newQueue[index], newQueue[index - 1]]
    setQueue(newQueue)
  }

  const moveStudentDown = (studentId: string) => {
    const index = queue.indexOf(studentId)
    if (index === -1 || index >= queue.length - 1) return
    
    const newQueue = [...queue]
    ;[newQueue[index], newQueue[index + 1]] = [newQueue[index + 1], newQueue[index]]
    setQueue(newQueue)
  }

  const handleEndSession = async () => {
    try {
      if (jitsiApi.current) {
        jitsiApi.current.dispose()
      }

      const response = await fetchWithAuth(`/sessions/${sessionId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "COMPLETED" })
      })

      if (response.ok) {
        toast.success("Session ended successfully")
        setSession({ ...session, status: "COMPLETED" })
        // Clear active session from localStorage
        localStorage.removeItem('activeSession')
      } else {
        toast.error("Failed to end session")
      }
    } catch (error) {
      console.error("Failed to end session:", error)
      toast.error("Failed to end session")
    }
  }

  const markAttendance = async (userId: string, status: string) => {
    try {
      const response = await fetchWithAuth(`/sessions/${sessionId}/attendance`, {
        method: "POST",
        body: JSON.stringify({ userId, status })
      })

      if (response.ok) {
        toast.success(`Marked as ${status.toLowerCase()}`)
        loadSessionData()
      } else {
        toast.error("Failed to mark attendance")
      }
    } catch (error) {
      console.error("Failed to mark attendance:", error)
      toast.error("Failed to mark attendance")
    }
  }

  // Store active session in localStorage
  useEffect(() => {
    if (session?.status === "LIVE" && session.halaqa?.title) {
      localStorage.setItem('activeSession', JSON.stringify({
        sessionId,
        sessionTitle: session.halaqa.title,
        timestamp: Date.now()
      }))
    }
  }, [session?.status, session?.halaqa?.title, sessionId])

  // Initialize Jitsi when session becomes live
  useEffect(() => {
    if (session?.status === "LIVE") {
      // Wait for script to load if not already loaded
      const checkAndInit = () => {
        if (window.JitsiMeetExternalAPI && jitsiContainer.current) {
          initJitsi()
        } else if (!jitsiApi.current) {
          // Retry after a short delay
          setTimeout(checkAndInit, 500)
        }
      }
      
      // Start checking after a small delay to ensure DOM is ready
      setTimeout(checkAndInit, 100)
    }
    
    return () => {
      if (jitsiApi.current) {
        jitsiApi.current.dispose()
        jitsiApi.current = null
      }
    }
  }, [session?.status, sessionId])

  if (loading) {
    return <div className="text-center py-12">Loading session...</div>
  }

  if (!session) {
    return <div className="text-center py-12">Session not found</div>
  }

  const isLive = session.status === "LIVE"
  const isCompleted = session.status === "COMPLETED"
  const currentStudent = students.find(s => s.id === currentStudentId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{session.halaqa?.title}</h2>
          <p className="text-muted-foreground">
            {new Date(session.date).toLocaleString()} • 
            <Badge className={`ml-2 ${
              isLive ? "bg-green-100 text-green-800" : 
              isCompleted ? "bg-gray-100 text-gray-800" : 
              "bg-blue-100 text-blue-800"
            }`}>
              {session.status}
            </Badge>
          </p>
        </div>
        <div className="flex gap-2">
          {isLive && (
            <Button variant="destructive" onClick={handleEndSession}>
              <StopCircle className="h-4 w-4 mr-2" />
              End Session
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href="/teacher/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>

      {/* Jitsi Video Meeting */}
      {isLive && (
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary-600" />
              Live Video Session
              {meetingActive && (
                <Badge className="bg-green-500 text-white animate-pulse">● LIVE</Badge>
              )}
            </CardTitle>
            {meetingActive && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.open(`/teacher/session/${sessionId}`, '_blank')}
              >
                <Video className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[500px] rounded-lg overflow-hidden bg-gray-900 border-2 border-gray-700">
              {/* Loading Overlay - Shows first */}
              {jitsiLoading && (
                <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center z-50">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mb-4"></div>
                  <p className="text-white text-lg font-semibold">Connecting to video session...</p>
                  <p className="text-gray-400 text-sm mt-2">Please wait while we set up the meeting</p>
                </div>
              )}

              {/* Error Overlay - Shows on error */}
              {!jitsiLoading && jitsiError && (
                <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center z-50">
                  <XCircle className="h-16 w-16 text-red-500 mb-4" />
                  <p className="text-white text-lg font-semibold mb-2">Failed to Connect</p>
                  <p className="text-gray-400 text-sm mb-6 max-w-md text-center">{jitsiError}</p>
                  <div className="flex gap-3">
                    <Button onClick={retryJitsi}>
                      Retry Connection
                    </Button>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                      Refresh Page
                    </Button>
                  </div>
                </div>
              )}

              {/* Jitsi Container - Always rendered */}
              <div 
                ref={jitsiContainer} 
                className="w-full h-full"
                style={{ display: (jitsiLoading || jitsiError) ? 'none' : 'block' }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Info */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Halaqa Type</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{session.halaqa?.type || "GENERAL"}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {session.halaqa?.type === "PRIVATE" ? "Only enrolled students" : "Open to all students"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Total enrolled</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendance.filter(a => a.status === "PRESENT").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Marked present</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Queue</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queue.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Students waiting</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Student Turn & Queue Management */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Student */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary-600" />
              Current Student Turn
            </CardTitle>
            <CardDescription>Student reciting now</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStudent ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border-2 border-green-500">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <UserCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{currentStudent.name}</h3>
                    <p className="text-sm text-muted-foreground">{currentStudent.email}</p>
                  </div>
                </div>

                <Separator />

                {/* Student Progress */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Progress History
                  </h4>
                  {studentProgress.length > 0 ? (
                    <div className="space-y-2">
                      {studentProgress.map((progress: any) => (
                        <div key={progress.id} className="p-3 rounded-lg border bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{progress.surah}</p>
                              <p className="text-sm text-muted-foreground">
                                Juz {progress.juz} • Page {progress.page}
                              </p>
                            </div>
                            <Badge className={
                              progress.status === "MEMORIZED" ? "bg-green-100 text-green-800" :
                              progress.status === "REVIEWING" ? "bg-blue-100 text-blue-800" :
                              "bg-yellow-100 text-yellow-800"
                            }>
                              {progress.status}
                            </Badge>
                          </div>
                          {progress.notes && (
                            <p className="text-sm mt-2 text-muted-foreground">{progress.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No progress recorded yet</p>
                  )}
                </div>

                <Button 
                  onClick={handleNextTurn} 
                  className="w-full"
                  disabled={!isLive || queue.length === 0}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Next Student
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <UserCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No student currently selected</p>
                <Button 
                  onClick={handleNextTurn} 
                  disabled={!isLive || queue.length === 0}
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start First Turn
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Turn Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary-600" />
              Turn Queue
            </CardTitle>
            <CardDescription>Manage student order</CardDescription>
          </CardHeader>
          <CardContent>
            {queue.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Queue is empty</p>
            ) : (
              <div className="space-y-2">
                {queue.map((studentId, index) => {
                  const student = students.find(s => s.id === studentId)
                  if (!student) return null

                  return (
                    <div 
                      key={studentId}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{student.name}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveStudentUp(studentId)}
                          disabled={index === 0 || !isLive}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveStudentDown(studentId)}
                          disabled={index === queue.length - 1 || !isLive}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Student Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Student Attendance</CardTitle>
          <CardDescription>
            Mark attendance for {session.halaqa?.type === "PRIVATE" ? "enrolled" : "all"} students
          </CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No students enrolled in this halaqa</p>
          ) : (
            <div className="space-y-3">
              {students.map((student) => {
                const studentAttendance = attendance.find(a => a.userId === student.id)
                
                return (
                  <div key={student.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {studentAttendance ? (
                        <Badge className={
                          studentAttendance.status === "PRESENT" ? "bg-green-100 text-green-800" :
                          studentAttendance.status === "LATE" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }>
                          {studentAttendance.status}
                        </Badge>
                      ) : (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-green-500 text-green-600 hover:bg-green-50"
                            onClick={() => markAttendance(student.id, "PRESENT")}
                            disabled={!isLive}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Present
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                            onClick={() => markAttendance(student.id, "LATE")}
                            disabled={!isLive}
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Late
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50"
                            onClick={() => markAttendance(student.id, "ABSENT")}
                            disabled={!isLive}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Absent
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meeting Instructions */}
      {isLive && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm">📹 Video Meeting Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <p><strong>Getting Started:</strong></p>
              <ul className="ml-4 list-disc space-y-1 text-muted-foreground">
                <li>If you see "Join meeting" or "Start meeting" button, click it</li>
                <li>If you see "Ask to join", you may need to wait for the host</li>
                <li>Allow camera and microphone permissions when prompted</li>
                <li>The first person to join becomes the moderator automatically</li>
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                <strong>Note:</strong> If connection fails, click "Retry Connection" or refresh the page. 
                The video meeting uses Jitsi Meet public servers.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
