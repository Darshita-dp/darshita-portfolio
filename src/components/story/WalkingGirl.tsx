import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface WalkingGirlProps {
  scrollProgress: number;
  isRaining: boolean;
}

export function WalkingGirl({ scrollProgress, isRaining }: WalkingGirlProps) {
  const [walkFrame, setWalkFrame] = useState(0);
  const lastScrollRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      const delta = Math.abs(window.scrollY - lastScrollRef.current);
      lastScrollRef.current = window.scrollY;

      if (delta > 0) {
        setWalkFrame((prev) => (prev + 1) % 8);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prefersReducedMotion]);

  const parallaxOffset = scrollProgress * 100;

  // Pixel art color palette
  const skinColor = "#F5C4A0";
  const hairColor = "#4A3428";
  const dressColor = "#E8A5C0";
  const broomColor = "#8B6F47";
  const broomBristleColor = "#D4A574";

  return (
    <motion.div
      className="fixed bottom-[20vh] left-[30vw] z-30 pointer-events-none"
      style={{
        transform: `translateX(${-parallaxOffset}vw)`,
      }}
    >
      <div className="relative w-32 h-32">
        {/* Pixel art girl character flying on broom */}
        <svg viewBox="0 0 48 48" className="w-full h-full" style={{ imageRendering: "pixelated" }}>
          {/* Broom handle */}
          <rect x="8" y="28" width="24" height="2" fill={broomColor} />
          
          {/* Broom bristles */}
          <rect x="30" y="26" width="2" height="2" fill={broomBristleColor} />
          <rect x="32" y="25" width="2" height="4" fill={broomBristleColor} />
          <rect x="34" y="24" width="2" height="6" fill={broomBristleColor} />
          <rect x="36" y="25" width="2" height="4" fill={broomBristleColor} />
          <rect x="38" y="26" width="2" height="2" fill={broomBristleColor} />
          
          {/* Girl sitting on broom */}
          {/* Head */}
          <rect x="16" y="14" width="8" height="8" fill={skinColor} />
          
          {/* Hair */}
          <rect x="14" y="12" width="12" height="2" fill={hairColor} />
          <rect x="14" y="14" width="2" height="6" fill={hairColor} />
          <rect x="24" y="14" width="2" height="6" fill={hairColor} />
          <rect x="16" y="20" width="8" height="2" fill={hairColor} />
          
          {/* Hair bow (red ribbon) */}
          <rect x="12" y="14" width="2" height="2" fill="#C41E3A" />
          <rect x="10" y="15" width="2" height="1" fill="#C41E3A" />
          
          {/* Eyes (tiny pixels) */}
          <rect x="18" y="17" width="1" height="1" fill="#2C3E50" />
          <rect x="21" y="17" width="1" height="1" fill="#2C3E50" />
          
          {/* Body/Dress leaning forward */}
          <rect x="15" y="22" width="10" height="2" fill={dressColor} />
          <rect x="14" y="24" width="10" height="4" fill={dressColor} />
          
          {/* Arms reaching forward (holding broom) */}
          <rect x="12" y="24" width="2" height="4" fill={skinColor} />
          <rect x="10" y="27" width="2" height="2" fill={skinColor} />
          
          {/* Legs bent on broom */}
          <motion.g
            animate={prefersReducedMotion ? {} : {
              y: [0, -0.5, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <rect x="18" y="28" width="3" height="4" fill={skinColor} />
            <rect x="21" y="28" width="3" height="4" fill={skinColor} />
          </motion.g>
          
          {/* Dress flowing behind */}
          <motion.g
            animate={prefersReducedMotion ? {} : {
              x: [0, 1, 0],
              scaleX: [1, 1.1, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <rect x="24" y="24" width="2" height="4" fill={dressColor} />
            <rect x="25" y="26" width="2" height="2" fill={dressColor} />
          </motion.g>
        </svg>
        
        {/* Rain splash effect when raining - pixel style */}
        {isRaining && (
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-blue-300/60" />
              <div className="w-1 h-1 bg-blue-300/60" />
              <div className="w-1 h-1 bg-blue-300/60" />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}