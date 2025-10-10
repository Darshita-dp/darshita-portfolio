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
          body: "Collect 5 special jellyfish to unlock your data profile",
          icon: "🪼",
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
          icon: "🎓",
          buttonText: "Start Mission →",
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
          {/* Animated grid background for Education level */}
          {levelId === 2 && (
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
            <div className="text-6xl">{content.icon}</div>
            <Button
              size="lg"
              onClick={onStart}
              className="text-lg px-8 py-6 font-semibold"
              style={{
                background: `linear-gradient(135deg, ${BYTE_BUBBLES_THEME.star} 0%, #FFC94A 100%)`,
                border: `3px solid ${BYTE_BUBBLES_THEME.star}`,
                boxShadow: `0 0 20px ${BYTE_BUBBLES_THEME.star}80, 0 4px 12px rgba(0,0,0,0.2)`,
                color: BYTE_BUBBLES_THEME.text,
                fontFamily: "'Anton', 'Impact', 'Arial Black', sans-serif",
                letterSpacing: "0.05em",
                fontWeight: 600,
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