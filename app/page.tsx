"use client"

import { useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { HomeDashboard } from "@/components/home-dashboard"
import { ChatInterface } from "@/components/chat-interface"
import { CallScreen } from "@/components/call-screen"
import { LearningHub } from "@/components/learning-hub"
import { LessonViewer } from "@/components/lesson-viewer"
import { ProgressView } from "@/components/progress-view"
import { ProfileView } from "@/components/profile-view"
import { LoginScreen } from "@/components/login-screen"
import { FoodStore } from "@/components/food-store"
import { MentorDashboard } from "@/components/mentor-dashboard"
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { query, orderBy, onSnapshot } from "firebase/firestore";
import { useEffect } from "react"
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Food item type
interface FoodItem {
  id: string
  name: string
  description: string
  price: number
  happinessBoost: number
  emoji: string
  category: "snack" | "meal" | "treat" | "special"
  color: string
}

interface Message {
  id: string;
  text: string;
  sender: "mentor" | "user"; // Allows both roles
  timestamp: Date;
  status: "sent" | "delivered" | "read"; // Allows multiple statuses
}

// Mock data for student
const mockStudent = {
  id: "s1",
  name: "Alex",
  email: "alex@example.com",
  avatar: "",
  joinedAt: new Date("2024-06-15"),
  petName: "Buddy",
  petLevel: 5,
  petHappiness: 78,
  streak: 7,
  xp: 320,
  lessonsCompleted: 12,
  totalLessons: 25,
  lastActive: new Date(Date.now() - 300000),
  mood: "good" as const,
  tasksCompletedToday: 2,
  totalTasksToday: 4,
}

// Mock data for mentor
const mockMentorUser = {
  name: "Sarah Chen",
  email: "sarah.chen@nhg.com",
  specialty: ["Anxiety", "Stress Management", "Life Transitions"],
  sessionsCompleted: 156,
  totalHoursSupport: 234,
}

const mockMentor = {
  id: "m1",
  name: "Sarah Chen",
  avatar: "",
  specialty: ["Anxiety", "Stress Management", "Life Transitions"],
  bio: "Hi! I've been through similar challenges during my university years. I'm here to listen and support you on your journey.",
  rating: 4.9,
  sessionsCompleted: 156,
  isOnline: true,
  lastSeen: new Date(),
}

const mockTasks = [
  {
    id: "t1",
    title: "Complete morning reflection",
    description: "Take 5 minutes to journal your thoughts",
    completed: true,
    xp: 15,
    type: "reflection" as const,
  },
  {
    id: "t2",
    title: "Watch: Managing Stress",
    description: "A 3-minute video on coping techniques",
    completed: false,
    xp: 20,
    type: "lesson" as const,
  },
  {
    id: "t3",
    title: "Practice deep breathing",
    description: "5 cycles of 4-7-8 breathing",
    completed: false,
    xp: 10,
    type: "activity" as const,
  },
  {
    id: "t4",
    title: "Send a gratitude message",
    description: "Share appreciation with someone",
    completed: false,
    xp: 15,
    type: "social" as const,
  },
]

const mockMessages = [
  {
    id: "msg1",
    text: "Hi there! I'm Sarah, your peer mentor. I'm really glad you're here. Feel free to message me anytime - I'm here to listen and support you on your wellness journey.",
    sender: "mentor" as const,
    timestamp: new Date(Date.now() - 86400000),
    status: "read" as const,
  },
  {
    id: "msg2",
    text: "There's no pressure to share anything you're not comfortable with. We can go at your pace.",
    sender: "mentor" as const,
    timestamp: new Date(Date.now() - 86300000),
    status: "read" as const,
  },
]

const mockModules = [
  {
    id: "mod1",
    title: "Understanding Anxiety",
    description: "Learn about anxiety and coping mechanisms",
    icon: "brain" as const,
    progress: 60,
    color: "bg-wellness-teal-light text-wellness-teal",
    lessons: [
      {
        id: "l1",
        title: "What is Anxiety?",
        description: "Understanding the basics",
        duration: "5 min",
        type: "video" as const,
        completed: true,
        locked: false,
        xp: 20,
      },
      {
        id: "l2",
        title: "Common Triggers",
        description: "Identifying what causes anxiety",
        duration: "4 min",
        type: "article" as const,
        completed: true,
        locked: false,
        xp: 15,
      },
      {
        id: "l3",
        title: "Knowledge Check",
        description: "Test your understanding",
        duration: "3 min",
        type: "quiz" as const,
        completed: false,
        locked: false,
        xp: 25,
      },
      {
        id: "l4",
        title: "Grounding Exercise",
        description: "5-4-3-2-1 technique",
        duration: "5 min",
        type: "activity" as const,
        completed: false,
        locked: true,
        xp: 20,
      },
    ],
  },
  {
    id: "mod2",
    title: "Building Resilience",
    description: "Develop mental strength and adaptability",
    icon: "heart" as const,
    progress: 25,
    color: "bg-wellness-coral-light text-wellness-coral",
    lessons: [
      {
        id: "l5",
        title: "The Resilience Mindset",
        description: "Introduction to resilience",
        duration: "6 min",
        type: "video" as const,
        completed: true,
        locked: false,
        xp: 20,
      },
      {
        id: "l6",
        title: "Growth Through Challenges",
        description: "Reframing difficulties",
        duration: "5 min",
        type: "article" as const,
        completed: false,
        locked: false,
        xp: 15,
      },
      {
        id: "l7",
        title: "Self-Compassion Practice",
        description: "Be kind to yourself",
        duration: "7 min",
        type: "activity" as const,
        completed: false,
        locked: true,
        xp: 25,
      },
    ],
  },
  {
    id: "mod3",
    title: "Peer Support Skills",
    description: "Learn to give and receive support",
    icon: "users" as const,
    progress: 0,
    color: "bg-primary/10 text-primary",
    lessons: [
      {
        id: "l8",
        title: "Active Listening",
        description: "Be present for others",
        duration: "5 min",
        type: "video" as const,
        completed: false,
        locked: false,
        xp: 20,
      },
      {
        id: "l9",
        title: "Setting Boundaries",
        description: "Healthy support limits",
        duration: "4 min",
        type: "article" as const,
        completed: false,
        locked: true,
        xp: 15,
      },
    ],
  },
]

const mockStats = {
  currentStreak: 7,
  longestStreak: 14,
  totalXp: 1250,
  level: 5,
  xpToNextLevel: 180,
  lessonsCompleted: 12,
  totalLessons: 25,
  messagesExchanged: 47,
  tasksCompleted: 34,
}

const mockWeeklyActivity = [
  { day: "Mon", completed: true, tasksCompleted: 4 },
  { day: "Tue", completed: true, tasksCompleted: 3 },
  { day: "Wed", completed: true, tasksCompleted: 4 },
  { day: "Thu", completed: true, tasksCompleted: 2 },
  { day: "Fri", completed: true, tasksCompleted: 3 },
  { day: "Sat", completed: true, tasksCompleted: 4 },
  { day: "Sun", completed: false, tasksCompleted: 1 },
]

const mockAchievements = [
  {
    id: "a1",
    title: "First Steps",
    description: "Complete your first lesson",
    icon: "🌱",
    unlockedAt: new Date("2024-06-16"),
  },
  {
    id: "a2",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "🔥",
    unlockedAt: new Date("2024-06-22"),
  },
  {
    id: "a3",
    title: "Conversation Starter",
    description: "Exchange 50 messages with your mentor",
    icon: "💬",
    progress: 47,
    maxProgress: 50,
  },
  {
    id: "a4",
    title: "Knowledge Seeker",
    description: "Complete all lessons in a module",
    icon: "📚",
    progress: 2,
    maxProgress: 4,
  },
]

const mockLesson = {
  id: "l3",
  title: "Knowledge Check: Understanding Anxiety",
  type: "quiz" as const,
  content: "",
  xp: 25,
  quiz: [
    {
      id: "q1",
      question: "Which of the following is a common physical symptom of anxiety?",
      options: [
        "Increased appetite",
        "Rapid heartbeat",
        "Improved sleep",
        "Enhanced focus",
      ],
      correctIndex: 1,
    },
    {
      id: "q2",
      question: "What is the 5-4-3-2-1 grounding technique?",
      options: [
        "A breathing exercise",
        "A meditation practice",
        "A sensory awareness technique",
        "A journaling method",
      ],
      correctIndex: 2,
    },
    {
      id: "q3",
      question: "Which approach is most helpful when supporting someone with anxiety?",
      options: [
        "Tell them to calm down",
        "Share statistics about anxiety",
        "Listen without judgment",
        "Change the subject",
      ],
      correctIndex: 2,
    },
  ],
}

export default function MindBuddyApp() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        // You can also fetch the user's role from Firestore here if needed
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    });

    return () => unsubscribe();
  }, []);
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<"student" | "mentor" | null>(null)
  
  // Navigation state
  const [activeTab, setActiveTab] = useState("home")
  const [showChat, setShowChat] = useState(false)
  const [showCall, setShowCall] = useState(false)
  const [showLesson, setShowLesson] = useState(false)
  const [showFoodStore, setShowFoodStore] = useState(false)
  
  // Data state
  const [messages, setMessages] = useState<Message[]>([]);
  const [tasks, setTasks] = useState(mockTasks)
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  // Student-specific state
  const [studentXp, setStudentXp] = useState(mockStudent.xp)
  const [petHappiness, setPetHappiness] = useState(mockStudent.petHappiness)
  const [foodInventory, setFoodInventory] = useState<FoodItem[]>([])

  const handleLogin = (role: "student" | "mentor", email: string, password: string) => {
    setUserRole(role)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserRole(null)
    setActiveTab("home")
    setShowChat(false)
    setShowCall(false)
    setShowLesson(false)
    setShowFoodStore(false)
  }

  const handleAction = (action: string) => {
    switch (action) {
      case "message":
        setShowChat(true)
        break
      case "lesson":
        setActiveTab("learn")
        break
      case "task":
        break
      case "call":
        setShowCall(true)
        break
      case "store":
        setShowFoodStore(true)
        break
    }
  }

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId && !t.completed) {
          // Award XP when completing task
          setStudentXp((xp) => xp + t.xp)
          // Boost pet happiness slightly
          setPetHappiness((h) => Math.min(100, h + 2))
          return { ...t, completed: true }
        }
        return t
      })
    )
  }

  const handleSendMessage = async (text: string) => {
    try {
      // Add message to Firestore "messages" collection
      await addDoc(collection(db, "messages"), {
        text,
        sender: userRole === "mentor" ? "mentor" : "user",
        timestamp: serverTimestamp(), // Use Firebase's server time
        status: "sent"
      });
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const handleStartLesson = (moduleId: string, lessonId: string) => {
    setShowLesson(true)
  }

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const handlePurchaseFood = (item: FoodItem) => {
    if (studentXp >= item.price) {
      setStudentXp((xp) => xp - item.price)
      setFoodInventory((inv) => [...inv, item])
    }
  }

  const handleFeedPet = (item: FoodItem) => {
    // Remove one item from inventory
    const itemIndex = foodInventory.findIndex((i) => i.id === item.id)
    if (itemIndex !== -1) {
      const newInventory = [...foodInventory]
      newInventory.splice(itemIndex, 1)
      setFoodInventory(newInventory)
      // Increase pet happiness
      setPetHappiness((h) => Math.min(100, h + item.happinessBoost))
    }
  }

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />
  }

  // MENTOR VIEW
  if (userRole === "mentor") {
    // Mentor Chat Interface
    if (showChat) {
      return (
        <ChatInterface
          mentor={{
            id: mockStudent.id,
            name: mockStudent.name,
            avatar: mockStudent.avatar,
            isOnline: true,
            lastSeen: mockStudent.lastActive,
          }}
          messages={messages.map((m) => ({
            ...m,
            sender: m.sender === "mentor" ? "user" : "mentor",
          }))}
          onSendMessage={handleSendMessage}
          onBack={() => setShowChat(false)}
          onCall={() => {
            setShowChat(false)
            setShowCall(true)
          }}
          onVideoCall={() => {
            setShowChat(false)
            setShowCall(true)
          }}
        />
      )
    }



    // Mentor Dashboard
    return (
      <MentorDashboard
        mentor={mockMentorUser}
        student={{
          id: mockStudent.id,
          name: mockStudent.name,
          email: mockStudent.email,
          avatar: mockStudent.avatar,
          joinedAt: mockStudent.joinedAt,
          streak: mockStudent.streak,
          xp: studentXp,
          lessonsCompleted: mockStudent.lessonsCompleted,
          totalLessons: mockStudent.totalLessons,
          lastActive: mockStudent.lastActive,
          mood: mockStudent.mood,
          tasksCompletedToday: mockStudent.tasksCompletedToday,
          totalTasksToday: mockStudent.totalTasksToday,
        }}
        onChat={() => setShowChat(true)}
        onCall={() => setShowCall(true)}
        onVideoCall={() => setShowCall(true)}
        onLogout={handleLogout}
      />
    )
  }

  // STUDENT VIEW

  // Call Screen
  if (showCall) {
    return (
      <CallScreen
        mentor={mockMentor}
        onDecline={() => setShowCall(false)}
        onEnd={() => setShowCall(false)}
      />
    )
  }

  // Chat Interface
  if (showChat) {
    return (
      <ChatInterface
        mentor={mockMentor}
        messages={messages}
        onSendMessage={handleSendMessage}
        onBack={() => setShowChat(false)}
        onCall={() => {
          setShowChat(false)
          setShowCall(true)
        }}
        onVideoCall={() => {
          setShowChat(false)
          setShowCall(true)
        }}
      />
    )
  }

  // Lesson Viewer
  if (showLesson) {
    return (
      <LessonViewer
        lesson={mockLesson}
        onBack={() => setShowLesson(false)}
        onComplete={() => {
          setStudentXp((xp) => xp + mockLesson.xp)
          setPetHappiness((h) => Math.min(100, h + 3))
          setShowLesson(false)
        }}
      />
    )
  }

  // Food Store
  if (showFoodStore) {
    return (
      <FoodStore
        xp={studentXp}
        petName={mockStudent.petName}
        petHappiness={petHappiness}
        onBack={() => setShowFoodStore(false)}
        onPurchase={handlePurchaseFood}
        onFeed={handleFeedPet}
        inventory={foodInventory}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-lg mx-auto px-4 pt-6 pb-24">
        {activeTab === "home" && (
          <HomeDashboard
            user={{
              ...mockStudent,
              xp: studentXp,
              petHappiness: petHappiness,
            }}
            mentor={mockMentor}
            tasks={tasks}
            onAction={handleAction}
            onToggleTask={handleToggleTask}
            onMessageMentor={() => setShowChat(true)}
            onCallMentor={() => setShowCall(true)}
          />
        )}

        {activeTab === "chat" && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Messages</h1>
            <button
              onClick={() => setShowChat(true)}
              className="w-full p-4 bg-card rounded-xl border border-border hover:shadow-md transition-shadow flex items-center gap-4"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-wellness-teal-light to-wellness-warm-light flex items-center justify-center text-lg font-semibold text-wellness-teal">
                  SC
                </div>
                {mockMentor.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground">{mockMentor.name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {messages[messages.length - 1]?.text}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {messages[messages.length - 1]?.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </button>
          </div>
        )}

        {activeTab === "learn" && (
          <LearningHub
            modules={mockModules}
            currentStreak={mockStats.currentStreak}
            weeklyGoal={5}
            weeklyProgress={3}
            onStartLesson={handleStartLesson}
          />
        )}

        {activeTab === "progress" && (
          <ProgressView
            stats={{
              ...mockStats,
              totalXp: studentXp,
            }}
            weeklyActivity={mockWeeklyActivity}
            achievements={mockAchievements}
            moodHistory={[]}
          />
        )}

        {activeTab === "profile" && (
          <ProfileView
            user={{
              ...mockStudent,
              xp: studentXp,
              petHappiness: petHappiness,
            }}
            onEditProfile={() => {}}
            onToggleTheme={handleToggleTheme}
            isDarkMode={isDarkMode}
            onLogout={handleLogout}
            onOpenStore={() => setShowFoodStore(true)}
          />
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
