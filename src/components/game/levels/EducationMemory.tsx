import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BYTE_BUBBLES_THEME } from "@/lib/byteBubblesData";

interface EducationMemoryProps {
  levelId: number;
  facts: string[];
  onComplete: (factsCollected: string[]) => void;
  onBack: () => void;
}

interface GameCard {
  id: number;
  value: string;
  display: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARD_PAIRS = [
  { value: "html", display: "HTML", pair: "webdev" },
  { value: "webdev", display: "Web Development", pair: "html" },
  { value: "sql", display: "SQL", pair: "database" },
  { value: "database", display: "Database", pair: "sql" },
  { value: "python", display: "Python", pair: "dataanalysis" },
  { value: "dataanalysis", display: "Data Analysis", pair: "python" },
  { value: "powerbi", display: "Power BI", pair: "visualization" },
  { value: "visualization", display: "Visualization", pair: "powerbi" },
  { value: "agile", display: "Agile", pair: "projectmgmt" },
  { value: "projectmgmt", display: "Project Management", pair: "agile" },
];

const CORRECT_MESSAGES = [
  "🧩 Skill Synced!\nKnowledge Node Connected.",
  "⚡ Data Flow Stabilized.",
  "📊 Skill Matrix Updated.",
  "💻 Module Linked Successfully.",
];

const WRONG_MESSAGES = [
  "❗ Desync Detected\nTry another pair, Player.",
  "Connection Lost – Recalibrating…",
  "Mismatch! Reattempt Required.",
];

const ENCOURAGEMENTS = [
  "Processing like a pro, Player Darshita.",
  "XP pathways glowing bright!",
  "Neural data flow stable. Keep matching.",
  "Halfway synced — knowledge circuits aligned!",
];

export function EducationMemory({ levelId, facts, onComplete, onBack }: EducationMemoryProps) {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [xp, setXp] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [encouragementText, setEncouragementText] = useState("");
  const [showTransition, setShowTransition] = useState(false);
  const [transitionStep, setTransitionStep] = useState(0);

  // Initialize and shuffle cards
  useEffect(() => {
    const shuffled = [...CARD_PAIRS]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({
        id: index,
        value: card.value,
        display: card.display,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
  }, []);

  // Show encouragement at halfway point
  useEffect(() => {
    if (matchedPairs === 2 || matchedPairs === 3) {
      const randomEncouragement = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
      setEncouragementText(randomEncouragement);
      setShowEncouragement(true);
      setTimeout(() => setShowEncouragement(false), 2500);
    }
  }, [matchedPairs]);

  // Handle card click
  const handleCardClick = (cardId: number) => {
    if (isLocked || isPaused || showComplete) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    
    // Flip the card
    const newCards = cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);
    
    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);
    
    // Check for match when 2 cards are flipped
    if (newFlipped.length === 2) {
      setIsLocked(true);
      const [firstId, secondId] = newFlipped;
      const firstCard = newCards.find(c => c.id === firstId);
      const secondCard = newCards.find(c => c.id === secondId);
      
      if (firstCard && secondCard) {
        const firstPair = CARD_PAIRS.find(p => p.value === firstCard.value);
        const isMatch = firstPair?.pair === secondCard.value;
        
        if (isMatch) {
          // Correct match
          const randomMessage = CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
          setFeedbackMessage(randomMessage);
          
          setTimeout(() => {
            setCards(prev => prev.map(c => 
              c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
            ));
            setMatchedPairs(prev => prev + 1);
            setXp(prev => prev + 30);
            setFlippedCards([]);
            setIsLocked(false);
            setFeedbackMessage(null);
          }, 1200);
        } else {
          // Wrong match
          const randomMessage = WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)];
          setFeedbackMessage(randomMessage);
          
          setTimeout(() => {
            setCards(prev => prev.map(c => 
              c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
            ));
            setFlippedCards([]);
            setIsLocked(false);
            setFeedbackMessage(null);
          }, 1500);
        }
      }
    }
  };

  // Handle completion
  useEffect(() => {
    if (matchedPairs === 5 && !showComplete) {
      setIsLocked(true);
      setShowTransition(true);
      
      // Transition sequence
      const steps = [
        "Uploading Education File…",
        "Verifying academic credentials... ✅",
        "Decrypting skill upgrades... ⚙️",
        "Generating Level Report…"
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
      
      return () => clearInterval(interval);
    }
  }, [matchedPairs, showComplete]);

  const transitionMessages = [
    "Uploading Education File…",
    "Verifying academic credentials... ✅",
    "Decrypting skill upgrades... ⚙️",
    "Generating Level Report…"
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
        className="w-[90vw] h-[80vh] max-w-5xl max-h-[700px] flex flex-col rounded-3xl overflow-hidden"
        style={{
          backgroundImage: `url('https://harmless-tapir-303.convex.cloud/api/storage/1a671974-29ce-4d1d-bd92-640e3bce7ed6')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: `3px solid ${BYTE_BUBBLES_THEME.accent}`,
          boxShadow: `0 0 30px ${BYTE_BUBBLES_THEME.accent}80, 0 8px 32px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{
            borderColor: `${BYTE_BUBBLES_THEME.accent}40`,
            background: `${BYTE_BUBBLES_THEME.bubble}80`,
            backdropFilter: 'blur(8px)',
          }}
        >
          <Button variant="ghost" size="sm" onClick={onBack}>
            ← Back to Map
          </Button>
          <div className="flex items-center gap-3">
            <span
              style={{
                fontFamily: "'Anton', sans-serif",
                color: BYTE_BUBBLES_THEME.text,
                fontSize: '1.1rem',
              }}
            >
              Skill Sync Progress ⭐ {matchedPairs} / 5
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? "Resume" : "Pause"}
          </Button>
        </div>

        {/* Game Area */}
        <div className="flex-1 relative p-4 md:p-6 overflow-y-auto">
          {/* Floating bubbles background effect */}
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

          {/* Card Grid */}
          <div className="grid grid-cols-5 gap-2 md:gap-3 max-w-3xl mx-auto">
            {cards.map((card) => (
              <motion.div
                key={card.id}
                className="aspect-[3/4] cursor-pointer"
                style={{ perspective: '800px' }}
                onClick={() => handleCardClick(card.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.div
                  className="w-full h-full relative"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                >
                  {/* Card Back */}
                  <div
                    className="absolute inset-0 rounded-lg flex items-center justify-center"
                    style={{
                      backfaceVisibility: 'hidden',
                      background: BYTE_BUBBLES_THEME.bgEnd,
                      border: `2px solid ${BYTE_BUBBLES_THEME.accent}`,
                      boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
                    }}
                  >
                    <div className="text-2xl md:text-3xl">🔒</div>
                  </div>
                  
                  {/* Card Front */}
                  <div
                    className="absolute inset-0 rounded-lg flex flex-col items-center justify-end p-1.5"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: (card.value === 'html' || card.value === 'webdev')
                        ? `url('https://harmless-tapir-303.convex.cloud/api/storage/1eb3fc27-d593-4c37-92bd-2cd7b3a6ecfc')`
                        : (card.value === 'sql' || card.value === 'database')
                        ? `url('https://harmless-tapir-303.convex.cloud/api/storage/a04d42f1-00e1-486b-8232-28954a6e86f0')`
                        : (card.value === 'python' || card.value === 'dataanalysis')
                        ? `url('https://harmless-tapir-303.convex.cloud/api/storage/8068e115-c02d-43dd-9ac1-09cf93ed9a6d')`
                        : `linear-gradient(135deg, ${BYTE_BUBBLES_THEME.bgStart} 0%, ${BYTE_BUBBLES_THEME.bgMid} 100%)`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: card.isMatched ? `2.5px solid ${BYTE_BUBBLES_THEME.seafoam}` : `2px solid ${BYTE_BUBBLES_THEME.accent}`,
                      boxShadow: card.isMatched 
                        ? `0 0 16px ${BYTE_BUBBLES_THEME.seafoam}80, 0 3px 10px rgba(0,0,0,0.2)`
                        : '0 3px 10px rgba(0,0,0,0.15)',
                    }}
                  >
                    {(card.value === 'html' || card.value === 'webdev' || card.value === 'sql' || card.value === 'database' || card.value === 'python' || card.value === 'dataanalysis') ? (
                      <div
                        className="w-full px-1 py-1 rounded"
                        style={{
                          background: 'rgba(0,0,0,0.7)',
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        <span
                          className="text-center text-[10px] md:text-xs font-bold leading-tight block"
                          style={{
                            fontFamily: "'Nunito', sans-serif",
                            color: '#FFD700',
                            textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                          }}
                        >
                          {card.display}
                        </span>
                      </div>
                    ) : (
                      <span
                        className="text-center text-[10px] md:text-xs font-semibold leading-tight"
                        style={{
                          fontFamily: "'Nunito', sans-serif",
                          color: BYTE_BUBBLES_THEME.text,
                        }}
                      >
                        {card.display}
                      </span>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

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
                  className="px-6 py-4 rounded-2xl text-center whitespace-pre-line"
                  style={{
                    background: `${BYTE_BUBBLES_THEME.bubble}95`,
                    border: `2px solid ${BYTE_BUBBLES_THEME.accent}`,
                    boxShadow: `0 0 30px ${BYTE_BUBBLES_THEME.accent}80`,
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: BYTE_BUBBLES_THEME.text,
                  }}
                >
                  {feedbackMessage}
                  {feedbackMessage.includes("Synced") && (
                    <motion.div
                      className="mt-2 text-2xl"
                      initial={{ y: 0, opacity: 1 }}
                      animate={{ y: -30, opacity: 0 }}
                      transition={{ duration: 1, delay: 0.3 }}
                      style={{ color: BYTE_BUBBLES_THEME.star }}
                    >
                      +30 XP
                    </motion.div>
                  )}
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
                    background: `${BYTE_BUBBLES_THEME.seafoam}90`,
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
                      Training Sequence Paused
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p style={{ fontFamily: "'Nunito', sans-serif" }}>
                      Take a breather, Player. Resume when your data stream's stable.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button onClick={() => setIsPaused(false)}>Resume Training</Button>
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
                        <p>🎓 Master's in Information Systems – Illinois State University</p>
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
                        XP Earned: +150
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
      </motion.div>
    </motion.div>
  );
}