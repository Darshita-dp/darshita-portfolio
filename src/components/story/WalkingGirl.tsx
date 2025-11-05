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
        {/* Sparkle particles around the character */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45) + Math.random() * 20;
          const distance = 60 + Math.random() * 30;
          return (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-yellow-300"
              style={{
                boxShadow: '0 0 8px rgba(255, 215, 0, 0.8)',
              }}
              animate={{
                x: [0, Math.cos(angle * Math.PI / 180) * distance, 0],
                y: [0, Math.sin(angle * Math.PI / 180) * distance, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 0.5,
                repeat: Infinity,
                ease: "easeOut",
                delay: i * 0.25,
              }}
            />
          );
        })}

        {/* Glitter trail effect */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`glitter-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              left: '50%',
              top: '50%',
              background: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#FFA500' : '#FFFF00',
              boxShadow: '0 0 6px currentColor',
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 80],
              y: [0, (Math.random() - 0.5) * 80],
              opacity: [0.8, 0],
              scale: [1, 0],
            }}
            transition={{
              duration: 1.5 + Math.random() * 0.8,
              repeat: Infinity,
              ease: "easeOut",
              delay: i * 0.15,
            }}
          />
        ))}

        {/* Witch character flying on broom - flips based on direction */}
        <motion.img
          src="https://harmless-tapir-303.convex.cloud/api/storage/d5928fb5-92f1-4106-848f-a9409279aa7e"
          alt="Flying witch"
          className="w-full h-full object-contain drop-shadow-lg relative z-10"
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