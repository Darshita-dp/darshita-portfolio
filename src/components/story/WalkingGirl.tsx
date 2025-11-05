import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface WalkingGirlProps {
  scrollProgress: number;
  isRaining: boolean;
}

export function WalkingGirl({ scrollProgress, isRaining }: WalkingGirlProps) {
  const prefersReducedMotion = useReducedMotion();
  const parallaxOffset = scrollProgress * 100;

  return (
    <motion.div
      className="fixed bottom-[20vh] left-[30vw] z-30 pointer-events-none"
      style={{
        transform: `translateX(${-parallaxOffset}vw)`,
      }}
    >
      <div className="relative w-48 h-48">
        {/* Witch character flying on broom */}
        <motion.img
          src="https://harmless-tapir-303.convex.cloud/api/storage/d5928fb5-92f1-4106-848f-a9409279aa7e"
          alt="Flying witch"
          className="w-full h-full object-contain drop-shadow-lg"
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