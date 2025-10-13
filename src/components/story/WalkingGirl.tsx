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

  return (
    <motion.div
      className="fixed bottom-[20vh] right-[10vw] z-30 pointer-events-none"
      style={{
        transform: `translateX(${-parallaxOffset}vw)`,
      }}
    >
      <div className="relative w-24 h-32">
        {/* Girl silhouette */}
        <svg viewBox="0 0 100 150" className="w-full h-full">
          <defs>
            <linearGradient id="girlGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F9D9E0" />
              <stop offset="100%" stopColor="#E4D7FA" />
            </linearGradient>
          </defs>
          
          {/* Body */}
          <ellipse cx="50" cy="100" rx="20" ry="35" fill="url(#girlGradient)" opacity="0.9" />
          
          {/* Head */}
          <circle cx="50" cy="40" r="18" fill="url(#girlGradient)" opacity="0.9" />
          
          {/* Walking legs (animated) */}
          <motion.ellipse
            cx="45"
            cy="130"
            rx="8"
            ry="20"
            fill="url(#girlGradient)"
            opacity="0.9"
            animate={prefersReducedMotion ? {} : {
              cy: [130, 125, 130],
              rx: [8, 10, 8],
            }}
            transition={{
              duration: 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.ellipse
            cx="55"
            cy="130"
            rx="8"
            ry="20"
            fill="url(#girlGradient)"
            opacity="0.9"
            animate={prefersReducedMotion ? {} : {
              cy: [125, 130, 125],
              rx: [10, 8, 10],
            }}
            transition={{
              duration: 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Umbrella (only when raining) */}
          {isRaining && (
            <g>
              <path
                d="M 50 30 Q 30 20, 30 35 L 50 35 Z"
                fill="#1D2340"
                opacity="0.8"
              />
              <path
                d="M 50 30 Q 70 20, 70 35 L 50 35 Z"
                fill="#1D2340"
                opacity="0.8"
              />
              <line x1="50" y1="35" x2="50" y2="55" stroke="#1D2340" strokeWidth="2" />
            </g>
          )}
        </svg>
        
        {/* Splash effect when raining */}
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
            <div className="w-8 h-2 rounded-full bg-blue-300/40" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
