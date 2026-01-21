"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Flame,
  Target,
  BookOpen,
  MessageCircle,
  TrendingUp,
  Calendar,
  Award,
  Star,
} from "lucide-react"

interface WeekDay {
  day: string
  completed: boolean
  tasksCompleted: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: Date
  progress?: number
  maxProgress?: number
}

interface ProgressViewProps {
  stats: {
    currentStreak: number
    longestStreak: number
    totalXp: number
    level: number
    xpToNextLevel: number
    lessonsCompleted: number
    totalLessons: number
    messagesExchanged: number
    tasksCompleted: number
  }
  weeklyActivity: WeekDay[]
  achievements: Achievement[]
  moodHistory: Array<{ date: Date; mood: number }>
}

export function ProgressView({
  stats,
  weeklyActivity,
  achievements,
}: ProgressViewProps) {
  const xpProgress = ((stats.totalXp % 500) / 500) * 100

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold text-foreground">Your Progress</h1>
        <p className="text-muted-foreground mt-1">Track your wellness journey</p>
      </header>

      {/* Level & XP Card */}
      <Card className="p-5 bg-gradient-to-br from-primary/10 via-wellness-teal-light/50 to-wellness-warm-light/50">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-foreground">
              {stats.level}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">Level {stats.level}</p>
            <p className="text-sm text-muted-foreground">
              {stats.xpToNextLevel} XP to next level
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{stats.totalXp}</p>
            <p className="text-xs text-muted-foreground">Total XP</p>
          </div>
        </div>
        <Progress value={xpProgress} className="h-3" />
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-wellness-coral-light flex items-center justify-center">
              <Flame className="w-5 h-5 text-wellness-coral" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.currentStreak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-wellness-warm-light flex items-center justify-center">
              <Star className="w-5 h-5 text-wellness-warm" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.longestStreak}</p>
              <p className="text-xs text-muted-foreground">Best Streak</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-wellness-teal-light flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-wellness-teal" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.lessonsCompleted}
              </p>
              <p className="text-xs text-muted-foreground">Lessons Done</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.tasksCompleted}
              </p>
              <p className="text-xs text-muted-foreground">Tasks Done</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Activity */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          This Week
        </h2>
        <Card className="p-4">
          <div className="flex justify-between">
            {weeklyActivity.map((day) => (
              <div key={day.day} className="flex flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground">{day.day}</span>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    day.completed
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {day.completed ? (
                    <Flame className="w-5 h-5" />
                  ) : (
                    <span className="text-xs">{day.tasksCompleted}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Achievements */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Achievements
        </h2>
        <div className="grid gap-3">
          {achievements.map((achievement) => {
            const isUnlocked = !!achievement.unlockedAt
            return (
              <Card
                key={achievement.id}
                className={`p-4 ${!isUnlocked && "opacity-60"}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      isUnlocked
                        ? "bg-wellness-warm-light"
                        : "bg-muted grayscale"
                    }`}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">
                      {achievement.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    {!isUnlocked && achievement.progress !== undefined && (
                      <div className="mt-2">
                        <Progress
                          value={
                            (achievement.progress / (achievement.maxProgress || 1)) * 100
                          }
                          className="h-1.5"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {achievement.progress}/{achievement.maxProgress}
                        </p>
                      </div>
                    )}
                  </div>
                  {isUnlocked && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Unlocked</p>
                      <p className="text-xs text-primary font-medium">
                        {achievement.unlockedAt?.toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Mentor Connection Stats */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Mentor Connection
        </h2>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Messages Exchanged</p>
                <p className="text-sm text-muted-foreground">
                  Building your support network
                </p>
              </div>
            </div>
            <p className="text-2xl font-bold text-primary">
              {stats.messagesExchanged}
            </p>
          </div>
        </Card>
      </section>
    </div>
  )
}
