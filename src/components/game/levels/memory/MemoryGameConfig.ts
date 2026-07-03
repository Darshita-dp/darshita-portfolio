export const MEMORY_CONFIG = {
  // Game mechanics
  CARD_PAIRS: [
    { value: "html", display: "HTML", pair: "webdev" },
    { value: "webdev", display: "Web Development", pair: "html" },
    { value: "sql", display: "SQL", pair: "database" },
    { value: "database", display: "Database", pair: "sql" },
    { value: "python", display: "Python", pair: "dataanalysis" },
    { value: "dataanalysis", display: "Data Analysis", pair: "python" },
    { value: "powerbi", display: "Power BI", pair: "visualization" },
    { value: "visualization", display: "Visualization", pair: "powerbi" },
    { value: "agile", display: "Agile", pair: "projectmgmt" },
    { value: "projectmgmt", display: "Project Management", pair: "agile" },
  ],
  
  CORRECT_MESSAGES: [
    "🧩 Skill Synced!\nKnowledge Node Connected.",
    "⚡ Data Flow Stabilized.",
    "📊 Skill Matrix Updated.",
    "💻 Module Linked Successfully.",
  ],
  
  WRONG_MESSAGES: [
    "❗ Desync Detected\nTry another pair, Player.",
    "Connection Lost – Recalibrating…",
    "Mismatch! Reattempt Required.",
  ],
  
  ENCOURAGEMENTS: [
    "Processing like a pro, Player.",
    "XP pathways glowing bright!",
    "Neural data flow stable. Keep matching.",
    "Halfway synced — knowledge circuits aligned!",
  ],
  
  TRANSITION_MESSAGES: [
    "Uploading Education File…",
    "Verifying academic credentials... ✅",
    "Decrypting skill upgrades... ⚙️",
    "Generating Level Report…",
  ],
  
  // Game balance
  XP_PER_MATCH: 30,
  TOTAL_PAIRS: 5,
  MATCH_DELAY: 1200,
  WRONG_DELAY: 1500,
  ENCOURAGEMENT_DELAY: 2500,
  TRANSITION_DELAY: 1200,
  
  // Audio
  CLICK_SOUND_URL: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
  CLICK_SOUND_VOLUME: 0.4,
  
  // Images
  CARD_BACK_IMAGE: "https://harmless-tapir-303.convex.cloud/api/storage/9835dd29-1c38-4215-ac90-4276110dc314",
  GAME_BG_IMAGE: "https://harmless-tapir-303.convex.cloud/api/storage/1a671974-29ce-4d1d-bd92-640e3bce7ed6",
  
  // Card front images by category
  CARD_IMAGES: {
    html: "https://harmless-tapir-303.convex.cloud/api/storage/1eb3fc27-d593-4c37-92bd-2cd7b3a6ecfc",
    webdev: "https://harmless-tapir-303.convex.cloud/api/storage/1eb3fc27-d593-4c37-92bd-2cd7b3a6ecfc",
    sql: "https://harmless-tapir-303.convex.cloud/api/storage/a04d42f1-00e1-486b-8232-28954a6e86f0",
    database: "https://harmless-tapir-303.convex.cloud/api/storage/a04d42f1-00e1-486b-8232-28954a6e86f0",
    python: "https://harmless-tapir-303.convex.cloud/api/storage/8068e115-c02d-43dd-9ac1-09cf93ed9a6d",
    dataanalysis: "https://harmless-tapir-303.convex.cloud/api/storage/8068e115-c02d-43dd-9ac1-09cf93ed9a6d",
    powerbi: "https://harmless-tapir-303.convex.cloud/api/storage/ede9107b-55a3-4ed1-ab07-e7b2994c987d",
    visualization: "https://harmless-tapir-303.convex.cloud/api/storage/ede9107b-55a3-4ed1-ab07-e7b2994c987d",
    agile: "https://harmless-tapir-303.convex.cloud/api/storage/1e878333-42a1-4456-8515-faf38f2b8bb1",
    projectmgmt: "https://harmless-tapir-303.convex.cloud/api/storage/1e878333-42a1-4456-8515-faf38f2b8bb1",
  },
};

export interface GameCard {
  id: number;
  value: string;
  display: string;
  isFlipped: boolean;
  isMatched: boolean;
}
