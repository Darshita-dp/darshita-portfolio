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
  const shoeColor = "#3D2817";
  const umbrellaColor = "#2C3E50";

  return (
    <motion.div
      className="fixed bottom-[20vh] left-[30vw] z-30 pointer-events-none"
      style={{
        transform: `translateX(${-parallaxOffset}vw)`,
      }}
    >
      <div className="relative w-24 h-32">
        {/* Pixel art girl character */}
        <svg viewBox="0 0 32 48" className="w-full h-full" style={{ imageRendering: "pixelated" }}>
          {/* Head */}
          <rect x="12" y="6" width="8" height="8" fill={skinColor} />
          
          {/* Hair */}
          <rect x="10" y="4" width="12" height="2" fill={hairColor} />
          <rect x="10" y="6" width="2" height="6" fill={hairColor} />
          <rect x="20" y="6" width="2" height="6" fill={hairColor} />
          <rect x="12" y="12" width="8" height="2" fill={hairColor} />
          
          {/* Eyes (tiny pixels) */}
          <rect x="14" y="9" width="1" height="1" fill="#2C3E50" />
          <rect x="17" y="9" width="1" height="1" fill="#2C3E50" />
          
          {/* Body/Dress */}
          <rect x="11" y="14" width="10" height="2" fill={dressColor} />
          <rect x="10" y="16" width="12" height="8" fill={dressColor} />
          <rect x="9" y="20" width="14" height="4" fill={dressColor} />
          
          {/* Arms */}
          <rect x="8" y="16" width="2" height="6" fill={skinColor} />
          <rect x="22" y="16" width="2" height="6" fill={skinColor} />
          
          {/* Walking legs (animated with walkFrame) */}
          <motion.g
            animate={prefersReducedMotion ? {} : {
              y: [0, -1, 0],
            }}
            transition={{
              duration: 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <rect x="12" y="24" width="3" height="8" fill={skinColor} />
            <rect x="12" y="32" width="3" height="4" fill={shoeColor} />
          </motion.g>
          
          <motion.g
            animate={prefersReducedMotion ? {} : {
              y: [-1, 0, -1],
            }}
            transition={{
              duration: 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <rect x="17" y="24" width="3" height="8" fill={skinColor} />
            <rect x="17" y="32" width="3" height="4" fill={shoeColor} />
          </motion.g>
          
          {/* Umbrella (only when raining) - pixel art style */}
          {isRaining && (
            <g>
              {/* Umbrella canopy - blocky pixel style */}
              <rect x="8" y="8" width="2" height="2" fill={umbrellaColor} />
              <rect x="10" y="6" width="2" height="2" fill={umbrellaColor} />
              <rect x="12" y="5" width="2" height="2" fill={umbrellaColor} />
              <rect x="14" y="4" width="4" height="2" fill={umbrellaColor} />
              <rect x="18" y="5" width="2" height="2" fill={umbrellaColor} />
              <rect x="20" y="6" width="2" height="2" fill={umbrellaColor} />
              <rect x="22" y="8" width="2" height="2" fill={umbrellaColor} />
              
              {/* Umbrella handle */}
              <rect x="15" y="6" width="2" height="10" fill={umbrellaColor} />
            </g>
          )}
        </svg>
        
        {/* Splash effect when raining - pixel style */}
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