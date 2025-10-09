import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Volume2, VolumeX } from "lucide-react";
import { 
  GAME_LEVELS, 
  GAME_PALETTE, 
  loadGameProgress, 
  saveGameProgress,
  type LevelData,
  type LevelId 
} from "@/lib/gameData";
import { BubbleNode } from "@/components/game/BubbleNode";
import { LevelPreview } from "@/components/game/LevelPreview";
import { RunnerQuest } from "@/components/game/levels/RunnerQuest";

type View = "map" | "preview" | "level";

export default function Play() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("map");
  const [selectedLevel, setSelectedLevel] = useState<LevelData | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [showUnderConstruction, setShowUnderConstruction] = useState(false);
  const [progress, setProgress] = useState(() => loadGameProgress());

  const completedCount = progress.completedLevels.size;

  const handleLevelClick = (level: LevelData) => {
    setSelectedLevel(level);
    setView("preview");
  };

  const handlePlayLevel = () => {
    setView("level");
  };

  const handleLevelComplete = (factsCollected: number) => {
    if (!selectedLevel) return;
    
    const newProgress = {
      ...progress,
      completedLevels: new Set([...progress.completedLevels, selectedLevel.id]),
      unlockedFacts: {
        ...progress.unlockedFacts,
        [selectedLevel.id]: factsCollected
      },
      totalXP: progress.totalXP + factsCollected * 10
    };
    
    setProgress(newProgress);
    saveGameProgress(newProgress);
    setView("map");
  };

  const handleBackToMap = () => {
    setView("map");
    setSelectedLevel(null);
  };

  const isLevelUnlocked = (levelId: LevelId): boolean => {
    const levelIndex = GAME_LEVELS.findIndex(l => l.id === levelId);
    if (levelIndex === 0) return true;
    const prevLevel = GAME_LEVELS[levelIndex - 1];
    return progress.completedLevels.has(prevLevel.id);
  };

  if (view === "level" && selectedLevel) {
    return (
      <RunnerQuest
        level={selectedLevel}
        onComplete={handleLevelComplete}
        onBack={handleBackToMap}
      />
    );
  }

  if (view === "preview" && selectedLevel) {
    return (
      <LevelPreview
        level={selectedLevel}
        onPlay={handlePlayLevel}
        onBack={handleBackToMap}
      />
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${GAME_PALETTE.bgStart} 0%, ${GAME_PALETTE.bgMid} 50%, ${GAME_PALETTE.bgEnd} 100%)`
      }}
    >
      {/* Header */}
      <header className="relative z-50 p-4 flex items-center justify-between backdrop-blur-sm bg-white/80">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
          ← Back to Modes
        </Button>
        <h1
          className="text-2xl font-bold"
          style={{
            fontFamily: '"Press Start 2P", "Orbitron", monospace',
            color: GAME_PALETTE.textPrimary
          }}
        >
          Bubbles of My Journey
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSoundOn(!soundOn)}
        >
          {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </Button>
      </header>

      {/* World Map */}
      <div className="container mx-auto px-4 py-8">
        <Card className="backdrop-blur-md bg-white/95 shadow-2xl mb-8">
          <CardHeader className="text-center">
            <CardTitle
              className="text-xl"
              style={{ color: GAME_PALETTE.textPrimary }}
            >
              World Progress: {completedCount} / {GAME_LEVELS.length} completed
            </CardTitle>
            <Progress value={(completedCount / GAME_LEVELS.length) * 100} className="mt-4" />
            <div className="flex justify-center gap-2 mt-2">
              {GAME_LEVELS.map((level) => (
                <span
                  key={level.id}
                  className="text-xl"
                  style={{
                    opacity: progress.completedLevels.has(level.id) ? 1 : 0.3
                  }}
                >
                  ⭐
                </span>
              ))}
            </div>
          </CardHeader>
        </Card>

        {/* Map Container */}
        <div className="relative w-full h-[600px] rounded-2xl overflow-hidden backdrop-blur-md bg-white/50 shadow-xl">
          {/* Bubble Nodes */}
          {GAME_LEVELS.map((level) => {
            const unlocked = isLevelUnlocked(level.id);
            const completed = progress.completedLevels.has(level.id);
            
            return (
              <BubbleNode
                key={level.id}
                emoji={level.emoji}
                name={level.name}
                x={level.x}
                y={level.y}
                completed={completed}
                locked={!unlocked}
                onClick={() => unlocked && handleLevelClick(level)}
              />
            );
          })}

          {/* Under Construction Node */}
          <BubbleNode
            emoji="🚧"
            name="Under Construction"
            x={45}
            y={15}
            completed={false}
            locked={false}
            onClick={() => setShowUnderConstruction(true)}
          />
        </div>

        <p
          className="text-center mt-6 text-sm"
          style={{ color: GAME_PALETTE.textSecondary }}
        >
          Tap a bubble to enter a level and discover facts about my journey!
        </p>
      </div>

      {/* Under Construction Modal */}
      <AnimatePresence>
        {showUnderConstruction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowUnderConstruction(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="max-w-md backdrop-blur-md bg-white/95">
                <CardHeader>
                  <CardTitle className="text-center text-2xl">
                    🚧 Under Construction 🚧
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-center">
                    A new world is brewing. Come back soon!
                  </p>
                  <Button
                    onClick={() => setShowUnderConstruction(false)}
                    className="w-full"
                    style={{ backgroundColor: GAME_PALETTE.accent }}
                  >
                    Got it!
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}