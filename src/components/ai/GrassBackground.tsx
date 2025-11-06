import { useMemo } from "react";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-mobile";

export function GrassBackground() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const grassCount = isMobile ? 60 : 240;
  const dandelionCount = isMobile ? 8 : 20;

  const grassBackground = useMemo(() => (
    <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-0">
      {/* Multiple grass blades with varied shapes, sizes, and colors */}
      {[...Array(grassCount)].map((_, i) => {
        const greenShades = [
          ["#2E7D32", "#66BB6A"],
          ["#388E3C", "#81C784"],
          ["#43A047", "#A5D6A7"],
          ["#4CAF50", "#C8E6C9"],
          ["#1B5E20", "#4CAF50"],
        ];
        const shade = greenShades[i % greenShades.length];
        const height = 60 + Math.random() * 100;
        const width = 5 + Math.random() * 15;
        const isWide = Math.random() > 0.7;

        return (
          <motion.div
            key={i}
            className="absolute bottom-0"
            style={{
              left: `${(i * 0.42) % 100}%`,
              height: `${height}px`,
              width: `${width}px`,
            }}
            animate={
              isMobile
                ? {}
                : {
                    rotate: [0, 3 + Math.random() * 3, -(3 + Math.random() * 3), 0],
                    scaleY: [1, 1.05 + Math.random() * 0.05, 0.95 + Math.random() * 0.05, 1],
                    scaleX: [1, 0.97, 1.03, 1],
                  }
            }
            transition={
              isMobile
                ? {}
                : {
                    duration: 2 + Math.random() * 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 3,
                  }
            }
          >
            <div
              className={isWide ? "w-full h-full rounded-t-lg" : "w-full h-full rounded-t-full"}
              style={{
                background: `linear-gradient(to top, ${shade[0]}, ${shade[1]})`,
                transformOrigin: "bottom center",
                opacity: 0.7 + Math.random() * 0.3,
              }}
            />
          </motion.div>
        );
      })}

      {/* Fluffy weed flowers (dandelions) */}
      {[...Array(dandelionCount)].map((_, i) => {
        const height = 160 + Math.random() * 40;
        const leftPos = i < 6 ? Math.random() * 30 : 25 + (i - 6) * 5 + Math.random() * 10;

        return (
          <motion.div
            key={`flower-${i}`}
            className="absolute bottom-0"
            style={{
              left: `${leftPos}%`,
              height: `${height}px`,
              width: "3px",
            }}
            animate={
              isMobile
                ? {}
                : {
                    rotate: [0, 5 + Math.random() * 4, -(5 + Math.random() * 4), 0],
                    x: [0, 3, -3, 0],
                  }
            }
            transition={
              isMobile
                ? {}
                : {
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 2,
                  }
            }
          >
            {/* Stem */}
            <div
              className="w-full h-full relative"
              style={{
                background: "linear-gradient(to top, #2E7D32, #66BB6A)",
                transformOrigin: "bottom center",
              }}
            >
              {/* Small leaves on stem */}
              <div
                className="absolute"
                style={{
                  left: "-4px",
                  top: "40%",
                  width: "8px",
                  height: "12px",
                  background: "linear-gradient(135deg, #43A047, #66BB6A)",
                  borderRadius: "0 50% 50% 0",
                  transform: "rotate(-30deg)",
                }}
              />
              <div
                className="absolute"
                style={{
                  right: "-4px",
                  top: "60%",
                  width: "8px",
                  height: "12px",
                  background: "linear-gradient(225deg, #43A047, #66BB6A)",
                  borderRadius: "50% 0 0 50%",
                  transform: "rotate(30deg)",
                }}
              />
            </div>
            {/* Fluffy flower head */}
            <motion.div
              className="absolute -top-3 left-1/2 -translate-x-1/2"
              animate={
                isMobile
                  ? {}
                  : {
                      scale: [1, 1.1, 1],
                      rotate: [0, 10, -10, 0],
                    }
              }
              transition={
                isMobile
                  ? {}
                  : {
                      duration: 2 + Math.random(),
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "radial-gradient(circle, #FFFFFF 30%, #F0F0F0 60%, rgba(255,255,255,0.6) 100%)",
                boxShadow: "0 0 8px rgba(255,255,255,0.8), inset 0 0 4px rgba(200,200,200,0.5)",
                filter: "blur(0.5px)",
              }}
            >
              {/* Sparkle effects */}
              {!isMobile &&
                [...Array(6)].map((_, sparkleIdx) => {
                  const angle = sparkleIdx * 60 + Math.random() * 30;
                  const distance = 12 + Math.random() * 6;
                  return (
                    <motion.div
                      key={sparkleIdx}
                      className="absolute"
                      style={{
                        left: "50%",
                        top: "50%",
                        width: "3px",
                        height: "3px",
                        borderRadius: "50%",
                        background: "#FFFFFF",
                        boxShadow: "0 0 3px #FFFFFF",
                      }}
                      animate={{
                        x: [0, Math.cos((angle * Math.PI) / 180) * distance, 0],
                        y: [0, Math.sin((angle * Math.PI) / 180) * distance, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1.5 + Math.random() * 0.5,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: sparkleIdx * 0.2 + Math.random() * 0.3,
                      }}
                    />
                  );
                })}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  ), [grassCount, dandelionCount, isMobile]);

  return grassBackground;
}
