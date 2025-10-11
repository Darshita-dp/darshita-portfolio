import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BYTE_BUBBLES_THEME } from "@/lib/byteBubblesData";

interface DecodeJourneyProps {
  levelId: number;
  facts: string[];
  onComplete: (factsCollected: string[]) => void;
  onBack: () => void;
}

interface Challenge {
  prompt: string;
  options: string[];
  correct: number;
  reveal: {
    title: string;
    summary: string;
    impact: string[];
    skills: string;
  };
}

const CHALLENGES: Challenge[] = [
  {
    prompt: "💻 At Illinois State University, Darshita taught over 150 students twice a week. Which role was this?",
    options: [
      "A) Research Assistant",
      "B) Graduate Teaching Assistant",
      "C) Tutor",
      "D) Lab Monitor"
    ],
    correct: 1,
    reveal: {
      title: "🎓 Graduate Teaching Assistant — Illinois State University",
      summary: "Delivered IT150 labs for 150+ students twice weekly using Microsoft Office Suite (Excel | Word | Access | PowerPoint). Strengthened communication, mentorship, and technical teaching.",
      impact: [
        "Conducted 12 labs per week",
        "Delivered structured tutorials",
        "Helped students master core IT tools"
      ],
      skills: "Teaching | Leadership | MS Suite | Communication"
    }
  },
  {
    prompt: "🌊 At CIIWAS NGO (Normal, IL | 08/2024–12/2024), which outcome is true?",
    options: [
      "A) Built marketing emails",
      "B) Created interactive web modules and dashboards for 100+ women learners",
      "C) Designed event flyers",
      "D) Managed surveys"
    ],
    correct: 1,
    reveal: {
      title: "🌊 Data & Web Development Intern — CIIWAS NGO",
      summary: "Centralized workshop resources and transformed raw program data into structured dashboards used by 100+ women to track IT learning progress.",
      impact: [
        "Registration efficiency ↑ 25%",
        "Automated MySQL pipelines",
        "React visual dashboards for outcomes"
      ],
      skills: "React | MySQL | Python | Data Visualization"
    }
  },
  {
    prompt: "🏭 At GMP MachPro (India | 01/2023–06/2023), what production impact did her analysis drive?",
    options: [
      "A) No measurable change",
      "B) Rejection rate increased",
      "C) Downtime reduced by 8%",
      "D) Forecast accuracy decreased"
    ],
    correct: 2,
    reveal: {
      title: "🏭 Data Analyst Intern — GMP MachPro",
      summary: "Analyzed production datasets from granulation and liquid packaging lines to identify efficiency gaps and improve manufacturing performance.",
      impact: [
        "Downtime ↓ 8%",
        "Operational savings achieved",
        "Real-time KPIs monitored through Power BI"
      ],
      skills: "Power BI | SQL | Data Analytics | Operations"
    }
  },
  {
    prompt: "🤝 At ORANGESNGO (India | 04/2022–12/2022), what was the key measurable result?",
    options: [
      "A) Donor participation dropped by 25%",
      "B) Donor participation increased by 25% in 2 months",
      "C) No change",
      "D) Only 2% improvement"
    ],
    correct: 1,
    reveal: {
      title: "🤝 IT Data Analyst Intern — ORANGESNGO",
      summary: "Standardized donor datasets from 80+ regions, improving pipelines and uncovering insights that boosted donor engagement.",
      impact: [
        "Donor participation ↑ 25% in 2 months",
        "Reporting accuracy improved",
        "2,000+ beneficiaries tracked"
      ],
      skills: "SQL | ETL | Data Modeling | Analytics"
    }
  },
  {
    prompt: "📊 Across all her roles, which skill was most strengthened?",
    options: [
      "A) Drawing",
      "B) Storytelling",
      "C) Communication & Collaboration",
      "D) Hardware repair"
    ],
    correct: 2,
    reveal: {
      title: "🧠 Cross-Role Highlight",
      summary: "From classrooms to NGOs and analytics teams, Darshita's strongest ability has been communication and teamwork — making every project more connected and clear.",
      impact: [
        "Multi-team collaboration",
        "Client and stakeholder updates",
        "Coordination under tight deadlines"
      ],
      skills: "Teamwork | Agile | Leadership | Mentorship"
    }
  }
];

const ENCOURAGEMENTS = [
  "Signal strong, Analyst.",
  "XP pathways stable.",
  "Insight unlocked — next challenge loading."
];

export function DecodeJourney({ levelId, facts, onComplete, onBack }: DecodeJourneyProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [xp, setXp] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionStep, setTransitionStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [encouragementText, setEncouragementText] = useState("");

  const currentChallenge = CHALLENGES[questionIndex];
  const isCorrect = selectedAnswer === currentChallenge.correct;

  // Show encouragement at midpoint
  useEffect(() => {
    if (questionIndex === 2 || questionIndex === 3) {
      const randomEncouragement = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
      setEncouragementText(randomEncouragement);
      setShowEncouragement(true);
      setTimeout(() => setShowEncouragement(false), 2000);
    }
  }, [questionIndex]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || showReveal) return;

    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentChallenge.correct;

    if (correct) {
      setFeedbackMessage("⚡ System Calibrated! +30 XP");
      setXp(prev => prev + 30);
      setCorrectCount(prev => prev + 1);
    } else {
      setFeedbackMessage("💥 Data Glitch Detected — Syncing truth… +10 XP");
      setXp(prev => prev + 10);
    }

    setTimeout(() => {
      setFeedbackMessage(null);
      setShowReveal(true);
    }, 1500);
  };

  const handleNextChallenge = () => {
    if (questionIndex < CHALLENGES.length - 1) {
      setQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowReveal(false);
    } else {
      // Start completion sequence
      setShowReveal(false);
      setShowTransition(true);

      const steps = [
        "Uploading Experience File…",
        "Decrypting Mission Logs…",
        "Rendering Results…"
      ];

      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          setTransitionStep(currentStep);
          currentStep++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setShowTransition(false);
            setShowComplete(true);
          }, 800);
        }
      }, 1200);
    }
  };

  const transitionMessages = [
    "Uploading Experience File…",
    "Decrypting Mission Logs…",
    "Rendering Results…"
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.8, y: 20, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          opacity: { duration: 0.2 }
        }}
        className="w-[90vw] h-[80vh] max-w-4xl max-h-[700px] flex flex-col rounded-3xl overflow-hidden"
        style={{
          background: `linear-gradient(180deg, #DFF6FF 0%, #A3D5F2 100%)`,
          border: `3px solid #9ED8E0`,
          boxShadow: `0 0 30px #9ED8E080, 0 8px 32px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{
            borderColor: `rgba(255,255,255,0.2)`,
            background: `rgba(255,255,255,0.3)`,
            backdropFilter: 'blur(8px)',
          }}
        >
          <Button variant="ghost" size="sm" onClick={onBack}>
            ← Back to Map
          </Button>
          <div className="flex items-center gap-3">
            <span
              style={{
                fontFamily: "'Orbitron', sans-serif",
                color: BYTE_BUBBLES_THEME.text,
                fontSize: '1.1rem',
              }}
            >
              Experience Arena — Challenges ⭐ {questionIndex + (showReveal ? 1 : 0)} / 5
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? "Resume" : "Pause"}
          </Button>
        </div>

        {/* Game Area */}
        <div 
          className="flex-1 relative p-4 md:p-6 overflow-hidden flex items-center justify-center"
          style={{
            backgroundImage: 'url(https://harmless-tapir-303.convex.cloud/api/storage/d2d82577-719f-4e83-933c-9a4e6c68f892)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Floating bubbles background */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={`bubble-${i}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: `${20 + Math.random() * 30}px`,
                height: `${20 + Math.random() * 30}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `radial-gradient(circle at 35% 25%, rgba(255,255,255,0.6), rgba(135,206,250,0.4))`,
                border: '1px solid rgba(255,255,255,0.3)',
              }}
              animate={{
                y: [0, -50 - Math.random() * 100],
                opacity: [0.3, 0.6, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}

          {/* Question Card */}
          {!showReveal && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl space-y-6"
            >
              <div
                className="text-xl md:text-2xl text-center px-6 py-4 rounded-2xl"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  color: BYTE_BUBBLES_THEME.text,
                  background: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(12px)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                }}
              >
                {currentChallenge.prompt}
              </div>
              <div className="space-y-3 px-4">
                {currentChallenge.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    className="w-full p-4 rounded-lg text-left transition-all disabled:cursor-not-allowed"
                    style={{
                      background: selectedAnswer === index
                        ? (isCorrect ? '#B2F2BB' : '#FAD4D4')
                        : 'rgba(255,211,110,0.95)',
                      border: '2px solid rgba(255,255,255,0.4)',
                      backdropFilter: 'blur(8px)',
                      fontFamily: "'Nunito', sans-serif",
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: BYTE_BUBBLES_THEME.text,
                      boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                    }}
                    whileHover={selectedAnswer === null ? { scale: 1.02, boxShadow: '0 0 20px #FFD36E80' } : {}}
                    whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Reveal Card */}
          <AnimatePresence>
            {showReveal && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="w-full max-w-2xl"
              >
                <Card
                  style={{
                    background: 'rgba(255,255,255,0.95)',
                    border: '3px solid #9ED8E0',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 0 30px #9ED8E080',
                  }}
                >
                  <CardHeader>
                    <CardTitle
                      className="text-xl md:text-2xl"
                      style={{
                        fontFamily: "'Orbitron', sans-serif",
                        color: BYTE_BUBBLES_THEME.text,
                      }}
                    >
                      {currentChallenge.reveal.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p
                      style={{
                        fontFamily: "'Nunito', sans-serif",
                        fontSize: '1rem',
                        lineHeight: '1.6',
                      }}
                    >
                      {currentChallenge.reveal.summary}
                    </p>
                    <div>
                      <h4 className="font-bold mb-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
                        Impact:
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {currentChallenge.reveal.impact.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1" style={{ fontFamily: "'Nunito', sans-serif" }}>
                        Skills:
                      </h4>
                      <p className="text-sm">{currentChallenge.reveal.skills}</p>
                    </div>
                    <Button
                      size="lg"
                      onClick={handleNextChallenge}
                      className="w-full text-lg"
                      style={{
                        background: '#FFD36E',
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 700,
                      }}
                    >
                      {questionIndex < CHALLENGES.length - 1 ? "Next Challenge →" : "Complete Mission →"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feedback Message */}
          <AnimatePresence>
            {feedbackMessage && (
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div
                  className="px-6 py-4 rounded-2xl text-center"
                  style={{
                    background: isCorrect ? '#B2F2BB' : '#FAD4D4',
                    border: `2px solid ${isCorrect ? '#51cf66' : '#ff6b6b'}`,
                    boxShadow: `0 0 30px ${isCorrect ? '#51cf6680' : '#ff6b6b80'}`,
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: BYTE_BUBBLES_THEME.text,
                  }}
                >
                  {feedbackMessage}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Encouragement Message */}
          <AnimatePresence>
            {showEncouragement && (
              <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
              >
                <div
                  className="px-4 py-2 rounded-full text-sm"
                  style={{
                    background: '#9ED8E090',
                    fontFamily: "'Nunito', sans-serif",
                    color: BYTE_BUBBLES_THEME.text,
                  }}
                >
                  {encouragementText}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
                      Training Paused
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p style={{ fontFamily: "'Nunito', sans-serif" }}>
                      Resume when ready.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button onClick={() => setIsPaused(false)}>Resume</Button>
                      <Button variant="outline" onClick={onBack}>Exit to Map</Button>
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
              <motion.div
                className="text-center space-y-6"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                <motion.div
                  className="text-3xl md:text-4xl font-bold mb-8"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    color: '#FFD36E',
                    textShadow: '0 0 20px #FFD36E80',
                  }}
                >
                  🎉 DATA SYNC COMPLETE
                </motion.div>
                <div className="space-y-3 mt-8">
                  {transitionMessages.slice(0, transitionStep + 1).map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.3 }}
                      className="text-lg"
                      style={{
                        fontFamily: "'Nunito', sans-serif",
                        color: '#fff',
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
                    background: 'rgba(255,255,255,0.98)',
                    border: '3px solid #9ED8E0',
                    boxShadow: '0 0 40px #9ED8E0',
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
                      EXPERIENCE FILE: VERIFIED ✅
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6 max-h-[60vh] overflow-y-auto">
                    {/* Mission Log */}
                    <div>
                      <h3
                        className="text-lg font-bold mb-2"
                        style={{ fontFamily: "'Nunito', sans-serif", color: BYTE_BUBBLES_THEME.text }}
                      >
                        Mission Log:
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p>🎓 Graduate Teaching Assistant — Illinois State University</p>
                        <p className="ml-4 text-xs">IT150 Labs | 150+ students | MS Suite (Excel | Word | Access | PowerPoint)</p>
                        <p>🌊 Data & Web Development Intern — CIIWAS NGO (Normal, IL | 08/2024–12/2024)</p>
                        <p>🏭 Data Analyst Intern — GMP MachPro (India | 01/2023–06/2023)</p>
                        <p>🤝 IT Data Analyst Intern — ORANGESNGO (India | 04/2022–12/2022)</p>
                      </div>
                    </div>

                    {/* Impact Highlights */}
                    <div>
                      <h3
                        className="text-lg font-bold mb-2"
                        style={{ fontFamily: "'Nunito', sans-serif", color: BYTE_BUBBLES_THEME.text }}
                      >
                        Impact Highlights:
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p>• CIIWAS: Dashboards used by 100+ women | Registration efficiency ↑ 25% | MySQL pipelines automated</p>
                        <p>• GMP MachPro: Downtime ↓ 8% | Power BI KPI visibility | Forecast accuracy ↑ 15%</p>
                        <p>• ORANGESNGO: Donor participation ↑ 25% in 2 months | 2,000+ beneficiaries tracked | 80+ regions standardized</p>
                        <p>• ISU GTA: Led labs for 150+ students | MS Suite (Excel, Word, Access, PowerPoint) | Enhanced communication & mentorship</p>
                      </div>
                    </div>

                    {/* Tech Stack */}
                    <div>
                      <h3
                        className="text-lg font-bold mb-2"
                        style={{ fontFamily: "'Nunito', sans-serif", color: BYTE_BUBBLES_THEME.text }}
                      >
                        Tech Stack:
                      </h3>
                      <p className="text-sm">
                        React | MySQL | Python | Power BI | SQL | ETL | Data Visualization | MS Suite | Statistical Analysis
                      </p>
                    </div>

                    {/* XP and Badge */}
                    <div className="border-t pt-4 space-y-2">
                      <p className="text-lg font-bold" style={{ color: '#FFD36E' }}>
                        XP Earned: +200
                      </p>
                      <p className="text-base">
                        New Badge: "Field-Tested Analyst" ⚡
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
                        🏆 Achievement Unlocked: "Mission Complete — You've Decoded Her Story!"
                      </p>
                    </div>

                    {/* Continue Button */}
                    <Button
                      size="lg"
                      onClick={() => onComplete(facts)}
                      className="w-full text-lg"
                      style={{
                        background: '#FFD36E',
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 700,
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
      </motion.div>
    </motion.div>
  );
}
