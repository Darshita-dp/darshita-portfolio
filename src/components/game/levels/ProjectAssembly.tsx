import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BYTE_BUBBLES_THEME } from "@/lib/byteBubblesData";

interface ProjectAssemblyProps {
  levelId: number;
  facts: string[];
  onComplete: (factsCollected: string[]) => void;
  onBack: () => void;
}

interface Project {
  id: number;
  name: string;
  emoji: string;
  tech: string[];
  challenge: string;
  impact: string;
  x: number;
  y: number;
}

const PROJECTS: Project[] = [
  {
    id: 1,
    name: "SmartPlanner",
    emoji: "📱",
    tech: ["SwiftUI", "Core Data", "MVVM"],
    challenge: "Built an iOS task management app with local data persistence",
    impact: "Streamlined personal productivity with intuitive UI",
    x: 150,
    y: 150,
  },
  {
    id: 2,
    name: "AI-Driven Predictive Analytics",
    emoji: "🤖",
    tech: ["Python", "Machine Learning", "Data Analysis"],
    challenge: "Developed predictive models for business forecasting",
    impact: "Achieved 87% prediction accuracy for key metrics",
    x: 250,
    y: 300,
  },
  {
    id: 3,
    name: "IT Services Optimization",
    emoji: "⚙️",
    tech: ["SQL", "Power BI", "Process Analysis"],
    challenge: "Analyzed and optimized IT service workflows",
    impact: "Reduced ticket resolution time by 30%, targeted 99.9% uptime",
    x: 350,
    y: 150,
  },
  {
    id: 4,
    name: "Retail Analytics",
    emoji: "🕯️",
    tech: ["Excel", "Data Visualization", "Forecasting"],
    challenge: "Built analytics dashboard for local candle business",
    impact: "Increased forecast accuracy by 20%",
    x: 450,
    y: 300,
  },
  {
    id: 5,
    name: "Film-Fusion",
    emoji: "🎬",
    tech: ["React", "API Integration", "UI/UX"],
    challenge: "Created movie discovery web application",
    impact: "Seamless browsing experience with real-time data",
    x: 550,
    y: 200,
  },
];

export function ProjectAssembly({ levelId, facts, onComplete, onBack }: ProjectAssemblyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [collectedProjects, setCollectedProjects] = useState<number[]>([]);
  const [showProjectCard, setShowProjectCard] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionStep, setTransitionStep] = useState(0);

  const gameStateRef = useRef({
    player: { x: 80, y: 80, vx: 0, vy: 0, direction: 1, animFrame: 0 },
    keys: { left: false, right: false, up: false, down: false },
    bubbleTrail: [] as { x: number; y: number; life: number }[],
    sparkles: [] as { x: number; y: number; vx: number; vy: number; life: number }[],
    nodeGlow: {} as Record<number, number>,
    playerSpeed: 4,
    playerSize: 50,
    nodeRadius: 40,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Load Plankton sprite
    const planktonImg = new Image();
    planktonImg.src = "https://harmless-tapir-303.convex.cloud/api/storage/70c020a8-c7b3-40f9-9742-b8b5d690b178";

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Game loop
    let animationId: number;
    let lastTime = Date.now();

    const gameLoop = () => {
      if (isPaused) {
        animationId = requestAnimationFrame(gameLoop);
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const now = Date.now();
      const deltaTime = (now - lastTime) / 16.67;
      lastTime = now;

      const state = gameStateRef.current;

      // Clear canvas
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw underwater gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, rect.height);
      gradient.addColorStop(0, "#A8F7E3");
      gradient.addColorStop(0.4, "#85D8E4");
      gradient.addColorStop(1, "#A7C8FF");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Draw coral outlines
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 250, rect.height);
        ctx.quadraticCurveTo(i * 250 + 50, rect.height - 100, i * 250 + 100, rect.height - 150);
        ctx.stroke();
      }

      // Draw glowing paths between nodes
      ctx.strokeStyle = "#9EF1C8";
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#9EF1C8";
      
      for (let i = 0; i < PROJECTS.length - 1; i++) {
        const p1 = PROJECTS[i];
        const p2 = PROJECTS[i + 1];
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(
          (p1.x + p2.x) / 2,
          Math.min(p1.y, p2.y) - 50,
          p2.x,
          p2.y
        );
        
        // Pulse effect when player is near
        const distToPath = Math.min(
          Math.hypot(state.player.x - p1.x, state.player.y - p1.y),
          Math.hypot(state.player.x - p2.x, state.player.y - p2.y)
        );
        if (distToPath < 150) {
          ctx.shadowBlur = 20 + Math.sin(now / 200) * 10;
        }
        
        ctx.stroke();
      }
      
      ctx.shadowBlur = 0;

      // Update and draw floating bubbles
      for (let i = 0; i < 15; i++) {
        const x = (i * 80 + now / 50) % rect.width;
        const y = rect.height - ((now / 30 + i * 50) % rect.height);
        const size = 10 + (i % 3) * 5;
        
        ctx.fillStyle = "rgba(164,238,210,0.3)";
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Handle player movement
      if (state.keys.left) state.player.vx = -state.playerSpeed;
      else if (state.keys.right) state.player.vx = state.playerSpeed;
      else state.player.vx *= 0.85;

      if (state.keys.up) state.player.vy = -state.playerSpeed;
      else if (state.keys.down) state.player.vy = state.playerSpeed;
      else state.player.vy *= 0.85;

      state.player.x += state.player.vx * deltaTime;
      state.player.y += state.player.vy * deltaTime;

      // Boundary collision
      state.player.x = Math.max(state.playerSize / 2, Math.min(rect.width - state.playerSize / 2, state.player.x));
      state.player.y = Math.max(state.playerSize / 2, Math.min(rect.height - state.playerSize / 2, state.player.y));

      // Update direction
      if (state.player.vx < -0.5) state.player.direction = -1;
      else if (state.player.vx > 0.5) state.player.direction = 1;

      // Update animation frame
      if (Math.abs(state.player.vx) > 0.5 || Math.abs(state.player.vy) > 0.5) {
        state.player.animFrame = (state.player.animFrame + 0.2 * deltaTime) % 2;
      }

      // Emit bubble trail
      if (Math.abs(state.player.vx) > 1 || Math.abs(state.player.vy) > 1) {
        if (Math.random() < 0.3) {
          state.bubbleTrail.push({
            x: state.player.x,
            y: state.player.y,
            life: 1,
          });
        }
      }

      // Update and draw bubble trail
      state.bubbleTrail = state.bubbleTrail.filter(bubble => {
        bubble.life -= 0.02 * deltaTime;
        if (bubble.life <= 0) return false;
        
        ctx.fillStyle = `rgba(164,238,210,${bubble.life * 0.4})`;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        return true;
      });

      // Draw project nodes
      PROJECTS.forEach(project => {
        const isCollected = collectedProjects.includes(project.id);
        const dist = Math.hypot(state.player.x - project.x, state.player.y - project.y);
        
        // Initialize glow
        if (!state.nodeGlow[project.id]) state.nodeGlow[project.id] = 0;
        
        // Update glow
        if (dist < state.nodeRadius + state.playerSize / 2 && !isCollected) {
          state.nodeGlow[project.id] = Math.min(1, state.nodeGlow[project.id] + 0.05 * deltaTime);
          
          // Trigger collection
          if (state.nodeGlow[project.id] >= 1 && !showProjectCard) {
            setCurrentProject(project);
            setShowProjectCard(true);
            setIsPaused(true);
            
            // Create sparkles
            for (let i = 0; i < 6; i++) {
              const angle = (i / 6) * Math.PI * 2;
              state.sparkles.push({
                x: project.x,
                y: project.y,
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3,
                life: 1,
              });
            }
          }
        } else {
          state.nodeGlow[project.id] *= 0.95;
        }
        
        // Draw node
        const baseGlow = isCollected ? 30 : 15;
        const glowIntensity = baseGlow + state.nodeGlow[project.id] * 20;
        
        ctx.shadowBlur = glowIntensity;
        ctx.shadowColor = "#7EE3C7";
        
        // Outer glow
        ctx.fillStyle = isCollected ? "rgba(255,211,110,0.6)" : "rgba(232,250,244,0.8)";
        ctx.beginPath();
        ctx.arc(project.x, project.y, state.nodeRadius + 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner core
        ctx.fillStyle = isCollected ? "#FFD36E" : "#7EE3C7";
        ctx.beginPath();
        ctx.arc(project.x, project.y, state.nodeRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        
        // Draw emoji
        ctx.font = "32px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#072C3E";
        ctx.fillText(project.emoji, project.x, project.y);
        
        // Expansion effect when near
        if (state.nodeGlow[project.id] > 0.5) {
          const scale = 1 + state.nodeGlow[project.id] * 0.3;
          ctx.save();
          ctx.translate(project.x, project.y);
          ctx.scale(scale, scale);
          ctx.globalAlpha = 0.5;
          ctx.strokeStyle = "#7EE3C7";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, state.nodeRadius + 10, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      });

      // Update and draw sparkles
      state.sparkles = state.sparkles.filter(sparkle => {
        sparkle.x += sparkle.vx * deltaTime;
        sparkle.y += sparkle.vy * deltaTime;
        sparkle.life -= 0.03 * deltaTime;
        
        if (sparkle.life <= 0) return false;
        
        ctx.fillStyle = `rgba(231,253,251,${sparkle.life})`;
        ctx.beginPath();
        ctx.arc(sparkle.x, sparkle.y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        return true;
      });

      // Draw Plankton
      ctx.save();
      ctx.translate(state.player.x, state.player.y);
      
      // Flip horizontally if moving left
      if (state.player.direction < 0) {
        ctx.scale(-1, 1);
      }
      
      // Bobbing animation
      const bobOffset = Math.sin(now / 300) * 3;
      ctx.translate(0, bobOffset);
      
      // Movement tilt
      if (Math.abs(state.player.vx) > 1 || Math.abs(state.player.vy) > 1) {
        const tilt = Math.sin(state.player.animFrame * Math.PI) * 0.07;
        ctx.rotate(tilt);
      }
      
      // Scale pulse
      const scale = 1 + Math.sin(now / 400) * 0.05;
      ctx.scale(scale, scale);
      
      if (planktonImg.complete) {
        ctx.drawImage(
          planktonImg,
          -state.playerSize / 2,
          -state.playerSize / 2,
          state.playerSize,
          state.playerSize
        );
      } else {
        // Fallback
        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(-state.playerSize / 2, -state.playerSize / 2, state.playerSize, state.playerSize);
      }
      
      ctx.restore();

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    // Input handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = gameStateRef.current;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") state.keys.left = true;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") state.keys.right = true;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") state.keys.up = true;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") state.keys.down = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const state = gameStateRef.current;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") state.keys.left = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") state.keys.right = false;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") state.keys.up = false;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") state.keys.down = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isPaused, showProjectCard, collectedProjects]);

  const handleNextProject = () => {
    if (!currentProject) return;
    
    setCollectedProjects([...collectedProjects, currentProject.id]);
    setShowProjectCard(false);
    setCurrentProject(null);
    setIsPaused(false);
    
    // Reset node glow
    gameStateRef.current.nodeGlow[currentProject.id] = 0;
    
    // Check completion
    if (collectedProjects.length + 1 >= PROJECTS.length) {
      setTimeout(() => {
        setShowTransition(true);
        
        const steps = [
          "Compiling Project Data...",
          "Verifying Tech Stacks...",
          "Generating Portfolio Report..."
        ];
        
        let currentStep = 0;
        const interval = setInterval(() => {
          if (currentStep < steps.length) {
            setTransitionStep(currentStep);
            currentStep++;
          } else {
            clearInterval(interval);
            setTimeout(() => {
              setShowTransition(false);
              setShowComplete(true);
            }, 800);
          }
        }, 1200);
      }, 500);
    }
  };

  const transitionMessages = [
    "Compiling Project Data...",
    "Verifying Tech Stacks...",
    "Generating Portfolio Report..."
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ background: 'rgba(0, 0, 0, 0.6)' }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.8, y: 20, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          opacity: { duration: 0.2 }
        }}
        className="w-[96vw] max-w-[500px] sm:w-[90vw] sm:max-w-4xl flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden"
        style={{
          height: '85vh',
          maxHeight: '85vh',
          background: 'transparent',
          border: `3px solid #9ED8E080`,
          boxShadow: `0 0 30px #9ED8E040, 0 8px 32px rgba(0,0,0,0.2)`,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-2 py-2 sm:px-4 sm:py-3 border-b"
          style={{
            borderColor: `rgba(255,255,255,0.2)`,
            background: 'linear-gradient(135deg, #CFF8EE 0%, #A4E5D9 100%)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Button variant="ghost" size="sm" onClick={onBack} className="text-xs sm:text-sm">
            ← Back
          </Button>
          <div className="flex items-center gap-1 sm:gap-3">
            <span
              style={{
                fontFamily: "'Orbitron', sans-serif",
                color: "#072C3E",
                fontSize: 'clamp(0.75rem, 2.5vw, 1.1rem)',
              }}
            >
              Badges Collected ⭐ {collectedProjects.length} / 5
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsPaused(!isPaused)} className="text-xs sm:text-sm">
            {isPaused ? "Resume" : "Pause"}
          </Button>
        </div>

        {/* Game Canvas */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ display: "block" }}
          />
          
          {/* Controls hint */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-xs"
            style={{
              background: 'rgba(255,255,255,0.9)',
              color: '#072C3E',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            Use Arrow Keys or WASD to move Plankton
          </div>
        </div>

        {/* Project Detail Card */}
        <AnimatePresence>
          {showProjectCard && currentProject && (
            <motion.div
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="w-full max-w-[92vw] sm:max-w-2xl mx-auto relative"
              >
                {/* Floating bubbles behind popup */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={`popup-bubble-${i}`}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      width: `${15 + Math.random() * 25}px`,
                      height: `${15 + Math.random() * 25}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      background: `radial-gradient(circle at 35% 25%, rgba(255,255,255,0.6), rgba(135,206,250,0.4))`,
                      border: '1px solid rgba(255,255,255,0.3)',
                      zIndex: -1,
                    }}
                    animate={{
                      y: [0, -30 - Math.random() * 50],
                      opacity: [0.3, 0.6, 0],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}

                {/* Glowing jellyfish behind popup */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={`popup-jellyfish-${i}`}
                    className="absolute pointer-events-none"
                    style={{
                      width: '40px',
                      height: '40px',
                      left: `${20 + i * 30}%`,
                      top: `${10 + Math.random() * 80}%`,
                      zIndex: -1,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      x: [0, 10, 0],
                      opacity: [0.4, 0.7, 0.4],
                    }}
                    transition={{
                      duration: 4 + i,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: 'radial-gradient(circle, rgba(126,227,199,0.6), rgba(112,227,196,0.3))',
                        borderRadius: '50%',
                        boxShadow: '0 0 20px rgba(126,227,199,0.8)',
                      }}
                    />
                  </motion.div>
                ))}

                {/* "Tech Badge Acquired!" floating text */}
                <motion.div
                  className="absolute -top-8 left-1/2 -translate-x-1/2 text-lg font-bold"
                  style={{
                    color: '#E7FDFB',
                    fontFamily: "'Orbitron', sans-serif",
                    textShadow: '0 0 10px #7EE3C7',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [20, -10, -10, -30] }}
                  transition={{ duration: 2, ease: "easeOut" }}
                >
                  Tech Badge Acquired!
                </motion.div>

                {/* XP Float */}
                <motion.div
                  className="absolute -top-14 left-1/2 -translate-x-1/2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold"
                  style={{
                    background: '#B8F1D2',
                    color: '#025B47',
                    fontFamily: "'Nunito', sans-serif",
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [30, 0, 0, -20] }}
                  transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
                >
                  +40 XP
                </motion.div>

                <Card
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '2px solid #7EE3C7',
                    borderRadius: '16px',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 0 30px rgba(126,227,199,0.5), 0 4px 16px rgba(0, 0, 0, 0.2)',
                    padding: 'clamp(1.25rem, 3.5vw, 2rem)',
                  }}
                >
                  <CardHeader className="p-0 mb-3 sm:mb-4 text-center">
                    <div className="text-4xl mb-2">{currentProject.emoji}</div>
                    <CardTitle
                      style={{
                        fontFamily: "'Orbitron', sans-serif",
                        color: '#072C3E',
                        fontWeight: 700,
                        fontSize: 'clamp(1rem, 3.5vw, 1.75rem)',
                      }}
                    >
                      {currentProject.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4 p-0">
                    <div>
                      <h4 
                        className="font-bold mb-2" 
                        style={{ 
                          fontFamily: "'Nunito', sans-serif",
                          color: '#072C3E',
                          fontSize: 'clamp(0.85rem, 2.3vw, 1rem)',
                        }}
                      >
                        Tech Stack:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentProject.tech.map((tech, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full text-xs sm:text-sm"
                            style={{
                              background: 'rgba(112,227,196,0.3)',
                              color: '#C8FAEA',
                              border: '1px solid #7EE3C7',
                              fontFamily: "'Nunito', sans-serif",
                              fontWeight: 600,
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 
                        className="font-bold mb-2" 
                        style={{ 
                          fontFamily: "'Nunito', sans-serif",
                          color: '#072C3E',
                          fontSize: 'clamp(0.85rem, 2.3vw, 1rem)',
                        }}
                      >
                        Challenge:
                      </h4>
                      <p style={{ 
                        color: '#C8FAEA',
                        fontSize: 'clamp(0.8rem, 1.9vw, 0.95rem)',
                      }}>
                        {currentProject.challenge}
                      </p>
                    </div>
                    <div>
                      <h4 
                        className="font-bold mb-2" 
                        style={{ 
                          fontFamily: "'Nunito', sans-serif",
                          color: '#072C3E',
                          fontSize: 'clamp(0.85rem, 2.3vw, 1rem)',
                        }}
                      >
                        Impact:
                      </h4>
                      <p style={{ 
                        color: '#C8FAEA',
                        fontSize: 'clamp(0.8rem, 1.9vw, 0.95rem)',
                      }}>
                        {currentProject.impact}
                      </p>
                    </div>
                    <Button
                      size="lg"
                      onClick={handleNextProject}
                      className="w-full mt-4 relative overflow-hidden group"
                      style={{
                        background: 'linear-gradient(135deg, #70E3C4, #47C7B0)',
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 600,
                        color: '#072C3E',
                        borderRadius: '9999px',
                        padding: 'clamp(0.65rem, 2vw, 0.8rem)',
                        fontSize: 'clamp(0.85rem, 2.3vw, 1.125rem)',
                        minHeight: '44px',
                        border: '2px solid #7EE3C7',
                        boxShadow: '0 0 15px rgba(126,227,199,0.4)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 25px rgba(126,227,199,0.8)';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(126,227,199,0.4)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      {collectedProjects.length + 1 < PROJECTS.length ? "Next Project →" : "Complete Assembly →"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause Menu */}
        <AnimatePresence>
          {isPaused && !showProjectCard && (
            <motion.div
              className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="max-w-md mx-4">
                <CardHeader>
                  <CardTitle className="text-center" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    Assembly Paused
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p style={{ fontFamily: "'Nunito', sans-serif" }}>Resume when ready.</p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={() => setIsPaused(false)}>Resume</Button>
                    <Button variant="outline" onClick={onBack}>Exit to Map</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transition Sequence */}
        <AnimatePresence>
          {showTransition && (
            <motion.div
              className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/70 backdrop-blur-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div className="text-center space-y-6">
                <motion.div
                  className="text-3xl md:text-4xl font-bold mb-8"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    color: '#FFD36E',
                    textShadow: '0 0 20px #FFD36E80',
                  }}
                >
                  🎉 ASSEMBLY COMPLETE
                </motion.div>
                <div className="space-y-3">
                  {transitionMessages.slice(0, transitionStep + 1).map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.3 }}
                      className="text-lg"
                      style={{
                        fontFamily: "'Nunito', sans-serif",
                        color: '#fff',
                      }}
                    >
                      {msg}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Victory Card */}
        <AnimatePresence>
          {showComplete && (
            <motion.div
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="w-full max-w-2xl my-4"
              >
                <Card
                  style={{
                    background: `linear-gradient(135deg, ${BYTE_BUBBLES_THEME.bubble}98 0%, ${BYTE_BUBBLES_THEME.seafoam}95 100%)`,
                    border: `3px solid ${BYTE_BUBBLES_THEME.accent}`,
                    boxShadow: `0 0 40px ${BYTE_BUBBLES_THEME.accent}`,
                  }}
                >
                  <CardHeader className="text-center border-b pb-3">
                    <CardTitle
                      className="text-xl md:text-2xl"
                      style={{
                        fontFamily: "'Orbitron', sans-serif",
                        color: BYTE_BUBBLES_THEME.text,
                      }}
                    >
                      PROJECT FILE: VERIFIED ✅
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4 pb-4">
                    <div>
                      <h3 className="text-base font-bold mb-2" style={{ fontFamily: "'Nunito', sans-serif", color: BYTE_BUBBLES_THEME.text }}>
                        Recovered Project Nodes:
                      </h3>
                      <div className="space-y-1 text-xs" style={{ color: BYTE_BUBBLES_THEME.textSecondary }}>
                        {PROJECTS.map((project) => (
                          <p key={project.id}>
                            {project.emoji} <strong>{project.name}</strong> — {project.tech.join(" | ")}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <h3 className="text-base font-bold mb-2" style={{ fontFamily: "'Nunito', sans-serif", color: BYTE_BUBBLES_THEME.text }}>
                        Impact Highlights:
                      </h3>
                      <div className="space-y-1 text-xs" style={{ color: BYTE_BUBBLES_THEME.textSecondary }}>
                        <p>• 5 project modules reactivated from system archives</p>
                        <p>• Restored full cross-domain functionality: mobile, web, data, and visualization</p>
                        <p>• Demonstrated blend of creativity + logic powering every build</p>
                      </div>
                    </div>

                    <div className="border-t pt-3 space-y-1">
                      <p className="text-base font-bold" style={{ color: BYTE_BUBBLES_THEME.star }}>
                        XP Earned: +250
                      </p>
                      <p className="text-sm" style={{ color: BYTE_BUBBLES_THEME.textSecondary }}>
                        Badge Unlocked: 💻 "Full-Stack Innovator"
                      </p>
                      <p className="text-sm font-bold" style={{ color: BYTE_BUBBLES_THEME.text }}>
                        🏆 Achievement: "System Restored — All Projects Online!"
                      </p>
                    </div>

                    <Button
                      size="lg"
                      onClick={() => onComplete(facts)}
                      className="w-full text-base mt-3"
                      style={{
                        background: `linear-gradient(135deg, ${BYTE_BUBBLES_THEME.star} 0%, #FFC94A 100%)`,
                        fontFamily: "'Anton', sans-serif",
                      }}
                    >
                      Continue → Next Mission
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}