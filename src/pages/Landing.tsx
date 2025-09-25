import { motion } from "framer-motion";
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

export default function Landing() {
  const navigate = useNavigate();

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
        {/* Big sunflower heads drifting in a breeze (no stems or circular base) */}
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={`sf-${i}`}
            initial={{ x: -140 - i * 30, y: 6 + i * 9, rotate: 0 }}
            animate={{
              x: "110%",
              y: [8 + i * 8, 4 + i * 7, 10 + i * 9, 8 + i * 8],
              rotate: [-3, 5, -4, -3],
            }}
            transition={{
              duration: 12 + (i % 4) * 2, // faster
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.6,
            }}
            className="absolute"
            style={{ top: `${6 + i * 8}%` }}
          >
            <span
              className="drop-shadow"
              style={{
                fontSize: `${44 + (i % 3) * 10}px`, // bigger flower heads
                filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.12))",
              }}
            >
              🌻
            </span>
          </motion.div>
        ))}

        {/* Petals drifting at various depths (slightly faster to match breeze) */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`petal-${i}`}
            initial={{ x: 120 + i * 30, y: -20 - i * 6, rotate: 0 }}
            animate={{
              x: ["-10%", "110%"],
              y: [i * 4, i * 6 + 8, i * 4],
              rotate: [0, 18, -10, 0],
            }}
            transition={{
              duration: 14 + (i % 5) * 2, // faster
              repeat: Infinity,
              ease: "easeInOut",
              delay: (i % 4) * 0.6,
            }}
            className="absolute"
            style={{ top: `${(i * 7) % 90}%` }}
          >
            <span className="text-[14px]" style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.12))" }}>🌼</span>
          </motion.div>
        ))}

        {/* Leaves for extra whimsy (slightly faster) */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`leaf-${i}`}
            initial={{ x: -80 - i * 20, y: 6 + i * 10, rotate: -10 }}
            animate={{
              x: "115%",
              y: [6 + i * 10, 10 + i * 12, 4 + i * 8, 6 + i * 10],
              rotate: [-8, 12, -6, -8],
            }}
            transition={{ duration: 18 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            className="absolute"
            style={{ top: `${6 + i * 9}%` }}
          >
            <span className="text-[16px] opacity-80" style={{ color: "#5F9595" }}>🍃</span>
          </motion.div>
        ))}
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