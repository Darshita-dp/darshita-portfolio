import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoryTrack } from "@/components/story/StoryTrack";
import { WeatherLayer } from "@/components/story/WeatherLayer";
import { WalkingGirl } from "@/components/story/WalkingGirl";
import { ChapterContent } from "@/components/story/ChapterContent";
import { StoryNavigation } from "@/components/story/StoryNavigation";
import { motion } from "framer-motion";

const chapters = [
  {
    id: 1,
    title: "Once Upon a Time",
    content: "In a quiet town where mornings smelled of jasmine, a little girl named Darshita dreamed with wide-open eyes. She believed that even the smallest spark of kindness could light the world.",
  },
  {
    id: 2,
    title: "Garden of Solitude",
    content: "She grew up in the hush of her grandparents' home, with stories, sketches, and piano notes for company. In silence, she found the colors that would one day paint her dreams.",
  },
  {
    id: 3,
    title: "The Curious Princess",
    content: "Curiosity became her crown. She learned to weave code with creativity — lines and colors dancing together. Each click whispered, 'You're building magic.'",
  },
  {
    id: 4,
    title: "Crossing Oceans",
    content: "One fine day, courage packed her suitcase. She crossed oceans with hope folded neatly inside. A new world awaited — big, bright, and beautifully unknown.",
  },
  {
    id: 5,
    title: "Kingdom of Knowledge",
    content: "In lecture halls and glowing screens, she found her rhythm. Teaching, learning, leading — her heart beat with purpose. Every project became a little story of growth and grace.",
  },
  {
    id: 6,
    title: "Circle of Friendship",
    content: "Between coffee mugs and starlit talks, she met her tribe. Friends who laughed, dreamed, and stayed. Together, they turned long nights into lifelong memories.",
  },
  {
    id: 7,
    title: "Heart of Kindness",
    content: "Then came the rains — challenges, change, quiet tears. But she learned that kindness is stronger than any storm. Even under her tiny umbrella, she shared her light.",
  },
  {
    id: 8,
    title: "Dream Blooms",
    content: "The storm softened; the world turned gentle again. She looked back and saw how every drop had made her bloom. The sun returned — not just above, but inside her too.",
  },
  {
    id: 9,
    title: "Bright & Happy Future",
    content: "Now she walks into a new morning with courage in her step. The pen writes, 'To be continued…' For the girl who once dreamed alone now writes stories of her own sunshine.",
  },
];

export default function Story() {
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(0);

  useEffect(() => {
    const chapter = Math.floor(scrollProgress * 9);
    setCurrentChapter(Math.min(8, chapter));
  }, [scrollProgress]);

  useEffect(() => {
    // Create scroll height for vertical scrolling
    document.body.style.height = "900vh";
    
    return () => {
      document.body.style.height = "";
    };
  }, []);

  const handleNavigate = (chapter: number) => {
    const targetScroll = (chapter / 9) * (document.body.scrollHeight - window.innerHeight);
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handleNavigate(Math.max(0, currentChapter - 1));
      } else if (e.key === "ArrowRight") {
        handleNavigate(Math.min(8, currentChapter + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentChapter]);

  const isRaining = currentChapter === 6;
  
  // Show welcome message when at the very beginning
  const showWelcome = scrollProgress < 0.02;

  return (
    <div className="relative">
      {/* Back button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/")}
        className="fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm hover:bg-white/90"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Weather and Sky */}
      <WeatherLayer scrollProgress={scrollProgress} currentChapter={currentChapter} />

      {/* Welcome Message */}
      {showWelcome && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center px-6 max-w-2xl">
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-4"
              style={{
                fontFamily: '"Great Vibes", "Gwendolyn", cursive',
                color: "#1D2340",
                textShadow: "0 2px 8px rgba(255,255,255,0.9)",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Welcome to my story
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl mb-6"
              style={{
                fontFamily: 'ui-serif, Georgia, serif',
                color: "#2C3E50",
                textShadow: "0 1px 4px rgba(255,255,255,0.9)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              A journey through clouds, courage, and kindness.
            </motion.p>
            <motion.p
              className="text-base md:text-lg flex items-center justify-center gap-2"
              style={{
                fontFamily: 'ui-serif, Georgia, serif',
                color: "#2C3E50",
                textShadow: "0 1px 4px rgba(255,255,255,0.9)",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <span>🌸</span>
              <span>Scroll down to walk with me...</span>
            </motion.p>
          </div>
        </motion.div>
      )}

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