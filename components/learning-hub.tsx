"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Clock,
  Play,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles,
  Brain,
  Heart,
  Users,
  Flame,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Lesson {
  id: string
  title: string
  description: string
  duration: string
  type: "video" | "article" | "quiz" | "activity"
  completed: boolean
  locked: boolean
  xp: number
}

interface Module {
  id: string
  title: string
  description: string
  icon: "brain" | "heart" | "users" | "flame"
  progress: number
  lessons: Lesson[]
  color: string
}

interface LearningHubProps {
  modules: Module[]
  currentStreak: number
  weeklyGoal: number
  weeklyProgress: number
  onStartLesson: (moduleId: string, lessonId: string) => void
}

const iconMap = {
  brain: Brain,
  heart: Heart,
  users: Users,
  flame: Flame,
}

const typeIcons = {
  video: Play,
  article: BookOpen,
  quiz: Brain,
  activity: Heart,
}

export function LearningHub({
  modules,
  currentStreak,
  weeklyGoal,
  weeklyProgress,
  onStartLesson,
}: LearningHubProps) {
  const [expandedModule, setExpandedModule] = useState<string | null>(modules[0]?.id || null)

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold text-foreground">Learn</h1>
        <p className="text-muted-foreground mt-1">Bite-sized lessons for your wellness journey</p>
      </header>

      {/* Weekly Progress Card */}
      <Card className="p-4 bg-gradient-to-r from-primary/10 to-wellness-warm/10 border-primary/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-wellness-warm flex items-center justify-center">
              <Flame className="w-5 h-5 text-card" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{currentStreak} Day Streak</p>
              <p className="text-xs text-muted-foreground">Keep it going!</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">
              {weeklyProgress}/{weeklyGoal} lessons
            </p>
            <p className="text-xs text-muted-foreground">This week</p>
          </div>
        </div>
        <Progress value={(weeklyProgress / weeklyGoal) * 100} className="h-2" />
      </Card>

      {/* Quick Start */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3">Continue Learning</h2>
        <Card className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-wellness-teal-light flex items-center justify-center">
            <Play className="w-6 h-6 text-wellness-teal" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">Understanding Your Emotions</p>
            <p className="text-sm text-muted-foreground">Module 2, Lesson 3</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>5 min</span>
          </div>
        </Card>
      </section>

      {/* Modules List */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3">Learning Paths</h2>
        <div className="space-y-3">
          {modules.map((module) => {
            const Icon = iconMap[module.icon]
            const isExpanded = expandedModule === module.id

            return (
              <Card key={module.id} className="overflow-hidden">
                {/* Module Header */}
                <button
                  className="w-full p-4 flex items-center gap-4 text-left hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                  aria-expanded={isExpanded}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      module.color
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{module.title}</h3>
                      {module.progress === 100 && (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {module.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Progress value={module.progress} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground">
                        {module.progress}%
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className={cn(
                      "w-5 h-5 text-muted-foreground transition-transform",
                      isExpanded && "rotate-90"
                    )}
                  />
                </button>

                {/* Lessons */}
                {isExpanded && (
                  <div className="border-t border-border">
                    {module.lessons.map((lesson, index) => {
                      const TypeIcon = typeIcons[lesson.type]
                      return (
                        <div
                          key={lesson.id}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0",
                            lesson.locked && "opacity-50"
                          )}
                        >
                          <div className="relative">
                            <div
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                                lesson.completed
                                  ? "bg-primary text-primary-foreground"
                                  : lesson.locked
                                  ? "bg-muted text-muted-foreground"
                                  : "bg-muted text-foreground"
                              )}
                            >
                              {lesson.completed ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : lesson.locked ? (
                                <Lock className="w-4 h-4" />
                              ) : (
                                index + 1
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                "font-medium text-sm",
                                lesson.completed
                                  ? "text-muted-foreground"
                                  : "text-foreground"
                              )}
                            >
                              {lesson.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <TypeIcon className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground capitalize">
                                {lesson.type}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                · {lesson.duration}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className="text-xs bg-wellness-warm/10 text-wellness-warm"
                            >
                              <Sparkles className="w-3 h-3 mr-1" />
                              +{lesson.xp}
                            </Badge>
                            {!lesson.locked && !lesson.completed && (
                              <Button
                                size="sm"
                                onClick={() => onStartLesson(module.id, lesson.id)}
                              >
                                Start
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
