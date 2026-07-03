import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BYTE_BUBBLES_THEME } from "@/lib/byteBubblesData";
import { MEMORY_CONFIG } from "./MemoryGameConfig";

interface MemoryGameModalsProps {
  isPaused: boolean;
  showTransition: boolean;
  showComplete: boolean;
  transitionStep: number;
  xp: number;
  onResume: () => void;
  onExit: () => void;
  onComplete: (facts: string[]) => void;
  facts: string[];
}

export function MemoryGameModals({
  isPaused,
  showTransition,
  showComplete,
  transitionStep,
  xp,
  onResume,
  onExit,
  onComplete,
  facts,
}: MemoryGameModalsProps) {
  return (
    <>
      {/* Pause Menu */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
            >
              <Card className="max-w-md mx-4">
                <CardHeader>
                  <CardTitle
                    className="text-center text-xl"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    Training Sequence Paused
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p style={{ fontFamily: "'Nunito', sans-serif" }}>
                    Take a breather, Player. Resume when your data stream's stable.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={onResume}>Resume Training</Button>
                    <Button variant="outline" onClick={onExit}>
                      Exit to Map
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transition Sequence */}
      <AnimatePresence>
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
                  color: BYTE_BUBBLES_THEME.star,
                  textShadow: `0 0 20px ${BYTE_BUBBLES_THEME.star}80`,
                }}
              >
                💡 DATA CUBE ASSEMBLED
              </motion.div>
              <div className="text-xl" style={{ color: BYTE_BUBBLES_THEME.seafoam }}>
                Training Sequence Complete.
              </div>
              <div className="space-y-3 mt-8">
                {MEMORY_CONFIG.TRANSITION_MESSAGES.slice(0, transitionStep + 1).map((msg, i) => (
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
      </AnimatePresence>

      {/* Victory Card */}
      <AnimatePresence>
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
              exit={{ scale: 0.8, y: 20 }}
              className="w-full max-w-3xl my-8"
            >
              <Card
                className="overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${BYTE_BUBBLES_THEME.bubble}98 0%, ${BYTE_BUBBLES_THEME.seafoam}95 100%)`,
                  border: `3px solid ${BYTE_BUBBLES_THEME.accent}`,
                  boxShadow: `0 0 40px ${BYTE_BUBBLES_THEME.accent}`,
                }}
              >
                <CardHeader className="text-center border-b pb-4">
                  <CardTitle
                    className="text-2xl md:text-3xl"
                    style={{
                      fontFamily: "'Orbitron', sans-serif",
                      color: BYTE_BUBBLES_THEME.text,
                    }}
                  >
                    EDUCATION FILE: VERIFIED ✅
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6 max-h-[60vh] overflow-y-auto">
                  {/* Level-Up Path */}
                  <div>
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{ fontFamily: "'Nunito', sans-serif", color: BYTE_BUBBLES_THEME.text }}
                    >
                      Level-Up Path:
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p>Master's in Information Systems – Illinois State University</p>
                      <p>📘 GPA: 4.0 — MAX RANK</p>
                    </div>
                  </div>

                  {/* Core Modules */}
                  <div>
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{ fontFamily: "'Nunito', sans-serif", color: BYTE_BUBBLES_THEME.text }}
                    >
                      Core Modules Unlocked:
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p>📊 Data Analysis | Data Visualization | Business Analytics</p>
                      <p>⚙️ Web Development Technologies | Systems Analysis & Design</p>
                      <p>🗂️ IT Project Management | Advanced System Design</p>
                    </div>
                  </div>

                  {/* Skill Upgrades */}
                  <div>
                    <h3
                      className="text-lg font-bold mb-3"
                      style={{ fontFamily: "'Nunito', sans-serif", color: BYTE_BUBBLES_THEME.text }}
                    >
                      Skill Upgrades:
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-semibold">🧮 Data Engineering & Databases:</p>
                        <p className="ml-4">- ETL Pipelines</p>
                        <p className="ml-4">- Dimensional Data Modeling (Star | Snowflake Schemas)</p>
                        <p className="ml-4">- Data Warehousing</p>
                        <p className="ml-4">- SQL (MySQL | Oracle)</p>
                        <p className="ml-4">- Cloud Platforms</p>
                      </div>
                      <div>
                        <p className="font-semibold">💻 Programming & Analysis:</p>
                        <p className="ml-4">- Python | R | C++ | Java</p>
                        <p className="ml-4">- Statistical Analysis | Forecasting</p>
                        <p className="ml-4">- Advanced Excel | MS Office Suite</p>
                      </div>
                      <div>
                        <p className="font-semibold">📊 BI & Visualization:</p>
                        <p className="ml-4">- Power BI (DAX | M Code | Dataflows | Publishing)</p>
                        <p className="ml-4">- Tableau | Looker Studio | Google Data Studio</p>
                      </div>
                      <div>
                        <p className="font-semibold">🧰 Tools & Methodologies:</p>
                        <p className="ml-4">- Git | JIRA | Agile (Scrum) | SDLC</p>
                        <p className="ml-4">- Requirements Elicitation | Systems Analysis</p>
                        <p className="ml-4">- UNIX/Linux | Windows OS</p>
                      </div>
                      <div>
                        <p className="font-semibold">🧩 Soft Skill Enhancements:</p>
                        <p className="ml-4">- Teamwork | Leadership | Critical Thinking</p>
                      </div>
                    </div>
                  </div>

                  {/* XP and Badge */}
                  <div className="border-t pt-4 space-y-2">
                    <p className="text-lg font-bold" style={{ color: BYTE_BUBBLES_THEME.star }}>
                      XP Earned: +{xp}
                    </p>
                    <p className="text-base">
                      New Badge: "Data Architect Apprentice" 🧠
                    </p>
                  </div>

                  {/* Achievement */}
                  <div className="text-center py-4">
                    <p
                      className="text-lg font-bold"
                      style={{
                        fontFamily: "'Orbitron', sans-serif",
                        color: BYTE_BUBBLES_THEME.text,
                      }}
                    >
                      🏆 Achievement Unlocked: "From Learner to Level-Up Master!"
                    </p>
                  </div>

                  {/* Continue Button */}
                  <Button
                    size="lg"
                    onClick={() => onComplete(facts)}
                    className="w-full text-lg"
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
      </AnimatePresence>
    </>
  );
}
