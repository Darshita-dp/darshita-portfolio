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
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ background: 'rgba(0, 0, 0, 0.6)' }}
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
        className="w-[96vw] max-w-[500px] sm:w-[90vw] sm:max-w-4xl flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden"
        style={{
          height: '85vh',
          maxHeight: '85vh',
          background: 'transparent',
          border: `3px solid #9ED8E080`,
          boxShadow: `0 0 30px #9ED8E040, 0 8px 32px rgba(0,0,0,0.2)`,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-2 py-2 sm:px-4 sm:py-3 border-b"
          style={{
            borderColor: `rgba(255,255,255,0.2)`,
            background: 'linear-gradient(135deg, #CFF8EE 0%, #A4E5D9 100%)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Button variant="ghost" size="sm" onClick={onBack} className="text-xs sm:text-sm">
            ← Back
          </Button>
          <div className="flex items-center gap-1 sm:gap-3">
            <span
              style={{
                fontFamily: "'Orbitron', sans-serif",
                color: BYTE_BUBBLES_THEME.text,
                fontSize: 'clamp(0.75rem, 2.5vw, 1.1rem)',
              }}
            >
              <span className="hidden sm:inline">Experience Arena — </span>Challenges ⭐ {questionIndex + (showReveal ? 1 : 0)} / 5
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsPaused(!isPaused)} className="text-xs sm:text-sm">
            {isPaused ? "Resume" : "Pause"}
          </Button>
        </div>

        {/* Game Area */}
        <div 
          className="flex-1 relative p-3 sm:p-4 md:p-6 overflow-y-auto flex items-center justify-center"
          style={{
            backgroundImage: 'url(https://harmless-tapir-303.convex.cloud/api/storage/d2d82577-719f-4e83-933c-9a4e6c68f892)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            boxShadow: `inset 0 0 40px ${BYTE_BUBBLES_THEME.accent}60, inset 0 0 80px ${BYTE_BUBBLES_THEME.seafoam}40`,
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
              className="w-full max-w-2xl space-y-2 sm:space-y-4"
            >
              <div
                className="text-center px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: 'clamp(0.8rem, 2.2vw, 1.25rem)',
                  color: '#093845',
                  background: 'rgba(207,248,238,0.85)',
                  backdropFilter: 'blur(12px)',
                  border: '2px solid rgba(164,229,217,0.4)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 2px 8px rgba(255,255,255,0.3)',
                }}
              >
                {currentChallenge.prompt}
              </div>
              <div className="space-y-2 sm:space-y-2.5 px-2 sm:px-3 relative">
                {/* Floating bubble particles */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={`particle-${i}`}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      width: `${8 + Math.random() * 12}px`,
                      height: `${8 + Math.random() * 12}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.4), rgba(164,229,217,0.2))',
                      opacity: 0.3,
                    }}
                    animate={{
                      y: [0, -30 - Math.random() * 20],
                      opacity: [0.2, 0.4, 0],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
                
                {currentChallenge.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    className="w-full p-2.5 sm:p-3 rounded-lg text-left transition-all disabled:cursor-not-allowed relative z-10"
                    style={{
                      background: selectedAnswer === index
                        ? (isCorrect 
                            ? 'linear-gradient(135deg, #CFF8EE 0%, #A4E5D9 100%)' 
                            : 'linear-gradient(135deg, #FFE5E5 0%, #FFD2D2 100%)')
                        : 'linear-gradient(135deg, #CFF8EE 0%, #A4E5D9 100%)',
                      border: selectedAnswer === index
                        ? (isCorrect 
                            ? '2px solid #A0F1CE' 
                            : '2px solid #FFD2D2')
                        : '2px solid rgba(164,229,217,0.5)',
                      backdropFilter: 'blur(4px)',
                      fontFamily: "'Nunito', sans-serif",
                      fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
                      fontWeight: 600,
                      color: '#093845',
                      boxShadow: selectedAnswer === index
                        ? (isCorrect 
                            ? '0 0 20px #A0F1CE80, inset 0 2px 6px rgba(255,255,255,0.4)' 
                            : '0 0 20px #FFD2D280, inset 0 2px 6px rgba(255,255,255,0.4)')
                        : '0 2px 12px rgba(0,0,0,0.1), inset 0 2px 6px rgba(255,255,255,0.4)',
                    }}
                    whileHover={selectedAnswer === null ? { 
                      scale: 1.02, 
                      boxShadow: '0 0 20px #7ED4C480, inset 0 2px 6px rgba(255,255,255,0.5)',
                      background: 'linear-gradient(135deg, #A4E5D9 0%, #7ED4C4 100%)'
                    } : {}}
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-full max-w-[92vw] sm:max-w-2xl mx-auto relative"
              >
                {/* Outer glow background */}
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #C5F5E8 0%, #AEE6D4 100%)',
                    filter: 'blur(20px)',
                    opacity: 0.6,
                    zIndex: -1,
                  }}
                />
                
                {/* Floating bubble particles behind card */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={`reveal-bubble-${i}`}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      width: `${15 + Math.random() * 25}px`,
                      height: `${15 + Math.random() * 25}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.4), rgba(164,229,217,0.2))',
                      opacity: 0.15,
                      zIndex: -1,
                    }}
                    animate={{
                      y: [0, -40 - Math.random() * 30],
                      opacity: [0.1, 0.2, 0],
                    }}
                    transition={{
                      duration: 4 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}

                {/* XP Star Float */}
                <motion.div
                  className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold"
                  style={{
                    background: '#B8F1D2',
                    color: '#025B47',
                    fontFamily: "'Nunito', sans-serif",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [20, -10, -10, -30] }}
                  transition={{ duration: 2, ease: "easeOut" }}
                >
                  +30 XP
                </motion.div>

                <Card
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: '16px',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    padding: 'clamp(1.25rem, 3.5vw, 2rem)',
                  }}
                >
                  <CardHeader className="p-0 mb-3 sm:mb-4">
                    <CardTitle
                      style={{
                        fontFamily: "'Orbitron', sans-serif",
                        color: '#02394A',
                        fontWeight: 700,
                        fontSize: 'clamp(0.95rem, 3.2vw, 1.5rem)',
                        lineHeight: '1.3',
                      }}
                    >
                      {currentChallenge.reveal.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2.5 sm:space-y-4 p-0">
                    <p
                      style={{
                        fontFamily: "'Nunito', sans-serif",
                        fontSize: 'clamp(0.8rem, 1.9vw, 1rem)',
                        lineHeight: '1.5',
                        color: '#1F3C45',
                      }}
                    >
                      {currentChallenge.reveal.summary}
                    </p>
                    <div>
                      <h4 
                        className="font-bold mb-1.5 sm:mb-2" 
                        style={{ 
                          fontFamily: "'Nunito', sans-serif",
                          color: '#007E7E',
                          fontSize: 'clamp(0.8rem, 2.3vw, 1rem)',
                        }}
                      >
                        Impact:
                      </h4>
                      <ul className="space-y-1" style={{ 
                        color: '#0E3A42',
                        fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
                      }}>
                        {currentChallenge.reveal.impact.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 
                        className="font-bold mb-1.5 sm:mb-2" 
                        style={{ 
                          fontFamily: "'Nunito', sans-serif",
                          color: '#007E7E',
                          fontSize: 'clamp(0.8rem, 2.3vw, 1rem)',
                        }}
                      >
                        Skills:
                      </h4>
                      <p style={{ 
                        color: '#0E3A42',
                        fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
                      }}>
                        {currentChallenge.reveal.skills}
                      </p>
                    </div>
                    <motion.div
                      animate={{
                        y: [0, -2, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      <Button
                        size="lg"
                        onClick={handleNextChallenge}
                        className="w-full mt-3 sm:mt-4"
                        style={{
                          background: 'linear-gradient(135deg, #A2E2D1, #6FDCC2)',
                          fontFamily: "'Nunito', sans-serif",
                          fontWeight: 600,
                          color: '#053E45',
                          border: 'none',
                          borderRadius: '9999px',
                          padding: 'clamp(0.65rem, 2vw, 0.8rem) clamp(1.5rem, 4vw, 2rem)',
                          boxShadow: '0 0 10px rgba(111, 220, 194, 0.6)',
                          transition: 'all 0.3s ease',
                          fontSize: 'clamp(0.85rem, 2.3vw, 1.125rem)',
                          minHeight: '44px',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #7FE9D0, #53C8AE)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #A2E2D1, #6FDCC2)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {questionIndex < CHALLENGES.length - 1 ? "Next Challenge →" : "Complete Mission →"}
                      </Button>
                    </motion.div>
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

                    {/* XP and Badge */}
                    <div className="border-t pt-4 space-y-2">
                      <p className="text-lg font-bold" style={{ color: BYTE_BUBBLES_THEME.star }}>
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
      </motion.div>
    </motion.div>
  );
}