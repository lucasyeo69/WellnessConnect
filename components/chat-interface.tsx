"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Phone, Video, MoreVertical, ArrowLeft, Smile } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  text: string
  sender: "user" | "mentor"
  timestamp: Date
  status?: "sent" | "delivered" | "read"
}

interface ChatInterfaceProps {
  mentor: {
    id: string
    name: string
    avatar: string
    isOnline: boolean
    lastSeen?: Date
  }
  messages: Message[]
  onSendMessage: (text: string) => void
  onBack: () => void
  onCall: () => void
  onVideoCall: () => void
}

export function ChatInterface({
  mentor,
  messages,
  onSendMessage,
  onBack,
  onCall,
  onVideoCall,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim())
      setInputValue("")
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatLastSeen = (date?: Date) => {
    if (!date) return ""
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return "just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Header */}
      <header className="flex items-center gap-3 p-4 bg-card border-b border-border">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="w-5 h-5" />
          <span className="sr-only">Go back</span>
        </Button>

        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wellness-teal-light to-wellness-warm-light flex items-center justify-center text-sm font-semibold text-wellness-teal">
            {mentor.name.split(" ").map((n) => n[0]).join("")}
          </div>
          {mentor.isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-foreground truncate">{mentor.name}</h1>
          <p className="text-xs text-muted-foreground">
            {mentor.isOnline ? "Online" : `Last seen ${formatLastSeen(mentor.lastSeen)}`}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onCall}>
            <Phone className="w-5 h-5" />
            <span className="sr-only">Voice call</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={onVideoCall}>
            <Video className="w-5 h-5" />
            <span className="sr-only">Video call</span>
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
            <span className="sr-only">More options</span>
          </Button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isUser = message.sender === "user"
          const showAvatar =
            index === 0 || messages[index - 1]?.sender !== message.sender

          return (
            <div
              key={message.id}
              className={cn("flex gap-2", isUser ? "flex-row-reverse" : "flex-row")}
            >
              {/* Avatar */}
              {!isUser && showAvatar ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-wellness-teal-light to-wellness-warm-light flex items-center justify-center text-xs font-semibold text-wellness-teal shrink-0">
                  {mentor.name.split(" ").map((n) => n[0]).join("")}
                </div>
              ) : (
                !isUser && <div className="w-8" />
              )}

              {/* Message Bubble */}
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5",
                  isUser
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border rounded-bl-md"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <div
                  className={cn(
                    "flex items-center gap-1 mt-1",
                    isUser ? "justify-end" : "justify-start"
                  )}
                >
                  <span
                    className={cn(
                      "text-xs",
                      isUser ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}
                  >
                    {formatTime(message.timestamp)}
                  </span>
                  {isUser && message.status && (
                    <span className="text-xs text-primary-foreground/70">
                      {message.status === "read" ? "Read" : message.status === "delivered" ? "Delivered" : ""}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-border">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" className="shrink-0">
            <Smile className="w-5 h-5" />
            <span className="sr-only">Add emoji</span>
          </Button>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!inputValue.trim()}
            className="shrink-0 bg-primary hover:bg-primary/90"
          >
            <Send className="w-5 h-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>

        {/* Quick Replies */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {["Hi! How are you?", "I need some support", "Can we schedule a call?", "Thank you!"].map(
            (reply) => (
              <button
                key={reply}
                type="button"
                onClick={() => {
                  onSendMessage(reply)
                }}
                className="shrink-0 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
              >
                {reply}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  )
}
