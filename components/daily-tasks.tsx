"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2, Circle, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  xp: number
  type: "lesson" | "reflection" | "activity" | "social"
}

interface DailyTasksProps {
  tasks: Task[]
  onToggleTask: (taskId: string) => void
}

const typeColors = {
  lesson: "bg-wellness-teal-light text-wellness-teal",
  reflection: "bg-wellness-warm-light text-wellness-warm",
  activity: "bg-wellness-coral-light text-wellness-coral",
  social: "bg-primary/10 text-primary",
}

export function DailyTasks({ tasks, onToggleTask }: DailyTasksProps) {
  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Today&apos;s Tasks</h2>
        <span className="text-sm text-muted-foreground">
          {completedCount}/{tasks.length} complete
        </span>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <Card
            key={task.id}
            className={cn(
              "p-3 cursor-pointer transition-all",
              task.completed && "bg-muted/50"
            )}
            onClick={() => onToggleTask(task.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onToggleTask(task.id)
              }
            }}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "font-medium text-sm",
                      task.completed ? "line-through text-muted-foreground" : "text-foreground"
                    )}
                  >
                    {task.title}
                  </span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full", typeColors[task.type])}>
                    {task.type}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
              </div>
              <div className="flex items-center gap-1 text-sm text-wellness-warm">
                <Sparkles className="w-3 h-3" />
                <span>+{task.xp}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
