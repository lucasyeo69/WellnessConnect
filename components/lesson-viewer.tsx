"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Play,
  Pause,
  Volume2,
  Sparkles,
} from "lucide-react"

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
}

interface LessonViewerProps {
  lesson: {
    id: string
    title: string
    type: "video" | "article" | "quiz" | "activity"
    content: string
    videoUrl?: string
    quiz?: QuizQuestion[]
    xp: number
  }
  onBack: () => void
  onComplete: () => void
}

export function LessonViewer({ lesson, onBack, onComplete }: LessonViewerProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const isQuiz = lesson.type === "quiz" && lesson.quiz
  const totalSteps = isQuiz ? lesson.quiz!.length : 1
  const progress = ((currentStep + 1) / totalSteps) * 100

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerIndex }))
  }

  const handleNext = () => {
    if (isQuiz && currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1)
    } else if (isQuiz) {
      setShowResults(true)
    } else {
      onComplete()
    }
  }

  const getQuizScore = () => {
    if (!lesson.quiz) return 0
    let correct = 0
    for (const q of lesson.quiz) {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++
      }
    }
    return correct
  }

  if (showResults && isQuiz) {
    const score = getQuizScore()
    const percentage = Math.round((score / lesson.quiz!.length) * 100)
    const passed = percentage >= 70

    return (
      <div className="flex flex-col min-h-full">
        {/* Header */}
        <header className="flex items-center gap-3 p-4 bg-card border-b border-border">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
            <span className="sr-only">Go back</span>
          </Button>
          <h1 className="font-semibold text-foreground flex-1">Quiz Results</h1>
        </header>

        {/* Results */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
              passed ? "bg-primary/10" : "bg-wellness-coral/10"
            }`}
          >
            <span
              className={`text-4xl font-bold ${
                passed ? "text-primary" : "text-wellness-coral"
              }`}
            >
              {percentage}%
            </span>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">
            {passed ? "Great job!" : "Keep practicing!"}
          </h2>
          <p className="text-muted-foreground mb-6">
            You got {score} out of {lesson.quiz!.length} questions correct.
          </p>

          {passed && (
            <div className="flex items-center gap-2 text-wellness-warm mb-6">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">+{lesson.xp} XP earned!</span>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack}>
              Back to Lessons
            </Button>
            {passed ? (
              <Button onClick={onComplete}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Complete
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setCurrentStep(0)
                  setSelectedAnswers({})
                  setShowResults(false)
                }}
              >
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 bg-card border-b border-border">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
          <span className="sr-only">Go back</span>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-foreground truncate">{lesson.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Progress value={progress} className="h-1.5 flex-1 max-w-[120px]" />
            <span className="text-xs text-muted-foreground">
              {currentStep + 1}/{totalSteps}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-wellness-warm">
          <Sparkles className="w-4 h-4" />
          <span>+{lesson.xp}</span>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {lesson.type === "video" && (
          <div className="space-y-4">
            {/* Video Player Placeholder */}
            <div className="relative aspect-video bg-foreground/5 rounded-xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="icon"
                  className="w-16 h-16 rounded-full"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" />
                  )}
                </Button>
              </div>
              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-foreground/80 to-transparent">
                <div className="flex items-center gap-3">
                  <Progress value={35} className="h-1 flex-1" />
                  <span className="text-xs text-card">2:15 / 6:30</span>
                  <Button variant="ghost" size="icon" className="text-card h-8 w-8">
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground leading-relaxed">{lesson.content}</p>
            </div>
          </div>
        )}

        {lesson.type === "article" && (
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-line">
              {lesson.content}
            </p>
          </div>
        )}

        {isQuiz && lesson.quiz && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Question {currentStep + 1}
              </h2>
              <p className="text-foreground mb-6">
                {lesson.quiz[currentStep].question}
              </p>
              <div className="space-y-3">
                {lesson.quiz[currentStep].options.map((option, index) => {
                  const isSelected =
                    selectedAnswers[lesson.quiz![currentStep].id] === index
                  return (
                    <button
                      key={index}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() =>
                        handleAnswer(lesson.quiz![currentStep].id, index)
                      }
                    >
                      <span className="text-foreground">{option}</span>
                    </button>
                  )
                })}
              </div>
            </Card>
          </div>
        )}

        {lesson.type === "activity" && (
          <div className="space-y-4">
            <Card className="p-6 bg-wellness-teal-light/30 border-wellness-teal/20">
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Mindfulness Activity
              </h2>
              <p className="text-foreground leading-relaxed">{lesson.content}</p>
            </Card>
            <p className="text-sm text-muted-foreground text-center">
              Take your time with this activity. Mark as complete when you&apos;re ready.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-card border-t border-border">
        <Button className="w-full" onClick={handleNext}>
          {isQuiz ? (
            currentStep < totalSteps - 1 ? (
              <>
                Next Question
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              "Submit Quiz"
            )
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Complete Lesson
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
