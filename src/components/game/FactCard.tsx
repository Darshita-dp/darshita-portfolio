import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { GAME_PALETTE } from '@/lib/gameData';

interface FactCardProps {
  fact: string;
  show: boolean;
  onClose: () => void;
}

export function FactCard({ fact, show, onClose }: FactCardProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.4 }}
          className="fixed top-24 right-4 z-50 max-w-sm"
        >
          <Card
            className="backdrop-blur-md border-2"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderColor: GAME_PALETTE.star,
              boxShadow: `0 8px 24px rgba(0,0,0,0.15)`
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⭐</span>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: GAME_PALETTE.textPrimary }}>
                    {fact}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
