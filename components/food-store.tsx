"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, Check, AlertCircle } from "lucide-react"

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

interface FoodStoreProps {
  xp: number
  petName: string
  petHappiness: number
  onBack: () => void
  onPurchase: (item: FoodItem) => void
  onFeed: (item: FoodItem) => void
  inventory: FoodItem[]
}

const storeItems: FoodItem[] = [
  {
    id: "apple",
    name: "Fresh Apple",
    description: "A crisp, healthy snack",
    price: 15,
    happinessBoost: 5,
    emoji: "🍎",
    category: "snack",
    color: "bg-red-100 text-red-600",
  },
  {
    id: "carrot",
    name: "Crunchy Carrot",
    description: "Packed with vitamins",
    price: 10,
    happinessBoost: 3,
    emoji: "🥕",
    category: "snack",
    color: "bg-orange-100 text-orange-600",
  },
  {
    id: "salad",
    name: "Garden Salad",
    description: "A refreshing mixed salad",
    price: 25,
    happinessBoost: 8,
    emoji: "🥗",
    category: "meal",
    color: "bg-green-100 text-green-600",
  },
  {
    id: "smoothie",
    name: "Berry Smoothie",
    description: "Blended with love",
    price: 30,
    happinessBoost: 10,
    emoji: "🥤",
    category: "meal",
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: "cookie",
    name: "Oat Cookie",
    description: "A sweet, wholesome treat",
    price: 20,
    happinessBoost: 7,
    emoji: "🍪",
    category: "treat",
    color: "bg-amber-100 text-amber-600",
  },
  {
    id: "cake",
    name: "Celebration Cake",
    description: "For special moments",
    price: 50,
    happinessBoost: 15,
    emoji: "🎂",
    category: "special",
    color: "bg-pink-100 text-pink-600",
  },
  {
    id: "sushi",
    name: "Veggie Sushi",
    description: "A fancy, balanced meal",
    price: 40,
    happinessBoost: 12,
    emoji: "🍱",
    category: "meal",
    color: "bg-teal-100 text-teal-600",
  },
  {
    id: "star-fruit",
    name: "Star Fruit",
    description: "Rare and magical",
    price: 75,
    happinessBoost: 20,
    emoji: "⭐",
    category: "special",
    color: "bg-yellow-100 text-yellow-600",
  },
]

export function FoodStore({
  xp,
  petName,
  petHappiness,
  onBack,
  onPurchase,
  onFeed,
  inventory,
}: FoodStoreProps) {
  const [activeTab, setActiveTab] = useState<"store" | "inventory">("store")
  const [feedingItem, setFeedingItem] = useState<string | null>(null)
  const [purchasedItem, setPurchasedItem] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handlePurchase = (item: FoodItem) => {
    if (xp < item.price) {
      setErrorMessage("Not enough XP!")
      setTimeout(() => setErrorMessage(null), 2000)
      return
    }
    onPurchase(item)
    setPurchasedItem(item.id)
    setTimeout(() => setPurchasedItem(null), 1500)
  }

  const handleFeed = (item: FoodItem) => {
    if (petHappiness >= 100) {
      setErrorMessage(`${petName} is already full!`)
      setTimeout(() => setErrorMessage(null), 2000)
      return
    }
    setFeedingItem(item.id)
    setTimeout(() => {
      onFeed(item)
      setFeedingItem(null)
    }, 800)
  }

  const getInventoryCount = (itemId: string) => {
    return inventory.filter((i) => i.id === itemId).length
  }

  const uniqueInventory = inventory.reduce((acc, item) => {
    if (!acc.find((i) => i.id === item.id)) {
      acc.push(item)
    }
    return acc
  }, [] as FoodItem[])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
            <span className="sr-only">Go back</span>
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Pet Food Store</h1>
            <p className="text-sm text-muted-foreground">
              Feed {petName} to boost happiness
            </p>
          </div>
          <div className="flex items-center gap-1 bg-wellness-warm/10 px-3 py-1.5 rounded-full">
            <Sparkles className="w-4 h-4 text-wellness-warm" />
            <span className="font-semibold text-foreground">{xp} XP</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setActiveTab("store")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "store"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Store
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors relative ${
              activeTab === "inventory"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Inventory
            {inventory.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-wellness-coral text-white text-xs rounded-full flex items-center justify-center">
                {inventory.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Error Toast */}
      {errorMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">{errorMessage}</span>
        </div>
      )}

      <main className="max-w-lg mx-auto p-4 pb-24">
        {/* Pet Happiness Preview */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-primary/5 to-wellness-warm/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">{petName}s Happiness</span>
            <span className="text-sm text-muted-foreground">{petHappiness}/100</span>
          </div>
          <div className="h-3 bg-card rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-wellness-warm rounded-full transition-all duration-500"
              style={{ width: `${petHappiness}%` }}
            />
          </div>
        </Card>

        {activeTab === "store" && (
          <div className="grid grid-cols-2 gap-3">
            {storeItems.map((item) => (
              <Card
                key={item.id}
                className={`p-4 transition-all ${
                  purchasedItem === item.id ? "ring-2 ring-green-500 scale-95" : ""
                }`}
              >
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center text-2xl mb-3`}>
                  {item.emoji}
                </div>
                <h3 className="font-semibold text-foreground text-sm">{item.name}</h3>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                  {item.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-wellness-teal mb-3">
                  <span>+{item.happinessBoost} happiness</span>
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  disabled={xp < item.price || purchasedItem === item.id}
                  onClick={() => handlePurchase(item)}
                >
                  {purchasedItem === item.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 mr-1" />
                      {item.price} XP
                    </>
                  )}
                </Button>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="space-y-3">
            {uniqueInventory.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🍽️</span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">Inventory Empty</h3>
                <p className="text-sm text-muted-foreground">
                  Visit the store to buy food for {petName}
                </p>
                <Button className="mt-4" onClick={() => setActiveTab("store")}>
                  Go to Store
                </Button>
              </Card>
            ) : (
              uniqueInventory.map((item) => {
                const count = getInventoryCount(item.id)
                const isFeeding = feedingItem === item.id
                
                return (
                  <Card
                    key={item.id}
                    className={`p-4 flex items-center gap-4 transition-all ${
                      isFeeding ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center text-2xl relative`}>
                      {item.emoji}
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background text-xs rounded-full flex items-center justify-center font-medium">
                        {count}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <p className="text-xs text-wellness-teal">
                        +{item.happinessBoost} happiness each
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleFeed(item)}
                      disabled={isFeeding || petHappiness >= 100}
                      className={isFeeding ? "animate-pulse" : ""}
                    >
                      {isFeeding ? "Feeding..." : "Feed"}
                    </Button>
                  </Card>
                )
              })
            )}
          </div>
        )}
      </main>
    </div>
  )
}
