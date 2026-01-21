"use client"

import { useState, useEffect } from "react"
import { Heart, Sparkles, Star } from "lucide-react"

interface VirtualPetProps {
  happiness: number
  level: number
  streak: number
  name: string
}

export function VirtualPet({ happiness, level, streak, name }: VirtualPetProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [showHearts, setShowHearts] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 500)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const getPetMood = () => {
    if (happiness >= 80) return "thriving"
    if (happiness >= 60) return "happy"
    if (happiness >= 40) return "content"
    return "needs-care"
  }

  const mood = getPetMood()

  const handlePet = () => {
    setShowHearts(true)
    setTimeout(() => setShowHearts(false), 1000)
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Floating particles for high happiness */}
      {happiness >= 70 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <Sparkles
              key={i}
              className="absolute text-wellness-warm animate-pulse"
              style={{
                left: `${20 + i * 30}%`,
                top: `${10 + i * 15}%`,
                animationDelay: `${i * 0.3}s`,
                width: 16,
                height: 16,
              }}
            />
          ))}
        </div>
      )}

      {/* Hearts animation on pet */}
      {showHearts && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1">
          {[...Array(3)].map((_, i) => (
            <Heart
              key={i}
              className="w-4 h-4 text-wellness-coral fill-wellness-coral animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      )}

      {/* Pet container */}
      <button
        onClick={handlePet}
        className="relative cursor-pointer transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
        aria-label={`Pet ${name}`}
      >
        <div
          className={`relative w-40 h-40 rounded-full bg-gradient-to-br from-wellness-teal-light to-wellness-warm-light flex items-center justify-center shadow-lg ${
            isAnimating ? "animate-bounce" : ""
          }`}
        >
          {/* Pet body - friendly blob creature */}
          <svg
            viewBox="0 0 100 100"
            className="w-28 h-28"
            aria-hidden="true"
          >
            {/* Body */}
            <ellipse
              cx="50"
              cy="55"
              rx={mood === "thriving" ? 38 : mood === "happy" ? 35 : 32}
              ry={mood === "thriving" ? 35 : mood === "happy" ? 32 : 30}
              className="fill-wellness-teal transition-all duration-500"
            />
            
            {/* Cheeks */}
            <circle cx="28" cy="58" r="6" className="fill-wellness-coral/40" />
            <circle cx="72" cy="58" r="6" className="fill-wellness-coral/40" />
            
            {/* Eyes */}
            <ellipse
              cx="38"
              cy="48"
              rx="5"
              ry={mood === "thriving" || mood === "happy" ? 3 : 5}
              className="fill-card"
            />
            <ellipse
              cx="62"
              cy="48"
              rx="5"
              ry={mood === "thriving" || mood === "happy" ? 3 : 5}
              className="fill-card"
            />
            
            {/* Pupils */}
            <circle cx="38" cy="48" r="2" className="fill-foreground" />
            <circle cx="62" cy="48" r="2" className="fill-foreground" />
            
            {/* Smile/mouth based on mood */}
            {mood === "thriving" && (
              <path
                d="M 40 62 Q 50 72 60 62"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="text-foreground"
              />
            )}
            {mood === "happy" && (
              <path
                d="M 42 62 Q 50 68 58 62"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-foreground"
              />
            )}
            {mood === "content" && (
              <line
                x1="42"
                y1="64"
                x2="58"
                y2="64"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-foreground"
              />
            )}
            {mood === "needs-care" && (
              <path
                d="M 42 66 Q 50 62 58 66"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-foreground"
              />
            )}
          </svg>

          {/* Level badge */}
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-wellness-warm rounded-full flex items-center justify-center shadow-md">
            <span className="text-sm font-bold text-foreground">Lv{level}</span>
          </div>
        </div>
      </button>

      {/* Pet name */}
      <p className="mt-3 text-lg font-semibold text-foreground">{name}</p>

      {/* Mood indicator */}
      <div className="flex items-center gap-1 mt-1">
        <span className="text-sm text-muted-foreground capitalize">{mood.replace("-", " ")}</span>
        {streak > 0 && (
          <span className="flex items-center gap-1 text-sm text-wellness-warm">
            <Star className="w-3 h-3 fill-wellness-warm" />
            {streak} day streak
          </span>
        )}
      </div>

      {/* Happiness bar */}
      <div className="w-full max-w-[200px] mt-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Happiness</span>
          <span>{happiness}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-wellness-teal to-wellness-warm rounded-full transition-all duration-500"
            style={{ width: `${happiness}%` }}
          />
        </div>
      </div>
    </div>
  )
}
