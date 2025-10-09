import { motion } from "framer-motion";
import { BYTE_BUBBLES_THEME } from "@/lib/byteBubblesData";

interface XPBarProps {
  totalStars: number;
  collectedStars: number;
}

export function XPBar({ totalStars, collectedStars }: XPBarProps) {
  const stars = Array.from({ length: totalStars }, (_, i) => i < collectedStars);

  return (
    <div
      className="fixed left-0 top-0 h-screen flex flex-col items-center justify-center py-8 px-2 md:px-3"
      style={{
        width: "clamp(48px, 4vw, 60px)",
        background: `linear-gradient(180deg, ${BYTE_BUBBLES_THEME.bgStart}60 0%, ${BYTE_BUBBLES_THEME.bgMid}50 50%, ${BYTE_BUBBLES_THEME.bgEnd}60 100%)`,
        borderRight: `1px solid ${BYTE_BUBBLES_THEME.accent}30`,
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Star slots */}
      <div className="flex-1 flex flex-col items-center justify-center gap-2 md:gap-3">
        {stars.map((filled, index) => (
          <motion.div
            key={index}
            className="relative w-6 h-6 md:w-8 md:h-8 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {filled ? (
              <motion.div
                className="text-xl md:text-2xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                style={{
                  filter: `drop-shadow(0 2px 6px ${BYTE_BUBBLES_THEME.star}80)`,
                }}
              >
                ⭐
              </motion.div>
            ) : (
              <div
                className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2"
                style={{
                  borderColor: `${BYTE_BUBBLES_THEME.textSecondary}30`,
                  background: "rgba(255,255,255,0.15)",
                }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* XP Label */}
      <div
        className="text-xs font-bold tracking-wider mt-2"
        style={{
          color: `${BYTE_BUBBLES_THEME.textSecondary}cc`,
          fontFamily: "'Orbitron', sans-serif",
        }}
      >
        XP
      </div>
    </div>
  );
}