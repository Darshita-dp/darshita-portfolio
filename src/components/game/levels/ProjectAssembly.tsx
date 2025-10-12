import { useState, useEffect } from "react";
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
    x: 20,
    y: 50,
  },
  {
    id: 2,
    name: "AI-Driven Predictive Analytics",
    emoji: "🤖",
    tech: ["Python", "Machine Learning", "Data Analysis"],
    challenge: "Developed predictive models for business forecasting",
    impact: "Achieved 87% prediction accuracy for key metrics",
    x: 35,
    y: 30,
  },
  {
    id: 3,
    name: "IT Services Optimization",
    emoji: "⚙️",
    tech: ["SQL", "Power BI", "Process Analysis"],
    challenge: "Analyzed and optimized IT service workflows",
    impact: "Reduced ticket resolution time by 30%, targeted 99.9% uptime",
    x: 50,
    y: 60,
  },
  {
    id: 4,
    name: "Retail Analytics",
    emoji: "🕯️",
    tech: ["Excel", "Data Visualization", "Forecasting"],
    challenge: "Built analytics dashboard for local candle business",
    impact: "Increased forecast accuracy by 20%",
    x: 65,
    y: 35,
  },
  {
    id: 5,
    name: "Film-Fusion",
    emoji: "🎬",
    tech: ["React", "API Integration", "UI/UX"],
    challenge: "Created movie discovery web application",
    impact: "Seamless browsing experience with real-time data",
    x: 80,
    y: 55,
  },
];

export function ProjectAssembly({ levelId, facts, onComplete, onBack }: ProjectAssemblyProps) {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [collectedProjects, setCollectedProjects] = useState<number[]>([]);
  const [showProjectCard, setShowProjectCard] = useState(false);
  const [xp, setXp] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionStep, setTransitionStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentProject = PROJECTS[currentProjectIndex];

  const handleCollectProject = () => {
    setCollectedProjects([...collectedProjects, currentProject.id]);
    setXp(prev => prev + 40);
    setShowProjectCard(true);
  };

  const handleNextProject = () => {
    setShowProjectCard(false);
    
    if (currentProjectIndex < PROJECTS.length - 1) {
      setCurrentProjectIndex(prev => prev + 1);
    } else {
      // Start completion sequence
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
                color: BYTE_BUBBLES_THEME.text,
                fontSize: 'clamp(0.75rem, 2.5vw, 1.1rem)',
              }}
            >
              Projects ⭐ {collectedProjects.length} / 5
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsPaused(!isPaused)} className="text-xs sm:text-sm">
            {isPaused ? "Resume" : "Pause"}
          </Button>
        </div>

        {/* Game Area */}
        <div 
          className="flex-1 relative p-3 sm:p-4 md:p-6 overflow-hidden flex items-center justify-center"
          style={{
            backgroundImage: 'url(https://harmless-tapir-303.convex.cloud/api/storage/4c392381-5251-4ad6-bb02-802a765e325c)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            boxShadow: `inset 0 0 40px ${BYTE_BUBBLES_THEME.accent}60, inset 0 0 80px ${BYTE_BUBBLES_THEME.seafoam}40`,
          }}
        >
          {/* Floating bubbles background */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`bubble-${i}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: `${20 + Math.random() * 30}px`,
                height: `${20 + Math.random() * 30}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `radial-gradient(circle at 35% 25%, rgba(255,255,255,0.6), rgba(135,206,250,0.4))`,
                border: '1px solid rgba(255,255,255,0.3)',
              }}
              animate={{
                y: [0, -50 - Math.random() * 100],
                opacity: [0.3, 0.6, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}

          {/* Project Path Map */}
          {!showProjectCard && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full h-full"
            >
              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                {PROJECTS.slice(0, -1).map((project, i) => {
                  const nextProject = PROJECTS[i + 1];
                  return (
                    <motion.line
                      key={`line-${i}`}
                      x1={`${project.x}%`}
                      y1={`${project.y}%`}
                      x2={`${nextProject.x}%`}
                      y2={`${nextProject.y}%`}
                      stroke={collectedProjects.includes(project.id) ? BYTE_BUBBLES_THEME.star : BYTE_BUBBLES_THEME.accent}
                      strokeWidth="3"
                      strokeDasharray="8 4"
                      initial={{ pathLength: 0, opacity: 0.3 }}
                      animate={{ pathLength: 1, opacity: collectedProjects.includes(project.id) ? 0.8 : 0.3 }}
                      transition={{ duration: 1 }}
                    />
                  );
                })}
              </svg>

              {/* Project nodes */}
              {PROJECTS.map((project, index) => {
                const isCollected = collectedProjects.includes(project.id);
                const isCurrent = index === currentProjectIndex;
                const isLocked = index > currentProjectIndex;

                return (
                  <motion.div
                    key={project.id}
                    className="absolute"
                    style={{
                      left: `${project.x}%`,
                      top: `${project.y}%`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <motion.button
                      onClick={() => isCurrent && !isCollected && handleCollectProject()}
                      disabled={isLocked || isCollected}
                      className="relative"
                      whileHover={isCurrent && !isCollected ? { scale: 1.1 } : {}}
                      whileTap={isCurrent && !isCollected ? { scale: 0.95 } : {}}
                    >
                      <div
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl"
                        style={{
                          background: isCollected 
                            ? `linear-gradient(135deg, ${BYTE_BUBBLES_THEME.star} 0%, #FFC94A 100%)`
                            : isCurrent
                            ? `radial-gradient(circle at 35% 25%, rgba(255,255,255,0.9), rgba(135,206,250,0.7) 40%, rgba(70,130,180,0.8))`
                            : 'rgba(200,200,200,0.5)',
                          border: `3px solid ${isCollected ? BYTE_BUBBLES_THEME.star : isCurrent ? '#fff' : '#999'}`,
                          boxShadow: isCollected 
                            ? `0 0 20px ${BYTE_BUBBLES_THEME.star}80`
                            : isCurrent
                            ? '0 0 20px rgba(135,206,250,0.8)'
                            : 'none',
                          cursor: isCurrent && !isCollected ? 'pointer' : 'default',
                        }}
                      >
                        {isLocked ? '🔒' : project.emoji}
                      </div>
                      {isCurrent && !isCollected && (
                        <motion.div
                          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold"
                          style={{ color: BYTE_BUBBLES_THEME.text }}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          Click to explore!
                        </motion.div>
                      )}
                    </motion.button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Project Detail Card */}
          <AnimatePresence>
            {showProjectCard && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
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

                {/* XP Float */}
                <motion.div
                  className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold"
                  style={{
                    background: '#B8F1D2',
                    color: '#025B47',
                    fontFamily: "'Nunito', sans-serif",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [20, -10, -10, -30] }}
                  transition={{ duration: 2, ease: "easeOut" }}
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
                      {currentProjectIndex < PROJECTS.length - 1 ? "Next Project →" : "Complete Assembly →"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pause Menu */}
        <AnimatePresence>
          {isPaused && (
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
