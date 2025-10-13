import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BookProps {
  children: ReactNode;
  className?: string;
}

export function Book({ children, className = "" }: BookProps) {
  return (
    <div className={`book-container ${className}`} style={{ perspective: "2000px" }}>
      {children}
    </div>
  );
}

interface PageFaceProps {
  children: ReactNode;
  side: "front" | "back";
}

export function PageFace({ children, side }: PageFaceProps) {
  return (
    <div
      className={`page-face page-face--${side}`}
      style={{
        position: "absolute",
        inset: 0,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: side === "back" ? "rotateY(180deg)" : "rotateY(0deg)",
      }}
    >
      {children}
    </div>
  );
}

interface PaperProps {
  children: ReactNode;
  pageNumber: number;
  direction: "next" | "prev";
  onAnimationComplete?: () => void;
}

export function Paper({ children, pageNumber, direction, onAnimationComplete }: PaperProps) {
  const isNext = direction === "next";
  
  return (
    <motion.div
      key={`paper-${pageNumber}`}
      className="paper"
      initial={{
        rotateY: isNext ? 0 : -180,
        transformOrigin: "left center",
      }}
      animate={{
        rotateY: 0,
        transformOrigin: "left center",
      }}
      exit={{
        rotateY: isNext ? -180 : 0,
        transformOrigin: "left center",
      }}
      transition={{
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96],
      }}
      onAnimationComplete={onAnimationComplete}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </motion.div>
  );
}

interface FlipRightProps {
  children: ReactNode;
}

export function FlipRight({ children }: FlipRightProps) {
  return (
    <div
      className="flip-right"
      style={{
        position: "absolute",
        inset: 0,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}

interface FlipLeftProps {
  children: ReactNode;
}

export function FlipLeft({ children }: FlipLeftProps) {
  return (
    <div
      className="flip-left"
      style={{
        position: "absolute",
        inset: 0,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}
