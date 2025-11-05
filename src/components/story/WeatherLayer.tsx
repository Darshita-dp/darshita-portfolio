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

  const parallaxOffset = scrollProgress * 40;

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

  return (
    <>
      {/* Sky Background */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{
          background: getSkyGradient(),
          transform: `translateX(${-parallaxOffset}vw)`,
          width: '900vw',
          left: 0,
        }}
      />

      {/* Clouds */}
      <motion.div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          opacity: getCloudOpacity(),
          transform: `translateX(${-parallaxOffset * 0.75}vw)`,
          width: '900vw',
          left: 0,
        }}
      >
        {cloudImage ? (
          // Use cloud images for chapters 1 and 2
          [...Array(8)].map((_, i) => (
            <motion.img
              key={i}
              src={cloudImage}
              alt=""
              className="absolute"
              style={{
                width: `${120 + i * 30}px`,
                height: `${60 + i * 15}px`,
                left: `${i * 15}%`,
                top: `${10 + (i % 3) * 15}%`,
                objectFit: "contain",
              }}
              animate={prefersReducedMotion ? {} : {
                x: [0, 20, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))
        ) : (
          // Use default rounded div clouds for other chapters
          [...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/60"
              style={{
                width: `${80 + i * 20}px`,
                height: `${40 + i * 10}px`,
                left: `${i * 15}%`,
                top: `${10 + (i % 3) * 15}%`,
                filter: "blur(8px)",
              }}
              animate={prefersReducedMotion ? {} : {
                x: [0, 20, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))
        )}
      </motion.div>

      {/* Stars (night only) */}
      <motion.div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{ 
          opacity: getStarOpacity(),
          width: '900vw',
          left: 0,
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
            width: '900vw',
            left: 0,
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