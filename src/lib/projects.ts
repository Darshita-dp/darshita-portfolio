export interface Project {
  id: string;
  title: string;
  tags: string[];
  thumb: string;
  summary: string;
  link: string;
  metrics: Record<string, number | string>;
  case: string;
  description?: string;
  tech?: string[];
  challenges?: string[];
  outcomes?: string[];
}

export const projects: Project[] = [
  {
    id: "courtside",
    title: "Courtside Leadership",
    tags: ["WordPress", "Client", "SEO"],
    thumb: "/images/courtside.png",
    summary: "Revamped SMB site with new IA and custom plugins.",
    link: "https://courtsideleadership.com/",
    metrics: { lcp_ms: 2300, pages: 12 },
    case: "/cases/courtside",
    description: "Complete website redesign and development for a leadership consulting firm, focusing on improved information architecture and custom WordPress functionality.",
    tech: ["WordPress", "PHP", "MySQL", "JavaScript", "CSS3"],
    challenges: ["Legacy content migration", "SEO preservation", "Performance optimization"],
    outcomes: ["40% faster load times", "Improved user engagement", "Better search rankings"]
  },
  {
    id: "ciiwas",
    title: "CIIWAS - NGO website",
    tags: ["HTML/CSS/JS", "Accessibility", "Performance"],
    thumb: "/images/ciiwas.png",
    summary: "Events hub with mobile-first UI and docs.",
    link: "https://www.ciiwas.org/",
    metrics: { lcp_ms: 2100 },
    case: "/cases/ciiwas",
    description: "Developed a comprehensive website for a non-profit organization with focus on accessibility and mobile-first design.",
    tech: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
    challenges: ["Accessibility compliance", "Multi-language support", "Event management system"],
    outcomes: ["WCAG AA compliance", "50% mobile traffic increase", "Streamlined event registration"]
  },
  {
    id: "movielens",
    title: "Movie Lens",
    tags: ["PHP", "MySQL", "Auth"],
    thumb: "/images/movielens.png",
    summary: "Movie reviews with login, search, ratings.",
    link: "https://bucolic-travesseiro-0fbc42.netlify.app/",
    metrics: { users_demo: 45 },
    case: "/cases/movielens",
    description: "Full-stack movie review application with user authentication, advanced search, and rating system.",
    tech: ["PHP", "MySQL", "JavaScript", "Bootstrap", "AJAX"],
    challenges: ["Database optimization", "User authentication", "Real-time updates"],
    outcomes: ["Scalable architecture", "Secure user system", "Responsive interface"]
  }
];

export const skills = {
  languages: { "C++": 4, "Java": 3, "Python": 3 },
  web: { "HTML": 5, "CSS": 4, "JavaScript": 4, "React": 3 },
  mobile: { "SwiftUI": 3 },
  data: { "SQL": 4, "MySQL": 4, "Oracle": 3 },
  tools: { "Jira": 4, "Git": 4, "WordPress": 4 }
};

export function getProjectById(id: string): Project | undefined {
  return projects.find(project => project.id === id);
}

export function getProjectsByTag(tag: string): Project[] {
  return projects.filter(project => 
    project.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
}

export function searchProjects(query: string): Project[] {
  const lowercaseQuery = query.toLowerCase();
  return projects.filter(project =>
    project.title.toLowerCase().includes(lowercaseQuery) ||
    project.summary.toLowerCase().includes(lowercaseQuery) ||
    project.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}
