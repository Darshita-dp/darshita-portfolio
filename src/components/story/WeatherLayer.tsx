import { motion } from "framer-motion";

interface WeatherLayerProps {
  scrollProgress: number;
  currentChapter: number;
}

export function WeatherLayer({ scrollProgress, currentChapter }: WeatherLayerProps) {
  const isRaining = currentChapter === 6;

  // Sky gradient based on chapter progression
  const getSkyGradient = () => {
    if (currentChapter <= 1) return "from-blue-100 via-blue-50 to-pink-50";
    if (currentChapter <= 3) return "from-sky-100 via-blue-50 to-amber-50";
    if (currentChapter <= 5) return "from-amber-50 via-orange-50 to-pink-50";
    if (currentChapter === 6) return "from-gray-300 via-gray-200 to-gray-100";
    if (currentChapter === 7) return "from-blue-100 via-sky-100 to-amber-50";
    return "from-yellow-100 via-amber-50 to-pink-50";
  };

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Subtle sky gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${getSkyGradient()} opacity-40`} />

      {/* Conditional rain effect */}
      {isRaining && (
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-8 bg-blue-400/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * -20}%`,
              }}
              animate={{
                y: ["0vh", "120vh"],
              }}
              transition={{
                duration: 1 + Math.random() * 0.5,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      {/* Subtle clouds */}
      {!isRaining && [...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-16 rounded-full bg-white/20 blur-xl"
          style={{
            left: `${10 + i * 25}%`,
            top: `${8 + i * 12}%`,
          }}
          animate={{
            x: [0, 30, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}