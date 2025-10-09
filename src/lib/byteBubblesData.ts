export const BYTE_BUBBLES_THEME = {
  bgStart: "#EAF5FF",
  bgMid: "#CFE4FA",
  bgEnd: "#BFD7EA",
  accent: "#A7E8E1",
  bubble: "#D6EEFF",
  star: "#FFD36E",
  seafoam: "#CFF4E3",
  text: "#1F2D3D",
  textSecondary: "#5E6C84",
} as const;

export type LevelType = "runner" | "memory" | "quiz" | "puzzle" | "timeline" | "design" | "boss" | "sign";

export interface BubbleNode {
  id: number;
  label: string;
  x: number; // percentage
  y: number; // percentage
  type: LevelType;
}

export interface LevelFact {
  text: string;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  fact: string;
}

export interface PuzzlePair {
  key: string;
  lock: string;
}

export const BUBBLE_NODES: BubbleNode[] = [
  { id: 1, label: "Intro", x: 6, y: 60, type: "runner" },
  { id: 2, label: "Education", x: 20, y: 48, type: "memory" },
  { id: 3, label: "Experience", x: 34, y: 58, type: "quiz" },
  { id: 4, label: "Projects", x: 48, y: 46, type: "puzzle" },
  { id: 5, label: "Impact", x: 62, y: 56, type: "timeline" },
  { id: 6, label: "Design", x: 76, y: 44, type: "design" },
  { id: 7, label: "Future", x: 90, y: 52, type: "boss" },
  { id: 8, label: "Under Construction", x: 96, y: 30, type: "sign" },
];

export const LEVEL_DATA = {
  runner: {
    facts: [
      "MS in Information Systems — 4.0 GPA",
      "Creativity × Tech is my core build",
      "Curiosity is my main power-up",
    ],
  },
  memory: {
    facts: [
      "Web Dev • Systems Analysis • Project Management",
      "HTML • CSS • JS • React",
      "Clarity over jargon • Structured problem-solving",
    ],
  },
  quiz: {
    questions: [
      {
        q: "Students mentored as GTA?",
        options: ["50+", "120+", "300+"],
        answer: 1,
        fact: "Mentored 120+ students",
      },
      {
        q: "Teaching style?",
        options: ["Slides", "Simple words + examples", "Only code"],
        answer: 1,
        fact: "I simplify complex topics",
      },
      {
        q: "Biggest boost?",
        options: ["Drawing", "Communication", "Hardware"],
        answer: 1,
        fact: "Communication upgraded",
      },
    ] as QuizQuestion[],
  },
  puzzle: {
    pairs: [
      { key: "SmartPlanner", lock: "SwiftUI • Core Data • MVVM" },
      { key: "Poha Factory", lock: "React • Reusable Components" },
      { key: "Capstone Site", lock: "Live Website Revamp" },
    ] as PuzzlePair[],
    facts: [
      "Built SmartPlanner (iOS, SwiftUI, Core Data, MVVM)",
      "Created Poha Factory UI (React)",
      "Revamped a live client site (Capstone)",
    ],
  },
  timeline: {
    cards: ["Education", "GTA", "NGO Projects", "Capstone", "Now"],
    order: [0, 1, 2, 3, 4],
    facts: [
      "NGO tech for women empowerment",
      "Dashboards to track impact",
      "People-first technology mindset",
    ],
  },
  design: {
    mode: "spotDiff",
    diffs: 5,
    facts: [
      "Ghibli-inspired pastel UI",
      "Data is a story first",
      "Creativity makes tech warm",
    ],
  },
  boss: {
    sequence: ["runnerJump", "memoryPair", "quizOne", "puzzlePair"],
    facts: [
      "Target: System Analyst / Creative Tech",
      "Data + Design + People",
      "Achievement unlocked: You know me",
    ],
    cta: ["Resume", "LinkedIn", "GitHub"],
  },
};

export interface GameProgress {
  xp: number;
  factsFound: string[];
  levelStatus: Record<number, "incomplete" | "complete">;
}

export const loadGameProgress = (): GameProgress => {
  try {
    const saved = localStorage.getItem("byteBubblesProgress");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to load game progress:", e);
  }
  return {
    xp: 0,
    factsFound: [],
    levelStatus: {},
  };
};

export const saveGameProgress = (progress: GameProgress): void => {
  try {
    localStorage.setItem("byteBubblesProgress", JSON.stringify(progress));
  } catch (e) {
    console.error("Failed to save game progress:", e);
  }
};
