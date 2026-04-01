import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Copy, Check, Share2, AlertCircle, MessageSquareQuote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useTranslateText } from "@workspace/api-client-react";
import { CringeScoreMeter } from "./CringeScoreMeter";
import { HistoryItem } from "./HistoryPanel";

const RANDOM_PROMPTS = [
  "I ate a sandwich",
  "I watched Netflix all day",
  "I went to the gym",
  "I woke up late",
  "I got stuck in traffic",
  "I had a bad day",
  "I took a nap",
  "I made coffee",
  "I cleaned my room",
  "I went for a walk"
];

interface TranslatorProps {
  onTranslateSuccess: (item: HistoryItem) => void;
  selectedHistoryItem?: HistoryItem | null;
}

export function Translator({ onTranslateSuccess, selectedHistoryItem }: TranslatorProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  
  const { toast } = useToast();
  const translateMutation = useTranslateText();

  // Sync with selected history item
  React.useEffect(() => {
    if (selectedHistoryItem) {
      setInput(selectedHistoryItem.original);
      setOutput(selectedHistoryItem.translation);
      setScore(selectedHistoryItem.score);
    }
  }, [selectedHistoryItem]);

  const handleTranslate = () => {
    if (!input.trim()) return;
    
    translateMutation.mutate({ data: { text: input } }, {
      onSuccess: (data) => {
        setOutput(data.translation);
        setScore(data.cringeScore);
        
        onTranslateSuccess({
          id: Date.now().toString(),
          original: input,
          translation: data.translation,
          score: data.cringeScore,
          timestamp: Date.now()
        });
      },
      onError: (error: any) => {
        const isRateLimit = error?.response?.status === 429;
        toast({
          variant: "destructive",
          title: "Translation Failed",
          description: isRateLimit 
            ? "Even LinkedIn influencers need a break. Try again in a few minutes."
            : "Something went wrong. Please try again.",
        });
      }
    });
  };

  const handleRandomPrompt = () => {
    const random = RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)];
    setInput(random);
    setOutput("");
    setScore(null);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Humbly brag away!",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePost = () => {
    if (!output) return;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=https://linkedin.com&summary=${encodeURIComponent(output)}`;
    window.open(url, '_blank');
  };

  const charCount = input.length;
  const isOverLimit = charCount >= 400;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full max-w-6xl mx-auto">
      {/* Left Panel: Input */}
      <div className="flex flex-col space-y-4 rounded-xl border bg-card p-5 lg:p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Plain English
          </h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRandomPrompt}
            className="text-xs text-muted-foreground hover:text-primary"
            data-testid="random-prompt-button"
          >
            <Wand2 className="w-3 h-3 mr-1" />
            Random Idea
          </Button>
        </div>
        
        <div className="relative flex-1 min-h-[250px]">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 500))}
            placeholder="Type something brutally honest and mundane..."
            className={`resize-none h-full min-h-[250px] text-base p-4 ${isOverLimit ? 'border-yellow-500 focus-visible:ring-yellow-500' : ''}`}
            data-testid="textarea-input"
          />
          <div className={`absolute bottom-3 right-4 text-xs font-medium ${isOverLimit ? 'text-yellow-600' : 'text-muted-foreground'}`}>
            {charCount}/500
          </div>
        </div>

        <Button 
          size="lg" 
          className="w-full text-base font-semibold"
          onClick={handleTranslate}
          disabled={!input.trim() || translateMutation.isPending}
          data-testid="translate-button"
        >
          {translateMutation.isPending ? (
            <span className="flex items-center">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Crafting humble-bragging post
            </span>
          ) : (
            "Translate to LinkedIn"
          )}
        </Button>
      </div>

      {/* Right Panel: Output */}
      <div className="flex flex-col space-y-4 rounded-xl border bg-primary/5 p-5 lg:p-6 shadow-sm min-h-[400px]">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-primary">
          LinkedIn Text
        </h2>
        
        <div className="flex-1 relative rounded-lg border bg-card">
          <AnimatePresence mode="wait">
            {!output && !translateMutation.isPending ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-muted-foreground"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <MessageSquareQuote className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p>Get LinkedIn brain-rot content here</p>
                <p className="text-sm mt-2 opacity-75">Type something on the left and get a LinkedIn professional, bragablle post</p>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full p-4 lg:p-6"
              >
                {translateMutation.isPending ? (
                  <div className="h-full flex flex-col space-y-3 p-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
                    <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-muted rounded animate-pulse w-2/3 mt-4"></div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    <div 
                      className="flex-1 overflow-y-auto whitespace-pre-wrap text-base leading-relaxed text-foreground font-serif"
                      data-testid="output-text"
                    >
                      {output}
                    </div>
                    
                    <div className="flex items-center gap-2 pt-4 mt-4 border-t border-border/50">
                      <Button 
                        variant="secondary" 
                        className="flex-1"
                        onClick={handleCopy}
                        data-testid="copy-button"
                      >
                        {copied ? <Check className="w-4 h-4 mr-2 text-green-600" /> : <Copy className="w-4 h-4 mr-2" />}
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                      {/* <Button 
                        className="flex-1 bg-[#0A66C2] hover:bg-[#004182] text-white"
                        onClick={handlePost}
                        data-testid="post-linkedin-button"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Post to LinkedIn
                      </Button> */}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cringe Score Meter */}
        <AnimatePresence>
          {score !== null && !translateMutation.isPending && (
            <CringeScoreMeter score={score} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
