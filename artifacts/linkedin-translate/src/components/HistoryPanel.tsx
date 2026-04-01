import React from "react";
import { History, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface HistoryItem {
  id: string;
  original: string;
  translation: string;
  score: number;
  timestamp: number;
}

interface HistoryPanelProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export function HistoryPanel({ items, onSelect, onClear }: HistoryPanelProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  if (items.length === 0) return null;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full rounded-xl border bg-card text-card-foreground shadow-sm"
      data-testid="history-panel"
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2 text-primary font-semibold">
          <History className="h-5 w-5" />
          <h2>Translation History</h2>
        </div>
        <div className="flex items-center gap-2">
          {isOpen && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClear}
              className="text-muted-foreground hover:text-destructive h-8"
              data-testid="clear-history-button"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span className="sr-only">Toggle History</span>
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      
      <CollapsibleContent>
        <ScrollArea className="h-[300px] w-full rounded-b-xl border-t">
          <div className="p-4 space-y-3">
            {items.map((item) => (
              <div 
                key={item.id}
                onClick={() => onSelect(item)}
                className="group cursor-pointer rounded-lg border bg-muted/50 p-3 transition-colors hover:bg-accent/50 hover:border-accent"
              >
                <div className="mb-2 text-xs text-muted-foreground font-medium flex justify-between items-center">
                  <span className="truncate pr-4 italic">"{item.original.length > 60 ? item.original.substring(0, 60) + '...' : item.original}"</span>
                  <span className="shrink-0 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold">
                    Score: {item.score}
                  </span>
                </div>
                <div className="text-sm line-clamp-2 text-foreground group-hover:text-foreground">
                  {item.translation}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
}
