import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Compass, MessageSquare, Waves } from "lucide-react";

// Shared knowledge base
type QA = { q: string; a: string; keywords: string[] };
const KNOWLEDGE: Array<QA> = [
  {
    q: "Master's Degree",
    a: "I completed my Master of Science in Information Systems at Illinois State University with a 4.0/4.0 GPA. Courses included: Advanced System Analysis & Design, IT Project Management, Web Development Technologies, Advanced Web Application Development, Mobile & Cloud Computing, Database Processing, Advanced Database Management, Practical Cryptography & Trusted Systems, Advanced Software Engineering, Systems Analysis & Design, Information Technology Strategy & Policy, Professional Practice in IT, Research Methodology, Information Assurance & Security, Writing for Graduate Students, C++ Programming, Information Technology Capstone.",
    keywords: ["master's", "ms", "information systems", "isu", "gpa", "courses", "graduate school", "illinois state university", "4.0", "coursework"],
  },
  {
    q: "Bachelor's Degree",
    a: "I completed my Bachelor of Computer Applications (Hons.) from Devi Ahilya Vishwavidyalaya in India with a GPA of 3.5/4.0. Courses included: Fundamentals of Programming in C, Object-Oriented Programming in C++, Core Java Programming, Data Structures & Algorithms, Digital Electronics & Computer Organization, Microprocessor & Assembly Language, Database Management Systems, Internet & Web Programming, Human-Computer Interaction, System Analysis & Design, System Programming, Computer Graphics, UNIX Operating System, Probability & Statistics, Organizational Behavior, Communication Skills & French Language, Final Year Project.",
    keywords: ["bachelor's", "undergrad", "bca", "devi ahilya", "india", "gpa", "computer applications", "courses", "subjects", "3.5", "vishwavidyalaya"],
  },
  {
    q: "Graduate Teaching Assistant",
    a: "As a Graduate Teaching Assistant at ISU, I taught IT-150 labs covering the full MS Office Suite — Word, Excel, Access, and PowerPoint — to around 150 students per semester for 2 semesters. I also graded assignments, guided projects, and provided one-on-one support.",
    keywords: ["gta", "teaching", "ta", "assistant", "professor", "ms office", "word", "excel", "access", "powerpoint", "students", "it-150", "labs", "grading"],
  },
  {
    q: "Awards",
    a: "I received a Graduate Teaching Assistantship and was honored with the Outstanding Graduate Student Award at Illinois State University.",
    keywords: ["award", "scholarship", "recognition", "outstanding", "graduate", "achievement", "teaching assistantship", "honors"],
  },
  {
    q: "Research Work",
    a: "I presented a research poster on how Artificial Intelligence is applied in the banking sector at a university symposium.",
    keywords: ["research", "symposium", "ai", "banking", "poster", "project", "artificial intelligence", "presentation"],
  },
  {
    q: "NGO Internships",
    a: "I worked with NGOs including CIIWAS and ORANGES, building accessible websites and dashboards that supported community projects and increased engagement.",
    keywords: ["ngo", "ciiwas", "oranges", "web development", "accessibility", "dashboards", "impact"],
  },
  {
    q: "Technical skills",
    a: "I'm comfortable with C, C++, Java, Python, Swift/SwiftUI, JavaScript/TypeScript, React, PHP/MySQL, and data tools. I love building full‑stack and mobile experiences.",
    keywords: ["skills", "c", "c++", "java", "python", "swift", "swiftui", "react", "php", "mysql", "javascript", "typescript", "data tools"],
  },
  {
    q: "SmartPlanner iOS app",
    a: "SmartPlanner is an iOS app built with SwiftUI, Core Data, and MVVM—focused on planning and productivity with a clean mobile UX.",
    keywords: ["smartplanner", "ios", "swiftui", "core data", "mvvm", "mobile"],
  },
  {
    q: "Film-Fusion website",
    a: "Film-Fusion is a web project (movie-focused) demonstrating full-stack concepts like routing, search, and structured UI.",
    keywords: ["film-fusion", "film", "movie", "website", "web project"],
  },
  {
    q: "Course Manager app",
    a: "Course Manager is a project for organizing and tracking courses, assignments, and progress—emphasizing reliability and UX clarity.",
    keywords: ["course manager", "courses", "assignments", "tracking"],
  },
  {
    q: "Courtside Leadership capstone",
    a: "Courtside Leadership was a capstone-style WordPress build with custom IA, plugins, and SEO improvements to boost performance and engagement.",
    keywords: ["courtside leadership", "wordpress", "seo", "capstone", "performance"],
  },
  {
    q: "Personal interests",
    a: "I love creative design, photography, and building playful/gamified UIs. Also: I'm a twin—so collaboration is in my DNA!",
    keywords: ["interests", "creative", "design", "photography", "twin", "gamified", "ui"],
  },
];

function answerFromKB(question: string) {
  const q = question.toLowerCase();
  // lightweight scoring by keyword overlap
  let best: { score: number; a: string } | null = null;
  for (const item of KNOWLEDGE) {
    let score = 0;
    for (const k of item.keywords) {
      if (q.includes(k.toLowerCase())) score += 1;
    }
    // small title similarity
    if (item.q.toLowerCase().includes(q) || q.includes(item.q.toLowerCase())) score += 2;
    if (!best || score > best.score) best = { score, a: item.a };
  }
  if (best && best.score > 0) return best.a;

  // Fallback
  return "I might not have the exact detail on that. Would you like me to point you to my projects or resume? You can also contact me directly on LinkedIn.";
}

// Simple message type
type Msg = { role: "user" | "ai"; text: string; ts: number };

// Shared header
function TopBar({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Modes
        </Button>
        <div className="text-sm opacity-70">{title}</div>
      </div>
    </header>
  );
}

/* -------------------- OPTION 1: Ask Me Anything 🌤️ -------------------- */
function AskMeAnything() {
  const [messages, setMessages] = useState<Array<Msg>>([
    { role: "ai", text: "Hi! Ask me anything about my background, projects, or skills 🌤️", ts: Date.now() },
  ]);
  const [input, setInput] = useState("");

  const onSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg: Msg = { role: "user", text: trimmed, ts: Date.now() };
    const aiMsg: Msg = {
      role: "ai",
      text:
        answerFromKB(trimmed) +
        " If you'd like a quick overview, try asking about my Master's, teaching experience, or SmartPlanner.",
      ts: Date.now() + 1,
    };
    setMessages((m) => [...m, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <div className="min-h-[calc(100vh-56px)] relative">
      {/* Animated sky and clouds */}
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-pink-100 to-sky-100 dark:from-slate-800 dark:to-slate-900">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: -200 }}
            animate={{ x: "120%" }}
            transition={{ duration: 30 + i * 5, repeat: Infinity, ease: "linear", delay: i * 2 }}
            className="absolute top-10 w-36 h-16 rounded-full bg-white/70 blur-sm"
            style={{ top: `${10 + i * 14}%`, left: `${-20 - i * 8}%` }}
          />
        ))}
      </div>

      {/* Chat box */}
      <div className="relative z-10 container mx-auto max-w-3xl px-4 py-8">
        <Card className="border-white/40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="tracking-tight">Ask Me Anything 🗨️</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[52vh] min-h-[360px] overflow-y-auto space-y-3 p-2 rounded-md bg-white/50 dark:bg-slate-900/40">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                      m.role === "user"
                        ? "bg-pink-200/80 text-slate-800"
                        : "bg-white/90 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Input
                placeholder="Ask about my Master's, projects, teaching, skills..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSend()}
                className="rounded-full shadow-sm focus-visible:ring-1"
              />
              <Button onClick={onSend} className="rounded-full">Send</Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Tip: Try "Tell me about SmartPlanner", "What's your GPA? ", or "What NGOs have you worked with?"
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* -------------------- OPTION 2: Interview Me 💬 -------------------- */
function InterviewMe() {
  const [messages, setMessages] = useState<Array<Msg>>([
    {
      role: "ai",
      text:
        "Welcome. Please proceed with your questions. I'll keep responses concise and professional.",
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");

  const formatInterviewAnswer = (q: string) => {
    // concise, professional tone
    const base = answerFromKB(q);
    const highlights =
      "Highlights: 4.0 GPA (ISU), Outstanding Graduate Student Award nomination, GTA for 120+ students, real-world NGO web development, and multi-language proficiency.";
    return `${base} ${highlights}`;
  };

  const onSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg: Msg = { role: "user", text: trimmed, ts: Date.now() };
    const aiMsg: Msg = { role: "ai", text: formatInterviewAnswer(trimmed), ts: Date.now() + 1 };
    setMessages((m) => [...m, userMsg, aiMsg]);
    setInput("");
  };

  const fmtTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#e5ddd5] dark:bg-slate-900">
      <div className="container mx-auto max-w-3xl px-4 py-6">
        <Card className="overflow-hidden border-0">
          {/* Header mock */}
          <div className="bg-[#075e54] text-white px-4 py-3 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <div className="font-semibold">Interview Me 🎤</div>
          </div>

          {/* Chat area */}
          <div className="bg-[#efe7dd] dark:bg-slate-950 h-[60vh] min-h-[380px] overflow-y-auto p-3">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex mb-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "ai" && (
                  <div className="mr-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-100 dark:from-slate-700 dark:to-slate-600 grid place-items-center border">
                      <span className="text-[10px]">AI</span>
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-lg px-3 py-2 text-sm relative ${
                    m.role === "user"
                      ? "bg-[#dcf8c6]"
                      : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  }`}
                >
                  <div>{m.text}</div>
                  <div className="text-[10px] opacity-60 mt-1 text-right flex items-center gap-1">
                    <span>{fmtTime(m.ts)}</span>
                    {m.role === "user" ? <span>✔✔</span> : null}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input bar */}
          <div className="bg-[#f0f0f0] dark:bg-slate-900 p-2 flex items-center gap-2 border-t">
            <Input
              placeholder="Ask interview questions (experience, achievements, projects, goals)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSend()}
              className="bg-white dark:bg-slate-800"
            />
            <Button onClick={onSend} variant="default">
              Send
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* -------------------- OPTION 3: Let Me Guide You 🧭 -------------------- */
function GuideMe() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Array<string>>([
    "Ahoy matey! I'm yer friendly navigator. Tap a card and I'll steer ye straight to treasure!",
  ]);

  const onSelect = (id: "projects" | "skills" | "education" | "contact") => {
    let msg = "";
    if (id === "projects") {
      msg =
        "Ahoy! Me chest o' projects: SmartPlanner (SwiftUI/Core Data/MVVM), Film-Fusion (web), Course Manager (tracking UX), and Courtside Leadership (WordPress/SEO).";
    } else if (id === "skills") {
      msg =
        "Skills off the starboard bow: C, C++, Java, Python, Swift/SwiftUI, React/TS, PHP/MySQL, data tools. A full-stack sailor at heart!";
    } else if (id === "education") {
      msg =
        "Edumacation map: ISU M.S. in Information Systems (4.0 GPA, 2025), GTA for IT‑150 (120+ students), and a BCA from India (3.5 GPA).";
    } else {
      msg = "Drop anchor to contact me—happy to chat about collaborations and opportunities!";
    }
    setMessages((m) => [...m, msg]);
  };

  const cards = useMemo(
    () => [
      {
        id: "projects" as const,
        title: "See My Projects",
        desc: "SmartPlanner, Film‑Fusion, Course Manager, Courtside Leadership",
        action: () => {
          onSelect("projects");
        },
        linkAction: () => navigate("/classic"),
      },
      {
        id: "skills" as const,
        title: "Check My Skills",
        desc: "Programming, web, mobile, data tools",
        action: () => onSelect("skills"),
        linkAction: () => navigate("/classic"),
      },
      {
        id: "education" as const,
        title: "Know My Education",
        desc: "ISU Master's, GTA, academic highlights",
        action: () => onSelect("education"),
        linkAction: () => navigate("/story"),
      },
      {
        id: "contact" as const,
        title: "Contact Me",
        desc: "Professional contact and availability",
        action: () => onSelect("contact"),
        linkAction: () => window.open("https://www.linkedin.com/", "_blank", "noopener,noreferrer"),
      },
    ],
    [navigate]
  );

  const compassRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="min-h-[calc(100vh-56px)] relative overflow-hidden">
      {/* Sky + boats */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100 to-blue-100 dark:from-slate-800 dark:to-slate-900" />
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: -200 }}
          animate={{ x: "120%" }}
          transition={{ duration: 35 + i * 8, repeat: Infinity, ease: "linear", delay: i * 3 }}
          className="absolute top-10"
          style={{ top: `${18 + i * 16}%` }}
        >
          <div className="flex items-center gap-2 text-sky-800/70 dark:text-sky-200/70">
            <Waves className="w-6 h-6" />
            <div className="w-24 h-6 rounded bg-white/70 dark:bg-slate-700/70 border" />
          </div>
        </motion.div>
      ))}

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Compass centerpiece */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <motion.div
              ref={compassRef}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-36 h-36 rounded-full grid place-items-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border shadow-inner"
            >
              <Compass className="w-20 h-20 text-amber-600 drop-shadow" />
            </motion.div>
            <div className="absolute inset-0 blur-2xl bg-amber-200/20 rounded-full" />
          </div>
          <div className="mt-4 text-center max-w-xl text-slate-700 dark:text-slate-200">
            <div className="text-2xl font-semibold">Let Me Guide You 🧭</div>
            <p className="text-sm opacity-80 mt-1">
              Ahoy matey! Let me steer ye to me treasure chest of career tales. Choose yer destination:
            </p>
          </div>
        </div>

        {/* Cards around compass */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mt-6">
          {cards.map((c) => (
            <Card key={c.id} className="bg-amber-50/70 dark:bg-amber-900/10 border-amber-200 dark:border-amber-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="tracking-tight">{c.title}</CardTitle>
                  <Badge variant="secondary">Go</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm opacity-80">{c.desc}</p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={c.action} className="shadow-none">Explain</Button>
                  <Button size="sm" variant="outline" onClick={c.linkAction} className="shadow-none">Open</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Narrative log */}
        <Card className="max-w-3xl mx-auto mt-6 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="tracking-tight">Captain's Log</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {messages.map((m, i) => (
              <div key={i} className="rounded-md border px-3 py-2 bg-amber-50/60 dark:bg-slate-800/60">
                {m}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* -------------------- Page container with three options -------------------- */
export default function AiPage() {
  const [tab, setTab] = useState<"ama" | "interview" | "guide">("ama");

  const TabButton = ({
    id,
    label,
    active,
    onClick,
  }: {
    id: string;
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm rounded-full border transition-colors ${
        active ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"
      }`}
      aria-pressed={active}
      aria-controls={`panel-${id}`}
      role="tab"
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <TopBar title="AI Chat" />

      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2 items-center justify-center">
          <TabButton id="ama" label="Ask Me Anything 🌤️" active={tab === "ama"} onClick={() => setTab("ama")} />
          <TabButton id="interview" label="Interview Me 🎤" active={tab === "interview"} onClick={() => setTab("interview")} />
          <TabButton id="guide" label="Let Me Guide You 🧭" active={tab === "guide"} onClick={() => setTab("guide")} />
        </div>
      </div>

      <main aria-live="polite">
        {tab === "ama" && <AskMeAnything />}
        {tab === "interview" && <InterviewMe />}
        {tab === "guide" && <GuideMe />}
      </main>

      <footer className="container mx-auto px-4 py-6 text-center text-xs text-muted-foreground">
        When I can't answer something precisely, I'll point you to my projects or LinkedIn. Let's connect!
      </footer>
    </div>
  );
}