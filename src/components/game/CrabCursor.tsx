import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CrabCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.1 }}
    >
      {/* Glowing dotted bubbles */}
      {[...Array(6)].map((_, i) => {
        const angle = (i * 60) * (Math.PI / 180);
        const distance = 15 + Math.random() * 5;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: "6px",
              height: "6px",
              left: `${x}px`,
              top: `${y}px`,
              background: "radial-gradient(circle, rgba(167, 232, 225, 0.9), rgba(167, 232, 225, 0.3))",
              boxShadow: "0 0 8px rgba(167, 232, 225, 0.8), 0 0 12px rgba(167, 232, 225, 0.4)",
            }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.6, 1, 0.6],
              y: [y, y - 5, y],
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        );
      })}
      
      {/* Jellyfish cursor */}
      <motion.img
        src="https://harmless-tapir-303.convex.cloud/api/storage/504aaf5b-3288-46a3-b785-5aa69fee077f"
        alt="Jellyfish cursor"
        className="w-10 h-10 md:w-12 md:h-12"
        style={{
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
        }}
        animate={{
          y: [0, -8, 0],
          rotate: [-3, 3, -3],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}