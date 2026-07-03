import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Project {
  id: number;
  name: string;
  emoji: string;
  tech: string[];
  challenge: string;
  impact: string;
}

interface ProjectCardProps {
  project: Project;
  isLastProject: boolean;
  onNext: () => void;
}

export function ProjectCard({ project, isLastProject, onNext }: ProjectCardProps) {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-[92vw] sm:max-w-2xl mx-auto relative"
      >
        {/* Floating bubbles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`popup-bubble-${i}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${15 + Math.random() * 25}px`,
              height: `${15 + Math.random() * 25}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle at 35% 25%, rgba(255,255,255,0.6), rgba(135,206,250,0.4))`,
              border: "1px solid rgba(255,255,255,0.3)",
              zIndex: -1,
            }}
            animate={{
              y: [0, -30 - Math.random() * 50],
              opacity: [0.3, 0.6, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Glowing jellyfish */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={`popup-jellyfish-${i}`}
            className="absolute pointer-events-none"
            style={{
              width: "40px",
              height: "40px",
              left: `${20 + i * 30}%`,
              top: `${10 + Math.random() * 80}%`,
              zIndex: -1,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "radial-gradient(circle, rgba(126,227,199,0.6), rgba(112,227,196,0.3))",
                borderRadius: "50%",
                boxShadow: "0 0 20px rgba(126,227,199,0.8)",
              }}
            />
          </motion.div>
        ))}

        {/* Badge acquired text */}
        <motion.div
          className="absolute -top-8 left-1/2 -translate-x-1/2 text-lg font-bold"
          style={{
            color: "#E7FDFB",
            fontFamily: "'Orbitron', sans-serif",
            textShadow: "0 0 10px #7EE3C7",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0, 1, 1, 0], y: [20, -10, -10, -30] }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          Tech Badge Acquired!
        </motion.div>

        {/* XP Float */}
        <motion.div
          className="absolute -top-14 left-1/2 -translate-x-1/2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold"
          style={{
            background: "#B8F1D2",
            color: "#025B47",
            fontFamily: "'Nunito', sans-serif",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: [0, 1, 1, 0], y: [30, 0, 0, -20] }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
        >
          +40 XP
        </motion.div>

        <Card
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "2px solid #7EE3C7",
            borderRadius: "16px",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 30px rgba(126,227,199,0.5), 0 4px 16px rgba(0, 0, 0, 0.2)",
            padding: "clamp(1.25rem, 3.5vw, 2rem)",
          }}
        >
          <CardHeader className="p-0 mb-3 sm:mb-4 text-center">
            <div className="text-4xl mb-2">{project.emoji}</div>
            <CardTitle
              style={{
                fontFamily: "'Orbitron', sans-serif",
                color: "#072C3E",
                fontWeight: 700,
                fontSize: "clamp(1rem, 3.5vw, 1.75rem)",
              }}
            >
              {project.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-0">
            <div>
              <h4
                className="font-bold mb-2"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  color: "#072C3E",
                  fontSize: "clamp(0.85rem, 2.3vw, 1rem)",
                }}
              >
                Tech Stack:
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs sm:text-sm"
                    style={{
                      background: "rgba(112,227,196,0.3)",
                      color: "#C8FAEA",
                      border: "1px solid #7EE3C7",
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4
                className="font-bold mb-2"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  color: "#072C3E",
                  fontSize: "clamp(0.85rem, 2.3vw, 1rem)",
                }}
              >
                Challenge:
              </h4>
              <p
                style={{
                  color: "#C8FAEA",
                  fontSize: "clamp(0.8rem, 1.9vw, 0.95rem)",
                }}
              >
                {project.challenge}
              </p>
            </div>
            <div>
              <h4
                className="font-bold mb-2"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  color: "#072C3E",
                  fontSize: "clamp(0.85rem, 2.3vw, 1rem)",
                }}
              >
                Impact:
              </h4>
              <p
                style={{
                  color: "#C8FAEA",
                  fontSize: "clamp(0.8rem, 1.9vw, 0.95rem)",
                }}
              >
                {project.impact}
              </p>
            </div>
            <Button
              size="lg"
              onClick={onNext}
              className="w-full mt-4 relative overflow-hidden group"
              style={{
                background: "linear-gradient(135deg, #70E3C4, #47C7B0)",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 600,
                color: "#072C3E",
                borderRadius: "9999px",
                padding: "clamp(0.65rem, 2vw, 0.8rem)",
                fontSize: "clamp(0.85rem, 2.3vw, 1.125rem)",
                minHeight: "44px",
                border: "2px solid #7EE3C7",
                boxShadow: "0 0 15px rgba(126,227,199,0.4)",
                transition: "all 0.3s ease",
              }}
            >
              {isLastProject ? "Complete Assembly →" : "Next Project →"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
