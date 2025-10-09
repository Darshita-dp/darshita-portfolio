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
              Boot-Up Protocol: Ready to Know the Player?
            </CardTitle>
            <p
              className="text-base md:text-lg"
              style={{
                fontFamily: "'Quicksand', sans-serif",
                color: BYTE_BUBBLES_THEME.textSecondary,
              }}
            >
              Collect 5 special stars to unlock your data profile
            </p>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6 pb-8">
            <div className="text-6xl">⭐</div>
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
              START RUN
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
