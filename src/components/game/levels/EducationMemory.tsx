import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BYTE_BUBBLES_THEME } from "@/lib/byteBubblesData";

interface EducationMemoryProps {
  levelId: number;
  facts: string[];
  onComplete: (factsCollected: string[]) => void;
  onBack: () => void;
}

export function EducationMemory({ levelId, facts, onComplete, onBack }: EducationMemoryProps) {
  const [matchedCount, setMatchedCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.8, y: 20, opacity: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 25,
          opacity: { duration: 0.2 }
        }}
        className="w-[90vw] h-[80vh] max-w-5xl max-h-[700px] flex flex-col rounded-3xl overflow-hidden"
        style={{
          backgroundImage: `url('https://harmless-tapir-303.convex.cloud/api/storage/1a671974-29ce-4d1d-bd92-640e3bce7ed6')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: `3px solid ${BYTE_BUBBLES_THEME.accent}`,
          boxShadow: `0 0 30px ${BYTE_BUBBLES_THEME.accent}80, 0 8px 32px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{
            borderColor: `${BYTE_BUBBLES_THEME.accent}40`,
            background: `${BYTE_BUBBLES_THEME.bubble}80`,
            backdropFilter: 'blur(8px)',
          }}
        >
          <Button variant="ghost" size="sm" onClick={onBack}>
            ← Back to Map
          </Button>
          <div className="flex items-center gap-3">
            <span
              style={{
                fontFamily: "'Anton', sans-serif",
                color: BYTE_BUBBLES_THEME.text,
                fontSize: '1.1rem',
              }}
            >
              Skill Sync Progress ⭐ {matchedCount} / 5
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? "Resume" : "Pause"}
          </Button>
        </div>

        {/* Game Area */}
        <div className="flex-1 relative p-6">
          <div className="text-center text-white text-xl">
            Memory matching game content will go here
          </div>
        </div>

        {/* Level Complete Modal */}
        <AnimatePresence>
          {showComplete && (
            <motion.div
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                className="bg-white rounded-2xl p-8 max-w-md"
              >
                <h2 className="text-2xl font-bold text-center mb-4">
                  ✨ Education Module Complete! ✨
                </h2>
                <Button
                  size="lg"
                  onClick={() => onComplete(facts)}
                  className="w-full"
                >
                  Next →
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}