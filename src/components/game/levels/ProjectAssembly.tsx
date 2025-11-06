import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GameCanvas, GameCanvasHandle } from "./project/GameCanvas";
import { ProjectCard } from "./project/ProjectCard";
import { GameModals } from "./project/GameModals";

interface ProjectAssemblyProps {
  levelId: number;
  facts: string[];
  onComplete: (factsCollected: string[]) => void;
  onBack: () => void;
}

interface Project {
  id: number;
  name: string;
  emoji: string;
  tech: string[];
  challenge: string;
  impact: string;
  x: number;
  y: number;
}

const PROJECTS: Project[] = [
  {
    id: 1,
    name: "SmartPlanner",
    emoji: "📱",
    tech: ["SwiftUI", "Core Data", "MVVM"],
    challenge: "Built an iOS task management app with local data persistence",
    impact: "Streamlined personal productivity with intuitive UI",
    x: 150,
    y: 150,
  },
  {
    id: 2,
    name: "AI-Driven Predictive Analytics",
    emoji: "🤖",
    tech: ["Python", "Machine Learning", "Data Analysis"],
    challenge: "Developed predictive models for business forecasting",
    impact: "Achieved 87% prediction accuracy for key metrics",
    x: 350,
    y: 120,
  },
  {
    id: 3,
    name: "IT Services Optimization",
    emoji: "⚙️",
    tech: ["SQL", "Power BI", "Process Analysis"],
    challenge: "Analyzed and optimized IT service workflows",
    impact: "Reduced ticket resolution time by 30%, targeted 99.9% uptime",
    x: 250,
    y: 350,
  },
  {
    id: 4,
    name: "Retail Analytics",
    emoji: "🕯️",
    tech: ["Excel", "Data Visualization", "Forecasting"],
    challenge: "Built analytics dashboard for local candle business",
    impact: "Increased forecast accuracy by 20%",
    x: 500,
    y: 280,
  },
  {
    id: 5,
    name: "Film-Fusion",
    emoji: "🎬",
    tech: ["React", "API Integration", "UI/UX"],
    challenge: "Created movie discovery web application",
    impact: "Seamless browsing experience with real-time data",
    x: 600,
    y: 180,
  },
];

// Static maze structure
interface MazeCell {
  x: number;
  y: number;
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
}

const STATIC_MAZE: MazeCell[][] = [
  [
    { x: 0, y: 0, walls: { top: true, right: false, bottom: false, left: true } },
    { x: 1, y: 0, walls: { top: true, right: false, bottom: true, left: false } },
    { x: 2, y: 0, walls: { top: true, right: true, bottom: false, left: false } },
    { x: 3, y: 0, walls: { top: true, right: false, bottom: false, left: true } },
    { x: 4, y: 0, walls: { top: true, right: false, bottom: true, left: false } },
    { x: 5, y: 0, walls: { top: true, right: true, bottom: false, left: false } },
    { x: 6, y: 0, walls: { top: true, right: false, bottom: false, left: true } },
    { x: 7, y: 0, walls: { top: true, right: false, bottom: true, left: false } },
    { x: 8, y: 0, walls: { top: true, right: true, bottom: false, left: false } },
    { x: 9, y: 0, walls: { top: true, right: false, bottom: false, left: true } },
    { x: 10, y: 0, walls: { top: true, right: false, bottom: true, left: false } },
    { x: 11, y: 0, walls: { top: true, right: true, bottom: false, left: false } },
  ],
  [
    { x: 0, y: 1, walls: { top: false, right: true, bottom: false, left: true } },
    { x: 1, y: 1, walls: { top: true, right: false, bottom: false, left: true } },
    { x: 2, y: 1, walls: { top: false, right: true, bottom: true, left: false } },
    { x: 3, y: 1, walls: { top: false, right: false, bottom: false, left: true } },
    { x: 4, y: 1, walls: { top: true, right: true, bottom: false, left: false } },
    { x: 5, y: 1, walls: { top: false, right: false, bottom: true, left: true } },
    { x: 6, y: 1, walls: { top: false, right: true, bottom: false, left: false } },
    { x: 7, y: 1, walls: { top: true, right: false, bottom: false, left: true } },
    { x: 8, y: 1, walls: { top: false, right: true, bottom: true, left: false } },
    { x: 9, y: 1, walls: { top: false, right: false, bottom: false, left: true } },
    { x: 10, y: 1, walls: { top: true, right: true, bottom: false, left: false } },
    { x: 11, y: 1, walls: { top: false, right: false, bottom: true, left: true } },
  ],
  [
    { x: 0, y: 2, walls: { top: false, right: false, bottom: true, left: true } },
    { x: 1, y: 2, walls: { top: false, right: true, bottom: false, left: false } },
    { x: 2, y: 2, walls: { top: true, right: false, bottom: false, left: true } },
    { x: 3, y: 2, walls: { top: false, right: true, bottom: true, left: false } },
    { x: 4, y: 2, walls: { top: false, right: false, bottom: false, left: true } },
    { x: 5, y: 2, walls: { top: true, right: true, bottom: false, left: false } },
    { x: 6, y: 2, walls: { top: false, right: false, bottom: true, left: true } },
    { x: 7, y: 2, walls: { top: false, right: true, bottom: false, left: false } },
    { x: 8, y: 2, walls: { top: true, right: false, bottom: false, left: true } },
    { x: 9, y: 2, walls: { top: false, right: true, bottom: true, left: false } },
    { x: 10, y: 2, walls: { top: false, right: false, bottom: false, left: true } },
    { x: 11, y: 2, walls: { top: true, right: true, bottom: false, left: false } },
  ],
  [
    { x: 0, y: 3, walls: { top: true, right: true, bottom: false, left: true } },
    { x: 1, y: 3, walls: { top: false, right: false, bottom: true, left: true } },
    { x: 2, y: 3, walls: { top: false, right: true, bottom: false, left: false } },
    { x: 3, y: 3, walls: { top: true, right: false, bottom: false, left: true } },
    { x: 4, y: 3, walls: { top: false, right: true, bottom: true, left: false } },
    { x: 5, y: 3, walls: { top: false, right: false, bottom: false, left: true } },
    { x: 6, y: 3, walls: { top: true, right: true, bottom: false, left: false } },
    { x: 7, y: 3, walls: { top: false, right: false, bottom: true, left: true } },
    { x: 8, y: 3, walls: { top: false, right: true, bottom: false, left: false } },
    { x: 9, y: 3, walls: { top: true, right: false, bottom: false, left: true } },
    { x: 10, y: 3, walls: { top: false, right: true, bottom: true, left: false } },
    { x: 11, y: 3, walls: { top: false, right: false, bottom: false, left: true } },
  ],
  [
    { x: 0, y: 4, walls: { top: false, right: false, bottom: true, left: true } },
    { x: 1, y: 4, walls: { top: true, right: true, bottom: false, left: false } },
    { x: 2, y: 4, walls: { top: false, right: false, bottom: false, left: true } },
    { x: 3, y: 4, walls: { top: false, right: true, bottom: true, left: false } },
    { x: 4, y: 4, walls: { top: true, right: false, bottom: false, left: true } },
    { x: 5, y: 4, walls: { top: false, right: true, bottom: false, left: false } },
    { x: 6, y: 4, walls: { top: false, right: false, bottom: true, left: true } },
    { x: 7, y: 4, walls: { top: true, right: true, bottom: false, left: false } },
    { x: 8, y: 4, walls: { top: false, right: false, bottom: false, left: true } },
    { x: 9, y: 4, walls: { top: false, right: true, bottom: true, left: false } },
    { x: 10, y: 4, walls: { top: true, right: false, bottom: false, left: true } },
    { x: 11, y: 4, walls: { top: false, right: true, bottom: false, left: false } },
  ],
  [
    { x: 0, y: 5, walls: { top: true, right: true, bottom: false, left: true } },
    { x: 1, y: 5, walls: { top: false, right: false, bottom: true, left: true } },
    { x: 2, y: 5, walls: { top: false, right: true, bottom: false, left: false } },
    { x: 3, y: 5, walls: { top: true, right: false, bottom: false, left: true } },
    { x: 4, y: 5, walls: { top: false, right: true, bottom: true, left: false } },
    { x: 5, y: 5, walls: { top: false, right: false, bottom: false, left: true } },
    { x: 6, y: 5, walls: { top: true, right: true, bottom: false, left: false } },
    { x: 7, y: 5, walls: { top: false, right: false, bottom: true, left: true } },
    { x: 8, y: 5, walls: { top: false, right: true, bottom: false, left: false } },
    { x: 9, y: 5, walls: { top: true, right: false, bottom: false, left: true } },
    { x: 10, y: 5, walls: { top: false, right: true, bottom: true, left: false } },
    { x: 11, y: 5, walls: { top: false, right: false, bottom: false, left: true } },
  ],
  [
    { x: 0, y: 6, walls: { top: false, right: false, bottom: false, left: true } },
    { x: 1, y: 6, walls: { top: true, right: true, bottom: false, left: false } },
    { x: 2, y: 6, walls: { top: false, right: false, bottom: true, left: true } },
    { x: 3, y: 6, walls: { top: false, right: true, bottom: false, left: false } },
    { x: 4, y: 6, walls: { top: true, right: false, bottom: false, left: true } },
    { x: 5, y: 6, walls: { top: false, right: true, bottom: false, left: false } },
    { x: 6, y: 6, walls: { top: false, right: false, bottom: true, left: true } },
    { x: 7, y: 6, walls: { top: true, right: true, bottom: false, left: false } },
    { x: 8, y: 6, walls: { top: false, right: false, bottom: false, left: true } },
    { x: 9, y: 6, walls: { top: false, right: true, bottom: true, left: false } },
    { x: 10, y: 6, walls: { top: true, right: false, bottom: false, left: true } },
    { x: 11, y: 6, walls: { top: false, right: true, bottom: false, left: false } },
  ],
  [
    { x: 0, y: 7, walls: { top: false, right: true, bottom: true, left: true } },
    { x: 1, y: 7, walls: { top: false, right: false, bottom: true, left: true } },
    { x: 2, y: 7, walls: { top: true, right: true, bottom: true, left: false } },
    { x: 3, y: 7, walls: { top: false, right: false, bottom: true, left: true } },
    { x: 4, y: 7, walls: { top: false, right: true, bottom: true, left: false } },
    { x: 5, y: 7, walls: { top: false, right: false, bottom: true, left: true } },
    { x: 6, y: 7, walls: { top: true, right: true, bottom: true, left: false } },
    { x: 7, y: 7, walls: { top: false, right: false, bottom: true, left: true } },
    { x: 8, y: 7, walls: { top: false, right: true, bottom: true, left: false } },
    { x: 9, y: 7, walls: { top: true, right: false, bottom: true, left: true } },
    { x: 10, y: 7, walls: { top: false, right: true, bottom: true, left: false } },
    { x: 11, y: 7, walls: { top: false, right: false, bottom: true, left: true } },
  ],
];

export function ProjectAssembly({ levelId, facts, onComplete, onBack }: ProjectAssemblyProps) {
  const canvasHandleRef = useRef<GameCanvasHandle>(null);
  const [collectedProjects, setCollectedProjects] = useState<number[]>([]);
  const [showProjectCard, setShowProjectCard] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionStep, setTransitionStep] = useState(0);
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });

  const gameStateRef = useRef({
    player: { x: 740, y: 250, vx: 0, vy: 0, direction: 1, animFrame: 0 },
    keys: { left: false, right: false, up: false, down: false },
    bubbleTrail: [] as { x: number; y: number; life: number }[],
    sparkles: [] as { x: number; y: number; vx: number; vy: number; life: number }[],
    nodeGlow: {} as Record<number, number>,
    playerSpeed: 4,
    playerSize: 50,
    nodeRadius: 28,
    cellSize: 60,
    maze: null as MazeCell[][] | null,
    images: {
      plankton: null as HTMLImageElement | null,
      background: null as HTMLImageElement | null,
      window: null as HTMLImageElement | null,
    },
  });

  // Initialize static maze on mount
  useEffect(() => {
    const rows = 8;
    gameStateRef.current.maze = STATIC_MAZE;
    
    // Create entrance on the LEFT side (middle row)
    const entranceRow = Math.floor(rows / 2);
    STATIC_MAZE[entranceRow][0].walls.left = false;
    
    // Position player well outside the maze on the left side with proper padding
    const cellSize = gameStateRef.current.cellSize;
    const mazePadding = 80; // Padding on all sides
    const entranceX = mazePadding - 100; // Position far left, well outside the maze
    const entranceY = entranceRow * cellSize + mazePadding + cellSize / 2;
    gameStateRef.current.player.x = entranceX;
    gameStateRef.current.player.y = entranceY;
    
    console.log("Static maze initialized. Player position:", { x: entranceX, y: entranceY, entranceRow });
  }, []);

  // Load images
  useEffect(() => {
    const planktonImg = new Image();
    planktonImg.src = "https://harmless-tapir-303.convex.cloud/api/storage/70c020a8-c7b3-40f9-9742-b8b5d690b178";
    planktonImg.onload = () => {
      gameStateRef.current.images.plankton = planktonImg;
    };

    const bgImg = new Image();
    bgImg.src = "https://harmless-tapir-303.convex.cloud/api/storage/26b7bf6f-f869-42d0-8186-692b6ccd81dd";
    bgImg.onload = () => {
      gameStateRef.current.images.background = bgImg;
    };

    const windowImg = new Image();
    windowImg.src = "https://harmless-tapir-303.convex.cloud/api/storage/e644d5fd-4bd9-47f8-93f7-66911a1cb47a";
    windowImg.onload = () => {
      gameStateRef.current.images.window = windowImg;
    };
  }, []);

  // Input handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = gameStateRef.current;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") state.keys.left = true;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") state.keys.right = true;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") state.keys.up = true;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") state.keys.down = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const state = gameStateRef.current;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") state.keys.left = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") state.keys.right = false;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") state.keys.up = false;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") state.keys.down = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const playClickSound = () => {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3");
    audio.volume = 0.4;
    audio.play().catch(err => console.log("Sound play failed:", err));
  };

  const handleRender = (ctx: CanvasRenderingContext2D, rect: DOMRect, deltaTime: number) => {
    const state = gameStateRef.current;
    const now = Date.now();

    // Camera follows player on mobile
    const isMobile = rect.width < 640;
    if (isMobile) {
      const targetX = rect.width / 2 - state.player.x;
      const targetY = rect.height / 2 - state.player.y;
      setCameraOffset({ x: targetX, y: targetY });
    } else {
      setCameraOffset({ x: 0, y: 0 });
    }

    // Apply camera transform
    ctx.save();
    if (isMobile) {
      ctx.translate(cameraOffset.x, cameraOffset.y);
    }

    // Draw background (extended for camera movement)
    if (state.images.background?.complete) {
      ctx.save();
      // Draw background larger to cover camera movement
      const bgPadding = 500;
      ctx.drawImage(
        state.images.background, 
        -bgPadding, 
        -bgPadding, 
        rect.width + bgPadding * 2, 
        rect.height + bgPadding * 2
      );
      ctx.restore();
    } else {
      ctx.fillStyle = "#A8F7E3";
      const bgPadding = 500;
      ctx.fillRect(-bgPadding, -bgPadding, rect.width + bgPadding * 2, rect.height + bgPadding * 2);
    }

    // Draw maze corridors with padding on all sides
    if (state.maze) {
      const cellSize = state.cellSize;
      const wallThickness = 4;
      const mazePadding = 80;
      const bottomPadding = 120; // Extra padding at bottom
      
      ctx.strokeStyle = "#7EE3C7";
      ctx.lineWidth = wallThickness;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = "#9EF1C8";
      ctx.shadowBlur = 8;

      for (let y = 0; y < state.maze.length; y++) {
        for (let x = 0; x < state.maze[y].length; x++) {
          const cell = state.maze[y][x];
          const px = x * cellSize + mazePadding;
          const py = y * cellSize + mazePadding;

          // Draw walls
          ctx.beginPath();
          if (cell.walls.top) {
            ctx.moveTo(px, py);
            ctx.lineTo(px + cellSize, py);
          }
          if (cell.walls.right) {
            ctx.moveTo(px + cellSize, py);
            ctx.lineTo(px + cellSize, py + cellSize);
          }
          if (cell.walls.bottom) {
            ctx.moveTo(px, py + cellSize);
            ctx.lineTo(px + cellSize, py + cellSize);
          }
          if (cell.walls.left) {
            ctx.moveTo(px, py);
            ctx.lineTo(px, py + cellSize);
          }
          ctx.stroke();
        }
      }
      
      // Draw bottom boundary with padding
      ctx.beginPath();
      ctx.moveTo(mazePadding, state.maze.length * cellSize + mazePadding);
      ctx.lineTo(state.maze[0].length * cellSize + mazePadding, state.maze.length * cellSize + mazePadding);
      ctx.stroke();
      
      ctx.shadowBlur = 0;
    }

    // Draw floating bubbles
    for (let i = 0; i < 15; i++) {
      const x = (i * 80 + now / 50) % rect.width;
      const y = rect.height - ((now / 30 + i * 50) % rect.height);
      const size = 10 + (i % 3) * 5;
      ctx.fillStyle = "rgba(164,238,210,0.3)";
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Handle player movement with wall collision
    if (state.keys.left) state.player.vx = -state.playerSpeed;
    else if (state.keys.right) state.player.vx = state.playerSpeed;
    else state.player.vx *= 0.85;

    if (state.keys.up) state.player.vy = -state.playerSpeed;
    else if (state.keys.down) state.player.vy = state.playerSpeed;
    else state.player.vy *= 0.85;

    // Calculate new position
    const newX = state.player.x + state.player.vx * deltaTime;
    const newY = state.player.y + state.player.vy * deltaTime;

    // Wall collision detection
    let canMoveX = true;
    let canMoveY = true;

    if (state.maze) {
      const cellSize = state.cellSize;
      const playerRadius = state.playerSize / 2;
      const mazePadding = 80;
      
      // Check collision with maze walls
      const checkCollision = (x: number, y: number): boolean => {
        const cellX = Math.floor((x - mazePadding) / cellSize);
        const cellY = Math.floor((y - mazePadding) / cellSize);
        
        // Allow movement outside maze bounds (for entrance area)
        if (cellY < 0 || cellY >= state.maze!.length || cellX < 0 || cellX >= state.maze![0].length) {
          return false; // Allow movement outside maze
        }
        
        const cell = state.maze![cellY][cellX];
        const px = cellX * cellSize + mazePadding;
        const py = cellY * cellSize + mazePadding;
        
        // Only check walls that are actually present, with proper tolerance
        // Tolerance of 4px to allow smooth movement through corridors
        if (cell.walls.top && y - playerRadius < py + 4) return true;
        if (cell.walls.bottom && y + playerRadius > py + cellSize - 4) return true;
        if (cell.walls.left && x - playerRadius < px + 4) return true;
        if (cell.walls.right && x + playerRadius > px + cellSize - 4) return true;
        
        return false;
      };

      canMoveX = !checkCollision(newX, state.player.y);
      canMoveY = !checkCollision(state.player.x, newY);
    }

    // Apply movement with diagonal fallback using a self-contained collision check
    if (canMoveX) state.player.x = newX;
    if (canMoveY) state.player.y = newY;

      // If both axes are blocked, try moving diagonally to escape tight corners
    if (
      !canMoveX &&
      !canMoveY &&
      (Math.abs(state.player.vx) > 0.5 || Math.abs(state.player.vy) > 0.5)
    ) {
      const reducedX = state.player.x + state.player.vx * 0.5;
      const reducedY = state.player.y + state.player.vy * 0.5;

      // Inline, safe collision check with proper null-narrowing for the maze
      const collides = (() => {
        const maze = gameStateRef.current.maze;
        if (!maze) return false;

        const cellSize = gameStateRef.current.cellSize;
        const playerRadius = gameStateRef.current.playerSize / 2;
        const mazePadding = 80;

        const cellX = Math.floor((reducedX - mazePadding) / cellSize);
        const cellY = Math.floor((reducedY - mazePadding) / cellSize);

        // Allow movement outside maze bounds (for entrance/left space)
        if (cellY < 0 || cellY >= maze.length || cellX < 0 || cellX >= maze[0].length) {
          return false;
        }

        const cell = maze[cellY][cellX];
        const px = cellX * cellSize + mazePadding;
        const py = cellY * cellSize + mazePadding;

        // Reduced tolerance (4px) for smoother movement
        if (cell.walls.top && reducedY - playerRadius < py + 4) return true;
        if (cell.walls.bottom && reducedY + playerRadius > py + cellSize - 4) return true;
        if (cell.walls.left && reducedX - playerRadius < px + 4) return true;
        if (cell.walls.right && reducedX + playerRadius > px + cellSize - 4) return true;

        return false;
      })();

      if (!collides) {
        gameStateRef.current.player.x = reducedX;
        gameStateRef.current.player.y = reducedY;
      }
    }

    // Boundary collision
    state.player.x = Math.max(state.playerSize / 2, Math.min(rect.width - state.playerSize / 2, state.player.x));
    state.player.y = Math.max(state.playerSize / 2, Math.min(rect.height - state.playerSize / 2, state.player.y));

    // Update direction
    if (state.player.vx < -0.5) state.player.direction = -1;
    else if (state.player.vx > 0.5) state.player.direction = 1;

    // Update animation frame
    if (Math.abs(state.player.vx) > 0.5 || Math.abs(state.player.vy) > 0.5) {
      state.player.animFrame = (state.player.animFrame + 0.2 * deltaTime) % 2;
    }

    // Emit bubble trail
    if (Math.abs(state.player.vx) > 1 || Math.abs(state.player.vy) > 1) {
      if (Math.random() < 0.3) {
        state.bubbleTrail.push({ x: state.player.x, y: state.player.y, life: 1 });
      }
    }

    // Update and draw bubble trail
    state.bubbleTrail = state.bubbleTrail.filter((bubble) => {
      bubble.life -= 0.02 * deltaTime;
      if (bubble.life <= 0) return false;
      ctx.fillStyle = `rgba(164,238,210,${bubble.life * 0.4})`;
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, 3, 0, Math.PI * 2);
      ctx.fill();
      return true;
    });

    // Draw project nodes
    PROJECTS.forEach((project) => {
      const isCollected = collectedProjects.includes(project.id);
      const dist = Math.hypot(state.player.x - project.x, state.player.y - project.y);

      if (!state.nodeGlow[project.id]) state.nodeGlow[project.id] = 0;

      if (dist < state.nodeRadius + state.playerSize / 2 && !isCollected) {
        state.nodeGlow[project.id] = Math.min(1, state.nodeGlow[project.id] + 0.05 * deltaTime);

        if (state.nodeGlow[project.id] >= 1 && !showProjectCard) {
          setCurrentProject(project);
          setShowProjectCard(true);
          setIsPaused(true);

          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            state.sparkles.push({
              x: project.x,
              y: project.y,
              vx: Math.cos(angle) * 3,
              vy: Math.sin(angle) * 3,
              life: 1,
            });
          }
        }
      } else {
        state.nodeGlow[project.id] *= 0.95;
      }

      const baseGlow = isCollected ? 15 : 12;
      const glowIntensity = baseGlow + state.nodeGlow[project.id] * 8;

      ctx.shadowBlur = glowIntensity;
      ctx.shadowColor = "#9EF1C8";

      ctx.fillStyle = isCollected ? "rgba(255,211,110,0.4)" : "rgba(189,247,228,0.5)";
      ctx.beginPath();
      ctx.arc(project.x, project.y, state.nodeRadius + 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(project.x, project.y, state.nodeRadius + 1, 0, Math.PI * 2);
      ctx.stroke();

      const gradient = ctx.createRadialGradient(
        project.x - state.nodeRadius * 0.3,
        project.y - state.nodeRadius * 0.3,
        0,
        project.x,
        project.y,
        state.nodeRadius
      );
      gradient.addColorStop(0, isCollected ? "#FFE89D" : "#E8FAF4");
      gradient.addColorStop(0.7, isCollected ? "#FFD36E" : "#BDF7E4");
      gradient.addColorStop(1, isCollected ? "#FFC94A" : "#9EF1C8");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(project.x, project.y, state.nodeRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;

      if (state.images.window?.complete) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(project.x, project.y, state.nodeRadius, 0, Math.PI * 2);
        ctx.clip();
        const imgSize = state.nodeRadius * 2.2;
        ctx.drawImage(state.images.window, project.x - imgSize / 2, project.y - imgSize / 2, imgSize, imgSize);
        ctx.restore();
      } else {
        ctx.font = "32px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#072C3E";
        ctx.fillText(project.emoji, project.x, project.y);
      }

      if (state.nodeGlow[project.id] > 0.5) {
        const scale = 1 + state.nodeGlow[project.id] * 0.3;
        ctx.save();
        ctx.translate(project.x, project.y);
        ctx.scale(scale, scale);
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = "#7EE3C7";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, state.nodeRadius + 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    });

    // Update and draw sparkles
    state.sparkles = state.sparkles.filter((sparkle) => {
      sparkle.x += sparkle.vx * deltaTime;
      sparkle.y += sparkle.vy * deltaTime;
      sparkle.life -= 0.03 * deltaTime;
      if (sparkle.life <= 0) return false;
      ctx.fillStyle = `rgba(231,253,251,${sparkle.life})`;
      ctx.beginPath();
      ctx.arc(sparkle.x, sparkle.y, 4, 0, Math.PI * 2);
      ctx.fill();
      return true;
    });

    // Draw Plankton
    ctx.save();
    ctx.translate(state.player.x, state.player.y);
    if (state.player.direction < 0) ctx.scale(-1, 1);
    const bobOffset = Math.sin(now / 300) * 3;
    ctx.translate(0, bobOffset);
    if (Math.abs(state.player.vx) > 1 || Math.abs(state.player.vy) > 1) {
      const tilt = Math.sin(state.player.animFrame * Math.PI) * 0.07;
      ctx.rotate(tilt);
    }
    const scale = 1 + Math.sin(now / 400) * 0.05;
    ctx.scale(scale, scale);
    ctx.shadowColor = "rgba(19,58,46,0.45)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;
    if (state.images.plankton?.complete) {
      ctx.drawImage(state.images.plankton, -state.playerSize / 2, -state.playerSize / 2, state.playerSize, state.playerSize);
    } else {
      ctx.fillStyle = "#4CAF50";
      ctx.fillRect(-state.playerSize / 2, -state.playerSize / 2, state.playerSize, state.playerSize);
    }
    ctx.restore();
    
    // Restore camera transform
    ctx.restore();
  };

  // Mobile touch controls
  const handleTouchControl = (direction: 'left' | 'right' | 'up' | 'down', isPressed: boolean) => {
    const state = gameStateRef.current;
    state.keys[direction] = isPressed;
  };

  const handleNextProject = () => {
    if (!currentProject) return;

    playClickSound();
    setCollectedProjects([...collectedProjects, currentProject.id]);
    setShowProjectCard(false);
    setCurrentProject(null);
    setIsPaused(false);

    gameStateRef.current.nodeGlow[currentProject.id] = 0;

    if (collectedProjects.length + 1 >= PROJECTS.length) {
      setTimeout(() => {
        setShowTransition(true);
        const steps = ["Compiling Project Data...", "Verifying Tech Stacks...", "Generating Portfolio Report..."];
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
      }, 500);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ background: "rgba(0, 0, 0, 0.6)" }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.8, y: 20, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          opacity: { duration: 0.2 },
        }}
        className="w-[96vw] max-w-[500px] sm:w-[90vw] sm:max-w-4xl flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden"
        style={{
          height: "85vh",
          maxHeight: "85vh",
          background: "transparent",
          border: `3px solid #9EF1C8`,
          boxShadow: `0 0 30px rgba(158,241,200,0.6), 0 8px 32px rgba(0,0,0,0.3), inset 0 0 60px rgba(0,0,0,0.1)`,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-2 py-2 sm:px-4 sm:py-3 border-b"
          style={{
            borderColor: `rgba(158,241,200,0.3)`,
            background: "linear-gradient(180deg, #D7F8EF 0%, #B8F1D2 100%)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Button variant="ghost" size="sm" onClick={() => { playClickSound(); onBack(); }} className="text-xs sm:text-sm">
            ← Back
          </Button>
          <div className="flex items-center gap-1 sm:gap-3">
            <span
              style={{
                fontFamily: "'Orbitron', sans-serif",
                color: "#17202A",
                fontSize: "clamp(0.75rem, 2.5vw, 1.1rem)",
                fontWeight: 700,
                textShadow: "0 0 6px #9EF1C8",
              }}
            >
              Badges Collected ⭐ {collectedProjects.length} / 5
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { playClickSound(); setIsPaused(!isPaused); }} className="text-xs sm:text-sm">
            {isPaused ? "Resume" : "Pause"}
          </Button>
        </div>

        {/* Game Canvas */}
        <div className="flex-1 relative" style={{ background: "#A8F7E3", overflow: "hidden" }}>
          <GameCanvas ref={canvasHandleRef} onRender={handleRender} isPaused={isPaused || showProjectCard} />
          
          {/* Mobile Touch Controls */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 sm:hidden z-50" style={{ pointerEvents: 'auto' }}>
            <div className="flex gap-2">
              {/* Left button */}
              <button
                onTouchStart={() => handleTouchControl('left', true)}
                onTouchEnd={() => handleTouchControl('left', false)}
                onMouseDown={() => handleTouchControl('left', true)}
                onMouseUp={() => handleTouchControl('left', false)}
                onMouseLeave={() => handleTouchControl('left', false)}
                className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm border-2 border-teal-400 shadow-lg active:scale-95 transition-transform flex items-center justify-center text-2xl"
                style={{ touchAction: 'none' }}
              >
                ←
              </button>
              {/* Up button */}
              <button
                onTouchStart={() => handleTouchControl('up', true)}
                onTouchEnd={() => handleTouchControl('up', false)}
                onMouseDown={() => handleTouchControl('up', true)}
                onMouseUp={() => handleTouchControl('up', false)}
                onMouseLeave={() => handleTouchControl('up', false)}
                className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm border-2 border-teal-400 shadow-lg active:scale-95 transition-transform flex items-center justify-center text-2xl"
                style={{ touchAction: 'none' }}
              >
                ↑
              </button>
              {/* Down button */}
              <button
                onTouchStart={() => handleTouchControl('down', true)}
                onTouchEnd={() => handleTouchControl('down', false)}
                onMouseDown={() => handleTouchControl('down', true)}
                onMouseUp={() => handleTouchControl('down', false)}
                onMouseLeave={() => handleTouchControl('down', false)}
                className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm border-2 border-teal-400 shadow-lg active:scale-95 transition-transform flex items-center justify-center text-2xl"
                style={{ touchAction: 'none' }}
              >
                ↓
              </button>
              {/* Right button */}
              <button
                onTouchStart={() => handleTouchControl('right', true)}
                onTouchEnd={() => handleTouchControl('right', false)}
                onMouseDown={() => handleTouchControl('right', true)}
                onMouseUp={() => handleTouchControl('right', false)}
                onMouseLeave={() => handleTouchControl('right', false)}
                className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-sm border-2 border-teal-400 shadow-lg active:scale-95 transition-transform flex items-center justify-center text-2xl"
                style={{ touchAction: 'none' }}
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Project Detail Card */}
        <AnimatePresence>
          {showProjectCard && currentProject && (
            <ProjectCard
              project={currentProject}
              isLastProject={collectedProjects.length + 1 >= PROJECTS.length}
              onNext={handleNextProject}
            />
          )}
        </AnimatePresence>

        {/* Modals */}
        <AnimatePresence>
          {(isPaused || showTransition || showComplete) && (
            <GameModals
              isPaused={isPaused && !showProjectCard}
              showTransition={showTransition}
              showComplete={showComplete}
              transitionStep={transitionStep}
              projects={PROJECTS}
              facts={facts}
              onResume={() => setIsPaused(false)}
              onExit={onBack}
              onComplete={onComplete}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}