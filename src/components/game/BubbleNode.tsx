import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { GAME_PALETTE } from '@/lib/gameData';

interface BubbleNodeProps {
  emoji: string;
  name: string;
  x: number;
  y: number;
  completed: boolean;
  locked?: boolean;
  onClick: () => void;
}

export function BubbleNode({ emoji, name, x, y, completed, locked, onClick }: BubbleNodeProps) {
  return (
    <motion.button
      className="absolute group"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      onClick={onClick}
      disabled={locked}
      whileHover={!locked ? { scale: 1.05 } : {}}
      animate={{
        y: [0, -8, 0],
      }}
      transition={{
        y: {
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }}
    >
      <div
        className="relative w-24 h-24 rounded-full flex items-center justify-center text-4xl cursor-pointer transition-all duration-300"
        style={{
          background: locked 
            ? 'rgba(100, 100, 100, 0.3)'
            : `linear-gradient(135deg, ${GAME_PALETTE.bubble}, ${GAME_PALETTE.accent})`,
          boxShadow: completed
            ? `0 0 20px ${GAME_PALETTE.success}, 0 4px 12px rgba(0,0,0,0.1)`
            : '0 4px 12px rgba(0,0,0,0.1)',
          border: completed ? `3px solid ${GAME_PALETTE.success}` : 'none'
        }}
      >
        {locked ? (
          <Lock className="w-8 h-8 text-gray-400" />
        ) : (
          <span className="drop-shadow-lg">{emoji}</span>
        )}
        
        {!locked && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${GAME_PALETTE.star}40 0%, transparent 70%)`
            }}
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
      
      <div
        className="mt-2 text-sm font-medium px-3 py-1 rounded-full backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: GAME_PALETTE.textPrimary
        }}
      >
        {name}
      </div>
    </motion.button>
  );
}
