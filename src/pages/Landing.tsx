import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const modes = [
  {
    id: "classic",
    title: "Classic",
    description: "Traditional portfolio view with clean design",
    symbol: "📜", // kawaii vibe
    color: "#F5D1C3", // pastel pink
    path: "/classic",
  },
  {
    id: "story",
    title: "Story",
    description: "Immersive scroll-driven narrative experience",
    symbol: "🎐", // wind chime
    color: "#F8CBA6", // pastel orange
    path: "/story",
  },
  {
    id: "play",
    title: "Play",
    description: "Gamified exploration of projects and skills",
    symbol: "🎮",
    color: "#FDE7A9", // pastel yellow
    path: "/play",
  },
  {
    id: "ai",
    title: "AI Chat",
    description: "Interactive conversation about my work",
    symbol: "🧠",
    color: "#BAE1FF", // pastel blue
    path: "/ai",
  },
];

function SunflowerHead({ size = 96 }: { size: number }) {
  // Pure flower face (no stem), kawaii style: yellow petals + warm center
  const petalCount = 12;
  const petals = Array.from({ length: petalCount });
  const cx = 50;
  const cy = 50;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
      style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.12))" }}
    >
      {/* Petals */}
      {petals.map((_, i) => {
        const angle = (i * 360) / petalCount;
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy - 28}
            rx="10"
            ry="24"
            fill="#FDE68A"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth="0.5"
            transform={`rotate(${angle} ${cx} ${cy})`}
          />
        );
      })}
      {/* Inner ring */}
      <circle cx={cx} cy={cy} r="22" fill="#A16207" />
      {/* Center */}
      <circle cx={cx} cy={cy} r="16" fill="#8B5E34" />
    </svg>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Kawaii Sky Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #FDE7A9 0%, #F8CBA6 25%, #F5D1C3 55%, #BAE1FF 100%)",
        }}
      />

      {/* Gentle cloud puffs */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: -200 }}
            animate={{ x: "110%" }}
            transition={{ duration: 28 + i * 6, repeat: Infinity, ease: "linear", delay: i * 2 }}
            className="absolute top-10"
            style={{ top: `${8 + i * 12}%`, left: `${-20 - i * 8}%` }}
          >
            <div className="flex items-center gap-2">
              <div className="w-28 h-10 rounded-full bg-white/60 blur-[1px]" />
              <div className="w-16 h-8 rounded-full bg-white/50 blur-[1px]" />
            </div>
          </motion.div>
        ))}
      </div>

      

      {/* Flying sunflowers and petals in the wind */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Big sunflower heads drifting in a breeze (custom SVG heads only) */}
        {[...Array(10)].map((_, i) => {
          // deterministic pseudo-random per index
          const seed = Math.abs(Math.sin((i + 1) * 9876.543)) % 1;
          const r = (min: number, max: number) => min + (max - min) * seed;

          // Spread entries across the full left side and full vertical range
          const initialX = -320 - r(0, 240) - (i % 4) * 40; // wider random band so they don't stack
          const baseY = `${r(4, 92)}%`; // random vertical lane across full viewport
          const size = 136 + (i % 3) * 36 + r(-10, 24);
          const scale = r(0.9, 1.15);
          const depthOpacity = r(0.65, 1);
          const swayAmp = r(8, 18); // horizontal micro-sway remains
          const dur = prefersReducedMotion ? 0 : r(6.2, 9.2);
          const delay = prefersReducedMotion ? 0 : (i % 7) * 0.27 + r(0, 0.35);
          const repeatDelay = prefersReducedMotion ? 0 : r(0.4, 2.0); // desync after each cycle

          return (
            <motion.div
              key={`sf-${i}`}
              initial={{ x: initialX, y: 0, rotate: 0 }}
              animate={
                prefersReducedMotion
                  ? { x: initialX, y: 0, rotate: 0 }
                  : {
                      x: "115%",
                      y: 0,
                      rotate: [-4, 4 + r(-1, 1), -2, -4],
                    }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      duration: dur,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay,
                      repeatDelay, // break re-grouping on the left edge
                    }
              }
              className="absolute"
              style={{ top: baseY }}
            >
              {/* inner sway + depth */}
              <motion.div
                initial={{ x: 0, scale, opacity: depthOpacity }}
                animate={prefersReducedMotion ? { x: 0 } : { x: [-swayAmp, swayAmp, -swayAmp] }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: r(3.2, 5.0), repeat: Infinity, ease: "easeInOut" }
                }
              >
                <SunflowerHead size={size} />
              </motion.div>
            </motion.div>
          );
        })}

        {/* Petals drifting at various depths (faster to match breeze) */}
        {[...Array(12)].map((_, i) => {
          const seed = Math.abs(Math.sin((i + 3) * 3456.789)) % 1;
          const r = (min: number, max: number) => min + (max - min) * seed;
          const sway = r(6, 14);
          const dur = prefersReducedMotion ? 0 : 8.5 + (i % 5) + r(-1, 1.2);
          const delay = prefersReducedMotion ? 0 : (i % 4) * 0.4 + r(0, 0.4);
          const repeatDelay = prefersReducedMotion ? 0 : r(0.5, 2.2);
          const scale = r(0.85, 1.15);
          const opacity = r(0.6, 0.95);
          const baseY = `${r(3, 95)}%`; // randomized lanes instead of patterned modulo
          const initialX = -200 - r(0, 160) - i * 6;

          return (
            <motion.div
              key={`petal-${i}`}
              initial={{ x: initialX, y: 0, rotate: 0 }}
              animate={
                prefersReducedMotion
                  ? { x: initialX, y: 0, rotate: 0 }
                  : {
                      x: ["-15%", "115%"],
                      y: [0, r(-12, 12), 0],
                      rotate: [0, 24 + r(-8, 8), -12 + r(-6, 6), 0],
                    }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      duration: dur,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay,
                      repeatDelay, // avoid vertical stacking at the left edge
                    }
              }
              className="absolute"
              style={{ top: baseY }}
            >
              <motion.span
                className="text-[16px]"
                style={{
                  filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.12))",
                  opacity,
                }}
                animate={prefersReducedMotion ? { x: 0 } : { x: [-sway, sway, -sway] }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 2.6 + r(-0.6, 0.6), repeat: Infinity, ease: "easeInOut" }
                }
              >
                <span style={{ display: "inline-block", transform: `scale(${scale})` }}>🌼</span>
              </motion.span>
            </motion.div>
          )
        })}

        {/* Leaves for extra whimsy (sped up) */}
        {[...Array(8)].map((_, i) => {
          const seed = Math.abs(Math.sin((i + 5) * 2222.111)) % 1;
          const r = (min: number, max: number) => min + (max - min) * seed;
          const sway = r(10, 22);
          const dur = prefersReducedMotion ? 0 : 10.5 + i * 1.4 + r(-1, 1);
          const delay = prefersReducedMotion ? 0 : i * 0.35 + r(0, 0.3);
          const repeatDelay = prefersReducedMotion ? 0 : r(0.4, 1.8);
          const scale = r(0.9, 1.2);
          const opacity = r(0.7, 0.95);
          const baseY = `${r(5, 90)}%`;
          const initialX = -220 - r(0, 200) - i * 10;

          return (
            <motion.div
              key={`leaf-${i}`}
              initial={{ x: initialX, y: 0, rotate: -10 }}
              animate={
                prefersReducedMotion
                  ? { x: initialX, y: 0, rotate: -10 }
                  : {
                      x: "120%",
                      y: [0, r(-10, 10), 0],
                      rotate: [-10, 14 + r(-4, 4), -8 + r(-4, 4), -10],
                    }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: dur, repeat: Infinity, ease: "easeInOut", delay, repeatDelay }
              }
              className="absolute"
              style={{ top: baseY }}
            >
              <motion.span
                className="text-[18px] opacity-85"
                style={{ color: "#5F9595", opacity }}
                initial={{ x: 0, scale }}
                animate={prefersReducedMotion ? { x: 0 } : { x: [-sway, sway, -sway] }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 3.2 + r(-0.6, 0.8), repeat: Infinity, ease: "easeInOut" }
                }
              >
                🍃
              </motion.span>
            </motion.div>
          )
        })}
      </div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Name & Tagline (Studio Ghibli–inspired) */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <h1 className="font-serif tracking-tight text-5xl md:text-7xl text-slate-900 drop-shadow-[0_1px_0_rgba(255,255,255,0.7)]">
            <span
              className="inline-block"
              style={{
                letterSpacing: "0.5px",
                textShadow: "0 2px 0 rgba(255,255,255,0.9)",
              }}
            >
              Darshita Patel
            </span>
          </h1>
          <p
            className="mt-3 text-lg md:text-xl text-slate-700/90"
            style={{
              fontFamily: "ui-serif, Georgia, Cambria, Times New Roman, Times, serif",
              letterSpacing: "0.2px",
            }}
          >
            — a soul where logic and creativity hold hands
          </p>
        </motion.div>

        {/* Mode Selection Grid (kawaii cards) */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl w-full"
        >
          {modes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.08 * index }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group cursor-pointer"
              onClick={() => navigate(mode.path)}
            >
              <Card
                className="border-[1.5px] transition-all duration-300 h-full"
                style={{
                  backgroundColor: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(8px)",
                  borderColor: "rgba(0,0,0,0.06)",
                }}
              >
                <CardHeader className="text-center pb-3">
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-full grid place-items-center transition-transform duration-300"
                    style={{
                      backgroundColor: mode.color,
                      boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.06), 0 6px 12px rgba(0,0,0,0.06)",
                    }}
                  >
                    <span className="text-2xl">{mode.symbol}</span>
                  </div>
                  <CardTitle className="text-2xl text-slate-900 tracking-tight">
                    {mode.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-slate-700/80 text-base">
                    {mode.description}
                  </CardDescription>
                  <div className="mt-4">
                    <Button
                      size="sm"
                      className="rounded-full"
                      style={{
                        backgroundColor: mode.color,
                        color: "#1f2937",
                        borderColor: "rgba(0,0,0,0.08)",
                      }}
                      variant="outline"
                    >
                      Open
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <p className="text-slate-700/70 text-sm">
            Built with React, Convex, and a sprinkle of kawaii ✨
          </p>
        </motion.div>
      </div>
    </div>
  );
}