import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FactCard } from "@/components/game/FactCard";
import { BYTE_BUBBLES_THEME } from "@/lib/byteBubblesData";

interface RunnerQuestProps {
  levelId: number;
  facts: string[];
  onComplete: (factsCollected: string[]) => void;
  onBack: () => void;
}

export function RunnerQuest({ levelId, facts, onComplete, onBack }: RunnerQuestProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [collectedCount, setCollectedCount] = useState(0);
  const [currentFact, setCurrentFact] = useState<string | null>(null);
  const [showMissMsg, setShowMissMsg] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  const gameStateRef = useRef({
    player: { x: 100, y: 0, vy: 0, jumping: false },
    stars: [] as { x: number; y: number; collected: boolean }[],
    platforms: [] as { x: number; y: number; width: number }[],
    scrollOffset: 0,
    gravity: 0.5,
    jumpPower: -10,
    groundY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Load images
    const playerImg = new Image();
    playerImg.src = "https://harmless-tapir-303.convex.cloud/api/storage/d009bf33-100f-493e-ab37-a526e124e39f";
    
    const bgImg = new Image();
    bgImg.src = "https://harmless-tapir-303.convex.cloud/api/storage/a4bff787-1951-4c58-80d3-6ceef52a4d73";

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
      
      gameStateRef.current.groundY = rect.height - 100;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize game objects
    const state = gameStateRef.current;
    state.player.y = state.groundY;
    
    // Create stars at well-spaced intervals
    state.stars = [];
    for (let i = 0; i < facts.length; i++) {
      state.stars.push({
        x: 500 + i * 800, // Better spacing between stars
        y: state.groundY - 120 - (Math.random() * 80), // Varied heights but not too high
        collected: false,
      });
    }

    // Create platforms
    state.platforms = [];
    for (let i = 0; i < 20; i++) {
      state.platforms.push({
        x: i * 300,
        y: state.groundY,
        width: 250,
      });
    }

    // Game loop
    let animationId: number;
    const gameLoop = () => {
      if (isPaused) {
        animationId = requestAnimationFrame(gameLoop);
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const state = gameStateRef.current;

      // Update player physics
      state.player.vy += state.gravity;
      state.player.y += state.player.vy;

      // Ground collision
      if (state.player.y >= state.groundY) {
        state.player.y = state.groundY;
        state.player.vy = 0;
        state.player.jumping = false;
      }
      
      // Ceiling collision (prevent going off-screen)
      if (state.player.y < 50) {
        state.player.y = 50;
        state.player.vy = 0;
      }

      // Auto-scroll (slower for better gameplay)
      state.scrollOffset += 1.5;

      // Draw background image
      if (bgImg.complete) {
        ctx.drawImage(bgImg, 0, 0, rect.width, rect.height);
      } else {
        // Fallback gradient while loading
        const gradient = ctx.createLinearGradient(0, 0, 0, rect.height);
        gradient.addColorStop(0, BYTE_BUBBLES_THEME.bgStart);
        gradient.addColorStop(0.5, BYTE_BUBBLES_THEME.bgMid);
        gradient.addColorStop(1, BYTE_BUBBLES_THEME.bgEnd);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, rect.width, rect.height);
      }

      // Draw platforms
      ctx.fillStyle = BYTE_BUBBLES_THEME.accent;
      state.platforms.forEach((platform) => {
        const x = platform.x - state.scrollOffset;
        if (x > -platform.width && x < rect.width) {
          roundRect(ctx, x, platform.y, platform.width, 20, 10);
        }
      });

      // Draw and check stars
      state.stars.forEach((star, index) => {
        if (star.collected) return;
        
        const x = star.x - state.scrollOffset;
        if (x > -50 && x < rect.width) {
          // Draw star
          ctx.save();
          ctx.translate(x, star.y);
          ctx.fillStyle = BYTE_BUBBLES_THEME.star;
          ctx.shadowColor = BYTE_BUBBLES_THEME.star;
          ctx.shadowBlur = 15;
          drawStarPath(ctx, 0, 0, 5, 20, 10);
          ctx.fill();
          ctx.restore();

          // Check collision with player
          const dx = x - state.player.x;
          const dy = star.y - state.player.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 40) {
            star.collected = true;
            setCollectedCount((prev) => prev + 1);
            setCurrentFact(facts[index]);
          } else if (x < state.player.x - 100) {
            // Missed the star
            star.collected = true;
            setShowMissMsg(true);
            setTimeout(() => setShowMissMsg(false), 1500);
          }
        }
      });

      // Draw player (SpongeBob character)
      ctx.save();
      ctx.translate(state.player.x, state.player.y);
      
      if (playerImg.complete) {
        // Draw SpongeBob image
        const playerSize = 70;
        ctx.drawImage(playerImg, -playerSize / 2, -playerSize / 2, playerSize, playerSize);
      } else {
        // Fallback bubble while loading
        const bubbleGradient = ctx.createRadialGradient(-10, -10, 5, 0, 0, 35);
        bubbleGradient.addColorStop(0, "rgba(255,255,255,0.9)");
        bubbleGradient.addColorStop(0.4, "rgba(135,206,250,0.7)");
        bubbleGradient.addColorStop(0.7, "rgba(70,130,180,0.8)");
        bubbleGradient.addColorStop(1, "rgba(100,149,237,0.6)");
        
        ctx.fillStyle = bubbleGradient;
        ctx.shadowColor = "rgba(0,0,0,0.2)";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, 0, 35, 0, Math.PI * 2);
        ctx.fill();
        
        // Highlight
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.beginPath();
        ctx.arc(-12, -12, 12, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();

      // Check if all stars collected
      const allCollected = state.stars.every((s) => s.collected);
      const allFactsShown = collectedCount === facts.length;
      if (allCollected && allFactsShown && !showComplete) {
        setShowComplete(true);
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    // Input handlers
    const handleJump = () => {
      const state = gameStateRef.current;
      if (!state.player.jumping && !isPaused) {
        state.player.jumping = true;
        state.player.vy = state.jumpPower;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleJump();
      }
    };

    canvas.addEventListener("click", handleJump);
    canvas.addEventListener("touchstart", handleJump, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("click", handleJump);
      canvas.removeEventListener("touchstart", handleJump);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [facts, isPaused, collectedCount, showComplete]);

  const handleFactDismiss = () => {
    setCurrentFact(null);
  };

  const handleComplete = () => {
    onComplete(facts);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        className="w-[90vw] h-[80vh] max-w-5xl max-h-[700px] flex flex-col rounded-3xl overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${BYTE_BUBBLES_THEME.bgStart} 0%, ${BYTE_BUBBLES_THEME.bgMid} 50%, ${BYTE_BUBBLES_THEME.bgEnd} 100%)`,
          border: `3px solid ${BYTE_BUBBLES_THEME.accent}60`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.3)`,
        }}
      >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b"
        style={{
          borderColor: `${BYTE_BUBBLES_THEME.accent}40`,
          background: `${BYTE_BUBBLES_THEME.bubble}80`,
        }}
      >
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Back to Map
        </Button>
        <div className="flex items-center gap-3">
          <span style={{ fontFamily: "'Anton', sans-serif", color: BYTE_BUBBLES_THEME.text }}>
            Level {levelId}
          </span>
          <span style={{ color: BYTE_BUBBLES_THEME.textSecondary }}>
            ⭐ {collectedCount} / {facts.length}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsPaused(!isPaused)}>
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
        
        {/* Miss message */}
        <AnimatePresence>
          {showMissMsg && (
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 rounded-full"
              style={{
                background: `${BYTE_BUBBLES_THEME.bubble}95`,
                border: `2px solid ${BYTE_BUBBLES_THEME.accent}`,
                fontFamily: "'Quicksand', sans-serif",
                color: BYTE_BUBBLES_THEME.text,
                fontWeight: 600,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              Missed! Keep going!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fact Card Overlay */}
      <AnimatePresence>
        {currentFact && <FactCard fact={currentFact} onDismiss={handleFactDismiss} />}
      </AnimatePresence>

      {/* Level Complete Modal */}
      <AnimatePresence>
        {showComplete && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              style={{ width: "clamp(300px, 60%, 480px)" }}
            >
              <Card
                style={{
                  background: `linear-gradient(135deg, ${BYTE_BUBBLES_THEME.bubble}95 0%, ${BYTE_BUBBLES_THEME.seafoam}90 100%)`,
                  borderRadius: "24px",
                  border: `2px solid ${BYTE_BUBBLES_THEME.accent}60`,
                }}
              >
                <CardHeader className="text-center">
                  <CardTitle
                    className="text-3xl mb-2"
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      color: BYTE_BUBBLES_THEME.text,
                    }}
                  >
                    🎉 Level Complete! 🎉
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4 pb-8">
                  <p style={{ fontFamily: "'Quicksand', sans-serif", color: BYTE_BUBBLES_THEME.textSecondary }}>
                    You collected all {facts.length} stars!
                  </p>
                  <Button
                    size="lg"
                    onClick={handleComplete}
                    style={{
                      background: `linear-gradient(135deg, ${BYTE_BUBBLES_THEME.star} 0%, #FFC94A 100%)`,
                      fontFamily: "'Anton', sans-serif",
                    }}
                  >
                    Continue
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

// Helper functions for canvas drawing
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

function drawStarPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);

  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
    rot += step;
  }

  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}