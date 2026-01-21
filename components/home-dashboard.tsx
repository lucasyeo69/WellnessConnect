"use client"

import { VirtualPet } from "./virtual-pet"
import { QuickActions } from "./quick-actions"
import { DailyTasks } from "./daily-tasks"
import { MentorCard } from "./mentor-card"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HomeDashboardProps {
  user: {
    name: string
    petName: string
    petLevel: number
    petHappiness: number
    streak: number
    xp: number
  }
  mentor: {
    id: string
    name: string
    avatar: string
    specialty: string[]
    bio: string
    rating: number
    sessionsCompleted: number
    isOnline: boolean
  }
  tasks: Array<{
    id: string
    title: string
    description: string
    completed: boolean
    xp: number
    type: "lesson" | "reflection" | "activity" | "social"
  }>
  onAction: (action: string) => void
  onToggleTask: (taskId: string) => void
  onMessageMentor: () => void
  onCallMentor: () => void
}

export function HomeDashboard({
  user,
  mentor,
  tasks,
  onAction,
  onToggleTask,
  onMessageMentor,
  onCallMentor,
}: HomeDashboardProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{getGreeting()}</p>
          <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-wellness-coral rounded-full" />
          <span className="sr-only">Notifications</span>
        </Button>
      </header>

      {/* Virtual Pet */}
      <section className="flex justify-center py-4" aria-labelledby="pet-section">
        <h2 id="pet-section" className="sr-only">Your Virtual Pet</h2>
        <VirtualPet
          name={user.petName}
          level={user.petLevel}
          happiness={user.petHappiness}
          streak={user.streak}
        />
      </section>

      {/* XP Progress */}
      <section className="bg-gradient-to-r from-primary/10 to-wellness-warm/10 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Level {user.petLevel} Progress</span>
          <span className="text-sm text-muted-foreground">{user.xp}/500 XP</span>
        </div>
        <div className="h-2 bg-card rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-wellness-warm rounded-full transition-all duration-500"
            style={{ width: `${(user.xp / 500) * 100}%` }}
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section aria-labelledby="actions-heading">
        <h2 id="actions-heading" className="text-lg font-semibold text-foreground mb-3">
          Quick Actions
        </h2>
        <QuickActions onAction={onAction} />
      </section>

      {/* Your Mentor */}
      <section aria-labelledby="mentor-heading">
        <h2 id="mentor-heading" className="text-lg font-semibold text-foreground mb-3">
          Your Mentor
        </h2>
        <MentorCard
          mentor={mentor}
          onMessage={onMessageMentor}
          onCall={onCallMentor}
        />
      </section>

      {/* Daily Tasks */}
      <section aria-labelledby="tasks-heading">
        <h2 id="tasks-heading" className="sr-only">Daily Tasks</h2>
        <DailyTasks tasks={tasks} onToggleTask={onToggleTask} />
      </section>
    </div>
  )
}
