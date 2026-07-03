import { motion } from "framer-motion";
import { BYTE_BUBBLES_THEME } from "@/lib/byteBubblesData";
import { MEMORY_CONFIG, GameCard } from "./MemoryGameConfig";

interface MemoryGameCardsProps {
  cards: GameCard[];
  onCardClick: (cardId: number) => void;
  isLocked: boolean;
}

export function MemoryGameCards({ cards, onCardClick, isLocked }: MemoryGameCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2 md:gap-3 w-full px-2 sm:px-4">
      {cards.map((card) => (
        <motion.div
          key={card.id}
          className="h-[16vh] max-h-[140px] sm:h-auto sm:aspect-[3/4] cursor-pointer w-full min-w-0"
          style={{ perspective: "800px" }}
          onClick={() => !isLocked && onCardClick(card.id)}
          whileHover={!card.isFlipped && !card.isMatched ? { scale: 1.02 } : {}}
          whileTap={{ scale: 0.98 }}
          aria-label={`Card ${card.id + 1}${card.isMatched ? " - matched" : ""}`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              !isLocked && onCardClick(card.id);
            }
          }}
        >
          <motion.div
            className="w-full h-full relative"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {/* Card Back */}
            <div
              className="absolute inset-0 rounded-md md:rounded-lg flex items-center justify-center"
              style={{
                backfaceVisibility: "hidden",
                backgroundImage: `url('${MEMORY_CONFIG.CARD_BACK_IMAGE}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: `2px solid ${BYTE_BUBBLES_THEME.accent}`,
                boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
              }}
            />

            {/* Card Front */}
            <div
              className="absolute inset-0 rounded-md md:rounded-lg flex flex-col items-center justify-end p-1 sm:p-1.5"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                backgroundImage: `url('${MEMORY_CONFIG.CARD_IMAGES[card.value as keyof typeof MEMORY_CONFIG.CARD_IMAGES] || ""}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: card.isMatched ? `2.5px solid ${BYTE_BUBBLES_THEME.seafoam}` : `2px solid ${BYTE_BUBBLES_THEME.accent}`,
                boxShadow: card.isMatched
                  ? `0 0 16px ${BYTE_BUBBLES_THEME.seafoam}80, 0 3px 10px rgba(0,0,0,0.2)`
                  : "0 3px 10px rgba(0,0,0,0.15)",
              }}
            >
              <div
                className="w-full px-0.5 sm:px-1 py-0.5 sm:py-1 rounded"
                style={{
                  background: "rgba(0,0,0,0.75)",
                }}
              >
                <span
                  className="text-center text-[8px] sm:text-[10px] md:text-xs font-bold leading-tight block"
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    color: "#FFD700",
                    textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                  }}
                >
                  {card.display}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
