import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface WalkingGirlProps {
  scrollProgress: number;
  isRaining: boolean;
}

export function WalkingGirl({ scrollProgress, isRaining }: WalkingGirlProps) {
  const prefersReducedMotion = useReducedMotion();
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
  // Map scrollProgress (0-1) to horizontal position (8% to 92% of screen width)
  const horizontalPercent = 8 + (scrollProgress * 84); // 8% to 92%

  return (
    <motion.div
      className="fixed bottom-8 z-30 pointer-events-none"
      style={{
        left: `${horizontalPercent}%`,
        transform: 'translateX(-50%)', // Center the character on the position
      }}
      animate={{
        left: `${horizontalPercent}%`,
      }}
      transition={{
        duration: 0.8,
        ease: "easeInOut",
      }}
    >
      <div className="relative w-48 h-48">
        {/* Witch character flying on broom - flips based on direction */}
        <motion.img
          src="https://harmless-tapir-303.convex.cloud/api/storage/d5928fb5-92f1-4106-848f-a9409279aa7e"
          alt="Flying witch"
          className="w-full h-full object-contain drop-shadow-lg"
          style={{
            scaleX: isMovingBackward ? 1 : -1,
          }}
          animate={prefersReducedMotion ? {} : {
            y: [0, -8, 0],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Rain splash effect when raining */}
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