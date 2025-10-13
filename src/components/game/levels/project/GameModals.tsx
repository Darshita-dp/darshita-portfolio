import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BYTE_BUBBLES_THEME } from "@/lib/byteBubblesData";

interface Project {
  id: number;
  name: string;
  emoji: string;
  tech: string[];
  challenge: string;
  impact: string;
}

interface GameModalsProps {
  isPaused: boolean;
  showTransition: boolean;
  showComplete: boolean;
  transitionStep: number;
  projects: Project[];
  facts: string[];
  onResume: () => void;
  onExit: () => void;
  onComplete: (facts: string[]) => void;
}

const transitionMessages = [
  "Compiling Project Data...",
  "Verifying Tech Stacks...",
  "Generating Portfolio Report...",
];

export function GameModals({
  isPaused,
  showTransition,
  showComplete,
  transitionStep,
  projects,
  facts,
  onResume,
  onExit,
  onComplete,
}: GameModalsProps) {
  return (
    <>
      {/* Pause Menu */}
      {isPaused && (
        <motion.div
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Card className="max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-center" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                Assembly Paused
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p style={{ fontFamily: "'Nunito', sans-serif" }}>Resume when ready.</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={onResume}>Resume</Button>
                <Button variant="outline" onClick={onExit}>
                  Exit to Map
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Transition Sequence */}
      {showTransition && (
        <motion.div
          className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/70 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="text-center space-y-6">
            <motion.div
              className="text-3xl md:text-4xl font-bold mb-8"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                color: "#FFD36E",
                textShadow: "0 0 20px #FFD36E80",
              }}
            >
              🎉 ASSEMBLY COMPLETE
            </motion.div>
            <div className="space-y-3">
              {transitionMessages.slice(0, transitionStep + 1).map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.3 }}
                  className="text-lg"
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    color: "#fff",
                  }}
                >
                  {msg}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Victory Card */}
      {showComplete && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-2xl my-4"
          >
            <Card
              style={{
                background: `linear-gradient(135deg, ${BYTE_BUBBLES_THEME.bubble}98 0%, ${BYTE_BUBBLES_THEME.seafoam}95 100%)`,
                border: `3px solid ${BYTE_BUBBLES_THEME.accent}`,
                boxShadow: `0 0 40px ${BYTE_BUBBLES_THEME.accent}`,
              }}
            >
              <CardHeader className="text-center border-b pb-3">
                <CardTitle
                  className="text-xl md:text-2xl"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    color: BYTE_BUBBLES_THEME.text,
                  }}
                >
                  PROJECT FILE: VERIFIED ✅
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 pb-4">
                <div>
                  <h3
                    className="text-base font-bold mb-2"
                    style={{ fontFamily: "'Nunito', sans-serif", color: BYTE_BUBBLES_THEME.text }}
                  >
                    Recovered Project Nodes:
                  </h3>
                  <div className="space-y-1 text-xs" style={{ color: "#4A5568" }}>
                    {projects.map((project) => (
                      <p key={project.id}>
                        {project.emoji} <strong>{project.name}</strong> — {project.tech.join(" | ")}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-3">
                  <h3
                    className="text-base font-bold mb-2"
                    style={{ fontFamily: "'Nunito', sans-serif", color: BYTE_BUBBLES_THEME.text }}
                  >
                    Impact Highlights:
                  </h3>
                  <div className="space-y-1 text-xs" style={{ color: "#4A5568" }}>
                    <p>• 5 project modules reactivated from system archives</p>
                    <p>• Restored full cross-domain functionality: mobile, web, data, and visualization</p>
                    <p>• Demonstrated blend of creativity + logic powering every build</p>
                  </div>
                </div>

                <div className="border-t pt-3 space-y-1">
                  <p className="text-base font-bold" style={{ color: BYTE_BUBBLES_THEME.star }}>
                    XP Earned: +250
                  </p>
                  <p className="text-sm" style={{ color: "#4A5568" }}>
                    Badge Unlocked: 💻 "Full-Stack Innovator"
                  </p>
                  <p className="text-sm font-bold" style={{ color: BYTE_BUBBLES_THEME.text }}>
                    🏆 Achievement: "System Restored — All Projects Online!"
                  </p>
                </div>

                <Button
                  size="lg"
                  onClick={() => onComplete(facts)}
                  className="w-full text-base mt-3"
                  style={{
                    background: `linear-gradient(135deg, ${BYTE_BUBBLES_THEME.star} 0%, #FFC94A 100%)`,
                    fontFamily: "'Anton', sans-serif",
                  }}
                >
                  Continue → Next Mission
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
