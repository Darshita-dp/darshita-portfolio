import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BYTE_BUBBLES_THEME } from "@/lib/byteBubblesData";
import { MEMORY_CONFIG, GameCard } from "./memory/MemoryGameConfig";
import { MemoryGameCards } from "./memory/MemoryGameCards";
import { MemoryGameModals } from "./memory/MemoryGameModals";

interface EducationMemoryProps {
  levelId: number;
  facts: string[];
  onComplete: (factsCollected: string[]) => void;
  onBack: () => void;
}

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

  const playClickSound = () => {
    try {
      const audio = new Audio(MEMORY_CONFIG.CLICK_SOUND_URL);
      audio.volume = MEMORY_CONFIG.CLICK_SOUND_VOLUME;
      void audio.play().catch(() => {
        // noop: ignore playback errors
      });
    } catch {
      // noop
    }
  };

  // Initialize and shuffle cards
  useEffect(() => {
    const shuffled = [...MEMORY_CONFIG.CARD_PAIRS]
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
      const randomEncouragement = 
        MEMORY_CONFIG.ENCOURAGEMENTS[
          Math.floor(Math.random() * MEMORY_CONFIG.ENCOURAGEMENTS.length)
        ];
      setEncouragementText(randomEncouragement);
      setShowEncouragement(true);
      setTimeout(() => setShowEncouragement(false), MEMORY_CONFIG.ENCOURAGEMENT_DELAY);
    }
  }, [matchedPairs]);

  // Handle card click
  const handleCardClick = (cardId: number) => {
    if (isLocked || isPaused || showComplete) return;

    playClickSound();

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isMatched) return;

    // If card is already flipped, unflip it
    if (card.isFlipped) {
      const newCards = cards.map((c) => 
        c.id === cardId ? { ...c, isFlipped: false } : c
      );
      setCards(newCards);
      setFlippedCards((prev) => prev.filter((id) => id !== cardId));
      return;
    }

    // Flip the card
    const newCards = cards.map((c) => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    // Check for match when 2 cards are flipped
    if (newFlipped.length === 2) {
      setIsLocked(true);
      const [firstId, secondId] = newFlipped;
      const firstCard = newCards.find((c) => c.id === firstId);
      const secondCard = newCards.find((c) => c.id === secondId);

      if (firstCard && secondCard) {
        const firstPair = MEMORY_CONFIG.CARD_PAIRS.find(
          (p) => p.value === firstCard.value
        );
        const isMatch = firstPair?.pair === secondCard.value;

        if (isMatch) {
          // Correct match
          const randomMessage = 
            MEMORY_CONFIG.CORRECT_MESSAGES[
              Math.floor(Math.random() * MEMORY_CONFIG.CORRECT_MESSAGES.length)
            ];
          setFeedbackMessage(randomMessage);

          setTimeout(() => {
            setCards((prev) => 
              prev.map((c) => 
                c.id === firstId || c.id === secondId 
                  ? { ...c, isMatched: true } 
                  : c
              )
            );
            setMatchedPairs((prev) => prev + 1);
            setXp((prev) => prev + MEMORY_CONFIG.XP_PER_MATCH);
            setFlippedCards([]);
            setIsLocked(false);
            setFeedbackMessage(null);
          }, MEMORY_CONFIG.MATCH_DELAY);
        } else {
          // Wrong match
          const randomMessage = 
            MEMORY_CONFIG.WRONG_MESSAGES[
              Math.floor(Math.random() * MEMORY_CONFIG.WRONG_MESSAGES.length)
            ];
          setFeedbackMessage(randomMessage);

          setTimeout(() => {
            setCards((prev) => 
              prev.map((c) => 
                c.id === firstId || c.id === secondId 
                  ? { ...c, isFlipped: false } 
                  : c
              )
            );
            setFlippedCards([]);
            setIsLocked(false);
            setFeedbackMessage(null);
          }, MEMORY_CONFIG.WRONG_DELAY);
        }
      }
    }
  };

  // Handle completion
  useEffect(() => {
    if (matchedPairs === MEMORY_CONFIG.TOTAL_PAIRS && !showComplete) {
      setIsLocked(true);
      setShowTransition(true);

      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < MEMORY_CONFIG.TRANSITION_MESSAGES.length) {
          setTransitionStep(currentStep);
          currentStep++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setShowTransition(false);
            setShowComplete(true);
          }, 800);
        }
      }, MEMORY_CONFIG.TRANSITION_DELAY);

      return () => clearInterval(interval);
    }
  }, [matchedPairs, showComplete]);

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
        className="w-[90vw] max-w-5xl flex flex-col rounded-3xl overflow-hidden"
        style={{
          maxHeight: "90vh",
          backgroundImage: `url('${MEMORY_CONFIG.GAME_BG_IMAGE}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
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
              Skill Sync Progress ⭐ {matchedPairs} / {MEMORY_CONFIG.TOTAL_PAIRS}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? "Resume" : "Pause"}
          </Button>
        </div>

        {/* Game Area */}
        <div className="flex-1 relative pt-[calc(5rem+8px)] px-2 pb-2 md:pt-6 md:px-4 md:pb-4 overflow-y-auto flex items-center justify-center">
          {/* Floating bubbles background effect - reduced for mobile */}
          {Array.from({ length: 8 }).map((_, i) => (
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
          <MemoryGameCards
            cards={cards}
            onCardClick={handleCardClick}
            isLocked={isLocked}
          />

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
                      +{MEMORY_CONFIG.XP_PER_MATCH} XP
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

        {/* Modals */}
        <MemoryGameModals
          isPaused={isPaused}
          showTransition={showTransition}
          showComplete={showComplete}
          transitionStep={transitionStep}
          xp={xp}
          onResume={() => setIsPaused(false)}
          onExit={onBack}
          onComplete={onComplete}
          facts={facts}
        />
      </motion.div>
    </motion.div>
  );
}