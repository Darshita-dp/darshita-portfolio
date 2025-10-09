import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Volume2, VolumeX, Pause, Play as PlayIcon } from "lucide-react";

// Game data structure
const GAME_DATA = {
  theme: {
    palette: {
      bgStart: "#E6F2FF",
      bgEnd: "#BFD7EA",
      accent: "#A7E8E1",
      bubble: "#D6EEFF",
      star: "#FFD36E",
      success: "#CFF4E3",
      highlight: "#FFC7C7",
      textPrimary: "#243B53",
      textSecondary: "#5E6C84"
    }
  },
  map: {
    nodes: [
      { id: 1, label: "Hello, World", emoji: "👋", x: 10, y: 70, unlocked: true },
      { id: 2, label: "Scholar", emoji: "📘", x: 25, y: 50, unlocked: false },
      { id: 3, label: "Mentor", emoji: "👩‍🏫", x: 40, y: 65, unlocked: false },
      { id: 4, label: "Creator", emoji: "💻", x: 55, y: 45, unlocked: false },
      { id: 5, label: "Change-Maker", emoji: "🌍", x: 70, y: 60, unlocked: false },
      { id: 6, label: "Dreamer", emoji: "✨", x: 82, y: 40, unlocked: false },
      { id: 7, label: "The Future", emoji: "🚀", x: 92, y: 55, unlocked: false },
      { id: 8, label: "Under Construction", emoji: "🚧", x: 96, y: 30, type: "sign" }
    ]
  },
  levels: {
    1: {
      name: "Hello, World",
      emoji: "👋",
      whatYoullLearn: [
        "My educational background and achievements",
        "What drives my passion for tech",
        "How I blend creativity with problem-solving"
      ],
      stars: [
        "Hi, I'm Darshita 👩‍💻 — MS in Information Systems at ISU.",
        "Graduated with a 4.0 GPA — curiosity + hard work.",
        "I love blending creativity with tech to solve real problems."
      ]
    },
    2: {
      name: "Scholar",
      emoji: "📘",
      whatYoullLearn: [
        "Key courses and technical skills",
        "My approach to learning",
        "What matters most in teamwork"
      ],
      stars: [
        "Studied Web Dev, Systems Analysis, and Project Management.",
        "I enjoy data, design, and structured problem-solving.",
        "Teamwork + clarity matter to me more than fancy jargon."
      ]
    },
    3: {
      name: "Mentor",
      emoji: "👩‍🏫",
      whatYoullLearn: [
        "Teaching experience with 120+ students",
        "Communication and leadership skills",
        "How mentoring shaped my growth"
      ],
      stars: [
        "Mentored 120+ students as a Graduate Teaching Assistant.",
        "Explained complex topics in simple words and examples.",
        "Helping others learn made me a better communicator."
      ]
    },
    4: {
      name: "Creator",
      emoji: "💻",
      whatYoullLearn: [
        "SmartPlanner iOS app development",
        "Web projects and frontend work",
        "Real-world client experience"
      ],
      stars: [
        "Built SmartPlanner (iOS, SwiftUI, Core Data, MVVM).",
        "Created Poha Factory frontend using React components.",
        "Revamped a live client site during my Capstone project."
      ]
    },
    5: {
      name: "Change-Maker",
      emoji: "🌍",
      whatYoullLearn: [
        "NGO work with CIIWAS and ORANGES",
        "Building tools for social impact",
        "Tech that helps real people"
      ],
      stars: [
        "Worked with NGOs (CIIWAS, ORANGES) on web + data tools.",
        "Built small dashboards to track project impact.",
        "I care about tech that truly helps people."
      ]
    },
    6: {
      name: "Dreamer",
      emoji: "✨",
      whatYoullLearn: [
        "Design philosophy and aesthetics",
        "Making data human and approachable",
        "Creativity in technical work"
      ],
      stars: [
        "I love Studio Ghibli vibes, pastel UI, and cute details.",
        "Data to me is a story — I try to make it human.",
        "Creativity is my way to make tech feel warm."
      ]
    },
    7: {
      name: "The Future",
      emoji: "🚀",
      whatYoullLearn: [
        "Career goals and aspirations",
        "My unique approach to tech",
        "How we can connect"
      ],
      stars: [
        "Excited to grow as a System Analyst / Creative Tech builder.",
        "I like mixing data, design, and people-first thinking.",
        "You finished my story 🌸 — let's connect below!"
      ]
    }
  }
};

type GameView = "map" | "level" | "preview";
type Star = { x: number; y: number; r: number; collected: boolean };
type Platform = { x: number; y: number; w: number; h: number };

export default function Play() {
  const navigate = useNavigate();
  const [view, setView] = useState<GameView>("map");
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [progress, setProgress] = useState<Record<number, number>>({});
  const [soundOn, setSoundOn] = useState(true);
  const [showConstructionModal, setShowConstructionModal] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bubbleGameProgress");
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load progress", e);
      }
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (levelId: number, starsCollected: number) => {
    const newProgress = { ...progress, [levelId]: starsCollected };
    setProgress(newProgress);
    localStorage.setItem("bubbleGameProgress", JSON.stringify(newProgress));
  };

  const completedLevels = Object.keys(progress).filter(
    (k) => progress[Number(k)] === GAME_DATA.levels[Number(k) as keyof typeof GAME_DATA.levels]?.stars.length
  ).length;

  const isLevelUnlocked = (levelId: number) => {
    if (levelId === 1) return true;
    return progress[levelId - 1] === GAME_DATA.levels[(levelId - 1) as keyof typeof GAME_DATA.levels]?.stars.length;
  };

  const handleBubbleClick = (node: typeof GAME_DATA.map.nodes[0]) => {
    if (node.type === "sign") {
      setShowConstructionModal(true);
      return;
    }
    if (!isLevelUnlocked(node.id)) return;
    setSelectedLevel(node.id);
    setView("preview");
  };

  const handlePlayLevel = () => {
    setView("level");
  };

  const handleLevelComplete = (levelId: number, starsCollected: number) => {
    saveProgress(levelId, starsCollected);
    setView("map");
    setSelectedLevel(null);
  };

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(to bottom, ${GAME_DATA.theme.palette.bgStart}, ${GAME_DATA.theme.palette.bgEnd})` }}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="flex items-center gap-2">
            ← Back to Modes
          </Button>
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="p-2 rounded-full hover:bg-accent transition-colors"
            aria-label={soundOn ? "Mute sound" : "Unmute sound"}
          >
            {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {view === "map" && (
          <WorldMap
            nodes={GAME_DATA.map.nodes}
            progress={progress}
            completedLevels={completedLevels}
            isLevelUnlocked={isLevelUnlocked}
            onBubbleClick={handleBubbleClick}
          />
        )}

        {view === "preview" && selectedLevel && (
          <LevelPreview
            level={GAME_DATA.levels[selectedLevel as keyof typeof GAME_DATA.levels]}
            onPlay={handlePlayLevel}
            onBack={() => setView("map")}
          />
        )}

        {view === "level" && selectedLevel && (
          <LevelGameplay
            levelId={selectedLevel}
            levelData={GAME_DATA.levels[selectedLevel as keyof typeof GAME_DATA.levels]}
            currentProgress={progress[selectedLevel] || 0}
            onComplete={handleLevelComplete}
            onBack={() => setView("map")}
          />
        )}
      </div>

      {/* Under Construction Modal */}
      <AnimatePresence>
        {showConstructionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowConstructionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Under Construction
                </h3>
                <p className="text-gray-600 mb-6">
                  A new world is brewing. Come back soon!
                </p>
                <Button onClick={() => setShowConstructionModal(false)} style={{ backgroundColor: GAME_DATA.theme.palette.accent }}>
                  Got it!
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// World Map Component
function WorldMap({
  nodes,
  progress,
  completedLevels,
  isLevelUnlocked,
  onBubbleClick
}: {
  nodes: typeof GAME_DATA.map.nodes;
  progress: Record<number, number>;
  completedLevels: number;
  isLevelUnlocked: (id: number) => boolean;
  onBubbleClick: (node: typeof GAME_DATA.map.nodes[0]) => void;
}) {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-3" style={{ fontFamily: "Poppins, sans-serif", color: GAME_DATA.theme.palette.textPrimary }}>
          Bubbles of My Journey
        </h1>
        <p className="text-lg" style={{ color: GAME_DATA.theme.palette.textSecondary, fontFamily: "Quicksand, sans-serif" }}>
          Tap a bubble to enter a level
        </p>
      </motion.div>

      {/* Progress Bar */}
      <div className="mb-12 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: GAME_DATA.theme.palette.textSecondary }}>
            World Progress
          </span>
          <span className="text-sm font-bold" style={{ color: GAME_DATA.theme.palette.textPrimary }}>
            {completedLevels} / 7 completed
          </span>
        </div>
        <div className="h-3 bg-white/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedLevels / 7) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: GAME_DATA.theme.palette.success }}
          />
        </div>
        <div className="flex gap-1 mt-3 justify-center">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
              style={{
                backgroundColor: progress[i] === GAME_DATA.levels[i as keyof typeof GAME_DATA.levels]?.stars.length
                  ? GAME_DATA.theme.palette.star
                  : "rgba(255,255,255,0.3)"
              }}
            >
              {progress[i] === GAME_DATA.levels[i as keyof typeof GAME_DATA.levels]?.stars.length ? "⭐" : ""}
            </div>
          ))}
        </div>
      </div>

      {/* Bubble Map */}
      <div className="relative h-[600px] md:h-[700px]">
        {nodes.map((node, idx) => {
          const unlocked = node.type === "sign" || isLevelUnlocked(node.id);
          const completed = progress[node.id] === GAME_DATA.levels[node.id as keyof typeof GAME_DATA.levels]?.stars.length;

          return (
            <motion.button
              key={node.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, type: "spring", stiffness: 200 }}
              onClick={() => unlocked && onBubbleClick(node)}
              disabled={!unlocked && node.type !== "sign"}
              className="absolute group"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: "translate(-50%, -50%)"
              }}
            >
              <motion.div
                animate={{
                  y: [0, -8, 0]
                }}
                transition={{
                  duration: 3 + idx * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                {/* Bubble */}
                <div
                  className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center text-4xl md:text-5xl transition-all duration-300 ${
                    unlocked ? "cursor-pointer group-hover:scale-110" : "opacity-50 cursor-not-allowed"
                  }`}
                  style={{
                    backgroundColor: node.type === "sign" ? "#D4A574" : GAME_DATA.theme.palette.bubble,
                    boxShadow: unlocked
                      ? `0 8px 24px rgba(0,0,0,0.12), inset 0 -4px 12px rgba(255,255,255,0.4)`
                      : "0 4px 12px rgba(0,0,0,0.08)",
                    border: completed ? `3px solid ${GAME_DATA.theme.palette.star}` : "none"
                  }}
                >
                  {!unlocked && node.type !== "sign" ? (
                    <Lock className="w-8 h-8 text-gray-400" />
                  ) : (
                    <span>{node.emoji}</span>
                  )}
                </div>

                {/* Sparkle effect on hover */}
                {unlocked && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: GAME_DATA.theme.palette.star,
                          left: `${30 + i * 20}%`,
                          top: `${20 + i * 15}%`
                        }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </motion.div>
                )}

                {/* Label */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <p
                    className="text-sm md:text-base font-semibold"
                    style={{ fontFamily: "Quicksand, sans-serif", color: GAME_DATA.theme.palette.textPrimary }}
                  >
                    {node.label}
                  </p>
                </div>

                {/* Stars collected indicator */}
                {node.type !== "sign" && progress[node.id] > 0 && (
                  <div
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: GAME_DATA.theme.palette.star, color: GAME_DATA.theme.palette.textPrimary }}
                  >
                    {progress[node.id]}/3
                  </div>
                )}
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Level Preview Component
function LevelPreview({
  level,
  onPlay,
  onBack
}: {
  level: typeof GAME_DATA.levels[1];
  onPlay: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-2xl mx-auto"
    >
      <Card
        className="overflow-hidden border-0"
        style={{
          background: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          borderRadius: "24px"
        }}
      >
        <CardHeader className="text-center pb-4">
          <div className="text-6xl mb-4">{level.emoji}</div>
          <CardTitle className="text-3xl" style={{ fontFamily: "Poppins, sans-serif" }}>
            {level.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 text-lg" style={{ fontFamily: "Quicksand, sans-serif" }}>
              What you'll learn:
            </h3>
            <ul className="space-y-2">
              {level.whatYoullLearn.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-xl">•</span>
                  <span style={{ fontFamily: "Quicksand, sans-serif" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={onPlay}
              className="flex-1 h-12 text-base font-semibold"
              style={{
                backgroundColor: GAME_DATA.theme.palette.accent,
                color: GAME_DATA.theme.palette.textPrimary
              }}
            >
              <PlayIcon className="w-5 h-5 mr-2" />
              Play Level
            </Button>
            <Button onClick={onBack} variant="outline" className="h-12 px-6">
              Back to Map
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Level Gameplay Component
function LevelGameplay({
  levelId,
  levelData,
  currentProgress,
  onComplete,
  onBack
}: {
  levelId: number;
  levelData: typeof GAME_DATA.levels[1];
  currentProgress: number;
  onComplete: (levelId: number, stars: number) => void;
  onBack: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [collectedCount, setCollectedCount] = useState<number>(currentProgress);
  const [showMissMsg, setShowMissMsg] = useState<boolean>(false);
  const [showFactCard, setShowFactCard] = useState<string | null>(null);
  const [completed, setCompleted] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);

  // Game state refs
  const playerRef = useRef({ x: 80, y: 0, vy: 0, size: 28 });
  const groundRef = useRef({ y: 0 });
  const starsRef = useRef<Array<Star>>([]);
  const platformsRef = useRef<Array<Platform>>([]);
  const lastSpawnRef = useRef({ star: 0, platform: 0 });
  const timeRef = useRef(0);
  const inputRef = useRef({ jumpRequested: false, canJump: true });

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = container.getBoundingClientRect();
    const width = Math.max(320, Math.floor(rect.width));
    const height = Math.floor(Math.min(480, Math.max(300, rect.height * 0.55)));

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const groundY = height - 50;
    groundRef.current.y = groundY;
    playerRef.current.y = groundY - playerRef.current.size;
  };

  const requestJump = () => {
    if (!paused) inputRef.current.jumpRequested = true;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" && !paused) {
        e.preventDefault();
        requestJump();
      }
      if (e.code === "Escape") {
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey);
  }, [paused]);

  useEffect(() => {
    const onResize = () => resizeCanvas();
    window.addEventListener("resize", onResize);
    resizeCanvas();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    starsRef.current = [];
    platformsRef.current = [];
    lastSpawnRef.current = { star: 0, platform: 0 };
    timeRef.current = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    const spawnStar = () => {
      const yMin = 80;
      const yMax = groundRef.current.y - 90;
      const y = Math.max(yMin, Math.min(yMax, Math.random() * (yMax - yMin) + yMin));
      const r = 10 + Math.random() * 6;
      starsRef.current.push({ x: width + 30, y, r, collected: false });
    };

    const spawnPlatform = () => {
      const w = 80 + Math.random() * 80;
      const h = 12;
      const yMin = groundRef.current.y - 140;
      const yMax = groundRef.current.y - 70;
      const y = Math.random() * (yMax - yMin) + yMin;
      platformsRef.current.push({ x: width + 60, y, w, h });
    };

    const speed = 3.2;
    const gravity = 0.6;
    const jumpVy = -10.5;

    const drawBackground = () => {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, GAME_DATA.theme.palette.bgStart);
      grad.addColorStop(1, GAME_DATA.theme.palette.bgEnd);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Floating bubbles
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      for (let i = 0; i < 8; i++) {
        const cx = ((i * 120 + timeRef.current * 15) % (width + 150)) - 75;
        const cy = 50 + (i % 3) * 30 + Math.sin(timeRef.current * 0.02 + i) * 15;
        ctx.beginPath();
        ctx.arc(cx, cy, 18 + (i % 3) * 6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Ground
      ctx.fillStyle = GAME_DATA.theme.palette.accent;
      ctx.fillRect(0, groundRef.current.y, width, height - groundRef.current.y);
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.fillRect(0, groundRef.current.y, width, 4);
    };

    const drawPlayer = () => {
      const p = playerRef.current;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = GAME_DATA.theme.palette.highlight;
      ctx.strokeStyle = GAME_DATA.theme.palette.textPrimary;
      ctx.lineWidth = 1.5;

      const bodyW = p.size * 1.2;
      const bodyH = p.size * 1.1;
      roundRect(ctx, -bodyW / 2, -bodyH, bodyW, bodyH, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      roundRect(ctx, -bodyW / 2 + 6, -bodyH + 8, bodyW - 12, bodyH * 0.55, 8);
      ctx.fill();

      ctx.fillStyle = GAME_DATA.theme.palette.textPrimary;
      ctx.beginPath();
      ctx.arc(-8, -bodyH + 24, 2.8, 0, Math.PI * 2);
      ctx.arc(8, -bodyH + 24, 2.8, 0, Math.PI * 2);
      ctx.fill();

      const t = timeRef.current;
      const legOffset = Math.sin(t * 0.4) * 4;
      ctx.fillStyle = GAME_DATA.theme.palette.textPrimary;
      roundRect(ctx, -10, -6 + legOffset, 8, 10, 3);
      roundRect(ctx, 2, -6 - legOffset, 8, 10, 3);
      ctx.restore();
    };

    const drawStar = (s: Star) => {
      ctx.save();
      ctx.translate(s.x, s.y);
      
      // Glow
      ctx.shadowColor = GAME_DATA.theme.palette.star;
      ctx.shadowBlur = 15;
      
      ctx.fillStyle = GAME_DATA.theme.palette.star;
      drawStarPath(ctx, s.r, 5, 0.5);
      ctx.fill();
      
      ctx.shadowBlur = 0;
      ctx.restore();
    };

    const drawPlatform = (pl: Platform) => {
      ctx.save();
      ctx.fillStyle = GAME_DATA.theme.palette.accent;
      roundRect(ctx, pl.x, pl.y, pl.w, pl.h, 6);
      ctx.fill();
      
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = GAME_DATA.theme.palette.highlight;
      for (let i = 0; i < 6; i++) {
        const sx = pl.x + 8 + (i * (pl.w - 16)) / 5;
        const sy = pl.y + 3 + (i % 2) * 3;
        ctx.fillRect(sx, sy, 6, 2);
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    };

    const step = () => {
      if (paused) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      timeRef.current += 1;

      const p = playerRef.current;
      p.vy += gravity;

      const onGround = p.y >= groundRef.current.y - p.size - 0.1;
      const standingPlatform = platformsRef.current.find((pl) => {
        const withinX = p.x > pl.x - p.size / 2 && p.x < pl.x + pl.w + p.size / 2;
        const standing = p.y + 2 >= pl.y - p.size && p.y <= pl.y - p.size + 6 && p.vy >= 0;
        return withinX && standing;
      });

      if (standingPlatform) {
        p.y = standingPlatform.y - p.size;
        p.vy = 0;
        inputRef.current.canJump = true;
      } else if (onGround) {
        p.y = groundRef.current.y - p.size;
        p.vy = 0;
        inputRef.current.canJump = true;
      } else {
        inputRef.current.canJump = false;
      }

      if (inputRef.current.jumpRequested && (onGround || standingPlatform)) {
        p.vy = jumpVy;
      }
      inputRef.current.jumpRequested = false;
      p.y += p.vy;

      if (timeRef.current - lastSpawnRef.current.star > 110) {
        spawnStar();
        lastSpawnRef.current.star = timeRef.current;
      }
      if (timeRef.current - lastSpawnRef.current.platform > 150) {
        spawnPlatform();
        lastSpawnRef.current.platform = timeRef.current;
      }

      starsRef.current.forEach((s) => (s.x -= speed));
      const before = starsRef.current.length;
      starsRef.current = starsRef.current.filter((s) => s.x > -30 && !s.collected);
      const removed = before - starsRef.current.length;
      if (removed > 0) {
        setShowMissMsg(true);
        window.setTimeout(() => setShowMissMsg(false), 1600);
      }

      platformsRef.current.forEach((pl) => (pl.x -= speed));
      platformsRef.current = platformsRef.current.filter((pl) => pl.x + pl.w > -20);

      for (const s of starsRef.current) {
        const dx = s.x - p.x;
        const dy = s.y - (p.y - p.size / 2);
        const dist = Math.hypot(dx, dy);
        if (dist < s.r + p.size * 0.6) {
          s.collected = true;
          setCollectedCount((prev) => {
            const next = prev + 1;
            if (next <= levelData.stars.length) {
              setShowFactCard(levelData.stars[next - 1]);
              setTimeout(() => setShowFactCard(null), 4000);
            }
            if (next >= levelData.stars.length) {
              setCompleted(true);
            }
            return next;
          });
        }
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      drawBackground();
      platformsRef.current.forEach(drawPlatform);
      starsRef.current.forEach(drawStar);
      drawPlayer();
      ctx.restore();

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [paused, levelData, collectedCount]);

  const handleComplete = () => {
    onComplete(levelId, collectedCount);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Game Canvas */}
        <Card className="overflow-hidden" style={{ borderRadius: "24px" }}>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{levelData.emoji}</span>
              <CardTitle style={{ fontFamily: "Poppins, sans-serif" }}>{levelData.name}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                ⭐ {collectedCount} / {levelData.stars.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPaused(!paused)}
                className="w-8 h-8 p-0"
              >
                {paused ? <PlayIcon className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div
              ref={containerRef}
              className="w-full touch-none select-none"
              onMouseDown={() => requestJump()}
              onTouchStart={(e) => {
                e.preventDefault();
                requestJump();
              }}
            >
              <canvas ref={canvasRef} className="w-full block cursor-pointer" />
            </div>

            <div className="p-4">
              <AnimatePresence>
                {showMissMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xs rounded-full px-3 py-1 bg-amber-100 text-amber-900 inline-block"
                  >
                    Oops! You missed this one… but you can always check my resume!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Fact Card */}
          <AnimatePresence>
            {showFactCard && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card
                  style={{
                    background: "rgba(255, 255, 255, 0.75)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "24px",
                    border: `2px solid ${GAME_DATA.theme.palette.star}`
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">⭐</span>
                      <p className="text-sm" style={{ fontFamily: "Quicksand, sans-serif" }}>
                        {showFactCard}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <Card style={{ borderRadius: "24px" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>
                Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2" style={{ fontFamily: "Quicksand, sans-serif" }}>
              <p>🖱️ <strong>Desktop:</strong> Space or Click to jump</p>
              <p>📱 <strong>Mobile:</strong> Tap anywhere to jump</p>
              <p>⏸️ <strong>Pause:</strong> ESC or pause button</p>
            </CardContent>
          </Card>

          {/* Level Complete */}
          <AnimatePresence>
            {completed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card
                  style={{
                    borderRadius: "24px",
                    border: `2px solid ${GAME_DATA.theme.palette.success}`
                  }}
                >
                  <CardHeader className="pb-2">
                    <CardTitle style={{ fontFamily: "Poppins, sans-serif" }}>
                      Level Complete! 🎉
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm" style={{ fontFamily: "Quicksand, sans-serif" }}>
                      You've unlocked all the snippets from this level!
                    </p>
                    {levelId === 7 ? (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold mb-3">Let's connect!</p>
                        <Button
                          className="w-full"
                          style={{ backgroundColor: GAME_DATA.theme.palette.accent }}
                          onClick={() => window.open("https://drive.google.com/file/d/1example", "_blank")}
                        >
                          Resume
                        </Button>
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => window.open("https://www.linkedin.com/in/darshitapatel2001/", "_blank")}
                        >
                          LinkedIn
                        </Button>
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => window.open("https://github.com/darshita", "_blank")}
                        >
                          GitHub
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          style={{ backgroundColor: GAME_DATA.theme.palette.accent }}
                          onClick={handleComplete}
                        >
                          Next Level
                        </Button>
                        <Button variant="outline" onClick={onBack}>
                          Back to Map
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const min = Math.min(w, h) / 2;
  const rad = Math.min(r, min);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.lineTo(x + w - rad, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
  ctx.lineTo(x + w, y + h - rad);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
  ctx.lineTo(x + rad, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
  ctx.lineTo(x, y + rad);
  ctx.quadraticCurveTo(x, y, x + rad, y);
  ctx.closePath();
}

function drawStarPath(ctx: CanvasRenderingContext2D, r: number, spikes = 5, inset = 0.5) {
  let rot = (Math.PI / 2) * 3;
  let x = 0;
  let y = 0;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(0, -r);
  for (let i = 0; i < spikes; i++) {
    x = Math.cos(rot) * r;
    y = Math.sin(rot) * r;
    ctx.lineTo(x, y);
    rot += step;

    x = Math.cos(rot) * r * inset;
    y = Math.sin(rot) * r * inset;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(0, -r);
  ctx.closePath();
}