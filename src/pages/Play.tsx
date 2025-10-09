import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Star = { x: number; y: number; r: number; collected: boolean };
type Platform = { x: number; y: number; w: number; h: number };

const SNIPPETS: Array<string> = [
  "Hi, I’m Darshita 👩‍💻 – MS in Information Systems with a 4.0 GPA.",
  "I built SmartPlanner 📅, an iOS app in SwiftUI using Core Data & MVVM.",
  "I worked as a Graduate Teaching Assistant 👩‍🏫 for IT courses at Illinois State University.",
  "I interned at NGOs 🌍 building websites & dashboards that helped community projects.",
  "I love Studio Ghibli art style 🎨 and blending creativity with IT."
];

export default function Play() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // Game state
  const [collectedCount, setCollectedCount] = useState<number>(0);
  const [showMissMsg, setShowMissMsg] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  // Internal state stored in refs to avoid rerenders per frame
  const playerRef = useRef({
    x: 80,
    y: 0,
    vy: 0,
    size: 28
  });
  const groundRef = useRef({ y: 0 });
  const starsRef = useRef<Array<Star>>([]);
  const platformsRef = useRef<Array<Platform>>([]);
  const lastSpawnRef = useRef({ star: 0, platform: 0 });
  const timeRef = useRef(0);
  const inputRef = useRef({ jumpRequested: false, canJump: true });

  // Resize canvas to fit container with DPR
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

  // Input handlers
  const requestJump = () => {
    inputRef.current.jumpRequested = true;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        requestJump();
      }
    };
    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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

    // Init level
    starsRef.current = [];
    platformsRef.current = [];
    lastSpawnRef.current = { star: 0, platform: 0 };
    timeRef.current = 0;
    setCollectedCount(0);
    setShowMissMsg(false);
    setCompleted(false);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    // Helper: spawn star
    const spawnStar = () => {
      const yMin = 80;
      const yMax = groundRef.current.y - 90;
      const y = Math.max(yMin, Math.min(yMax, Math.random() * (yMax - yMin) + yMin));
      const r = 10 + Math.random() * 6;
      starsRef.current.push({ x: width + 30, y, r, collected: false });
    };

    // Helper: spawn simple platforms (visual + optional landing)
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
      // Soft gradient sky
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "oklch(92% 0.06 280)");
      grad.addColorStop(1, "oklch(98% 0.02 280)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Decorative hearts/clouds
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = "oklch(70% 0.12 320)";
      for (let i = 0; i < 6; i++) {
        const cx = ((i * 150 + timeRef.current * 20) % (width + 200)) - 100;
        const cy = 60 + (i % 2) * 24;
        ctx.beginPath();
        ctx.arc(cx, cy, 22, 0, Math.PI * 2);
        ctx.arc(cx + 28, cy, 22, 0, Math.PI * 2);
        ctx.fillRect(cx - 10, cy, 48, 24);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Ground
      ctx.fillStyle = "oklch(94% 0.02 150)";
      ctx.fillRect(0, groundRef.current.y, width, height - groundRef.current.y);
      // Ground stripe
      ctx.fillStyle = "oklch(85% 0.04 150)";
      ctx.fillRect(0, groundRef.current.y, width, 6);
    };

    const drawPlayer = () => {
      const p = playerRef.current;
      // Cute rounded chibi body
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = "oklch(75% 0.16 320)"; // pink body
      ctx.strokeStyle = "oklch(40% 0.03 280)";
      ctx.lineWidth = 1.5;

      // Body
      const bodyW = p.size * 1.2;
      const bodyH = p.size * 1.1;
      roundRect(ctx, -bodyW / 2, -bodyH, bodyW, bodyH, 10);
      ctx.fill();
      ctx.stroke();

      // Face
      ctx.fillStyle = "oklch(98% 0.01 280)";
      roundRect(ctx, -bodyW / 2 + 6, -bodyH + 8, bodyW - 12, bodyH * 0.55, 8);
      ctx.fill();

      // Eyes
      ctx.fillStyle = "oklch(20% 0.04 280)";
      ctx.beginPath();
      ctx.arc(-8, -bodyH + 24, 2.8, 0, Math.PI * 2);
      ctx.arc(8, -bodyH + 24, 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Simple run "legs" animation
      const t = timeRef.current;
      const legOffset = Math.sin(t * 0.4) * 4;
      ctx.fillStyle = "oklch(40% 0.03 280)";
      roundRect(ctx, -10, -6 + legOffset, 8, 10, 3);
      roundRect(ctx, 2, -6 - legOffset, 8, 10, 3);
      ctx.restore();
    };

    const drawStar = (s: Star) => {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.fillStyle = "oklch(90% 0.2 90)";
      drawStarPath(ctx, s.r, 5, 0.5);
      ctx.fill();
      ctx.restore();
    };

    const drawPlatform = (pl: Platform) => {
      ctx.save();
      ctx.fillStyle = "oklch(92% 0.03 180)";
      roundRect(ctx, pl.x, pl.y, pl.w, pl.h, 6);
      ctx.fill();
      // Cute sprinkles
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = "oklch(70% 0.16 320)";
      for (let i = 0; i < 6; i++) {
        const sx = pl.x + 8 + (i * (pl.w - 16)) / 5;
        const sy = pl.y + 3 + (i % 2) * 3;
        ctx.fillRect(sx, sy, 6, 2);
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    };

    const step = () => {
      timeRef.current += 1;

      // Physics: gravity
      const p = playerRef.current;
      p.vy += gravity;

      // Jump once when on ground or lightly above ground; allow landing on platforms
      const onGround = p.y >= groundRef.current.y - p.size - 0.1;
      const standingPlatform = platformsRef.current.find((pl) => {
        const withinX = p.x > pl.x - p.size / 2 && p.x < pl.x + pl.w + p.size / 2;
        const standing =
          p.y + 2 >= pl.y - p.size && p.y <= pl.y - p.size + 6 && p.vy >= 0;
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

      // Spawn stars every ~1.8s
      if (timeRef.current - lastSpawnRef.current.star > 110) {
        spawnStar();
        lastSpawnRef.current.star = timeRef.current;
      }
      // Spawn platforms every ~2.5s
      if (timeRef.current - lastSpawnRef.current.platform > 150) {
        spawnPlatform();
        lastSpawnRef.current.platform = timeRef.current;
      }

      // Move and cleanup stars
      starsRef.current.forEach((s) => (s.x -= speed));
      const before = starsRef.current.length;
      starsRef.current = starsRef.current.filter((s) => s.x > -30 && !s.collected);
      const removed = before - starsRef.current.length;
      if (removed > 0) {
        // A star left the screen uncollected -> show playful miss message
        setShowMissMsg(true);
        window.setTimeout(() => setShowMissMsg(false), 1600);
      }

      // Move and cleanup platforms
      platformsRef.current.forEach((pl) => (pl.x -= speed));
      platformsRef.current = platformsRef.current.filter((pl) => pl.x + pl.w > -20);

      // Collect stars (circle-rect approx by point distance to player center)
      for (const s of starsRef.current) {
        const dx = s.x - p.x;
        const dy = s.y - (p.y - p.size / 2);
        const dist = Math.hypot(dx, dy);
        if (dist < s.r + p.size * 0.6) {
          s.collected = true;
          setCollectedCount((prev) => {
            const next = prev + 1;
            if (next >= SNIPPETS.length) {
              setCompleted(true);
            }
            return next;
          });
        }
      }

      // Draw
      ctx.save();
      ctx.scale(dpr, dpr);
      drawBackground();
      platformsRef.current.forEach(drawPlatform);
      starsRef.current.forEach(drawStar);
      drawPlayer();
      ctx.restore();

      // End condition guard (keep loop running for confetti vibe if needed)
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="flex items-center gap-2">
            ← Back to Modes
          </Button>
          <div className="text-sm opacity-70">Play Mode · Jump with Space or Tap</div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          {/* Game Board */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="tracking-tight">Star Runner 🌸</CardTitle>
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

              {/* Floating overlays */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⭐</span>
                  <span className="text-sm font-medium">
                    Collected {collectedCount} / {SNIPPETS.length}
                  </span>
                </div>
                <AnimatePresence>
                  {showMissMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-xs rounded-full px-3 py-1 bg-amber-100 text-amber-900 dark:bg-amber-200/20 dark:text-amber-200"
                    >
                      Oops! You missed this one… but you can always check my resume!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Snippets / Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="tracking-tight">Learn about me 💖</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {SNIPPETS.map((text, i) => {
                  const unlocked = i < collectedCount;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: unlocked ? 1 : 0.4, x: 0 }}
                      className={`rounded-lg px-3 py-2 border ${unlocked ? "bg-white/70 dark:bg-slate-900/60" : "bg-muted/40"}`}
                    >
                      <div className="flex items-start gap-2">
                        <span className={`mt-0.5 ${unlocked ? "" : "opacity-60"}`}>⭐</span>
                        <p className="text-sm">{unlocked ? text : "Locked – collect a star to reveal ✨"}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>

            <AnimatePresence>
              {completed && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  <Card className="border-primary/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="tracking-tight">You’ve learned my story 🌸</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm opacity-80">
                        Thanks for playing! Want to connect?
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" onClick={() => navigate("/classic")}>
                          Resume
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
                            LinkedIn
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helpers
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
