export const GAME_PALETTE = {
  bgStart: '#E6F2FF',
  bgMid: '#CFE4FA', 
  bgEnd: '#BFD7EA',
  accent: '#A7E8E1',
  bubble: '#D6EEFF',
  star: '#FFD36E',
  success: '#CFF4E3',
  highlight: '#FFC7C7',
  textPrimary: '#243B53',
  textSecondary: '#5E6C84'
} as const;

export type LevelId = 'runner' | 'memory' | 'quiz' | 'puzzle' | 'timeline' | 'design' | 'boss';

export interface LevelData {
  id: LevelId;
  name: string;
  emoji: string;
  facts: string[];
  x: number; // position on map (%)
  y: number; // position on map (%)
}

export const GAME_LEVELS: LevelData[] = [
  {
    id: 'runner',
    name: 'Runner Quest',
    emoji: '👟',
    x: 20,
    y: 75,
    facts: [
      'MS in Information Systems — 4.0 GPA 🎓',
      'Blending creativity with tech 💻✨',
      'Curiosity is my power-up to keep leveling up.'
    ]
  },
  {
    id: 'memory',
    name: 'Memory Match',
    emoji: '🃏',
    x: 35,
    y: 45,
    facts: [
      'Web Dev • Systems Analysis • Project Management',
      'HTML • CSS • JS • React',
      'Clean, clear design is my favorite buff.'
    ]
  },
  {
    id: 'quiz',
    name: 'Quiz Arena',
    emoji: '❓',
    x: 50,
    y: 25,
    facts: [
      'Mentored 120+ students as GTA.',
      'Communication skill upgraded +10 XP.',
      'Simplified learning is my strongest spell.'
    ]
  },
  {
    id: 'puzzle',
    name: 'Puzzle Forge',
    emoji: '🔐',
    x: 65,
    y: 40,
    facts: [
      'SmartPlanner (SwiftUI, Core Data, MVVM).',
      'Poha Factory (React, reusable components).',
      'Capstone Project — Live Website Revamp.'
    ]
  },
  {
    id: 'timeline',
    name: 'Timeline Drift',
    emoji: '⏱️',
    x: 75,
    y: 65,
    facts: [
      'Worked with NGOs on women empowerment tech.',
      'Created dashboards for impact tracking.',
      'Tech should help people level up too.'
    ]
  },
  {
    id: 'design',
    name: 'Design Dive',
    emoji: '👀',
    x: 60,
    y: 80,
    facts: [
      'Studio Ghibli vibes inspire my designs 🌸.',
      'Data is storytelling — I visualize emotion in analytics.',
      'Creativity fuels clarity.'
    ]
  },
  {
    id: 'boss',
    name: 'Boss Realm',
    emoji: '🚀',
    x: 85,
    y: 50,
    facts: [
      'Dream role: System Analyst / Creative Technologist.',
      'I mix design, data, and people-focused solutions.',
      "Achievement unlocked: 'Met Darshita 🌸.'"
    ]
  }
];

export interface GameProgress {
  completedLevels: Set<LevelId>;
  unlockedFacts: Record<LevelId, number>;
  totalXP: number;
}

export const loadGameProgress = (): GameProgress => {
  try {
    const saved = localStorage.getItem('bubblesGameProgress');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        completedLevels: new Set(parsed.completedLevels || []),
        unlockedFacts: parsed.unlockedFacts || {
          runner: 0,
          memory: 0,
          quiz: 0,
          puzzle: 0,
          timeline: 0,
          design: 0,
          boss: 0
        },
        totalXP: parsed.totalXP || 0
      };
    }
  } catch (e) {
    console.error('Failed to load game progress:', e);
  }
  return {
    completedLevels: new Set(),
    unlockedFacts: {
      runner: 0,
      memory: 0,
      quiz: 0,
      puzzle: 0,
      timeline: 0,
      design: 0,
      boss: 0
    },
    totalXP: 0
  };
};

export const saveGameProgress = (progress: GameProgress): void => {
  try {
    localStorage.setItem('bubblesGameProgress', JSON.stringify({
      completedLevels: Array.from(progress.completedLevels),
      unlockedFacts: progress.unlockedFacts,
      totalXP: progress.totalXP
    }));
  } catch (e) {
    console.error('Failed to save game progress:', e);
  }
};
