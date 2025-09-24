import { motion } from "framer-motion";
import { Brain, Gamepad2, MousePointer, Scroll } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const modes = [
  {
    id: "classic",
    title: "Classic",
    description: "Traditional portfolio view with clean design",
    icon: MousePointer,
    color: "from-blue-500 to-cyan-500",
    path: "/classic"
  },
  {
    id: "story",
    title: "Story",
    description: "Immersive scroll-driven narrative experience",
    icon: Scroll,
    color: "from-purple-500 to-pink-500",
    path: "/story"
  },
  {
    id: "play",
    title: "Play",
    description: "Gamified exploration of projects and skills",
    icon: Gamepad2,
    color: "from-green-500 to-emerald-500",
    path: "/play"
  },
  {
    id: "ai",
    title: "AI Chat",
    description: "Interactive conversation about my work",
    icon: Brain,
    color: "from-orange-500 to-red-500",
    path: "/ai"
  }
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="mb-6">
            <img
              src="./logo.svg"
              alt="Darshita Patel"
              width={80}
              height={80}
              className="mx-auto rounded-full border-4 border-white/20 backdrop-blur-sm"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            Darshita Patel
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-2">
            Full-Stack Developer & Systems Thinker
          </p>
          <p className="text-lg text-white/60">
            Choose your exploration mode
          </p>
        </motion.div>

        {/* Mode Selection Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full"
        >
          {modes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group cursor-pointer"
              onClick={() => navigate(mode.path)}
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${mode.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <mode.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-white group-hover:text-white/90 transition-colors">
                    {mode.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-white/70 text-lg">
                    {mode.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-white/50 text-sm">
            Built with React, Convex, and creative passion
          </p>
        </motion.div>
      </div>
    </div>
  );
}