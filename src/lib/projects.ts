export interface Project {
  id: string;
  title: string;
  tags: string[];
  thumb: string;
  summary: string;
  link: string;
  /** Explicit GitHub repository URL (added when source is open-sourced on GitHub). */
  githubUrl?: string;
  /** `github.com/Darshita-dp/<repoSlug>` slug. */
  repoSlug?: string;
  metrics: Record<string, number | string>;
  case: string;
  description?: string;
  tech?: string[];
  challenges?: string[];
  outcomes?: string[];
  /** Primary language as reported by GitHub, e.g. "TypeScript" | "Jupyter Notebook". */
  language?: string;
  /** Repository topics, e.g. ["react", "dashboard"]. */
  topics?: string[];
}

// Helpers so every GitHub entry mirrors the same conventions.
const githubThumb = (slug: string) =>
  `https://opengraph.githubassets.com/1/Darshita-dp/${slug}`;
const gh = (slug: string) => `https://github.com/Darshita-dp/${slug}`;

export const projects: Project[] = [
  // ---------- Existing flagship entries ----------
  // Kept verbatim so game level ids, /cases/[id] routes, and AI references
  // (SmartPlanner, Film-Fusion, etc.) keep working during the transition.
  {
    id: "courtside",
    title: "Courtside Leadership",
    tags: ["WordPress", "Client", "SEO"],
    thumb: "/images/courtside.png",
    summary: "Revamped SMB site with new IA and custom plugins.",
    link: "https://courtsideleadership.com/",
    githubUrl: gh("Courtside-Leadership-Website"),
    metrics: { lcp_ms: 2300, pages: 12 },
    case: "/cases/courtside",
    description:
      "Complete website redesign and development for a leadership consulting firm, focusing on improved information architecture and custom WordPress functionality.",
    tech: ["WordPress", "PHP", "MySQL", "JavaScript", "CSS3"],
    challenges: ["Legacy content migration", "SEO preservation", "Performance optimization"],
    outcomes: ["40% faster load times", "Improved user engagement", "Better search rankings"],
  },
  {
    id: "ciiwas",
    title: "CIIWAS - NGO website",
    tags: ["HTML/CSS/JS", "Accessibility", "Performance"],
    thumb: "/images/ciiwas.png",
    summary: "Events hub with mobile-first UI and docs.",
    link: "https://www.ciiwas.org/",
    githubUrl: gh("CIIWAS-NGO-Website"),
    metrics: { lcp_ms: 2100 },
    case: "/cases/ciiwas",
    description:
      "Developed a comprehensive website for a non-profit organization with focus on accessibility and mobile-first design.",
    tech: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
    challenges: ["Accessibility compliance", "Multi-language support", "Event management system"],
    outcomes: ["WCAG AA compliance", "50% mobile traffic increase", "Streamlined event registration"],
  },
  {
    id: "movielens",
    title: "Movie Lens",
    tags: ["PHP", "MySQL", "Auth"],
    thumb: "/images/movielens.png",
    summary: "Movie reviews with login, search, ratings.",
    link: "https://bucolic-travesseiro-0fbc42.netlify.app/",
    githubUrl: gh("MovieLens"),
    metrics: { users_demo: 45 },
    case: "/cases/movielens",
    description:
      "Full-stack movie review application with user authentication, advanced search, and rating system.",
    tech: ["PHP", "MySQL", "JavaScript", "Bootstrap", "AJAX"],
    challenges: ["Database optimization", "User authentication", "Real-time updates"],
    outcomes: ["Scalable architecture", "Secure user system", "Responsive interface"],
  },

  // ---------- Live GitHub repos (new) ----------
  {
    id: "healthcare-rcc",
    title: "Healthcare Revenue Cycle Command Center",
    tags: ["Healthcare", "Analytics", "Automation"],
    thumb: githubThumb("Healthcare-Revenue-Cycle-Command-Center"),
    summary:
      "End-to-end healthcare RCM analytics — claims, denials, payer performance, revenue leakage.",
    link: gh("Healthcare-Revenue-Cycle-Command-Center"),
    githubUrl: gh("Healthcare-Revenue-Cycle-Command-Center"),
    repoSlug: "Healthcare-Revenue-Cycle-Command-Center",
    metrics: {},
    case: "/cases/healthcare-rcc",
    description:
      "Full healthcare analytics and automation system that tracks claims, denials, payer performance, and revenue leakage — giving finance and operations teams a single command center for the revenue cycle.",
    tech: ["Python", "SQL", "Power BI", "Excel"],
    challenges: ["Heterogeneous claims data", "Payer-mix logic", "Revenue-leakage detection"],
    outcomes: ["Centralized KPIs", "Actionable denial alerts", "Faster reporting turnaround"],
  },
  {
    id: "virtual-birthday-party",
    title: "Virtual Birthday Party",
    tags: ["React", "TypeScript", "Multiplayer"],
    thumb: githubThumb("virtual-birthday-party"),
    summary:
      "Real-time, multiplayer virtual birthday party memory capsule.",
    link: gh("virtual-birthday-party"),
    githubUrl: gh("virtual-birthday-party"),
    repoSlug: "virtual-birthday-party",
    metrics: {},
    case: "/cases/virtual-birthday-party",
    description:
      "A real-time virtual birthday party memory capsule built with React + TypeScript where participants join a shared space, drop memories and play interactive moments together.",
    tech: ["React", "TypeScript", "Next.js", "CSS Modules"],
    language: "TypeScript",
    topics: ["react", "typescript", "creative-coding", "multiplayer", "nextjs", "realtime"],
    challenges: [
      "Concurrent multiplayer state",
      "Real-time sync",
      "Smooth creative-coding animations",
    ],
    outcomes: ["Multiplayer lobby flow", "Reusable room components", "Clean styling system"],
  },
  {
    id: "ecommerce-funnel-analysis",
    title: "E-commerce Funnel Analysis",
    tags: ["Jupyter", "Python", "Sequencing"],
    thumb: githubThumb("ecommerce-funnel-analysis"),
    summary:
      "Conversion-funnel analysis using sequence-based tracking and segmentation.",
    link: gh("ecommerce-funnel-analysis"),
    githubUrl: gh("ecommerce-funnel-analysis"),
    repoSlug: "ecommerce-funnel-analysis",
    metrics: {},
    case: "/cases/ecommerce-funnel-analysis",
    description:
      "A Jupyter notebook project that uses sequence-based tracking and segmentation to analyze an e-commerce conversion funnel and surface where shoppers drop off.",
    tech: ["Python", "Pandas", "Jupyter"],
    language: "Jupyter Notebook",
    challenges: ["Event-sequence reconstruction", "Segmentation logic", "Funnel visualization"],
    outcomes: ["Drop-off surfaced by step", "Segment-level insights", "Reusable notebook"],
  },
  {
    id: "spotify-powerbi-dashboard",
    title: "Spotify Power BI Dashboard",
    tags: ["Power BI", "Music", "DAX"],
    thumb: githubThumb("spotify-powerbi-dashboard"),
    summary:
      "Interactive Spotify analytics exploring song popularity and artist trends.",
    link: gh("spotify-powerbi-dashboard"),
    githubUrl: gh("spotify-powerbi-dashboard"),
    repoSlug: "spotify-powerbi-dashboard",
    metrics: {},
    case: "/cases/spotify-powerbi-dashboard",
    description:
      "Interactive Power BI dashboard that explores song popularity and artist trends in Spotify data using DAX measures and power-query transformations.",
    tech: ["Power BI", "DAX", "Power Query"],
    topics: ["spotify", "dashboard", "data-visualization", "data-analytics", "dax", "powerbi", "music-data"],
    challenges: [
      "Shaping JSON-like music data",
      "Cross-artist comparisons",
      "Storytelling in a dashboard",
    ],
    outcomes: ["Trend-rich visualizations", "Reusable DAX library", "Artist deep-dives"],
  },
  {
    id: "telecom-customer-churn-eda",
    title: "Telecom Customer Churn EDA",
    tags: ["Python", "EDA", "Pandas"],
    thumb: githubThumb("telecom-customer-churn-eda"),
    summary:
      "Exploratory Data Analysis on telecom customer churn.",
    link: gh("telecom-customer-churn-eda"),
    githubUrl: gh("telecom-customer-churn-eda"),
    repoSlug: "telecom-customer-churn-eda",
    metrics: {},
    case: "/cases/telecom-customer-churn-eda",
    description:
      "Exploratory Data Analysis on telecom customer churn using Python, Pandas and Seaborn to surface the factors most correlated with customer loss.",
    tech: ["Python", "Pandas", "Seaborn", "Matplotlib"],
    language: "Jupyter Notebook",
    topics: ["python", "eda", "pandas", "data-visualization", "seaborn", "telecom"],
    challenges: ["Class imbalance", "Feature encoding", "Distinguishing churn drivers"],
    outcomes: ["Cleaned dataset", "Visual EDA report", "Driver hypotheses"],
  },
  {
    id: "walmart-sales-analysis",
    title: "Walmart Sales Analysis",
    tags: ["Jupyter", "SQL", "Python"],
    thumb: githubThumb("walmart-sales-analysis"),
    summary:
      "SQL + Python project analyzing Walmart sales data for business insights.",
    link: gh("walmart-sales-analysis"),
    githubUrl: gh("walmart-sales-analysis"),
    repoSlug: "walmart-sales-analysis",
    metrics: {},
    case: "/cases/walmart-sales-analysis",
    description:
      "A combined SQL + Python analysis of Walmart sales data to surface business insights — top-performing stores, seasonal demand, and product mix trends.",
    tech: ["SQL", "Python", "Jupyter"],
    language: "Jupyter Notebook",
    challenges: ["Multi-table joins", "Time-series seasonality", "Translating queries into KPIs"],
    outcomes: ["Top-store leaderboard", "Seasonality heatmap", "Actionable business insights"],
  },
  {
    id: "weatherapi-powerbi-dashboard",
    title: "WeatherAPI Power BI Dashboard",
    tags: ["Power BI", "Weather", "Real-time"],
    thumb: githubThumb("weatherapi-powerbi-dashboard"),
    summary:
      "Real-time Power BI dashboard for weather and air-quality indicators.",
    link: gh("weatherapi-powerbi-dashboard"),
    githubUrl: gh("weatherapi-powerbi-dashboard"),
    repoSlug: "weatherapi-powerbi-dashboard",
    metrics: {},
    case: "/cases/weatherapi-powerbi-dashboard",
    description:
      "Interactive Power BI dashboard that pulls real-time weather and air-quality indicators from WeatherAPI and visualizes them with DAX-driven KPIs.",
    tech: ["Power BI", "DAX", "Power Query", "WeatherAPI"],
    topics: ["dashboard", "data-visualization", "data-analytics", "weather-data", "power-query", "dax", "powerbi"],
    challenges: ["Live-data refresh", "Air-quality joins", "Card / map visuals"],
    outcomes: ["Real-time KPIs", "Location-level drill-downs", "Reusable refresh pattern"],
  },
];

export const skills = {
  languages: { "C++": 4, "Java": 3, "Python": 3 },
  web: { "HTML": 5, "CSS": 4, "JavaScript": 4, "React": 3 },
  mobile: { "SwiftUI": 3 },
  data: { "SQL": 4, "MySQL": 4, "Oracle": 3 },
  tools: { "Jira": 4, "Git": 4, "WordPress": 4 },
};

export function getProjectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

export function getProjectsByTag(tag: string): Project[] {
  return projects.filter((project) =>
    project.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))
  );
}

export function searchProjects(query: string): Project[] {
  const lowercaseQuery = query.toLowerCase();
  return projects.filter(
    (project) =>
      project.title.toLowerCase().includes(lowercaseQuery) ||
      project.summary.toLowerCase().includes(lowercaseQuery) ||
      project.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
      (project.repoSlug?.toLowerCase().includes(lowercaseQuery) ?? false) ||
      (project.description?.toLowerCase().includes(lowercaseQuery) ?? false)
  );
}
