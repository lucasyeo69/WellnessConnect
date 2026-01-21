"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Phone, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MentorCardProps {
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
  onMessage: () => void
  onCall: () => void
}

export function MentorCard({ mentor, onMessage, onCall }: MentorCardProps) {
  return (
    <Card className="p-4">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-wellness-teal-light to-wellness-warm-light flex items-center justify-center text-2xl font-semibold text-wellness-teal">
            {mentor.name.split(" ").map(n => n[0]).join("")}
          </div>
          {mentor.isOnline && (
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground">{mentor.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-3 h-3 fill-wellness-warm text-wellness-warm" />
                <span>{mentor.rating}</span>
                <span className="mx-1">·</span>
                <span>{mentor.sessionsCompleted} sessions</span>
              </div>
            </div>
            <Badge variant={mentor.isOnline ? "default" : "secondary"} className={mentor.isOnline ? "bg-green-500/10 text-green-600 border-green-500/20" : ""}>
              {mentor.isOnline ? "Online" : "Away"}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{mentor.bio}</p>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {mentor.specialty.map((spec) => (
              <Badge key={spec} variant="outline" className="text-xs bg-wellness-teal-light/50 border-wellness-teal/20 text-wellness-teal">
                {spec}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <Button
          variant="default"
          className="flex-1 bg-primary hover:bg-primary/90"
          onClick={onMessage}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Message
        </Button>
        <Button
          variant="outline"
          className="flex-1 bg-transparent"
          onClick={onCall}
        >
          <Phone className="w-4 h-4 mr-2" />
          Call
        </Button>
      </div>
    </Card>
  )
}
