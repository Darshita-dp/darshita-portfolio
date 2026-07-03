import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BYTE_BUBBLES_THEME } from "@/lib/byteBubblesData";

interface LevelPreviewProps {
  levelId: number;
  onStart: () => void;
  onClose: () => void;
}

export function LevelPreview({ levelId, onStart, onClose }: LevelPreviewProps) {
  // Custom content based on level ID
  const getPreviewContent = () => {
    switch (levelId) {
      case 1: // Intro
        return {
          title: "Boot-Up Protocol: Ready to Know the Player?",
          body: "Collect 5 special jellyfish to unlock data profile",
          icon: "https://harmless-tapir-303.convex.cloud/api/storage/62277434-6a50-4a22-85b7-efee30f6d666",
          buttonText: "START RUN",
        };
      case 2: // Education
        return {
          title: "⚙️ INITIATING TRAINING GROUNDS…",
          body: (
            <>
              <p className="mb-3">Welcome back, Player!</p>
              <p className="mb-3">Your learning modules are fragmented across the ocean of data.</p>
              <p className="mb-2">🧩 <strong>Mission:</strong> Match each skill with its pair to sync your Knowledge Nodes.</p>
              <p>💠 <strong>Goal:</strong> Complete 5 matches to assemble your Data Cube and unlock the Education File.</p>
            </>
          ),
          icon: "",
          buttonText: "Start Mission →",
        };
      case 3: // Experience
        return {
          title: "⚡ INITIALIZING EXPERIENCE ARENA…",
          body: (
            <>
              <p className="mb-3">Recruiter-in-training detected.</p>
              <p className="mb-2">🧩 <strong>Mission:</strong> Decode Darshita's real-world missions by choosing the most likely outcomes.</p>
              <p className="mb-2">💠 <strong>Goal:</strong> Clear 5 field challenges to unlock her Experience File.</p>
              <p>💡 <strong>Tip:</strong> Guess freely — every reveal adds to your XP stream.</p>
            </>
          ),
          icon: "",
          buttonText: "Start Battle →",
        };
      case 4: // Projects
        return {
          title: "💻 INITIALIZING PROJECT PATHFINDER…",
          body: (
            <>
              <p className="mb-3">System Map Offline.</p>
              <p className="mb-3">The coral data maze has scattered Darshita's project archives across the ocean grid.</p>
              <p className="mb-2">🧩 <strong>Mission:</strong> Navigate through the maze to locate five lost project nodes and recover their tech badges.</p>
              <p className="mb-2">🪄 <strong>Goal:</strong> Collect all badges to reactivate the Project File and restore full system visibility.</p>
              <p>💡 <strong>Tip:</strong> Follow the glowing trails — every pulse points to a project waiting to be rediscovered.</p>
            </>
          ),
          icon: "",
          buttonText: "Start Exploration →",
        };
      default:
        return {
          title: "Level Preview",
          body: "Get ready to play!",
          icon: "🎮",
          buttonText: "START",
        };
    }
  };

  const content = getPreviewContent();

  const playClickSound = () => {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3");
    audio.volume = 0.4;
    audio.play().catch(err => console.log("Sound play failed:", err));
  };

  const handleStartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    console.log("=== Start Mission button clicked ===");
    console.log("Calling onStart()");
    onStart();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "clamp(300px, 60%, 560px)",
          position: "relative",
          zIndex: 60,
        }}
      >
        <Card
          className="relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${BYTE_BUBBLES_THEME.bubble}95 0%, ${BYTE_BUBBLES_THEME.seafoam}90 100%)`,
            backdropFilter: "blur(16px)",
            borderRadius: "24px",
            border: `2px solid ${BYTE_BUBBLES_THEME.accent}60`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.2), 0 0 0 1px ${BYTE_BUBBLES_THEME.accent}40`,
          }}
        >
          {/* Animated grid background for Education and Experience levels */}
          {(levelId === 2 || levelId === 3) && (
            <motion.div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(${BYTE_BUBBLES_THEME.accent} 1px, transparent 1px),
                  linear-gradient(90deg, ${BYTE_BUBBLES_THEME.accent} 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
              animate={{
                opacity: [0.05, 0.15, 0.05],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          <CardHeader className="text-center pb-4">
            <CardTitle
              className="text-2xl md:text-3xl mb-2"
              style={{
                fontFamily: "'Anton', 'Impact', 'Arial Black', sans-serif",
                color: BYTE_BUBBLES_THEME.text,
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              {content.title}
            </CardTitle>
            <div
              className="text-base md:text-lg text-left px-4"
              style={{
                fontFamily: "'Quicksand', sans-serif",
                color: BYTE_BUBBLES_THEME.textSecondary,
              }}
            >
              {content.body}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6 pb-8">
            {typeof content.icon === 'string' && content.icon.startsWith('http') ? (
              <img 
                src={content.icon} 
                alt="Level icon" 
                className="w-20 h-20 md:w-24 md:h-24"
              />
            ) : content.icon ? (
              <div className="text-6xl">{content.icon}</div>
            ) : null}
            <Button
              size="lg"
              onClick={handleStartClick}
              className="text-lg px-8 py-6 font-semibold transition-all hover:scale-105 active:scale-95 relative z-10 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${BYTE_BUBBLES_THEME.star} 0%, #FFC94A 100%)`,
                border: `3px solid ${BYTE_BUBBLES_THEME.star}`,
                boxShadow: `0 0 20px ${BYTE_BUBBLES_THEME.star}80, 0 4px 12px rgba(0,0,0,0.2)`,
                color: BYTE_BUBBLES_THEME.text,
                fontFamily: "'Anton', 'Impact', 'Arial Black', sans-serif",
                letterSpacing: "0.05em",
                fontWeight: 600,
                pointerEvents: "auto",
              }}
            >
              {content.buttonText}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}