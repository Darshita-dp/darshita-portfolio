import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BYTE_BUBBLES_THEME } from "@/lib/byteBubblesData";
import { useMediaQuery } from "@/hooks/use-mobile";
import { RUNNER_CONFIG } from "./runner/gameConfig";
import { GameCanvasRenderer } from "./runner/GameCanvasRenderer";
import { GamePhysics } from "./runner/GamePhysics";

interface RunnerQuestProps {
  levelId: number;
  facts: string[];
  onComplete: (factsCollected: string[]) => void;
  onBack: () => void;
}

export function RunnerQuest({ levelId, facts, onComplete, onBack }: RunnerQuestProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [collectedCount, setCollectedCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const completionShownRef = useRef(false);
  const rendererRef = useRef<GameCanvasRenderer | null>(null);

  const gameStateRef = useRef({
    player: { x: 100, y: 0, vy: 0, jumping: false, onGround: false },
    stars: [] as { x: number; y: number; collected: boolean; id: number }[],
    platforms: [] as { x: number; y: number; width: number; height: number }[],
    scrollOffset: 0,
    collectedStars: new Set<number>(),
    processedStars: new Set<number>(),
    missedStars: 0,
    groundY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    completionShownRef.current = false;
    rendererRef.current = new GameCanvasRenderer(canvas, ctx);

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;

      const dpr = isMobile ? 1 : window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.scale(dpr, dpr);

      gameStateRef.current.groundY = rect.height - RUNNER_CONFIG.groundYOffset;
    };

    const initialResize = () => {
      resizeCanvas();
      setTimeout(resizeCanvas, 100);
    };

    initialResize();
    window.addEventListener("resize", resizeCanvas);

    // Initialize game
    const state = gameStateRef.current;
    state.player.y = state.groundY - RUNNER_CONFIG.playerHeight;
    state.collectedStars = new Set<number>();

    const starCount = isMobile ? RUNNER_CONFIG.mobile.starCount : RUNNER_CONFIG.starCount;
    state.stars = [];
    for (let i = 0; i < starCount; i++) {
      const baseX = 600 + i * RUNNER_CONFIG.starSpacing;
      const heightVariation = i % 2 === 0 ? -200 : -130;
      state.stars.push({
        x: baseX,
        y: state.groundY + heightVariation,
        collected: false,
        id: i,
      });
    }

    state.platforms = [];
    for (let i = 0; i < 30; i++) {
      state.platforms.push({
        x: i * RUNNER_CONFIG.platformSpacing,
        y: state.groundY,
        width: 280,
        height: RUNNER_CONFIG.platformHeight,
      });
    }

    for (let i = 0; i < 15; i++) {
      if (Math.random() > 0.3) {
        state.platforms.push({
          x: 800 + i * 600,
          y: state.groundY - 120 - Math.random() * 40,
          width: 200,
          height: RUNNER_CONFIG.platformHeight,
        });
      }
    }

    let animationId: number;
    const gameLoop = () => {
      if (isPaused) {
        animationId = requestAnimationFrame(gameLoop);
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas || !rendererRef.current) return;

      const state = gameStateRef.current;
      const rect = canvas.getBoundingClientRect();

      GamePhysics.updatePlayer(state);
      GamePhysics.updateScroll(state, isMobile);

      // Check missed stars
      state.stars.forEach((star) => {
        if (state.processedStars.has(star.id)) return;

        const x = star.x - state.scrollOffset;
        if (x < state.player.x - 100 && !state.processedStars.has(star.id)) {
          state.processedStars.add(star.id);
          state.missedStars++;

          if (state.missedStars >= RUNNER_CONFIG.maxMissedStars && collectedCount < RUNNER_CONFIG.requiredStars && !completionShownRef.current) {
            setShowGameOver(true);
            setIsPaused(true);
            completionShownRef.current = true;
          }
        }
      });

      // Check collected stars
      const time = Date.now() / 1000;
      const collisionRadius = isMobile ? RUNNER_CONFIG.mobile.starCollisionRadius : RUNNER_CONFIG.starCollisionRadius;

      state.stars.forEach((star) => {
        if (state.processedStars.has(star.id)) return;

        const x = star.x - state.scrollOffset;
        const bobOffset = Math.sin(time * RUNNER_CONFIG.starBobSpeed + star.id * 0.5) * RUNNER_CONFIG.starBobAmount;

        const playerCenterX = state.player.x + RUNNER_CONFIG.playerWidth / 2;
        const playerCenterY = state.player.y + RUNNER_CONFIG.playerHeight / 2;
        const dx = x - playerCenterX;
        const dy = (star.y + bobOffset) - playerCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < collisionRadius && !state.processedStars.has(star.id)) {
          state.processedStars.add(star.id);
          state.collectedStars.add(star.id);
          const newCount = state.collectedStars.size;
          setCollectedCount(newCount);

          if (newCount === RUNNER_CONFIG.requiredStars && !completionShownRef.current) {
            setShowComplete(true);
            setIsPaused(true);
            completionShownRef.current = true;
          }
        }
      });

      rendererRef.current.render(state, isMobile);
      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    const handleJump = () => {
      if (!isPaused) {
        GamePhysics.jump(gameStateRef.current);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleJump();
      }
    };

    canvas.addEventListener("click", handleJump);
    canvas.addEventListener("touchstart", handleJump, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("click", handleJump);
      canvas.removeEventListener("touchstart", handleJump);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPaused, isMobile]);

  const handleComplete = () => {
    onComplete(facts);
  };

  const handleRetry = () => {
    setShowGameOver(false);
    setShowComplete(false);
    setCollectedCount(0);
    setIsPaused(false);

    const state = gameStateRef.current;
    state.scrollOffset = 0;
    state.collectedStars = new Set<number>();
    state.processedStars = new Set<number>();
    state.missedStars = 0;
    state.player.y = state.groundY - RUNNER_CONFIG.playerHeight;
    state.player.vy = 0;

    const starCount = isMobile ? RUNNER_CONFIG.mobile.starCount : RUNNER_CONFIG.starCount;
    state.stars = [];
    for (let i = 0; i < starCount; i++) {
      const baseX = 600 + i * RUNNER_CONFIG.starSpacing;
      const heightVariation = i % 2 === 0 ? -200 : -130;
      state.stars.push({
        x: baseX,
        y: state.groundY + heightVariation,
        collected: false,
        id: i,
      });
    }

    completionShownRef.current = false;
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-label="Runner Quest Level"
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
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{
            borderColor: `${BYTE_BUBBLES_THEME.accent}40`,
            background: `${BYTE_BUBBLES_THEME.bubble}80`,
          }}
        >
          <Button variant="ghost" size="sm" onClick={onBack} aria-label="Return to map">
            ← Back to Map
          </Button>
          <div className="flex items-center gap-3">
            <span style={{ fontFamily: "'Anton', sans-serif", color: BYTE_BUBBLES_THEME.text }}>
              Level {levelId}
            </span>
            <span style={{ color: BYTE_BUBBLES_THEME.textSecondary }} aria-live="polite">
              ⭐ {collectedCount} / {RUNNER_CONFIG.requiredStars}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? "Resume game" : "Pause game"}
          >
            {isPaused ? "Resume" : "Pause"}
          </Button>
        </div>

        {/* Game Canvas */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ display: "block" }}
            role="img"
            aria-label="Game canvas - Collect jellyfish to progress"
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
              role="dialog"
              aria-label="Game Over"
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                style={{ width: "clamp(280px, 90%, 500px)" }}
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
                      className="text-sm md:text-lg"
                      style={{
                        fontFamily: "'Quicksand', sans-serif",
                        color: BYTE_BUBBLES_THEME.textSecondary,
                      }}
                    >
                      You didn't collect enough jellyfish! You collected {collectedCount} out of {RUNNER_CONFIG.requiredStars}.
                    </p>
                    <div className="flex gap-2 md:gap-4 justify-center flex-wrap">
                      <Button
                        size="sm"
                        onClick={handleRetry}
                        className="text-sm md:text-base px-4 md:px-6 py-2 md:py-4"
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
                        size="sm"
                        onClick={onBack}
                        variant="outline"
                        className="text-sm md:text-base px-4 md:px-6 py-2 md:py-4"
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
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="dialog"
              aria-label="Level Complete"
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                className="w-full max-w-2xl my-4"
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
                      className="text-xl md:text-2xl mb-2"
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
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start">
                      <div className="flex-shrink-0">
                        <motion.img
                          src="https://harmless-tapir-303.convex.cloud/api/storage/9fed1d7b-ec46-4101-a8ce-3fbe4fa47119"
                          alt="Player Avatar"
                          className="w-24 h-24 md:w-32 md:h-32 rounded-2xl"
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
                            <div><strong>Class:</strong> Creative Technologist / Data Analyst</div>
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

                    <div className="mt-4 text-center">
                      <Button
                        size="default"
                        onClick={handleComplete}
                        className="text-sm md:text-base px-4 md:px-6 py-2 md:py-4"
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