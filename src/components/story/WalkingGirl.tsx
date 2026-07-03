import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-mobile";

interface WalkingGirlProps {
  scrollProgress: number;
  isRaining: boolean;
}

export function WalkingGirl({ scrollProgress, isRaining }: WalkingGirlProps) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const prevScrollProgress = useRef(scrollProgress);
  const [isMovingBackward, setIsMovingBackward] = useState(false);
  
  // Track scroll direction
  useEffect(() => {
    if (scrollProgress < prevScrollProgress.current) {
      setIsMovingBackward(true);
    } else if (scrollProgress > prevScrollProgress.current) {
      setIsMovingBackward(false);
    }
    prevScrollProgress.current = scrollProgress;
  }, [scrollProgress]);
  
  // Calculate horizontal position based on scroll progress (0 = left, 1 = right)
  const horizontalPercent = 8 + (scrollProgress * 84);

  // Reduce particle count on mobile
  const particleCount = isMobile ? 6 : 12;
  const glitterCount = isMobile ? 12 : 24;

  return (
    <motion.div
      className="fixed bottom-8 z-30 pointer-events-none"
      style={{
        left: `${horizontalPercent}%`,
        transform: 'translateX(-50%)',
      }}
      animate={{
        left: `${horizontalPercent}%`,
      }}
      transition={{
        duration: 0.8,
        ease: "easeInOut",
      }}
      aria-hidden="true"
    >
      <div className="relative w-48 h-48">
        {/* Sparkle particles around the character */}
        {[...Array(particleCount)].map((_, i) => {
          const angle = (i * 30) + Math.random() * 20;
          const distance = 60 + Math.random() * 30;
          return (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-yellow-300"
              style={{
                boxShadow: '0 0 8px rgba(255, 215, 0, 0.8)',
              }}
              animate={prefersReducedMotion ? {} : {
                x: [0, Math.cos(angle * Math.PI / 180) * distance, 0],
                y: [0, Math.sin(angle * Math.PI / 180) * distance, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0],
              }}
              transition={prefersReducedMotion ? {} : {
                duration: 2 + Math.random() * 0.5,
                repeat: Infinity,
                ease: "easeOut",
                delay: i * 0.15,
              }}
            />
          );
        })}

        {/* Enhanced glitter trail effect with silver and larger particles */}
        {[...Array(glitterCount)].map((_, i) => {
          const isSilver = i % 2 === 0;
          const size = isSilver ? (2 + Math.random() * 2) : (1.5 + Math.random() * 1);
          return (
            <motion.div
              key={`glitter-${i}`}
              className="absolute rounded-full"
              style={{
                left: '50%',
                top: '50%',
                width: `${size}px`,
                height: `${size}px`,
                background: isSilver 
                  ? 'linear-gradient(135deg, #E8E8E8, #C0C0C0, #FFFFFF)' 
                  : i % 4 === 0 ? '#FFD700' : i % 4 === 1 ? '#FFA500' : i % 4 === 2 ? '#FFFF00' : '#FFE55C',
                boxShadow: isSilver 
                  ? '0 0 10px rgba(192, 192, 192, 0.9), 0 0 20px rgba(255, 255, 255, 0.6)' 
                  : '0 0 6px currentColor',
              }}
              animate={prefersReducedMotion ? {} : {
                x: [0, (Math.random() - 0.5) * 100],
                y: [0, (Math.random() - 0.5) * 100],
                opacity: [0.9, 0],
                scale: [1, 0],
                rotate: [0, Math.random() * 360],
              }}
              transition={prefersReducedMotion ? {} : {
                duration: 1.8 + Math.random() * 1,
                repeat: Infinity,
                ease: "easeOut",
                delay: i * 0.08,
                repeatDelay: 0,
              }}
            />
          );
        })}

        {/* Witch character flying on broom - flips based on direction */}
        <motion.img
          src="https://harmless-tapir-303.convex.cloud/api/storage/d5928fb5-92f1-4106-848f-a9409279aa7e"
          alt="Flying witch character"
          className="w-full h-full object-contain drop-shadow-lg relative z-10"
          style={{
            scaleX: isMovingBackward ? 1 : -1,
          }}
          animate={prefersReducedMotion ? {} : {
            y: [0, -8, 0],
            rotate: [0, 2, -2, 0],
          }}
          transition={prefersReducedMotion ? {} : {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Rain splash effect when raining */}
        {isRaining && (
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            animate={prefersReducedMotion ? {} : {
              scale: [0.8, 1.2, 0.8],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={prefersReducedMotion ? {} : {
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