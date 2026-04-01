import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Translator } from "@/components/Translator";
import { HistoryPanel, HistoryItem } from "@/components/HistoryPanel";

export default function AppContent() {
  const [isDark, setIsDark] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    // Initialize dark mode
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDarkMode = storedTheme === "dark" || (!storedTheme && prefersDark);
    
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Initialize history
    const storedHistory = localStorage.getItem("linkedin-translate-history");
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch {
        localStorage.removeItem("linkedin-translate-history");
      }
    }
  }, []);

  const toggleDark = () => {
    const newTheme = !isDark ? "dark" : "light";
    setIsDark(!isDark);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleNewTranslation = (item: HistoryItem) => {
    setHistory(prev => {
      const newHistory = [item, ...prev].slice(0, 10);
      localStorage.setItem("linkedin-translate-history", JSON.stringify(newHistory));
      return newHistory;
    });
    setSelectedItem(null);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("linkedin-translate-history");
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-background text-foreground transition-colors duration-300">
      <Header isDark={isDark} toggleDark={toggleDark} />
      
      <main className="flex-1 container mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col items-center space-y-12">
        <div className="w-full">
          <Translator 
            onTranslateSuccess={handleNewTranslation} 
            selectedHistoryItem={selectedItem}
          />
        </div>
        
        <div className="w-full max-w-4xl mx-auto">
          <HistoryPanel 
            items={history} 
            onSelect={setSelectedItem} 
            onClear={handleClearHistory} 
          />
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t bg-muted/20">
        <p className="font-medium text-foreground">Say what you mean. Sound like LinkedIn.</p>
        <p className="mt-1 opacity-75">Nothing you type is stored on our servers. Keep hustling.</p>
      </footer>
    </div>
  );
}
