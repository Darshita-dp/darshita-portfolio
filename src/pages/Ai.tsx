import { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Compass, MessageSquare, Waves, Send, Check, CheckCheck, Clock } from "lucide-react";
import { KNOWLEDGE, type QA } from "@/lib/aiKnowledge";

function answerFromKB(question: string) {
  const q = question.toLowerCase();
  
  // Boost score for "why" questions
  const isWhyQuestion = q.includes("why") || q.includes("what motivated") || q.includes("reason for");
  
  // lightweight scoring by keyword overlap
  let best: { score: number; a: string } | null = null;
  for (const item of KNOWLEDGE) {
    let score = 0;
    for (const k of item.keywords) {
      if (q.includes(k.toLowerCase())) score += 1;
    }
    // small title similarity
    if (item.q.toLowerCase().includes(q) || q.includes(item.q.toLowerCase())) score += 2;
    
    // Boost motivational entries for "why" questions
    if (isWhyQuestion && (item.q.includes("Why") || item.q.includes("motivated"))) {
      score += 3;
    }
    
    if (!best || score > best.score) best = { score, a: item.a };
  }
  if (best && best.score > 0) return best.a;

  // Fallback
  return "I might not have the exact detail on that. Would you like me to point you to my projects or resume? You can also contact me directly on LinkedIn.";
}

// Simple message type
type Msg = { 
  role: "user" | "ai"; 
  text: string; 
  ts: number;
  status?: "sending" | "sent" | "delivered" | "seen";
};

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

/* -------------------- WhatsApp-Style Interview Me 💼 -------------------- */
function InterviewMe() {
  const [messages, setMessages] = useState<Array<Msg>>([
    {
      role: "ai",
      text: "Welcome. Please proceed with your questions. I'll keep responses concise and professional.",
      ts: Date.now(),
      status: "seen",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickChips, setShowQuickChips] = useState(true);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const quickChips = [
    "Tell me about your GTA experience",
    "Walk me through SmartPlanner",
    "Top 3 strengths",
    "Why Data Analyst?",
    "A project with measurable impact",
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Mark messages as seen when they enter viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const msgIndex = parseInt(entry.target.getAttribute("data-msg-index") || "-1");
            if (msgIndex >= 0) {
              setMessages((prev) =>
                prev.map((msg, idx) =>
                  idx === msgIndex && msg.role === "user" && msg.status !== "seen"
                    ? { ...msg, status: "seen" }
                    : msg
                )
              );
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    const msgElements = document.querySelectorAll("[data-msg-index]");
    msgElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [messages]);

  const onSend = (text?: string) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isTyping) return;
    
    setShowQuickChips(false);
    const userMsg: Msg = { role: "user", text: trimmed, ts: Date.now(), status: "sending" };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate delivery states
    setTimeout(() => {
      setMessages((m) =>
        m.map((msg, idx) => (idx === m.length - 1 ? { ...msg, status: "sent" } : msg))
      );
    }, 300);

    setTimeout(() => {
      setMessages((m) =>
        m.map((msg, idx) => (idx === m.length - 1 ? { ...msg, status: "delivered" } : msg))
      );
    }, 600);

    // AI response after typing delay
    setTimeout(() => {
      const aiMsg: Msg = {
        role: "ai",
        text: answerFromKB(trimmed),
        ts: Date.now(),
        status: "seen",
      };
      setMessages((m) => [...m, aiMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const fmtTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const StatusIcon = ({ status }: { status?: string }) => {
    if (status === "sending") return <Clock className="w-3 h-3 text-gray-400" />;
    if (status === "sent") return <Check className="w-3 h-3 text-gray-400" />;
    if (status === "delivered") return <CheckCheck className="w-3 h-3 text-gray-400" />;
    if (status === "seen") return <CheckCheck className="w-3 h-3 text-[#34B7F1]" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-[#EDE7E3] dark:bg-slate-900 flex flex-col">
      {/* WhatsApp-style Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B6A5B] text-white px-4 py-3 flex items-center justify-between shadow-md h-14">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="text-white hover:bg-white/10 p-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white ring-2 ring-white overflow-hidden">
              <img
                        src="https://harmless-tapir-303.convex.cloud/api/storage/fbbcab3e-d3b1-4639-99b4-311c5e1ab7ca"
                alt="Darshita Patel"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-semibold text-sm">Interview Me 💼</div>
              <div className="text-xs opacity-90 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                {isTyping ? "typing..." : "online"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Body */}
      <div
        ref={chatBodyRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-2 max-w-[820px] mx-auto w-full pt-[72px] pb-[132px]"
      >
        {messages.map((m, idx) => {
          const isFirstInGroup =
            idx === 0 || messages[idx - 1].role !== m.role;
          const isLastInGroup =
            idx === messages.length - 1 || messages[idx + 1].role !== m.role;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-2`}
              data-msg-index={idx}
              ref={idx === messages.length - 1 ? lastMessageRef : null}
            >
              {m.role === "ai" && isFirstInGroup && (
                <div className="w-8 h-8 rounded-full bg-white ring-1 ring-gray-200 overflow-hidden flex-shrink-0">
                  <img
                    src="https://harmless-tapir-303.convex.cloud/api/storage/fbbcab3e-d3b1-4639-99b4-311c5e1ab7ca"
                    alt="AI"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {m.role === "ai" && !isFirstInGroup && <div className="w-8" />}

              <div
                className={`max-w-[75%] rounded-[18px] px-3 py-2 text-sm shadow-sm ${
                  m.role === "user"
                    ? "bg-[#DCF8C6] text-[#102015] rounded-tr-sm"
                    : "bg-white text-[#1C1C1C] border border-[#E8EAED] rounded-tl-sm"
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
                <div className="text-[11px] text-[#7A7F85] mt-1 flex items-center justify-end gap-1">
                  <span>{fmtTime(m.ts)}</span>
                  {m.role === "user" && <StatusIcon status={m.status} />}
                </div>
              </div>

              {m.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white text-xs font-semibold grid place-items-center flex-shrink-0">
                  U
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Quick Chips */}
        {showQuickChips && messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mt-3 justify-center"
          >
            {quickChips.map((chip, i) => (
              <button
                key={i}
                onClick={() => onSend(chip)}
                className="px-3 py-1.5 text-xs bg-white border border-[#E8EAED] rounded-full hover:bg-gray-50 transition-colors shadow-sm"
              >
                {chip}
              </button>
            ))}
          </motion.div>
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-white ring-1 ring-gray-200 overflow-hidden flex-shrink-0">
              <img
                src="https://harmless-tapir-303.convex.cloud/api/storage/fbbcab3e-d3b1-4639-99b4-311c5e1ab7ca"
                alt="AI"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-white border border-[#E8EAED] rounded-[18px] rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                    className="w-2 h-2 rounded-full bg-gray-400"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Bar */}
      <div className="fixed bottom-[72px] left-0 right-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-4 py-3 border-t border-gray-200 shadow-lg z-40">
        <div className="flex items-center gap-3 max-w-[820px] mx-auto">
          <Input
            placeholder="Ask interview questions (experience, achievements, projects, goals)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            disabled={isTyping}
            className="flex-1 rounded-full bg-white border-gray-300 focus-visible:ring-1 h-11 shadow-sm"
          />
          <Button
            onClick={() => onSend()}
            disabled={!input.trim() || isTyping}
            className="rounded-full w-11 h-11 p-0 bg-[#128C7E] hover:bg-[#0B6A5B] shadow-md active:scale-95 transition-transform"
          >
            <Send className="w-5 h-5 -rotate-6" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 px-4 py-4 text-center text-xs text-gray-600 dark:text-gray-400 border-t z-30">
        <div className="max-w-[820px] mx-auto">
          <p className="mb-2">
            When I can't answer something precisely, I'll point you to my projects or LinkedIn. Let's connect!
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Button size="sm" variant="outline" onClick={() => window.location.href = "/classic"}>
              View Projects
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open("https://www.linkedin.com/in/darshita-patel", "_blank")}
            >
              LinkedIn
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.location.href = "mailto:darshitapatel1506@gmail.com"}
            >
              Email
            </Button>
          </div>
        </div>
      </footer>
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

/* -------------------- Page container with two options -------------------- */
export default function AiPage() {
  const [tab, setTab] = useState<"interview" | "guide">("interview");

  const TabButton = (({
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
  ));

  return (
    <div className="min-h-screen bg-background">
      <TopBar title="AI Chat" />

      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2 items-center justify-center">
          <TabButton id="interview" label="Interview Me 🎤" active={tab === "interview"} onClick={() => setTab("interview")} />
          <TabButton id="guide" label="Let Me Guide You 🧭" active={tab === "guide"} onClick={() => setTab("guide")} />
        </div>
      </div>

      <main aria-live="polite">
        {tab === "interview" && <InterviewMe />}
        {tab === "guide" && <GuideMe />}
      </main>

      <footer className="container mx-auto px-4 py-6 text-center text-xs text-muted-foreground">
        When I can't answer something precisely, I'll point you to my projects or LinkedIn. Let's connect!
      </footer>
    </div>
  );
}