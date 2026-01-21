import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function SelectFocusScreen() {
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);

  const handleFocusSelection = (focus: string) => {
    setSelectedFocus((prev) =>
      prev.includes(focus)
        ? prev.filter((item) => item !== focus)
        : [...prev, focus],
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-wellness-teal-light/50 to-background flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Select Your Focus
        </h1>
        <p className="text-muted-foreground text-center mt-2 max-w-xs">
          Choose the wellness areas you'd like to focus on. You can select
          multiple.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {[
          "Anxiety",
          "Stress",
          "Depression",
          "Motivation",
          "Obesity",
          "Sleep",
        ].map((focus) => (
          <Card
            key={focus}
            onClick={() => handleFocusSelection(focus)}
            className={`w-24 h-24 flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all border-2 ${
              selectedFocus.includes(focus)
                ? "border-primary bg-primary/10"
                : "border-border hover:bg-primary/10"
            }`}
          >
            <div className="flex items-center justify-center mb-2">
              {/* Just the focus text without icons */}
              <Label className="text-sm text-center">{focus}</Label>
            </div>
          </Card>
        ))}
      </div>

      <Button className="w-40 mt-4" disabled={selectedFocus.length === 0}>
        Continue
      </Button>
    </div>
  );
}
