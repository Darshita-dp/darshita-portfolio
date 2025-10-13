import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoryNavigationProps {
  currentChapter: number;
  totalChapters: number;
  onNavigate: (chapter: number) => void;
}

export function StoryNavigation({ currentChapter, totalChapters, onNavigate }: StoryNavigationProps) {
  return (
    <>
      {/* Arrow Navigation */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate(Math.max(0, currentChapter - 1))}
          disabled={currentChapter === 0}
          className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
          aria-label="Previous chapter"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
      </div>

      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate(Math.min(totalChapters - 1, currentChapter + 1))}
          disabled={currentChapter === totalChapters - 1}
          className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
          aria-label="Next chapter"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Dot Progress */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        {[...Array(totalChapters)].map((_, i) => (
          <motion.button
            key={i}
            onClick={() => onNavigate(i)}
            className="w-2 h-2 rounded-full transition-all"
            style={{
              backgroundColor: currentChapter === i ? "#1D2340" : "rgba(255,255,255,0.5)",
              scale: currentChapter === i ? 1.5 : 1,
            }}
            whileHover={{ scale: 1.5 }}
            aria-label={`Go to chapter ${i + 1}`}
            tabIndex={0}
          />
        ))}
      </div>
    </>
  );
}
