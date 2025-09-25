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
    color: "#CC97C1", // pastel violet
    path: "/story",
  },
  {
    id: "play",
    title: "Play",
    description: "Gamified exploration of projects and skills",
    symbol: "🎮",
    color: "#5F9595", // sea green
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
            "linear-gradient(180deg, #F5D1C3 0%, #F5D1C3 10%, #F3D9EF 35%, #E7D6F0 55%, #CFEAFA 80%, #BAE1FF 100%)",
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

      {/* Water band with subtle waves */}
      <div className="absolute left-0 right-0 bottom-0 h-[36vh]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(186,225,255,0.85) 0%, rgba(186,225,255,0.95) 40%, rgba(186,225,255,1) 100%)",
          }}
        />
        {/* Animated wave strips */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: "-20%" }}
            animate={{ x: "20%" }}
            transition={{ duration: 6 + i * 2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            className="absolute left-0 right-0"
            style={{
              bottom: `${8 + i * 10}%`,
              height: 12,
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.25) 100%)",
              maskImage:
                "radial-gradient(14px 8px at 10% 50%, black 60%, transparent 62%), radial-gradient(14px 8px at 30% 50%, black 60%, transparent 62%), radial-gradient(14px 8px at 50% 50%, black 60%, transparent 62%), radial-gradient(14px 8px at 70% 50%, black 60%, transparent 62%), radial-gradient(14px 8px at 90% 50%, black 60%, transparent 62%)",
              WebkitMaskImage:
                "radial-gradient(14px 8px at 10% 50%, black 60%, transparent 62%), radial-gradient(14px 8px at 30% 50%, black 60%, transparent 62%), radial-gradient(14px 8px at 50% 50%, black 60%, transparent 62%), radial-gradient(14px 8px at 70% 50%, black 60%, transparent 62%), radial-gradient(14px 8px at 90% 50%, black 60%, transparent 62%)",
            }}
          />
        ))}
      </div>

      {/* Floating sunflowers on the water */}
      <div className="pointer-events-none absolute left-0 right-0 bottom-[8vh]">
        {[
          { left: "6%" },
          { left: "22%" },
          { left: "38%" },
          { left: "56%" },
          { left: "74%" },
          { left: "88%" },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: pos.left }}
            initial={{ y: 0, rotate: 0 }}
            animate={{ y: [-4, 2, -4], rotate: [0, 1.5, 0] }}
            transition={{ duration: 3.8 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Stem */}
            <div
              className="mx-auto"
              style={{
                width: 4,
                height: 42,
                backgroundColor: "#5F9595",
                borderRadius: 4,
                boxShadow: "0 0 0 1px rgba(0,0,0,0.04) inset",
              }}
            />
            {/* Flower head */}
            <div
              className="mx-auto grid place-items-center"
              style={{
                width: 56,
                height: 56,
                transform: "translateY(-6px)",
                borderRadius: "9999px",
                background:
                  "radial-gradient(circle at 50% 50%, #E3A14C 0%, #D28934 55%, #B66D1A 56%, #F5D1C3 57%, #F5D1C3 100%)",
                boxShadow:
                  "0 1px 0 rgba(0,0,0,0.04), 0 6px 10px rgba(0,0,0,0.08), inset 0 -1px 0 rgba(0,0,0,0.06)",
              }}
            >
              <span className="text-xl">🌻</span>
            </div>
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