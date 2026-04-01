import React from "react";
import { Moon, Sun, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header({ isDark, toggleDark }: { isDark: boolean; toggleDark: () => void }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <TrendingUp size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-primary">LinkedIn Translate</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Say what you mean. Sound like LinkedIn.</p>
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
