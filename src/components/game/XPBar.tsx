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
      className="fixed left-0 top-0 h-screen flex flex-col items-center justify-center py-8 px-2 md:px-4"
      style={{
        width: "clamp(56px, 5vw, 72px)",
        background: `linear-gradient(180deg, ${BYTE_BUBBLES_THEME.bgStart} 0%, ${BYTE_BUBBLES_THEME.bgMid} 50%, ${BYTE_BUBBLES_THEME.bgEnd} 100%)`,
        borderRight: `1px solid ${BYTE_BUBBLES_THEME.accent}40`,
      }}
    >
      {/* Star slots */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 md:gap-4">
        {stars.map((filled, index) => (
          <motion.div
            key={index}
            className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {filled ? (
              <motion.div
                className="text-2xl md:text-3xl"
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
                className="w-6 h-6 md:w-7 md:h-7 rounded-full border-2"
                style={{
                  borderColor: `${BYTE_BUBBLES_THEME.textSecondary}40`,
                  background: "rgba(255,255,255,0.2)",
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
          color: BYTE_BUBBLES_THEME.textSecondary,
          fontFamily: "'Orbitron', sans-serif",
        }}
      >
        XP
      </div>
    </div>
  );
}
