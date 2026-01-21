"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Bell, 
  MessageSquare, 
  Phone, 
  Video, 
  Calendar, 
  TrendingUp, 
  BookOpen, 
  Target,
  LogOut,
  Settings,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react"

interface StudentData {
  id: string
  name: string
  email: string
  avatar: string
  joinedAt: Date
  streak: number
  xp: number
  lessonsCompleted: number
  totalLessons: number
  lastActive: Date
  mood: "great" | "good" | "okay" | "struggling"
  tasksCompletedToday: number
  totalTasksToday: number
}

interface MentorData {
  name: string
  email: string
  specialty: string[]
  sessionsCompleted: number
  totalHoursSupport: number
}

interface MentorDashboardProps {
  mentor: MentorData
  student: StudentData
  onChat: () => void
  onCall: () => void
  onVideoCall: () => void
  onLogout: () => void
}

export function MentorDashboard({
  mentor,
  student,
  onChat,
  onCall,
  onVideoCall,
  onLogout,
}: MentorDashboardProps) {
  const [showSettings, setShowSettings] = useState(false)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const formatLastActive = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "great":
        return "bg-green-100 text-green-700"
      case "good":
        return "bg-blue-100 text-blue-700"
      case "okay":
        return "bg-yellow-100 text-yellow-700"
      case "struggling":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getMoodLabel = (mood: string) => {
    switch (mood) {
      case "great":
        return "Feeling Great"
      case "good":
        return "Feeling Good"
      case "okay":
        return "Doing Okay"
      case "struggling":
        return "Needs Support"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{getGreeting()}</p>
            <h1 className="text-xl font-bold text-foreground">{mentor.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-wellness-coral rounded-full" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="w-5 h-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 pb-8 space-y-6">
        {/* Mentor Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Sessions</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{mentor.sessionsCompleted}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-wellness-warm/10 to-wellness-warm/5">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-wellness-warm" />
              <span className="text-sm text-muted-foreground">Support Hours</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{mentor.totalHoursSupport}h</p>
          </Card>
        </div>

        {/* Your Student Section */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Your Student</h2>
          
          <Card className="p-5">
            {/* Student Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-wellness-teal-light to-wellness-warm-light flex items-center justify-center text-xl font-semibold text-wellness-teal">
                  {student.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-card flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg">{student.name}</h3>
                <p className="text-sm text-muted-foreground">{student.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getMoodColor(student.mood)}`}>
                    {getMoodLabel(student.mood)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Active {formatLastActive(student.lastActive)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <Button onClick={onChat} className="flex-col h-auto py-3 bg-transparent" variant="outline">
                <MessageSquare className="w-5 h-5 mb-1" />
                <span className="text-xs">Message</span>
              </Button>
              <Button onClick={onCall} className="flex-col h-auto py-3 bg-transparent" variant="outline">
                <Phone className="w-5 h-5 mb-1" />
                <span className="text-xs">Call</span>
              </Button>
              <Button onClick={onVideoCall} className="flex-col h-auto py-3 bg-transparent" variant="outline">
                <Video className="w-5 h-5 mb-1" />
                <span className="text-xs">Video</span>
              </Button>
            </div>

            {/* Student Progress */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Progress Overview
              </h4>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-wellness-coral" />
                    <span className="text-xs text-muted-foreground">Streak</span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">{student.streak} days</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Lessons</span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {student.lessonsCompleted}/{student.totalLessons}
                  </p>
                </div>
              </div>

              {/* Today's Activity */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Todays Tasks</span>
                  <span className="text-sm text-muted-foreground">
                    {student.tasksCompletedToday}/{student.totalTasksToday}
                  </span>
                </div>
                <div className="h-2 bg-card rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-wellness-warm rounded-full transition-all"
                    style={{ width: `${(student.tasksCompletedToday / student.totalTasksToday) * 100}%` }}
                  />
                </div>
              </div>

              {/* XP Progress */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Total XP Earned</span>
                  <span className="text-sm font-semibold text-wellness-warm">{student.xp} XP</span>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Suggested Actions */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Suggested Actions</h2>
          <div className="space-y-2">
            {student.mood === "struggling" && (
              <Card className="p-4 flex items-center gap-3 border-wellness-coral/30 bg-wellness-coral-light/30">
                <div className="w-10 h-10 rounded-full bg-wellness-coral/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-wellness-coral" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Check in with {student.name}</p>
                  <p className="text-sm text-muted-foreground">They may need extra support today</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Card>
            )}
            <Card className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Schedule weekly check-in</p>
                <p className="text-sm text-muted-foreground">Plan your next session</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Card>
            <Card className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-wellness-warm/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-wellness-warm" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Recommend a lesson</p>
                <p className="text-sm text-muted-foreground">Based on their progress</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Card>
          </div>
        </section>

        {/* NHG Resources */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">NHG Resources</h2>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-3">
              Access training materials and support resources from the NHG Community Care Network.
            </p>
            <Button variant="outline" className="w-full bg-transparent">
              View Resources
            </Button>
          </Card>
        </section>

        {/* Logout */}
        <Button 
          variant="ghost" 
          className="w-full text-muted-foreground hover:text-foreground"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </main>
    </div>
  )
}
