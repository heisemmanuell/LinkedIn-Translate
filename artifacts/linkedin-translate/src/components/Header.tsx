import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header({ isDark, toggleDark }: { isDark: boolean; toggleDark: () => void }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="LinkedIn Translate Logo" className="h-10 w-10 object-contain" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-primary">LinkedIn Translate</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Say what you mean. Sound like a LinkedIn Influencer.</p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleDark}
          className="rounded-full"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
}
