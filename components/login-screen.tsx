"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Users, ArrowRight, Eye, EyeOff } from "lucide-react"
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface LoginScreenProps {
  onLogin: (role: "student" | "mentor", email: string, password: string) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [step, setStep] = useState<"role" | "credentials">("role")
  const [selectedRole, setSelectedRole] = useState<"student" | "mentor" | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleRoleSelect = (role: "student" | "mentor") => {
    setSelectedRole(role)
    setStep("credentials")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    setIsLoading(true);
    try {
      // 1. Sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Fetch their role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const actualRole = userData.role; // e.g., "mentor" or "mentee"

        // 3. Verify if the actual role matches what they selected on the screen
        if (actualRole.toLowerCase() === selectedRole.toLowerCase()) {
          onLogin(selectedRole, email, password);
        } else {
          // 4. Role mismatch: Sign them out immediately and show an error
          await signOut(auth);
          alert(`Access Denied: You are registered as a ${actualRole}, not a ${selectedRole}.`);
        }
      } else {
        await signOut(auth);
        alert("User profile not found in database.");
      }
    } catch (error: any) {
      alert(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-wellness-teal-light/50 to-background flex flex-col items-center justify-center p-4">
      {/* Logo and Branding */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-wellness-warm flex items-center justify-center mb-4 shadow-lg">
          <Heart className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">MindBuddy</h1>
        <p className="text-muted-foreground text-center mt-2 max-w-xs">
          Your peer support companion for wellness and growth
        </p>
      </div>

      {/* Role Selection */}
      {step === "role" && (
        <div className="w-full max-w-sm space-y-4">
          <h2 className="text-lg font-semibold text-center text-foreground mb-6">
            How would you like to sign in?
          </h2>
          
          <button
            onClick={() => handleRoleSelect("student")}
            className="w-full p-4 bg-card rounded-xl border-2 border-border hover:border-primary transition-all flex items-center gap-4 text-left group"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Heart className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Im a Student</p>
              <p className="text-sm text-muted-foreground">
                Connect with a peer mentor for support
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>

          <button
            onClick={() => handleRoleSelect("mentor")}
            className="w-full p-4 bg-card rounded-xl border-2 border-border hover:border-primary transition-all flex items-center gap-4 text-left group"
          >
            <div className="w-14 h-14 rounded-full bg-wellness-warm/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Users className="w-7 h-7 text-wellness-warm" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Im a Mentor</p>
              <p className="text-sm text-muted-foreground">
                Support students on their wellness journey
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>

          <p className="text-xs text-center text-muted-foreground mt-6">
            NHG-trained peer support program
          </p>
        </div>
      )}

      {/* Login Form */}
      {step === "credentials" && selectedRole && (
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                selectedRole === "student" ? "bg-primary/10" : "bg-wellness-warm/10"
              }`}>
                {selectedRole === "student" ? (
                  <Heart className={`w-6 h-6 text-primary`} />
                ) : (
                  <Users className={`w-6 h-6 text-wellness-warm`} />
                )}
              </div>
            </div>
            <CardTitle>
              {selectedRole === "student" ? "Student Login" : "Mentor Login"}
            </CardTitle>
            <CardDescription>
              {selectedRole === "student" 
                ? "Sign in to connect with your mentor"
                : "Sign in to support your student"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-muted border-0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-muted border-0 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading || !email || !password}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep("role")
                  setSelectedRole(null)
                  setEmail("")
                  setPassword("")
                }}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to role selection
              </button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-6 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                Demo: Use any email and password to sign in
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
