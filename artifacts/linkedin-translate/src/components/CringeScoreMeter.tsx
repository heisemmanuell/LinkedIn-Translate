import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import confetti from "canvas-confetti";

interface CringeScoreMeterProps {
  score: number;
}

export function CringeScoreMeter({ score }: CringeScoreMeterProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);

    if (score >= 91) {
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0A66C2', '#004182', '#ffffff']
        });
      }, 500);
    }

    return () => clearTimeout(timeout);
  }, [score]);

  const getLabel = (s: number) => {
    if (s <= 25) return "Intern Energy";
    if (s <= 50) return "The Humble-Bragger";
    if (s <= 75) return "Team Lead Vibes";
    if (s <= 90) return "The Final Boss";
    return "LinkedIn Influencer ";
  };

  const getColorClass = (s: number) => {
    if (s <= 25) return "bg-green-500";
    if (s <= 50) return "bg-yellow-400";
    if (s <= 75) return "bg-orange-500";
    return "bg-primary";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 space-y-2 rounded-lg border bg-card p-4 shadow-sm"
      data-testid="cringe-score-meter"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Corporate Cringe Score</h3>
        <span className="text-2xl font-bold text-foreground">{score}/100</span>
      </div>
      
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          className={`h-full w-full flex-1 transition-all ${getColorClass(score)}`}
          initial={{ x: '-100%' }}
          animate={{ x: `-${100 - animatedScore}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      
      <div className="flex justify-between items-center text-sm font-medium pt-1">
        <span className="text-muted-foreground">{getLabel(score)}</span>
        {score >= 91 && <span className="text-primary animate-pulse">#Agree</span>}
      </div>
    </motion.div>
  );
}
