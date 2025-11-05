import { motion, useReducedMotion } from "framer-motion";

interface WeatherLayerProps {
  scrollProgress: number;
  currentChapter: number;
}

export function WeatherLayer({ scrollProgress, currentChapter }: WeatherLayerProps) {
  const prefersReducedMotion = useReducedMotion();

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

  const getCloudOpacity = () => {
    if (currentChapter <= 2) return 0.8;
    if (currentChapter <= 4) return 0.5;
    if (currentChapter === 7) return 0.9;
    if (currentChapter >= 8) return 0.7;
    return 0.3;
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

  // Determine which cloud image to use based on chapter
  const getCloudImage = () => {
    if (currentChapter === 0) {
      return "https://harmless-tapir-303.convex.cloud/api/storage/47929630-859f-4372-ad82-040caa3e2d1a";
    } else if (currentChapter === 1) {
      return "https://harmless-tapir-303.convex.cloud/api/storage/ac7f8ab5-863f-4896-bcdd-06a37dd01b2e";
    }
    return null;
  };

  const cloudImage = getCloudImage();

  // Calculate cloud opacity based on scroll progress for fade out effect
  const getScrollBasedCloudOpacity = (index: number) => {
    // Clouds visible in chapters 0-1, fade out as we move to chapter 2
    const chapterProgress = scrollProgress * 9;
    
    if (chapterProgress < 1.5) {
      return 0.4; // Full visibility in chapters 0-1
    } else if (chapterProgress < 2.5) {
      // Fade out between chapter 1.5 and 2.5
      return 0.4 * (1 - ((chapterProgress - 1.5) / 1));
    }
    return 0; // Invisible after chapter 2
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

      {/* Clouds - only show for chapters 0-2 with scroll-based movement */}
      {cloudImage && (
        <motion.div
          className="fixed inset-0 z-10 pointer-events-none"
          style={{
            opacity: getCloudOpacity(),
          }}
        >
          {[...Array(18)].map((_, i) => {
            const cloudOpacity = getScrollBasedCloudOpacity(i);
            const chapterProgress = scrollProgress * 9;
            
            // Calculate horizontal movement: clouds move from left to right as we scroll
            // Start position at chapter 0, end position at chapter 2
            const startX = (i * 5.5) - 10; // Initial spread
            const moveDistance = 120; // How far clouds travel
            const xPosition = startX + (chapterProgress / 2) * moveDistance;
            
            return (
              <motion.img
                key={i}
                src={cloudImage}
                alt=""
                className="absolute"
                style={{
                  width: `${80 + Math.random() * 180}px`,
                  height: `${40 + Math.random() * 90}px`,
                  left: `${xPosition}%`,
                  top: `${5 + (i % 5) * 12}%`,
                  objectFit: "contain",
                  opacity: cloudOpacity,
                }}
                animate={prefersReducedMotion ? {} : {
                  y: [0, 8 + Math.random() * 6, 0],
                  scale: [1, 1.02 + Math.random() * 0.03, 1],
                }}
                transition={{
                  duration: 6 + i * 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </motion.div>
      )}

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