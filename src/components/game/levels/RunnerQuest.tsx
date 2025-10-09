import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GAME_PALETTE, type LevelData } from '@/lib/gameData';
import { FactCard } from '@/components/game/FactCard';

interface RunnerQuestProps {
  level: LevelData;
  onComplete: (factsCollected: number) => void;
  onBack: () => void;
}

type Star = { x: number; y: number; r: number; collected: boolean };
type Platform = { x: number; y: number; w: number; h: number };

export function RunnerQuest({ level, onComplete, onBack }: RunnerQuestProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [collectedCount, setCollectedCount] = useState(0);
  const [showMissMsg, setShowMissMsg] = useState(false);
  const [currentFact, setCurrentFact] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const playerRef = useRef({ x: 80, y: 0, vy: 0, size: 28 });
  const groundRef = useRef({ y: 0 });
  const starsRef = useRef<Star[]>([]);
  const platformsRef = useRef<Platform[]>([]);
  const lastSpawnRef = useRef({ star: 0, platform: 0 });
  const timeRef = useRef(0);
  const inputRef = useRef({ jumpRequested: false });

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = container.getBoundingClientRect();
    const width = Math.max(320, Math.floor(rect.width));
    const height = Math.floor(Math.min(480, Math.max(300, rect.height * 0.6)));

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const groundY = height - 50;
    groundRef.current.y = groundY;
    playerRef.current.y = groundY - playerRef.current.size;
  };

  const requestJump = () => {
    inputRef.current.jumpRequested = true;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        requestJump();
      }
    };
    window.addEventListener('keydown', onKey, { passive: false });
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onResize = () => resizeCanvas();
    window.addEventListener('resize', onResize);
    resizeCanvas();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
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
      const r = 12;
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
      grad.addColorStop(0, GAME_PALETTE.bgStart);
      grad.addColorStop(0.5, GAME_PALETTE.bgMid);
      grad.addColorStop(1, GAME_PALETTE.bgEnd);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = GAME_PALETTE.accent;
      ctx.fillRect(0, groundRef.current.y, width, height - groundRef.current.y);
    };

    const drawPlayer = () => {
      const p = playerRef.current;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = GAME_PALETTE.bubble;
      ctx.strokeStyle = GAME_PALETTE.textPrimary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -p.size / 2, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    const drawStar = (s: Star) => {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.fillStyle = GAME_PALETTE.star;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const x = Math.cos(angle) * s.r;
        const y = Math.sin(angle) * s.r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawPlatform = (pl: Platform) => {
      ctx.fillStyle = GAME_PALETTE.highlight;
      ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
    };

    const step = () => {
      timeRef.current += 1;
      const p = playerRef.current;
      p.vy += gravity;

      const onGround = p.y >= groundRef.current.y - p.size;
      if (onGround) {
        p.y = groundRef.current.y - p.size;
        p.vy = 0;
      }

      if (inputRef.current.jumpRequested && onGround) {
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
        setTimeout(() => setShowMissMsg(false), 1600);
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
            if (next <= level.facts.length) {
              setCurrentFact(level.facts[next - 1]);
              setTimeout(() => setCurrentFact(null), 4000);
            }
            if (next >= level.facts.length) {
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
  }, [level.facts]);

  return (
    <div
      className="fixed inset-0"
      style={{
        background: `linear-gradient(180deg, ${GAME_PALETTE.bgStart} 0%, ${GAME_PALETTE.bgEnd} 100%)`
      }}
    >
      <header className="relative z-10 p-4 flex items-center justify-between backdrop-blur-sm bg-white/80">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Back to Map
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{level.emoji}</span>
          <span className="font-medium">{level.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl">⭐</span>
          <span className="text-sm font-medium">
            {collectedCount} / {level.facts.length}
          </span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div
              ref={containerRef}
              className="w-full touch-none select-none"
              onMouseDown={requestJump}
              onTouchStart={(e) => {
                e.preventDefault();
                requestJump();
              }}
            >
              <canvas ref={canvasRef} className="w-full block cursor-pointer" />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Press Space or Tap to Jump
              </div>
              <AnimatePresence>
                {showMissMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xs rounded-full px-3 py-1 bg-amber-100 text-amber-900"
                  >
                    You missed that star... but you still earned XP!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>

      {currentFact && (
        <FactCard fact={currentFact} show={true} onClose={() => setCurrentFact(null)} />
      )}

      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Card className="max-w-md backdrop-blur-md bg-white/95">
                <CardHeader>
                  <CardTitle className="text-center text-2xl">
                    Level Complete! 🎉
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-center">
                    You collected all {level.facts.length} stars!
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={onBack} className="flex-1">
                      Back to Map
                    </Button>
                    <Button
                      onClick={() => onComplete(collectedCount)}
                      className="flex-1"
                      style={{ backgroundColor: GAME_PALETTE.success }}
                    >
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
