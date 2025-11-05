import { motion, useReducedMotion } from "framer-motion";

interface WeatherLayerProps {
  scrollProgress: number;
  currentChapter: number;
}

export function WeatherLayer({ scrollProgress, currentChapter }: WeatherLayerProps) {
  const prefersReducedMotion = useReducedMotion();

  // Falling flowers for chapter 1
  const showFlowers = currentChapter === 0;

  // Calculate weather states based on scroll progress
  const getSkyGradient = () => {
    const chapterProgress = scrollProgress * 9;
    
    if (chapterProgress < 2) {
      // Dawn (Ch 1-2)
      return "linear-gradient(180deg, #FFB6C1 0%, #FFF6E7 100%)";
    } else if (chapterProgress < 3) {
      // Late Morning (Ch 3)
      return "linear-gradient(180deg, #CDE7F9 0%, #E8F4FA 100%)";
    } else if (chapterProgress < 4) {
      // Afternoon (Ch 4)
      return "linear-gradient(180deg, #87CEEB 0%, #B0E0E6 100%)";
    } else if (chapterProgress < 5) {
      // Evening (Ch 5)
      return "linear-gradient(180deg, #FFB347 0%, #E4D7FA 100%)";
    } else if (chapterProgress < 6) {
      // Night (Ch 6)
      return "linear-gradient(180deg, #1D2340 0%, #2C3E50 100%)";
    } else if (chapterProgress < 7) {
      // Rain (Ch 7)
      return "linear-gradient(180deg, #2C3E50 0%, #34495E 100%)";
    } else if (chapterProgress < 8) {
      // Clearing (Ch 8)
      return "linear-gradient(180deg, #708090 0%, #B0C4DE 100%)";
    } else {
      // New Morning (Ch 9)
      return "linear-gradient(180deg, #CDE7F9 0%, #FBE6A2 100%)";
    }
  };

  const getRainIntensity = () => {
    if (currentChapter !== 7) return 0;
    const chapterProgress = (scrollProgress * 9) - 6;
    if (chapterProgress < 0.6) return chapterProgress / 0.6;
    return 1 - ((chapterProgress - 0.6) / 0.4);
  };

  const getStarOpacity = () => {
    if (currentChapter === 6) return 0.8;
    if (currentChapter === 7) return 0.4;
    return 0;
  };

  return (
    <>
      {/* Sky Background */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{
          background: getSkyGradient(),
        }}
      />

      {/* Stars (night only) */}
      <motion.div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{ 
          opacity: getStarOpacity(),
        }}
      >
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
            }}
            animate={prefersReducedMotion ? {} : {
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      {/* Falling Flowers (Chapter 1 only) */}
      {showFlowers && (
        <motion.div
          className="fixed inset-0 z-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(60)].map((_, i) => {
            const size = 20 + Math.random() * 30; // 20-50px
            const opacity = 0.4 + Math.random() * 0.4; // 0.4-0.8
            const startX = Math.random() * 100;
            const drift = (Math.random() - 0.5) * 30; // horizontal drift
            const duration = 4 + Math.random() * 3; // 4-7s
            const delay = Math.random() * 2;
            
            return (
              <motion.img
                key={`flower-${i}`}
                src="https://harmless-tapir-303.convex.cloud/api/storage/18a36123-1921-492d-ad74-35efaf89ab73"
                alt=""
                className="absolute"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${startX}%`,
                  top: '-60px',
                  opacity: opacity,
                }}
                animate={prefersReducedMotion ? {} : {
                  y: ['0vh', '60vh'],
                  x: [0, drift],
                  rotate: [0, Math.random() * 360],
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: delay,
                }}
              />
            );
          })}
          {/* Sparkling Sparkles */}
          {[...Array(40)].map((_, i) => {
            const size = 15 + Math.random() * 25; // 15-40px
            const opacity = 0.5 + Math.random() * 0.4; // 0.5-0.9
            const startX = Math.random() * 100;
            const duration = 2 + Math.random() * 2; // 2-4s
            const delay = Math.random() * 3;
            
            return (
              <motion.img
                key={`sparkle-${i}`}
                src="https://harmless-tapir-303.convex.cloud/api/storage/97621a6b-9260-4899-a3c2-8af8d2d6ea49"
                alt=""
                className="absolute"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${startX}%`,
                  top: '-60px',
                  opacity: opacity,
                }}
                animate={prefersReducedMotion ? {} : {
                  y: ['0vh', '60vh'],
                  opacity: [opacity, opacity * 0.3, opacity],
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: delay,
                }}
              />
            );
          })}
        </motion.div>
      )}

      {/* Rain */}
      {getRainIntensity() > 0 && (
        <motion.div
          className="fixed inset-0 z-20 pointer-events-none"
          style={{ 
            opacity: getRainIntensity(),
          }}
        >
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-8 bg-blue-200/40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${-10 + Math.random() * 10}%`,
                transform: "rotate(15deg)",
              }}
              animate={{
                y: ["0vh", "110vh"],
              }}
              transition={{
                duration: 0.8 + Math.random() * 0.4,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 0.8,
              }}
            />
          ))}
        </motion.div>
      )}
    </>
  );
}