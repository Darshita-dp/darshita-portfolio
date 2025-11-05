import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

interface WeatherLayerProps {
  scrollProgress: number;
  currentChapter: number;
}

export function WeatherLayer({ scrollProgress, currentChapter }: WeatherLayerProps) {
  const prefersReducedMotion = useReducedMotion();
  const flowersContainerRef = useRef<HTMLDivElement | null>(null);
  const sparklesContainerRef = useRef<HTMLDivElement | null>(null);
  const cloudsContainerRef = useRef<HTMLDivElement | null>(null);

  // Falling flowers for chapters 1 and 2
  const showFlowers = currentChapter === 0 || currentChapter === 1;
  const showClouds = currentChapter === 2 || currentChapter === 3;

  // Continuous flower animation using RAF
  useEffect(() => {
    if (!showFlowers || prefersReducedMotion) return;
    
    const container = flowersContainerRef.current;
    if (!container) return;

    const flowers: Array<{
      el: HTMLImageElement;
      startX: number;
      y: number;
      drift: number;
      speed: number;
      rotation: number;
      rotSpeed: number;
    }> = [];

    // Create 60 flower elements
    for (let i = 0; i < 60; i++) {
      const img = document.createElement("img");
      img.src = "https://harmless-tapir-303.convex.cloud/api/storage/18a36123-1921-492d-ad74-35efaf89ab73";
      img.alt = "";
      img.style.position = "absolute";
      img.style.pointerEvents = "none";
      
      const size = 20 + Math.random() * 30;
      const opacity = 0.4 + Math.random() * 0.4;
      img.style.width = `${size}px`;
      img.style.height = `${size}px`;
      img.style.opacity = String(opacity);
      
      container.appendChild(img);

      flowers.push({
        el: img,
        startX: Math.random() * 100,
        y: -60 - Math.random() * 200, // stagger initial positions
        drift: (Math.random() - 0.5) * 30,
        speed: 40 + Math.random() * 30, // pixels per second
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 60, // degrees per second
      });
    }

    let lastTime = performance.now();
    let rafId: number;

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000; // seconds
      lastTime = currentTime;

      const vh = window.innerHeight;

      flowers.forEach((flower) => {
        flower.y += flower.speed * deltaTime;
        flower.rotation += flower.rotSpeed * deltaTime;

        // Reset when flower goes off screen
        if (flower.y > vh + 60) {
          flower.y = -60;
          flower.startX = Math.random() * 100;
          flower.drift = (Math.random() - 0.5) * 30;
        }

        const x = flower.startX + (flower.drift * (flower.y + 60)) / vh;
        flower.el.style.transform = `translate(${x}vw, ${flower.y}px) rotate(${flower.rotation}deg)`;
      });

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      container.innerHTML = "";
    };
  }, [showFlowers, prefersReducedMotion]);

  // Continuous sparkle animation using RAF
  useEffect(() => {
    if (!showFlowers || prefersReducedMotion) return;
    
    const container = sparklesContainerRef.current;
    if (!container) return;

    const sparkles: Array<{
      el: HTMLImageElement;
      startX: number;
      y: number;
      speed: number;
      scale: number;
      scalePhase: number;
      rotation: number;
      rotSpeed: number;
      opacityBase: number;
      opacityPhase: number;
    }> = [];

    // Create 40 sparkle elements
    for (let i = 0; i < 40; i++) {
      const img = document.createElement("img");
      img.src = "https://harmless-tapir-303.convex.cloud/api/storage/97621a6b-9260-4899-a3c2-8af8d2d6ea49";
      img.alt = "";
      img.style.position = "absolute";
      img.style.pointerEvents = "none";
      
      const size = 8 + Math.random() * 8;
      img.style.width = `${size}px`;
      img.style.height = `${size}px`;
      
      container.appendChild(img);

      sparkles.push({
        el: img,
        startX: Math.random() * 100,
        y: -60 - Math.random() * 300, // stagger initial positions
        speed: 30 + Math.random() * 30,
        scale: 1,
        scalePhase: Math.random() * Math.PI * 2,
        rotation: Math.random() * 360,
        rotSpeed: 90 + Math.random() * 90,
        opacityBase: 0.5 + Math.random() * 0.4,
        opacityPhase: Math.random() * Math.PI * 2,
      });
    }

    let lastTime = performance.now();
    let rafId: number;

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const vh = window.innerHeight;
      const time = currentTime / 1000;

      sparkles.forEach((sparkle) => {
        sparkle.y += sparkle.speed * deltaTime;
        sparkle.rotation += sparkle.rotSpeed * deltaTime;

        // Reset when sparkle goes off screen
        if (sparkle.y > vh + 60) {
          sparkle.y = -60;
          sparkle.startX = Math.random() * 100;
        }

        // Pulsing scale and opacity
        sparkle.scale = 1 + 0.3 * Math.sin(time * 2 + sparkle.scalePhase);
        const opacity = sparkle.opacityBase * (0.7 + 0.3 * Math.sin(time * 3 + sparkle.opacityPhase));

        sparkle.el.style.transform = `translate(${sparkle.startX}vw, ${sparkle.y}px) scale(${sparkle.scale}) rotate(${sparkle.rotation}deg)`;
        sparkle.el.style.opacity = String(opacity);
      });

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      container.innerHTML = "";
    };
  }, [showFlowers, prefersReducedMotion]);

  // Floating clouds for chapters 3 and 4
  useEffect(() => {
    if (!showClouds || prefersReducedMotion) return;
    
    const container = cloudsContainerRef.current;
    if (!container) return;

    const clouds: Array<{
      el: HTMLImageElement;
      x: number;
      baseY: number;
      speed: number;
      amp: number;
      freq: number;
      phase: number;
    }> = [];

    // Create 27 cloud elements (14 + 8 + 5 more with extra transparency and less movement)
    const cloudCount = 27;
    for (let i = 0; i < cloudCount; i++) {
      const img = document.createElement("img");
      img.src = "https://harmless-tapir-303.convex.cloud/api/storage/6ee126fd-20b5-4592-a489-0d46bf521544";
      img.alt = "";
      img.style.position = "absolute";
      img.style.pointerEvents = "none";
      
      const size = 60 + Math.random() * 120; // 60-180px for varied sizes
      // Extra 8 clouds have more transparency (0.15-0.3) vs original (0.2-0.4)
      const opacity = i < 14 ? (0.2 + Math.random() * 0.2) : (0.15 + Math.random() * 0.15);
      img.style.width = `${size}px`;
      img.style.height = "auto";
      img.style.opacity = String(opacity);
      
      container.appendChild(img);

      clouds.push({
        el: img,
        x: -20 + (i / cloudCount) * 140 + Math.random() * 20, // distribute evenly across full width with slight randomness
        baseY: Math.random() * 12, // top 12% of screen only (moved higher)
        speed: i < 14 ? (5 + Math.random() * 10) : (2 + Math.random() * 4), // extra clouds move slower
        amp: i < 14 ? (3 + Math.random() * 5) : (1 + Math.random() * 2), // extra clouds have less vertical movement
        freq: 0.3 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let lastTime = performance.now();
    let rafId: number;

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const vw = window.innerWidth;

      clouds.forEach((cloud) => {
        cloud.x += (cloud.speed * deltaTime) / vw * 100; // convert to vw
        
        // Reset when cloud goes off right edge
        if (cloud.x > 110) {
          cloud.x = -20;
          cloud.baseY = Math.random() * 20; // keep in top 20%
        }

        const y = cloud.baseY + cloud.amp * Math.sin((currentTime / 1000) * cloud.freq + cloud.phase);
        cloud.el.style.transform = `translate(${cloud.x}vw, ${y}vh)`;
      });

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      container.innerHTML = "";
    };
  }, [showClouds, prefersReducedMotion]);

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

      {/* Falling Flowers (Chapter 1 only) - RAF animated */}
      {showFlowers && (
        <div
          ref={flowersContainerRef}
          className="fixed inset-0 z-20 pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Sparkling Sparkles (Chapter 1 only) - RAF animated */}
      {showFlowers && (
        <div
          ref={sparklesContainerRef}
          className="fixed inset-0 z-20 pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Floating Clouds (Chapters 3 & 4) - RAF animated */}
      {showClouds && (
        <div
          ref={cloudsContainerRef}
          className="fixed inset-0 z-20 pointer-events-none"
          aria-hidden="true"
        />
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