import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoryTrack } from "@/components/story/StoryTrack";
import { WeatherLayer } from "@/components/story/WeatherLayer";
import { WalkingGirl } from "@/components/story/WalkingGirl";
import { ChapterContent } from "@/components/story/ChapterContent";
import { StoryNavigation } from "@/components/story/StoryNavigation";
import { chapters } from "@/lib/storyChapters";
import { motion } from "framer-motion";

export default function Story() {
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // Detect mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const chapter = Math.floor(scrollProgress * chapters.length);
    setCurrentChapter(Math.min(chapters.length - 1, chapter));
  }, [scrollProgress]);

  useEffect(() => {
    // Mobile: 600vh, Desktop: 900vh
    const scrollHeight = isMobile ? "600vh" : "900vh";
    document.body.style.height = scrollHeight;
    
    return () => {
      document.body.style.height = "";
    };
  }, [isMobile]);

  const handleNavigate = (chapter: number) => {
    const targetScroll = (chapter / chapters.length) * (document.body.scrollHeight - window.innerHeight);
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  // Touch swipe gestures for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchStartX.current - touchEndX;
    const deltaY = Math.abs(touchStartY.current - touchEndY);

    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > 50 && deltaY < 50) {
      if (deltaX > 0) {
        // Swiped left - go to next chapter
        handleNavigate(Math.min(chapters.length - 1, currentChapter + 1));
      } else {
        // Swiped right - go to previous chapter
        handleNavigate(Math.max(0, currentChapter - 1));
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handleNavigate(Math.max(0, currentChapter - 1));
      } else if (e.key === "ArrowRight") {
        handleNavigate(Math.min(chapters.length - 1, currentChapter + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentChapter]);

  const isRaining = currentChapter === 6;

  return (
    <div 
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="main"
      aria-label="Story mode - Interactive narrative experience"
    >
      {/* Back button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/")}
        className="fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm hover:bg-white/90"
        aria-label="Return to home page"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Mobile scroll hint */}
      {isMobile && (
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 text-center text-xs text-slate-600 dark:text-slate-300 pointer-events-none"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          aria-live="polite"
          aria-label="Swipe left or right to navigate chapters"
        >
          <div className="flex items-center justify-center gap-2">
            <span>👈</span>
            <span>Swipe to navigate</span>
            <span>👉</span>
          </div>
        </motion.div>
      )}

      {/* Weather and Sky */}
      <WeatherLayer scrollProgress={scrollProgress} currentChapter={currentChapter} />

      {/* Walking Girl */}
      <WalkingGirl scrollProgress={scrollProgress} isRaining={isRaining} />

      {/* Story Track with Chapters */}
      <StoryTrack
        onProgressChange={setScrollProgress}
        currentChapter={currentChapter}
      >
        {chapters.map((chapter, index) => (
          <ChapterContent
            key={chapter.id}
            chapter={chapter}
            isActive={currentChapter === index}
          />
        ))}
      </StoryTrack>

      {/* Navigation Controls */}
      <StoryNavigation
        currentChapter={currentChapter}
        totalChapters={chapters.length}
        onNavigate={handleNavigate}
      />
    </div>
  );
}