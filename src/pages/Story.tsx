import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoryTrack } from "@/components/story/StoryTrack";
import { WeatherLayer } from "@/components/story/WeatherLayer";
import { WalkingGirl } from "@/components/story/WalkingGirl";
import { ChapterContent } from "@/components/story/ChapterContent";
import { StoryNavigation } from "@/components/story/StoryNavigation";

const chapters = [
  {
    id: 1,
    title: "Once Upon a Time...",
    content: "A gentle heart, a bright dream.",
  },
  {
    id: 2,
    title: "Garden of Solitude",
    content: "She made art from quiet.",
  },
  {
    id: 3,
    title: "Curious Princess",
    content: "Colors met logic; curiosity grew.",
  },
  {
    id: 4,
    title: "Crossing Oceans",
    content: "A suitcase of courage.",
  },
  {
    id: 5,
    title: "Kingdom of Knowledge",
    content: "Learning, helping, leading.",
  },
  {
    id: 6,
    title: "Circle of Friendship",
    content: "Found her people, found her light.",
  },
  {
    id: 7,
    title: "Heart of Kindness",
    content: "Kindness even in storms.",
  },
  {
    id: 8,
    title: "Dream Blooms",
    content: "New skies open.",
  },
  {
    id: 9,
    title: "Bright & Happy Future",
    content: "To be continued...",
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