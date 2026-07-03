import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface StoryTrackProps {
  children: React.ReactNode;
  onProgressChange: (progress: number) => void;
  currentChapter: number;
}

export function StoryTrack({ children, onProgressChange, currentChapter }: StoryTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / scrollHeight;
      const clampedProgress = Math.max(0, Math.min(1, progress));
      
      setScrollProgress(clampedProgress);
      onProgressChange(clampedProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onProgressChange]);

  const trackTranslateX = -scrollProgress * (9 * 100 - 100);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <motion.div
        ref={trackRef}
        className="flex h-full"
        style={{
          width: "900vw",
          transform: prefersReducedMotion 
            ? `translateX(${-currentChapter * 100}vw)` 
            : `translateX(${trackTranslateX}vw)`,
        }}
        transition={prefersReducedMotion ? { duration: 0.6, ease: "easeInOut" } : undefined}
      >
        {children}
      </motion.div>
    </div>
  );
}
