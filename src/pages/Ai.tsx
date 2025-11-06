import { useMemo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Compass, MessageSquare, Waves } from "lucide-react";
import { KNOWLEDGE, type QA } from "@/lib/aiKnowledge";
import ReactMarkdown from "react-markdown";

// Simple message type
type Msg = { role: "user" | "ai"; text: string; ts: number };

// Shared header
function TopBar({ title }: { title: string }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 bg-[#0B6A5B] border-b">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between text-white">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="flex items-center gap-2 hover:bg-[#90EE90] hover:text-slate-900">
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
      text: "This chat mode is currently using a simple response system. Please use the 'Interview Me' tab below for the full AI-powered experience! 🌼",
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
        "Heya! I'm the chat version of Darshita 🌼 fueled by data, design, and a bit of curiosity.\n\nI'm powered by real AI now, so feel free to ask me anything about Darshita's background, projects, or skills!",
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatAction = useAction(api.ai.chat);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-focus input on mount and after typing stops
  useEffect(() => {
    if (!isTyping) {
      inputRef.current?.focus();
    }
  }, [isTyping]);

  // Memoize the grass background to prevent re-renders on input changes
  const grassBackground = useMemo(() => (
    <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-0">
      {/* Multiple grass blades with varied shapes, sizes, and colors */}
      {[...Array(240)].map((_, i) => {
        const greenShades = [
          ['#2E7D32', '#66BB6A'], // Dark to medium green
          ['#388E3C', '#81C784'], // Medium green
          ['#43A047', '#A5D6A7'], // Light green
          ['#4CAF50', '#C8E6C9'], // Very light green
          ['#1B5E20', '#4CAF50'], // Very dark to medium
        ];
        const shade = greenShades[i % greenShades.length];
        const height = 60 + Math.random() * 100; // 60-160px
        const width = 5 + Math.random() * 15; // 5-20px
        const isWide = Math.random() > 0.7;
        
        return (
          <motion.div
            key={i}
            className="absolute bottom-0"
            style={{
              left: `${(i * 0.42)}%`,
              height: `${height}px`,
              width: `${width}px`,
            }}
            animate={{
              rotate: [0, 3 + Math.random() * 3, -(3 + Math.random() * 3), 0],
              scaleY: [1, 1.05 + Math.random() * 0.05, 0.95 + Math.random() * 0.05, 1],
              scaleX: [1, 0.97, 1.03, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          >
            <div 
              className={isWide ? "w-full h-full rounded-t-lg" : "w-full h-full rounded-t-full"}
              style={{
                background: `linear-gradient(to top, ${shade[0]}, ${shade[1]})`,
                transformOrigin: 'bottom center',
                opacity: 0.7 + Math.random() * 0.3,
              }}
            />
          </motion.div>
        );
      })}
      
      {/* Fluffy weed flowers (dandelions) */}
      {[...Array(20)].map((_, i) => {
        const height = 160 + Math.random() * 40; // 160-200px (taller than max grass)
        const leftPos = i < 6 ? Math.random() * 30 : 25 + (i - 6) * 5 + Math.random() * 10;
        
        return (
          <motion.div
            key={`flower-${i}`}
            className="absolute bottom-0"
            style={{
              left: `${leftPos}%`,
              height: `${height}px`,
              width: '3px',
            }}
            animate={{
              rotate: [0, 5 + Math.random() * 4, -(5 + Math.random() * 4), 0],
              x: [0, 3, -3, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          >
            {/* Stem */}
            <div 
              className="w-full h-full relative"
              style={{
                background: 'linear-gradient(to top, #2E7D32, #66BB6A)',
                transformOrigin: 'bottom center',
              }}
            >
              {/* Small leaves on stem */}
              <div 
                className="absolute"
                style={{
                  left: '-4px',
                  top: '40%',
                  width: '8px',
                  height: '12px',
                  background: 'linear-gradient(135deg, #43A047, #66BB6A)',
                  borderRadius: '0 50% 50% 0',
                  transform: 'rotate(-30deg)',
                }}
              />
              <div 
                className="absolute"
                style={{
                  right: '-4px',
                  top: '60%',
                  width: '8px',
                  height: '12px',
                  background: 'linear-gradient(225deg, #43A047, #66BB6A)',
                  borderRadius: '50% 0 0 50%',
                  transform: 'rotate(30deg)',
                }}
              />
            </div>
            {/* Fluffy flower head */}
            <motion.div
              className="absolute -top-3 left-1/2 -translate-x-1/2"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #FFFFFF 30%, #F0F0F0 60%, rgba(255,255,255,0.6) 100%)',
                boxShadow: '0 0 8px rgba(255,255,255,0.8), inset 0 0 4px rgba(200,200,200,0.5)',
                filter: 'blur(0.5px)',
              }}
            >
              {/* Sparkle effects */}
              {[...Array(6)].map((_, sparkleIdx) => {
                const angle = (sparkleIdx * 60) + Math.random() * 30;
                const distance = 12 + Math.random() * 6;
                return (
                  <motion.div
                    key={sparkleIdx}
                    className="absolute"
                    style={{
                      left: '50%',
                      top: '50%',
                      width: '3px',
                      height: '3px',
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      boxShadow: '0 0 3px #FFFFFF',
                    }}
                    animate={{
                      x: [0, Math.cos(angle * Math.PI / 180) * distance, 0],
                      y: [0, Math.sin(angle * Math.PI / 180) * distance, 0],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.5 + Math.random() * 0.5,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: sparkleIdx * 0.2 + Math.random() * 0.3,
                    }}
                  />
                );
              })}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  ), []); // Empty dependency array means this only renders once

  const onSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;
    
    const userMsg: Msg = { role: "user", text: trimmed, ts: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Call OpenAI via Convex action
      const result = await chatAction({
        message: trimmed,
        conversationHistory: conversationHistory,
      });
      
      // Update conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: "user", content: trimmed },
        { role: "assistant", content: result.message },
      ]);
      
      const aiMsg: Msg = { 
        role: "ai", 
        text: result.message, 
        ts: Date.now() + 1 
      };
      setMessages((m) => [...m, aiMsg]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMsg: Msg = {
        role: "ai",
        text: "Oops! I'm having trouble thinking right now. Please try again, or reach out to Darshita on LinkedIn! 🌼",
        ts: Date.now() + 1,
      };
      setMessages((m) => [...m, errorMsg]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const fmtTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="h-screen bg-[#D4E8E4] dark:bg-slate-900 relative overflow-hidden flex flex-col">
      {/* Animated grass background */}
      {grassBackground}

      <div 
        className="container mx-auto max-w-3xl px-4 relative z-10 flex-1 flex items-stretch overflow-hidden"
      >
        <Card className="flex flex-col overflow-hidden border-0 shadow-lg w-full">
          {/* WhatsApp-style Header */}
          <div className="bg-[#0B6A5B] text-white px-4 py-3 flex items-center gap-3 h-12 flex-shrink-0">
            <img 
              src="https://harmless-tapir-303.convex.cloud/api/storage/fbbcab3e-d3b1-4639-99b4-311c5e1ab7ca" 
              alt="Darshita" 
              className="h-9 w-9 rounded-full ring-2 ring-white object-cover"
            />
            <div className="flex flex-col">
              <span className="font-medium text-base">Darshita's bot</span>
              <div className="flex items-center gap-1">
<span className="w-1 h-1 rounded-full bg-green-400 animate-pulse"></span>
                <span className="text-xs text-white/80">online</span>
              </div>
            </div>
          </div>

          {/* Chat area */}
          <div className="bg-[#EFE7DD]/60 dark:bg-slate-950/60 flex-1 overflow-y-auto p-3 min-h-[60px] max-h-[calc(100vh-140px)]">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex mb-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "ai" && (
                  <div className="mr-2 flex-shrink-0">
                    <img 
                      src="https://harmless-tapir-303.convex.cloud/api/storage/fbbcab3e-d3b1-4639-99b4-311c5e1ab7ca" 
                      alt="" 
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
                    />
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-lg px-3 py-2 text-sm relative shadow-sm ${
                    m.role === "user"
                      ? "bg-[#DCF8C6] rounded-tr-sm"
                      : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border rounded-tl-sm"
                  }`}
                >
                  <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-p:leading-relaxed prose-strong:font-semibold prose-strong:text-slate-900 dark:prose-strong:text-slate-100 prose-ul:my-2 prose-li:my-1">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                      }}
                    >
                      {m.text}
                    </ReactMarkdown>
                  </div>
                  <div className="text-[10px] opacity-60 mt-1 text-right flex items-center justify-end gap-1">
                    <span>{fmtTime(m.ts)}</span>
                    {m.role === "user" ? <span className="text-blue-500">✓✓</span> : null}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-end gap-2 mt-2" aria-live="polite">
                <img 
                  src="https://harmless-tapir-303.convex.cloud/api/storage/fbbcab3e-d3b1-4639-99b4-311c5e1ab7ca" 
                  alt="" 
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-white flex-shrink-0"
                />
                <div className="bg-white px-3 py-2 rounded-2xl shadow-sm border rounded-tl-sm">
                  <span className="inline-flex gap-1 text-[#606770]">
                    <span className="animate-bounce" style={{ animationDelay: '-0.2s' }}>•</span>
                    <span className="animate-bounce" style={{ animationDelay: '-0.1s' }}>•</span>
                    <span className="animate-bounce">•</span>
                  </span>
                </div>
              </div>
            )}
            
            {/* Invisible div for auto-scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar with WhatsApp-style send button */}
          <div className="bg-[#F0F0F0] dark:bg-slate-900 p-2 flex items-center gap-2 border-t flex-shrink-0 sticky bottom-0">
            <Input
              ref={inputRef}
              placeholder="Type your question before my code daydreams again..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              disabled={isTyping}
              className="bg-white dark:bg-slate-800 flex-1"
            />
            <button
              type="button"
              onClick={onSend}
              disabled={isTyping}
              aria-label="Send"
              className="h-12 w-12 shrink-0 grid place-items-center rounded-full bg-[#128C7E] text-white hover:bg-[#90EE90] active:scale-95 transition shadow focus:outline-none focus:ring-2 focus:ring-[rgba(18,140,126,.35)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg 
                className="-rotate-6 h-5 w-5" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.2"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13"></path>
                <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
              </svg>
            </button>
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

/* -------------------- Page container with two options -------------------- */
export default function AiPage() {
  const [tab, setTab] = useState<"interview" | "guide">("interview");

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
    <div className="min-h-screen bg-background" style={{ height: '100%', overflow: 'hidden' }}>
      <TopBar title="AI Chat" />

      <main aria-live="polite">
        {tab === "interview" && <InterviewMe />}
        {tab === "guide" && <GuideMe />}
      </main>

      <footer className="bg-[#0B6A5B] text-white px-4 py-2 text-center text-xs flex-shrink-0">
        When I can't answer something precisely, I'll point you to my{" "}
        <a 
          href="/classic#projects" 
          className="underline hover:text-foreground transition-colors"
        >
          projects
        </a>
        {" "}or{" "}
        <a 
          href="https://www.linkedin.com/in/darshitapatel2001/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors"
        >
          LinkedIn
        </a>
        . Let's connect!
      </footer>
    </div>
  );
}