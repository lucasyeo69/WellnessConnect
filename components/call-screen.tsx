"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from "lucide-react"

interface CallScreenProps {
  mentor: {
    name: string
    avatar: string
  }
  isIncoming?: boolean
  onAccept?: () => void
  onDecline: () => void
  onEnd: () => void
}

export function CallScreen({
  mentor,
  isIncoming = false,
  onAccept,
  onDecline,
  onEnd,
}: CallScreenProps) {
  const [callDuration, setCallDuration] = useState(0)
  const [isConnected, setIsConnected] = useState(!isIncoming)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeaker, setIsSpeaker] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isConnected])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAccept = () => {
    setIsConnected(true)
    onAccept?.()
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-primary/90 to-wellness-teal z-50 flex flex-col items-center justify-between py-16 px-6">
      {/* Mentor Info */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-28 h-28 rounded-full bg-card/20 flex items-center justify-center text-4xl font-semibold text-card backdrop-blur-sm">
          {mentor.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-card">{mentor.name}</h1>
          <p className="text-card/80 mt-1">
            {isIncoming && !isConnected
              ? "Incoming call..."
              : isConnected
              ? formatDuration(callDuration)
              : "Calling..."}
          </p>
        </div>
      </div>

      {/* Animated waves */}
      {isConnected && (
        <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-1 bg-card/60 rounded-full animate-pulse"
            style={{
              height: `${20 + (i % 3) * 10}px`, 
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col items-center gap-6">
        {/* Secondary controls */}
        {isConnected && (
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              className={`w-14 h-14 rounded-full ${
                isMuted ? "bg-card/30 text-card" : "bg-card/20 text-card"
              }`}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`w-14 h-14 rounded-full ${
                isSpeaker ? "bg-card/30 text-card" : "bg-card/20 text-card"
              }`}
              onClick={() => setIsSpeaker(!isSpeaker)}
            >
              {isSpeaker ? (
                <Volume2 className="w-6 h-6" />
              ) : (
                <VolumeX className="w-6 h-6" />
              )}
              <span className="sr-only">{isSpeaker ? "Speaker off" : "Speaker on"}</span>
            </Button>
          </div>
        )}

        {/* Main controls */}
        <div className="flex items-center gap-8">
          {isIncoming && !isConnected ? (
            <>
              <Button
                size="icon"
                className="w-16 h-16 rounded-full bg-destructive hover:bg-destructive/90"
                onClick={onDecline}
              >
                <PhoneOff className="w-7 h-7" />
                <span className="sr-only">Decline call</span>
              </Button>
              <Button
                size="icon"
                className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600"
                onClick={handleAccept}
              >
                <Phone className="w-7 h-7" />
                <span className="sr-only">Accept call</span>
              </Button>
            </>
          ) : (
            <Button
              size="icon"
              className="w-16 h-16 rounded-full bg-destructive hover:bg-destructive/90"
              onClick={onEnd}
            >
              <PhoneOff className="w-7 h-7" />
              <span className="sr-only">End call</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
