import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [isPaused, setIsPaused] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);

  const gameStateRef = useRef({
    player: { x: 100, y: 0, vy: 0, jumping: false, onGround: false },
    stars: [] as { x: number; y: number; collected: boolean; id: number }[],
    platforms: [] as { x: number; y: number; width: number; height: number }[],
    scrollOffset: 0,
    gravity: 0.6,
    jumpPower: -14,
    groundY: 0,
    collectedStars: new Set<number>(),
    missedStars: 0,
    playerWidth: 60,
    playerHeight: 60,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Load images
    const playerImg = new Image();
    playerImg.src = "https://harmless-tapir-303.convex.cloud/api/storage/684f9879-8593-4d6d-b7cf-896a5e33048b";
    
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
      
      gameStateRef.current.groundY = rect.height - 80;
    };

    // Initial resize with delay to ensure DOM is ready
    const initialResize = () => {
      resizeCanvas();
      setTimeout(resizeCanvas, 100);
    };

    initialResize();
    window.addEventListener("resize", resizeCanvas);

    // Initialize game objects
    const state = gameStateRef.current;
    state.player.y = state.groundY - state.playerHeight;
    state.collectedStars = new Set<number>();
    
    // Create 15 stars at varied positions
    state.stars = [];
    for (let i = 0; i < 15; i++) {
      const baseX = 600 + i * 800;
      const heightVariation = Math.random() > 0.5 ? -150 : -80;
      state.stars.push({
        x: baseX,
        y: state.groundY + heightVariation,
        collected: false,
        id: i,
      });
    }

    // Create platforms for Mario-style gameplay
    state.platforms = [];
    const platformHeight = 20;
    
    // Ground platforms
    for (let i = 0; i < 30; i++) {
      state.platforms.push({
        x: i * 300,
        y: state.groundY,
        width: 280,
        height: platformHeight,
      });
    }
    
    // Elevated platforms for higher stars
    for (let i = 0; i < 15; i++) {
      if (Math.random() > 0.3) {
        state.platforms.push({
          x: 800 + i * 600,
          y: state.groundY - 120 - Math.random() * 40,
          width: 200,
          height: platformHeight,
        });
      }
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

      // Apply gravity
      state.player.vy += state.gravity;
      state.player.y += state.player.vy;

      // Check platform collisions
      state.player.onGround = false;
      
      for (const platform of state.platforms) {
        const platformScreenX = platform.x - state.scrollOffset;
        
        // Check if player is above platform and falling
        if (
          state.player.x + state.playerWidth > platformScreenX &&
          state.player.x < platformScreenX + platform.width &&
          state.player.y + state.playerHeight >= platform.y &&
          state.player.y + state.playerHeight <= platform.y + platform.height + 10 &&
          state.player.vy >= 0
        ) {
          state.player.y = platform.y - state.playerHeight;
          state.player.vy = 0;
          state.player.jumping = false;
          state.player.onGround = true;
          break;
        }
      }

      // Ceiling collision
      if (state.player.y < 30) {
        state.player.y = 30;
        state.player.vy = 0;
      }

      // Auto-scroll (faster for better gameplay)
      state.scrollOffset += 2;

      // Draw background
      if (bgImg.complete) {
        ctx.drawImage(bgImg, 0, 0, rect.width, rect.height);
      } else {
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
          roundRect(ctx, x, platform.y, platform.width, platform.height, 8);
        }
      });

      // Draw and check stars
      state.stars.forEach((star) => {
        if (state.collectedStars.has(star.id)) return;
        
        const x = star.x - state.scrollOffset;
        
        // Check if star has been missed (scrolled past the player)
        if (x < state.player.x - 100 && !state.collectedStars.has(star.id)) {
          state.collectedStars.add(star.id); // Mark as processed
          state.missedStars++;
          
          // Check game over condition: missed 10 stars without collecting 5
          if (state.missedStars >= 10 && collectedCount < 5) {
            setShowGameOver(true);
            setIsPaused(true);
          }
        }
        
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

          // Check collision with player (center-based)
          const playerCenterX = state.player.x + state.playerWidth / 2;
          const playerCenterY = state.player.y + state.playerHeight / 2;
          const dx = x - playerCenterX;
          const dy = star.y - playerCenterY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 40 && !state.collectedStars.has(star.id)) {
            state.collectedStars.add(star.id);
            setCollectedCount(prev => prev + 1);
          }
        }
      });

      // Draw player (SpongeBob)
      ctx.save();
      ctx.translate(state.player.x, state.player.y);
      
      if (playerImg.complete) {
        ctx.drawImage(
          playerImg,
          -state.playerWidth / 2,
          -state.playerHeight / 2,
          state.playerWidth,
          state.playerHeight
        );
      } else {
        // Fallback
        ctx.fillStyle = "#FFD700";
        ctx.fillRect(-state.playerWidth / 2, -state.playerHeight / 2, state.playerWidth, state.playerHeight);
      }
      
      ctx.restore();

      // Check completion (exactly 5 stars collected)
      if (collectedCount === 5 && !showComplete) {
        setShowComplete(true);
        setIsPaused(true);
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    // Input handlers
    const handleJump = () => {
      const state = gameStateRef.current;
      if (state.player.onGround && !isPaused) {
        state.player.jumping = true;
        state.player.vy = state.jumpPower;
        state.player.onGround = false;
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
  }, [facts, isPaused, showComplete]);

  const handleComplete = () => {
    onComplete(facts);
  };

  const handleRetry = () => {
    setShowGameOver(false);
    setCollectedCount(0);
    setIsPaused(false);
    
    // Reset game state
    const state = gameStateRef.current;
    state.scrollOffset = 0;
    state.collectedStars = new Set<number>();
    state.missedStars = 0;
    state.player.y = state.groundY - state.playerHeight;
    state.player.vy = 0;
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
            ⭐ {collectedCount} / 5
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
      </div>

      {/* Game Over Modal */}
      <AnimatePresence>
        {showGameOver && (
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
              style={{ width: "clamp(400px, 75%, 700px)" }}
            >
              <Card
                style={{
                  background: `linear-gradient(135deg, ${BYTE_BUBBLES_THEME.bubble}95 0%, ${BYTE_BUBBLES_THEME.seafoam}90 100%)`,
                  backdropFilter: "blur(16px)",
                  borderRadius: "24px",
                  border: `2px solid ${BYTE_BUBBLES_THEME.accent}60`,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.2)`,
                }}
              >
                <CardHeader className="text-center pb-2">
                  <CardTitle
                    className="text-2xl md:text-3xl mb-2"
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      color: BYTE_BUBBLES_THEME.text,
                      letterSpacing: "0.05em",
                    }}
                  >
                    💔 GAME OVER 💔
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4 text-center space-y-4">
                  <p
                    className="text-lg"
                    style={{
                      fontFamily: "'Quicksand', sans-serif",
                      color: BYTE_BUBBLES_THEME.textSecondary,
                    }}
                  >
                    You didn't collect enough stars! You collected {collectedCount} out of 5.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      size="default"
                      onClick={handleRetry}
                      className="text-base px-6 py-4"
                      style={{
                        background: `linear-gradient(135deg, ${BYTE_BUBBLES_THEME.star} 0%, #FFC94A 100%)`,
                        border: `3px solid ${BYTE_BUBBLES_THEME.star}`,
                        boxShadow: `0 0 20px ${BYTE_BUBBLES_THEME.star}80, 0 4px 12px rgba(0,0,0,0.2)`,
                        fontFamily: "'Anton', sans-serif",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Try Again
                    </Button>
                    <Button
                      size="default"
                      onClick={onBack}
                      variant="outline"
                      className="text-base px-6 py-4"
                    >
                      Back to Map
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
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
              style={{ width: "clamp(400px, 75%, 700px)" }}
            >
              <Card
                style={{
                  background: `linear-gradient(135deg, ${BYTE_BUBBLES_THEME.bubble}95 0%, ${BYTE_BUBBLES_THEME.seafoam}90 100%)`,
                  backdropFilter: "blur(16px)",
                  borderRadius: "24px",
                  border: `2px solid ${BYTE_BUBBLES_THEME.accent}60`,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.2)`,
                }}
              >
                <CardHeader className="text-center pb-2">
                  <CardTitle
                    className="text-2xl md:text-3xl mb-2"
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      color: BYTE_BUBBLES_THEME.text,
                      letterSpacing: "0.05em",
                    }}
                  >
                    ✨ DATA PROFILE UNLOCKED ✨
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex flex-row gap-6 items-center">
                    {/* Left side: Avatar */}
                    <div className="flex-shrink-0">
                      <motion.img
                        src="https://harmless-tapir-303.convex.cloud/api/storage/d009bf33-100f-493e-ab37-a526e124e39f"
                        alt="Player Avatar"
                        className="w-28 h-28 md:w-32 md:h-32 rounded-2xl"
                        style={{
                          border: `3px solid ${BYTE_BUBBLES_THEME.star}`,
                          boxShadow: `0 0 20px ${BYTE_BUBBLES_THEME.star}60`,
                        }}
                        animate={{
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                    
                    {/* Right side: Player Stats */}
                    <div className="flex-1 space-y-2 text-left">
                      <div
                        className="text-xs md:text-sm font-mono leading-snug"
                        style={{
                          color: BYTE_BUBBLES_THEME.text,
                          fontFamily: "'Courier New', monospace",
                        }}
                      >
                        <div className="mb-2 pb-1 border-b-2" style={{ borderColor: BYTE_BUBBLES_THEME.accent }}>
                          <strong>PLAYER FILE UNLOCKED</strong>
                        </div>
                        <div className="space-y-1">
                          <div><strong>Name:</strong> Darshita Patel</div>
                          <div><strong>Level:</strong> Graduate in Information Systems (4.0 GPA)</div>
                          <div><strong>Class:</strong> Creative Technologist / System Analyst</div>
                          <div><strong>Power-Ups:</strong> Communication ⚡ Creativity ✨ Curiosity 💡</div>
                          <div><strong>Base Origin:</strong> Illinois State University</div>
                          <div><strong>Current Quest:</strong> Building the future of smart design & data</div>
                        </div>
                        <div className="mt-2 pt-1 border-t-2" style={{ borderColor: BYTE_BUBBLES_THEME.accent }}>
                          <div className="text-center text-xs" style={{ color: BYTE_BUBBLES_THEME.star }}>
                            🏆 Achievement Unlocked: "Boot-Up Complete – You met Darshita!"
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Next Button */}
                  <div className="mt-4 text-center">
                    <Button
                      size="default"
                      onClick={handleComplete}
                      className="text-base px-6 py-4"
                      style={{
                        background: `linear-gradient(135deg, ${BYTE_BUBBLES_THEME.star} 0%, #FFC94A 100%)`,
                        border: `3px solid ${BYTE_BUBBLES_THEME.star}`,
                        boxShadow: `0 0 20px ${BYTE_BUBBLES_THEME.star}80, 0 4px 12px rgba(0,0,0,0.2)`,
                        fontFamily: "'Anton', sans-serif",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Next →
                    </Button>
                  </div>
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