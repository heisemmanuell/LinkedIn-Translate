import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-4 shadow-lg border-primary/20">
        <CardContent className="pt-8 pb-8 flex flex-col items-center text-center space-y-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground group hover:-rotate-12 transition-transform">
            <TrendingDown className="h-8 w-8" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-primary">404: Synergy Not Found</h1>
            <p className="text-muted-foreground">
              We tried to leverage our core competencies to circle back to this deliverable, but it looks like we don't have the bandwidth right now. Let's take this offline.
            </p>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg text-sm text-left w-full border border-border/50">
            <p className="font-semibold mb-1 text-primary">What this taught me about B2B SaaS 👇</p>
            <p className="italic text-muted-foreground">
              "Sometimes hitting a 404 is just the universe telling you it's time to pivot. Never stop grinding. #Mindset #Growth #ThoughtLeadership"
            </p>
          </div>

          <Link href="/">
            <Button className="w-full sm:w-auto font-semibold" size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Pivot Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
