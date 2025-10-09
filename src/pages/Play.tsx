import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BubbleNode } from "@/components/game/BubbleNode";
import { XPBar } from "@/components/game/XPBar";
import { BUBBLE_NODES, BYTE_BUBBLES_THEME, loadGameProgress, saveGameProgress, type GameProgress } from "@/lib/byteBubblesData";

export default function Play() {
  const navigate = useNavigate();
  const [soundOn, setSoundOn] = useState(false);
  const [showUnderConstruction, setShowUnderConstruction] = useState(false);
  const [progress, setProgress] = useState<GameProgress>(() => loadGameProgress());

  const handleBubbleClick = (nodeId: number) => {
    const node = BUBBLE_NODES.find((n) => n.id === nodeId);
    if (!node) return;

    if (node.type === "sign") {
      setShowUnderConstruction(true);
      return;
    }

    // For now, just mark as complete for demo
    const newProgress = {
      ...progress,
      xp: progress.xp + 10,
      levelStatus: { ...progress.levelStatus, [nodeId]: "complete" as const },
    };
    setProgress(newProgress);
    saveGameProgress(newProgress);
  };

  const completedCount = Object.values(progress.levelStatus).filter((s) => s === "complete").length;
  const totalLevels = BUBBLE_NODES.filter((n) => n.type !== "sign").length;

  return (
    <div
      className="min-h-screen w-full overflow-hidden relative"
      style={{
        backgroundImage: `url('https://harmless-tapir-303.convex.cloud/api/storage/b443f2f5-47b5-4748-bb60-7ab8b4468ccd')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay to maintain theme colors */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, ${BYTE_BUBBLES_THEME.bgStart}40 0%, ${BYTE_BUBBLES_THEME.bgMid}30 50%, ${BYTE_BUBBLES_THEME.bgEnd}40 100%)`,
        }}
      />

      {/* Header */}
      <header
        className="relative z-50 border-b"
        style={{
          borderColor: `${BYTE_BUBBLES_THEME.accent}10`,
        }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
            style={{
              background: `radial-gradient(circle at 35% 25%, rgba(255,255,255,0.9), rgba(135,206,250,0.7) 40%, rgba(70,130,180,0.8) 70%, rgba(100,149,237,0.6))`,
              border: `3px solid rgba(255,255,255,0.5)`,
              boxShadow: `
                inset -8px -8px 12px rgba(70,130,180,0.4),
                inset 12px 12px 16px rgba(255,255,255,0.8),
                0 8px 24px rgba(0,0,0,0.15),
                0 0 0 4px rgba(255,255,255,0.3)
              `,
              color: BYTE_BUBBLES_THEME.text,
              fontFamily: "'Anton', 'Impact', 'Arial Black', sans-serif",
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            ← Exit
          </button>
          <h1
            className="text-3xl md:text-5xl font-semibold tracking-wider"
            style={{
              fontFamily: "'Anton', 'Impact', 'Arial Black', sans-serif",
              color: BYTE_BUBBLES_THEME.star,
              textShadow: `3px 3px 0px ${BYTE_BUBBLES_THEME.text}, 0 4px 12px ${BYTE_BUBBLES_THEME.accent}80`,
              letterSpacing: "0.05em",
              textTransform: "uppercase" as const,
              fontWeight: 600,
            }}
          >
            Bubbles of My Journey
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSoundOn(!soundOn)}
            aria-label={soundOn ? "Mute sound" : "Unmute sound"}
          >
            {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Main Game Area */}
      <div className="relative h-[calc(100vh-80px)] w-full">
        {/* XP Bar - Left Side */}
        <XPBar totalStars={totalLevels} collectedStars={completedCount} />

        {/* Map Stage - Right Side */}
        <div
          className="absolute top-0 right-0 h-full overflow-hidden"
          style={{
            width: "calc(100% - clamp(48px, 4vw, 60px))",
            left: "clamp(48px, 4vw, 60px)",
          }}
        >
          {/* Bubble Nodes */}
          <div className="relative w-full h-full">
            {/* Wavy connection path */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 5 }}
            >
              <motion.path
                d={`M ${BUBBLE_NODES[0].x}% ${BUBBLE_NODES[0].y}% ${BUBBLE_NODES.slice(1, -1)
                  .map((n) => `Q ${n.x - 2}% ${n.y - 3}%, ${n.x}% ${n.y}%`)
                  .join(" ")}`}
                stroke={BYTE_BUBBLES_THEME.accent}
                strokeWidth="3"
                fill="none"
                strokeDasharray="8 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </svg>

            {/* Bubble nodes */}
            {BUBBLE_NODES.map((node) => (
              <BubbleNode
                key={node.id}
                label={node.label}
                x={node.x}
                y={node.y}
                onClick={() => handleBubbleClick(node.id)}
                isCompleted={progress.levelStatus[node.id] === "complete"}
              />
            ))}

            {/* Floating background bubbles */}
            {Array.from({ length: 45 }).map((_, i) => {
              const size = 20 + Math.random() * 40;
              const hasOrbiters = i < 15; // First 15 bubbles get small dotted orbiters
              const bubbleLeft = Math.random() * 100;
              const bubbleTop = Math.random() * 100;
              
              return (
                <div key={`bubble-group-${i}`}>
                  {/* Main bubble */}
                  <motion.div
                    className="absolute rounded-full"
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      left: `${bubbleLeft}%`,
                      top: `${bubbleTop}%`,
                      background: `radial-gradient(circle at 35% 25%, rgba(255,255,255,0.9), rgba(135,206,250,0.7) 40%, rgba(70,130,180,0.8) 70%, rgba(100,149,237,0.6))`,
                      border: `2px solid rgba(255,255,255,0.4)`,
                      boxShadow: `
                        inset -${size * 0.1}px -${size * 0.1}px ${size * 0.15}px rgba(70,130,180,0.4),
                        inset ${size * 0.15}px ${size * 0.15}px ${size * 0.2}px rgba(255,255,255,0.8),
                        0 ${size * 0.1}px ${size * 0.3}px rgba(0,0,0,0.1)
                      `,
                    }}
                    animate={{
                      y: [0, -100 - Math.random() * 200],
                      x: [0, (Math.random() - 0.5) * 60],
                      opacity: [0.3, 0.6, 0],
                    }}
                    transition={{
                      duration: 8 + Math.random() * 6,
                      repeat: Infinity,
                      delay: Math.random() * 4,
                      ease: "easeInOut",
                    }}
                  />
                  
                  {/* Small dotted orbiters for first 15 bubbles */}
                  {hasOrbiters && Array.from({ length: 5 }).map((_, orbiterIndex) => {
                    const angle = (orbiterIndex * 72) + (Math.random() * 30); // Distribute around circle
                    const distance = size * 0.7 + Math.random() * 10;
                    const orbiterSize = 4 + Math.random() * 4;
                    
                    return (
                      <motion.div
                        key={`orbiter-${i}-${orbiterIndex}`}
                        className="absolute rounded-full"
                        style={{
                          width: `${orbiterSize}px`,
                          height: `${orbiterSize}px`,
                          left: `calc(${bubbleLeft}% + ${Math.cos(angle * Math.PI / 180) * distance}px)`,
                          top: `calc(${bubbleTop}% + ${Math.sin(angle * Math.PI / 180) * distance}px)`,
                          background: `radial-gradient(circle at 35% 25%, rgba(255,255,255,0.9), rgba(135,206,250,0.7) 40%, rgba(70,130,180,0.8))`,
                          border: `1.5px solid rgba(255,255,255,0.5)`,
                          boxShadow: `
                            inset -${orbiterSize * 0.15}px -${orbiterSize * 0.15}px ${orbiterSize * 0.2}px rgba(70,130,180,0.4),
                            inset ${orbiterSize * 0.2}px ${orbiterSize * 0.2}px ${orbiterSize * 0.25}px rgba(255,255,255,0.8),
                            0 ${orbiterSize * 0.15}px ${orbiterSize * 0.4}px rgba(0,0,0,0.1)
                          `,
                        }}
                        animate={{
                          y: [0, -100 - Math.random() * 200],
                          x: [0, (Math.random() - 0.5) * 60],
                          opacity: [0.5, 0.9, 0.3, 0.8, 0],
                          scale: [0.6, 1.2, 0.8, 1.3, 0.6],
                          boxShadow: [
                            `0 0 8px ${BYTE_BUBBLES_THEME.accent}80, 0 0 12px ${BYTE_BUBBLES_THEME.seafoam}60`,
                            `0 0 16px ${BYTE_BUBBLES_THEME.accent}, 0 0 24px ${BYTE_BUBBLES_THEME.seafoam}80`,
                            `0 0 8px ${BYTE_BUBBLES_THEME.accent}80, 0 0 12px ${BYTE_BUBBLES_THEME.seafoam}60`,
                          ],
                        }}
                        transition={{
                          duration: 8 + Math.random() * 6,
                          repeat: Infinity,
                          delay: Math.random() * 4,
                          ease: "easeInOut",
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Under Construction Modal */}
      <AnimatePresence>
        {showUnderConstruction && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUnderConstruction(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card
                className="max-w-md mx-4"
                style={{
                  background: BYTE_BUBBLES_THEME.bubble,
                  borderColor: BYTE_BUBBLES_THEME.accent,
                }}
              >
                <CardHeader>
                  <CardTitle
                    className="text-center text-2xl"
                    style={{
                      fontFamily: "'Orbitron', sans-serif",
                      color: BYTE_BUBBLES_THEME.text,
                    }}
                  >
                    🚧 Under Construction 🚧
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p
                    style={{
                      fontFamily: "'Quicksand', sans-serif",
                      color: BYTE_BUBBLES_THEME.textSecondary,
                    }}
                  >
                    A new world is brewing. Come back soon!
                  </p>
                  <Button onClick={() => setShowUnderConstruction(false)}>Got it!</Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}