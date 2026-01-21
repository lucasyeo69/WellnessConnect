"use client"

import { MessageCircle, BookOpen, CheckSquare, ShoppingBag, Phone } from "lucide-react"
import { Card } from "@/components/ui/card"

interface QuickActionsProps {
  onAction: (action: string) => void
}

const actions = [
  {
    id: "message",
    label: "Message Mentor",
    icon: MessageCircle,
    color: "bg-wellness-teal-light text-wellness-teal",
    description: "Chat with your mentor"
  },
  {
    id: "lesson",
    label: "Quick Lesson",
    icon: BookOpen,
    color: "bg-wellness-warm-light text-wellness-warm",
    description: "5-min learning bite"
  },
  {
    id: "task",
    label: "Daily Task",
    icon: CheckSquare,
    color: "bg-wellness-coral-light text-wellness-coral",
    description: "Complete today's goal"
  },
  {
    id: "store",
    label: "Pet Store",
    icon: ShoppingBag,
    color: "bg-primary/10 text-primary",
    description: "Buy food for Buddy"
  },
]

export function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Card
            key={action.id}
            className="p-4 cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => onAction(action.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onAction(action.id)
              }
            }}
          >
            <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">{action.label}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
          </Card>
        )
      })}
    </div>
  )
}
