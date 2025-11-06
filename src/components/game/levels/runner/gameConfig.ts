// Game configuration constants
export const RUNNER_CONFIG = {
  // Physics
  gravity: 0.6,
  jumpPower: -14,
  
  // Player
  playerWidth: 60,
  playerHeight: 60,
  
  // Platforms
  platformHeight: 20,
  platformSpacing: 300,
  
  // Stars (Jellyfish)
  starCount: 15,
  starSpacing: 800,
  starCollisionRadius: 40,
  starBobAmount: 15,
  starBobSpeed: 2,
  
  // Game mechanics
  maxMissedStars: 8,
  requiredStars: 5,
  
  // Scroll
  autoScrollSpeed: 3,
  
  // Canvas
  groundYOffset: 80,
  
  // Mobile adjustments
  mobile: {
    starCount: 12,
    autoScrollSpeed: 2.5,
    starCollisionRadius: 35,
  },
} as const;

export const GAME_COLORS = {
  platformFill: "#A7E8E1",
  playerFallback: "#FFD700",
  jellyfishGlow: "rgba(255, 105, 180, 0.6)",
  jellyfishGlowOuter: "rgba(255, 105, 180, 0.3)",
} as const;
