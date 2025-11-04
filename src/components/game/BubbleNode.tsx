import { motion } from "framer-motion";
import { BYTE_BUBBLES_THEME } from "@/lib/byteBubblesData";

interface BubbleNodeProps {
  label: string;
  x: number;
  y: number;
  onClick: () => void;
  isCompleted?: boolean;
}

export function BubbleNode({ label, x, y, onClick, isCompleted }: BubbleNodeProps) {
  const playClickSound = () => {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3");
    audio.volume = 0.4;
    audio.play().catch(err => console.log("Sound play failed:", err));
  };

  const playHoverSound = () => {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3");
    audio.volume = 0.2;
    audio.play().catch(err => console.log("Sound play failed:", err));
  };

  const handleClick = () => {
    playClickSound();
    onClick();
  };

  return (
    <motion.button
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
        width: "clamp(76px, 9vw, 120px)",
        height: "clamp(76px, 9vw, 120px)",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      onMouseEnter={playHoverSound}
      aria-label={`Play ${label} level`}
    >
      <motion.div
        className="relative w-full h-full rounded-full flex items-center justify-center"
        style={{
          background: `radial-gradient(circle at 35% 25%, rgba(255,255,255,0.9), rgba(135,206,250,0.7) 40%, rgba(70,130,180,0.8) 70%, rgba(100,149,237,0.6))`,
          border: `3px solid rgba(255,255,255,0.5)`,
          boxShadow: `
            inset -8px -8px 12px rgba(70,130,180,0.4),
            inset 12px 12px 16px rgba(255,255,255,0.8),
            0 8px 24px rgba(0,0,0,0.15),
            0 0 0 4px rgba(255,255,255,0.3)
          `,
        }}
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)`,
            backgroundSize: "200% 200%",
          }}
          whileHover={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ duration: 0.6 }}
        />
        
        {/* Sunflower glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: `0 0 0 0px ${BYTE_BUBBLES_THEME.star}`,
          }}
          whileHover={{
            boxShadow: `0 0 0 4px ${BYTE_BUBBLES_THEME.star}40`,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Label */}
        <span
          className="relative z-10 text-center px-2"
          style={{
            color: BYTE_BUBBLES_THEME.text,
            fontSize: "clamp(12px, 1.4vw, 16px)",
            lineHeight: 1.2,
            fontFamily: "'Anton', 'Impact', 'Arial Black', sans-serif",
            letterSpacing: "0.02em",
            fontWeight: 400,
          }}
        >
          {label}
        </span>

        {/* Completion indicator */}
        {isCompleted && (
          <motion.div
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
            style={{
              background: BYTE_BUBBLES_THEME.star,
              boxShadow: `0 2px 8px ${BYTE_BUBBLES_THEME.star}80`,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <span className="text-xs">⭐</span>
          </motion.div>
        )}
      </motion.div>
    </motion.button>
  );
}