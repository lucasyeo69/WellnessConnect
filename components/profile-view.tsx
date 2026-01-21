"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Edit2,
} from "lucide-react"
import { VirtualPet } from "./virtual-pet"

interface ProfileViewProps {
  user: {
    name: string
    email: string
    joinedAt: Date
    petName: string
    petLevel: number
    petHappiness: number
    streak: number
    xp: number
  }
  onEditProfile: () => void
  onToggleTheme: () => void
  isDarkMode: boolean
  onLogout?: () => void
  onOpenStore?: () => void
}

const menuItems = [
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
  { id: "help", label: "Help & Support", icon: HelpCircle },
  { id: "settings", label: "Settings", icon: Settings },
]

export function ProfileView({
  user,
  onEditProfile,
  onToggleTheme,
  isDarkMode,
  onLogout,
  onOpenStore,
}: ProfileViewProps) {
  const memberSince = user.joinedAt.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <Button variant="ghost" size="icon" onClick={onToggleTheme}>
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </header>

      {/* User Card */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-wellness-teal-light to-wellness-warm-light flex items-center justify-center text-2xl font-semibold text-wellness-teal">
            {user.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">{user.name}</h2>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEditProfile}>
                <Edit2 className="w-4 h-4" />
                <span className="sr-only">Edit profile</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Badge variant="secondary" className="mt-2">
              Member since {memberSince}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Pet Showcase */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
          Your Wellness Companion
        </h3>
        <VirtualPet
          name={user.petName}
          level={user.petLevel}
          happiness={user.petHappiness}
          streak={user.streak}
        />
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1 bg-transparent">
            <Edit2 className="w-4 h-4 mr-2" />
            Customize
          </Button>
          {onOpenStore && (
            <Button onClick={onOpenStore} className="flex-1">
              🛒 Food Store
            </Button>
          )}
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">
          Available XP: <span className="font-semibold text-wellness-warm">{user.xp}</span>
        </p>
      </Card>

      {/* Menu Items */}
      <Card className="overflow-hidden">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className={`w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left ${
                index !== menuItems.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="flex-1 font-medium text-foreground">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          )
        })}
      </Card>

      {/* NHG Resources */}
      <Card className="p-4 bg-wellness-teal-light/30 border-wellness-teal/20">
        <h3 className="font-semibold text-foreground mb-2">NHG Community Care</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Access additional resources from NHG&apos;s Community Care Network for comprehensive support.
        </p>
        <Button variant="outline" className="w-full border-wellness-teal/30 text-wellness-teal hover:bg-wellness-teal/10 bg-transparent">
          Explore Resources
        </Button>
      </Card>

      {/* Sign Out */}
      <Button 
        variant="ghost" 
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={onLogout}
      >
        <LogOut className="w-5 h-5 mr-2" />
        Sign Out
      </Button>
    </div>
  )
}
