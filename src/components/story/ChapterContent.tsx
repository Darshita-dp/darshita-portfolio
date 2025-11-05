import { motion } from "framer-motion";

interface Chapter {
  id: number;
  title: string;
  content: string;
}

interface ChapterContentProps {
  chapter: Chapter;
  isActive: boolean;
}

export function ChapterContent({ chapter, isActive }: ChapterContentProps) {
  return (
    <div className="w-screen h-full flex items-center justify-center px-8 relative z-20">
      <motion.div
        className="max-w-2xl text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.6, delay: isActive ? 0 : 0 }}
      >
        <motion.h2
          className="text-4xl md:text-6xl font-bold mb-6"
          style={{
            fontFamily: '"Great Vibes", "Gwendolyn", cursive',
            color: "#1D2340",
            textShadow: "0 2px 8px rgba(255,255,255,0.8)",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.6 }}
        >
          {chapter.title}
        </motion.h2>
        
        <motion.p
          className="text-lg md:text-xl leading-relaxed"
          style={{
            fontFamily: 'ui-serif, Georgia, serif',
            color: "#2C3E50",
            textShadow: "0 1px 4px rgba(255,255,255,0.9)",
            backgroundColor: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(8px)",
            padding: "1.5rem",
            borderRadius: "1rem",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.6, delay: isActive ? 0.12 : 0 }}
        >
          {chapter.content}
        </motion.p>
      </motion.div>
    </div>
  );
}
