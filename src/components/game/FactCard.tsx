import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BYTE_BUBBLES_THEME } from "@/lib/byteBubblesData";

interface FactCardProps {
  fact: string;
  onDismiss: () => void;
}

export function FactCard({ fact, onDismiss }: FactCardProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDismiss}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "clamp(280px, 80%, 420px)",
        }}
      >
        <Card
          className="relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${BYTE_BUBBLES_THEME.bubble}95 0%, ${BYTE_BUBBLES_THEME.seafoam}90 100%)`,
            backdropFilter: "blur(16px)",
            borderRadius: "20px",
            border: `2px solid ${BYTE_BUBBLES_THEME.accent}60`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.2), 0 0 0 1px ${BYTE_BUBBLES_THEME.accent}40`,
          }}
        >
          <CardContent className="p-6 text-center space-y-4">
            <div className="text-4xl">⭐</div>
            <p
              className="text-lg leading-relaxed"
              style={{
                fontFamily: "'Quicksand', sans-serif",
                color: BYTE_BUBBLES_THEME.text,
                fontWeight: 600,
              }}
            >
              {fact}
            </p>
            <p
              className="text-sm"
              style={{
                fontFamily: "'Quicksand', sans-serif",
                color: BYTE_BUBBLES_THEME.textSecondary,
              }}
            >
              Click anywhere to continue
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
