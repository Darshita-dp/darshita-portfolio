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

interface ProjectData {
  id: string;
  name: string;
  techStack: string;
  challenge: string;
  impact: string;
  emoji: string;
}

interface ComponentTile {
  id: string;
  projectId: string;
  type: "tech" | "challenge" | "impact";
  content: string;
}

const PROJECTS: ProjectData[] = [
  {
    id: "smartplanner",
    name: "SmartPlanner",
    emoji: "📱",
    techStack: "SwiftUI | Core Data | MVVM",
    challenge: "iOS task management with offline sync",
    impact: "Streamlined daily planning for users"
  },
  {
    id: "ai-analytics",
    name: "AI-Driven Predictive Analytics",
    emoji: "🤖",
    techStack: "Python | Machine Learning | Data Modeling",
    challenge: "87% prediction accuracy for banking",
    impact: "Enhanced decision-making insights"
  },
  {
    id: "it-optimization",
    name: "IT Services Optimization",
    emoji: "⚙️",
    techStack: "Power BI | SQL | Process Analysis",
    challenge: "99.9% uptime target achievement",
    impact: "30% reduction in ticket resolution time"
  },
  {
    id: "retail-analytics",
    name: "Retail Analytics",
    emoji: "🕯️",
    techStack: "Tableau | Excel | Forecasting",
    challenge: "Local candle business data insights",
    impact: "20% forecast accuracy increase"
  },
  {
    id: "film-fusion",
    name: "Film-Fusion",
    emoji: "🎬",
    techStack: "React | API Integration | UI/UX",
    challenge: "Movie discovery web platform",
    impact: "Seamless user experience for film lovers"
  }
];

const ENCOURAGEMENTS = [
  "Assembly in progress...",
  "Circuits aligning nicely!",
  "Project pathways connecting...",
];

export function ProjectAssembly({ levelId, facts, onComplete, onBack }: ProjectAssemblyProps) {
  const [completedProjects, setCompletedProjects] = useState<Set<string>>(new Set());
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedTiles, setSelectedTiles] = useState<Record<string, ComponentTile | null>>({});
  const [showReveal, setShowReveal] = useState(false);
  const [revealProject, setRevealProject] = useState<ProjectData | null>(null);
  const [xp, setXp] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionStep, setTransitionStep] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [encouragementText, setEncouragementText] = useState("");
  const [availableTiles, setAvailableTiles] = useState<ComponentTile[]>([]);

  // Initialize tiles
  useEffect(() => {
    const tiles: ComponentTile[] = [];
    PROJECTS.forEach(project => {
      tiles.push(
        { id: `${project.id}-tech`, projectId: project.id, type: "tech", content: project.techStack },
        { id: `${project.id}-challenge`, projectId: project.id, type: "challenge", content: project.challenge },
        { id: `${project.id}-impact`, projectId: project.id, type: "impact", content: project.impact }
      );
    });
    setAvailableTiles(tiles.sort(() => Math.random() - 0.5));
  }, []);

  // Show encouragement
  useEffect(() => {
    if (completedProjects.size === 2 || completedProjects.size === 3) {
      const randomEncouragement = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
      setEncouragementText(randomEncouragement);
      setShowEncouragement(true);
      setTimeout(() => setShowEncouragement(false), 2000);
    }
  }, [completedProjects.size]);

  const handleProjectSelect = (projectId: string) => {
    if (completedProjects.has(projectId)) return;
    setSelectedProject(projectId);
  };

  const handleTileSelect = (tile: ComponentTile) => {
    if (!selectedProject || completedProjects.has(selectedProject)) return;

    const newSelectedTiles = { ...selectedTiles };
    newSelectedTiles[tile.type] = tile;
    setSelectedTiles(newSelectedTiles);

    // Check if all three components are selected
    if (newSelectedTiles.tech && newSelectedTiles.challenge && newSelectedTiles.impact) {
      const allCorrect = 
        newSelectedTiles.tech.projectId === selectedProject &&
        newSelectedTiles.challenge.projectId === selectedProject &&
        newSelectedTiles.impact.projectId === selectedProject;

      if (allCorrect) {
        setFeedbackMessage("⚡ Project Assembled! +40 XP");
        setXp(prev => prev + 40);
        
        setTimeout(() => {
          setFeedbackMessage(null);
          const project = PROJECTS.find(p => p.id === selectedProject);
          if (project) {
            setRevealProject(project);
            setShowReveal(true);
            setCompletedProjects(prev => new Set([...prev, selectedProject]));
            // Remove used tiles
            setAvailableTiles(prev => prev.filter(t => t.projectId !== selectedProject));
          }
        }, 1500);
      } else {
        setFeedbackMessage("❌ Mismatch Detected — Try Again!");
        setTimeout(() => {
          setFeedbackMessage(null);
          setSelectedTiles({});
        }, 1500);
      }
    }
  };

  const handleNextProject = () => {
    setShowReveal(false);
    setRevealProject(null);
    setSelectedProject(null);
    setSelectedTiles({});

    if (completedProjects.size >= 5) {
      // Start completion sequence
      setShowTransition(true);
      const steps = [
        "Uploading Project Files…",
        "Verifying build outputs... ✅",
        "Compiling portfolio data... 📦",
        "Generating Achievement Report…"
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
    "Uploading Project Files…",
    "Verifying build outputs... ✅",
    "Compiling portfolio data... 📦",
    "Generating Achievement Report…"
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
              <span className="hidden sm:inline">Project Assembly — </span>Built ⭐ {completedProjects.size} / 5
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsPaused(!isPaused)} className="text-xs sm:text-sm">
            {isPaused ? "Resume" : "Pause"}
          </Button>
        </div>

        {/* Game Area */}
        <div 
          className="flex-1 relative p-3 sm:p-4 md:p-6 overflow-y-auto"
          style={{
            backgroundImage: 'url(https://harmless-tapir-303.convex.cloud/api/storage/d2d82577-719f-4e83-933c-9a4e6c68f892)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            boxShadow: `inset 0 0 40px ${BYTE_BUBBLES_THEME.accent}60, inset 0 0 80px ${BYTE_BUBBLES_THEME.seafoam}40`,
          }}
        >
          {/* Floating bubbles background */}
          {Array.from({ length: 15 }).map((_, i) => (
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

          {!showReveal && (
            <div className="space-y-4 max-w-4xl mx-auto">
              {/* Project Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                {PROJECTS.map(project => (
                  <motion.button
                    key={project.id}
                    onClick={() => handleProjectSelect(project.id)}
                    disabled={completedProjects.has(project.id)}
                    className="p-3 rounded-lg text-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: selectedProject === project.id
                        ? 'linear-gradient(135deg, #A4E5D9 0%, #7ED4C4 100%)'
                        : completedProjects.has(project.id)
                        ? 'linear-gradient(135deg, #B8F1D2 0%, #A0F1CE 100%)'
                        : 'linear-gradient(135deg, #CFF8EE 0%, #A4E5D9 100%)',
                      border: selectedProject === project.id
                        ? '2px solid #7ED4C4'
                        : '2px solid rgba(164,229,217,0.5)',
                      backdropFilter: 'blur(4px)',
                      boxShadow: selectedProject === project.id
                        ? '0 0 20px #7ED4C480'
                        : '0 2px 12px rgba(0,0,0,0.1)',
                    }}
                    whileHover={!completedProjects.has(project.id) ? { scale: 1.05 } : {}}
                    whileTap={!completedProjects.has(project.id) ? { scale: 0.95 } : {}}
                  >
                    <div className="text-3xl mb-1">{project.emoji}</div>
                    <div
                      className="text-xs font-semibold"
                      style={{
                        fontFamily: "'Nunito', sans-serif",
                        color: '#093845',
                      }}
                    >
                      {project.name}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Component Slots */}
              {selectedProject && !completedProjects.has(selectedProject) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 p-3 rounded-lg"
                  style={{
                    background: 'rgba(207,248,238,0.6)',
                    border: '2px solid rgba(164,229,217,0.4)',
                  }}
                >
                  {(['tech', 'challenge', 'impact'] as const).map(type => (
                    <div
                      key={type}
                      className="p-3 rounded-lg min-h-[60px] flex items-center justify-center text-center"
                      style={{
                        background: selectedTiles[type]
                          ? 'rgba(184,241,210,0.8)'
                          : 'rgba(255,255,255,0.5)',
                        border: '2px dashed rgba(164,229,217,0.6)',
                      }}
                    >
                      {selectedTiles[type] ? (
                        <span
                          className="text-xs font-medium"
                          style={{
                            fontFamily: "'Nunito', sans-serif",
                            color: '#025B47',
                          }}
                        >
                          {selectedTiles[type]?.content}
                        </span>
                      ) : (
                        <span
                          className="text-xs opacity-60"
                          style={{
                            fontFamily: "'Nunito', sans-serif",
                            color: '#093845',
                          }}
                        >
                          {type === 'tech' ? '🔧 Tech Stack' : type === 'challenge' ? '🎯 Challenge' : '💡 Impact'}
                        </span>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Available Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {availableTiles.map(tile => (
                  <motion.button
                    key={tile.id}
                    onClick={() => handleTileSelect(tile)}
                    disabled={!selectedProject || completedProjects.has(selectedProject)}
                    className="p-2 sm:p-3 rounded-lg text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'linear-gradient(135deg, #E6F2FF 0%, #D6EEFF 100%)',
                      border: '2px solid rgba(164,229,217,0.5)',
                      backdropFilter: 'blur(4px)',
                      fontFamily: "'Nunito', sans-serif",
                      fontSize: 'clamp(0.7rem, 1.6vw, 0.85rem)',
                      color: '#093845',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                    whileHover={selectedProject && !completedProjects.has(selectedProject) ? { 
                      scale: 1.02,
                      boxShadow: '0 0 15px #7ED4C480'
                    } : {}}
                    whileTap={selectedProject && !completedProjects.has(selectedProject) ? { scale: 0.98 } : {}}
                  >
                    {tile.content}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Reveal Card */}
          <AnimatePresence>
            {showReveal && revealProject && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-full max-w-[92vw] sm:max-w-2xl mx-auto relative"
              >
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #C5F5E8 0%, #AEE6D4 100%)',
                    filter: 'blur(20px)',
                    opacity: 0.6,
                    zIndex: -1,
                  }}
                />

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
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: '16px',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    padding: 'clamp(1.25rem, 3.5vw, 2rem)',
                  }}
                >
                  <CardHeader className="p-0 mb-3 sm:mb-4">
                    <CardTitle
                      style={{
                        fontFamily: "'Orbitron', sans-serif",
                        color: '#02394A',
                        fontWeight: 700,
                        fontSize: 'clamp(0.95rem, 3.2vw, 1.5rem)',
                        lineHeight: '1.3',
                      }}
                    >
                      {revealProject.emoji} {revealProject.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2.5 sm:space-y-4 p-0">
                    <div>
                      <h4 
                        className="font-bold mb-1.5 sm:mb-2" 
                        style={{ 
                          fontFamily: "'Nunito', sans-serif",
                          color: '#007E7E',
                          fontSize: 'clamp(0.8rem, 2.3vw, 1rem)',
                        }}
                      >
                        Tech Stack:
                      </h4>
                      <p style={{ 
                        color: '#0E3A42',
                        fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
                      }}>
                        {revealProject.techStack}
                      </p>
                    </div>
                    <div>
                      <h4 
                        className="font-bold mb-1.5 sm:mb-2" 
                        style={{ 
                          fontFamily: "'Nunito', sans-serif",
                          color: '#007E7E',
                          fontSize: 'clamp(0.8rem, 2.3vw, 1rem)',
                        }}
                      >
                        Challenge:
                      </h4>
                      <p style={{ 
                        color: '#0E3A42',
                        fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
                      }}>
                        {revealProject.challenge}
                      </p>
                    </div>
                    <div>
                      <h4 
                        className="font-bold mb-1.5 sm:mb-2" 
                        style={{ 
                          fontFamily: "'Nunito', sans-serif",
                          color: '#007E7E',
                          fontSize: 'clamp(0.8rem, 2.3vw, 1rem)',
                        }}
                      >
                        Impact:
                      </h4>
                      <p style={{ 
                        color: '#0E3A42',
                        fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
                      }}>
                        {revealProject.impact}
                      </p>
                    </div>
                    <motion.div
                      animate={{
                        y: [0, -2, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      <Button
                        size="lg"
                        onClick={handleNextProject}
                        className="w-full mt-3 sm:mt-4"
                        style={{
                          background: 'linear-gradient(135deg, #A2E2D1, #6FDCC2)',
                          fontFamily: "'Nunito', sans-serif",
                          fontWeight: 600,
                          color: '#053E45',
                          border: 'none',
                          borderRadius: '9999px',
                          padding: 'clamp(0.65rem, 2vw, 0.8rem) clamp(1.5rem, 4vw, 2rem)',
                          boxShadow: '0 0 10px rgba(111, 220, 194, 0.6)',
                          transition: 'all 0.3s ease',
                          fontSize: 'clamp(0.85rem, 2.3vw, 1.125rem)',
                          minHeight: '44px',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #7FE9D0, #53C8AE)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #A2E2D1, #6FDCC2)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {completedProjects.size < 4 ? "Next Project →" : "Complete Assembly →"}
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feedback Message */}
          <AnimatePresence>
            {feedbackMessage && (
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div
                  className="px-6 py-4 rounded-2xl text-center"
                  style={{
                    background: feedbackMessage.includes('Assembled') ? '#B2F2BB' : '#FAD4D4',
                    border: `2px solid ${feedbackMessage.includes('Assembled') ? '#51cf66' : '#ff6b6b'}`,
                    boxShadow: `0 0 30px ${feedbackMessage.includes('Assembled') ? '#51cf6680' : '#ff6b6b80'}`,
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: BYTE_BUBBLES_THEME.text,
                  }}
                >
                  {feedbackMessage}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Encouragement Message */}
          <AnimatePresence>
            {showEncouragement && (
              <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
              >
                <div
                  className="px-4 py-2 rounded-full text-sm"
                  style={{
                    background: '#9ED8E090',
                    fontFamily: "'Nunito', sans-serif",
                    color: BYTE_BUBBLES_THEME.text,
                  }}
                >
                  {encouragementText}
                </div>
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
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
              >
                <Card className="max-w-md mx-4">
                  <CardHeader>
                    <CardTitle
                      className="text-center text-xl"
                      style={{ fontFamily: "'Orbitron', sans-serif" }}
                    >
                      Assembly Paused
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p style={{ fontFamily: "'Nunito', sans-serif" }}>
                      Resume when ready.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button onClick={() => setIsPaused(false)}>Resume</Button>
                      <Button variant="outline" onClick={onBack}>Exit to Map</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
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
              <motion.div
                className="text-center space-y-6"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                <motion.div
                  className="text-3xl md:text-4xl font-bold mb-8"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    color: '#FFD36E',
                    textShadow: '0 0 20px #FFD36E80',
                  }}
                >
                  🎉 ALL PROJECTS ASSEMBLED
                </motion.div>
                <div className="space-y-3 mt-8">
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
                exit={{ scale: 0.8, y: 20 }}
                className="w-full max-w-3xl my-8"
              >
                <Card
                  className="overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${BYTE_BUBBLES_THEME.bubble}98 0%, ${BYTE_BUBBLES_THEME.seafoam}95 100%)`,
                    border: `3px solid ${BYTE_BUBBLES_THEME.accent}`,
                    boxShadow: `0 0 40px ${BYTE_BUBBLES_THEME.accent}`,
                  }}
                >
                  <CardHeader className="text-center border-b pb-4">
                    <CardTitle
                      className="text-2xl md:text-3xl"
                      style={{
                        fontFamily: "'Orbitron', sans-serif",
                        color: BYTE_BUBBLES_THEME.text,
                      }}
                    >
                      PROJECTS FILE: VERIFIED ✅
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6 max-h-[60vh] overflow-y-auto">
                    <div>
                      <h3
                        className="text-lg font-bold mb-2"
                        style={{ fontFamily: "'Nunito', sans-serif", color: BYTE_BUBBLES_THEME.text }}
                      >
                        Portfolio Highlights:
                      </h3>
                      <div className="space-y-2 text-sm">
                        {PROJECTS.map(project => (
                          <p key={project.id}>
                            {project.emoji} <strong>{project.name}</strong> — {project.impact}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3
                        className="text-lg font-bold mb-2"
                        style={{ fontFamily: "'Nunito', sans-serif", color: BYTE_BUBBLES_THEME.text }}
                      >
                        Technical Mastery:
                      </h3>
                      <p className="text-sm">
                        From iOS development to AI analytics, from data visualization to web platforms — 
                        a diverse toolkit solving real-world problems with measurable impact.
                      </p>
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <p className="text-lg font-bold" style={{ color: BYTE_BUBBLES_THEME.star }}>
                        XP Earned: +200
                      </p>
                      <p className="text-base">
                        New Badge: "Master Builder" 🏗️
                      </p>
                    </div>

                    <div className="text-center py-4">
                      <p
                        className="text-lg font-bold"
                        style={{
                          fontFamily: "'Orbitron', sans-serif",
                          color: BYTE_BUBBLES_THEME.text,
                        }}
                      >
                        🏆 Achievement Unlocked: "Portfolio Architect — All Projects Assembled!"
                      </p>
                    </div>

                    <Button
                      size="lg"
                      onClick={() => onComplete(facts)}
                      className="w-full text-lg"
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
