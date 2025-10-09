import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GAME_PALETTE, type LevelData } from '@/lib/gameData';

interface LevelPreviewProps {
  level: LevelData;
  onPlay: () => void;
  onBack: () => void;
}

export function LevelPreview({ level, onPlay, onBack }: LevelPreviewProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(180deg, ${GAME_PALETTE.bgStart} 0%, ${GAME_PALETTE.bgMid} 50%, ${GAME_PALETTE.bgEnd} 100%)`
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="backdrop-blur-md bg-white/95 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="text-6xl mb-4">{level.emoji}</div>
            <CardTitle
              className="text-3xl"
              style={{
                fontFamily: '"Press Start 2P", "Orbitron", monospace',
                color: GAME_PALETTE.textPrimary
              }}
            >
              {level.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: GAME_PALETTE.textPrimary }}
              >
                What you'll learn:
              </h3>
              <ul className="space-y-2">
                {level.facts.map((fact, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <span className="text-xl">⭐</span>
                    <span
                      className="text-sm"
                      style={{ color: GAME_PALETTE.textSecondary }}
                    >
                      {fact}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1"
              >
                Back to Map
              </Button>
              <Button
                onClick={onPlay}
                className="flex-1"
                style={{
                  backgroundColor: GAME_PALETTE.accent,
                  color: GAME_PALETTE.textPrimary
                }}
              >
                Play Level
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
