import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowRight, Briefcase, Database, Github, Linkedin, Mail, Smartphone, Star, ExternalLink, User, MessageSquare } from "lucide-react";
import { BarChart3, Code2, Users, Wrench } from "lucide-react";

type Project = {
  id: string;
  title: string;
  summary: string;
  image: string;
  tags: Array<string>;
  link?: string;
  metrics?: Array<{ icon: React.ReactNode; label: string; value?: number; suffix?: string }>;
};

const BLUE = {
  headerFrom: "#0D47A1",
  headerTo: "#0D47A1",
  accent: "#A3D0FF",
  bgTint: "#EAF4FF",
};

const featuredProjects: Array<Project> = [
  {
    id: "smartplanner",
    title: "SmartPlanner (SwiftUI)",
    summary: "iOS task manager with AI-inspired priority, week view, drag-to-reschedule, Core Data.",
    image: "https://harmless-tapir-303.convex.cloud/api/storage/9c96e942-0cbd-47dc-8910-948153ae3f91",
    tags: ["SwiftUI", "Core Data", "MVVM"],
    link: "#",
    metrics: [
      { icon: <Star className="w-3.5 h-3.5" />, label: "Impact", value: 100, suffix: "%" },
      { icon: <Smartphone className="w-3.5 h-3.5" />, label: "Platform", value: 1 },
    ],
  },
  {
    id: "film-fusion",
    title: "Movie Lens",
    summary: "Interactive movie reviews with search, reviews, login; PHP + JSON/AJAX.",
    image: "https://harmless-tapir-303.convex.cloud/api/storage/c9475219-276b-4120-a971-bd75d2fa117d",
    tags: ["HTML/CSS/JS", "PHP", "AJAX"],
    link: "https://bucolic-travesseiro-0fbc42.netlify.app/",
    metrics: [
      { icon: <Database className="w-3.5 h-3.5" />, label: "APIs", value: 2 },
      { icon: <Star className="w-3.5 h-3.5" />, label: "Features", value: 12, suffix: "+" },
    ],
  },
  {
    id: "scholarship-automation",
    title: "Scholarship Automation",
    summary: "Process analysis with RFP & BPMN; vendor comparison and automation framework.",
    image: "https://harmless-tapir-303.convex.cloud/api/storage/3311862a-8472-4130-b2bd-0ac148ef9aad",
    tags: ["Process", "BPMN", "RFP"],
    // link intentionally omitted
    metrics: [
      { icon: <Star className="w-3.5 h-3.5" />, label: "Efficiency", value: 40, suffix: "%" },
      { icon: <Database className="w-3.5 h-3.5" />, label: "Docs", value: 8, suffix: "+" },
    ],
  },
  {
    id: "ai-predictive-analytics",
    title: "AI-Driven Predictive Analytics",
    summary:
      "Designed regression and classification models on an open dataset, achieving 92% accuracy in predicting behavior. Built an interactive Python dashboard showcasing how AI improves demand forecasting, customer targeting, and strategic decisions.",
    image: "https://harmless-tapir-303.convex.cloud/api/storage/a60d0701-4fc7-4749-b411-f961e8bc541d",
    tags: ["AI", "Python", "Regression", "Classification", "Dashboard"],
    metrics: [{ icon: <Star className="w-3.5 h-3.5" />, label: "Accuracy", value: 92, suffix: "%" }],
  },
  {
    id: "it-services-optimization",
    title: "IT Services Optimization",
    summary:
      "Partnered with an external IT stakeholder to capture requirements and define KPIs (avg. resolution time, backlog volume). Delivered visualization reports and recommendations that streamlined operations and reduced ticket resolution times by 15%.",
    image: "https://harmless-tapir-303.convex.cloud/api/storage/82c04e8b-0353-48ae-9a5f-d1b0feb70e08",
    tags: ["KPIs", "Process", "Dashboards"],
    metrics: [{ icon: <Star className="w-3.5 h-3.5" />, label: "Faster resolution", value: 15, suffix: "%" }],
  },
  {
    id: "retail-analytics-candles",
    title: "Retail Analytics for Local Candle Business",
    summary:
      "Aggregated two years of POS data to segment purchase patterns, identify seasonal trends and underperforming inventory. Built Tableau dashboards guiding pricing and stocking—reduced overstock by 18% and improved revenue forecast accuracy by 20%.",
    image: "https://harmless-tapir-303.convex.cloud/api/storage/87a95311-cb32-42a7-976c-1074b87d4be5",
    tags: ["Retail", "Tableau", "POS Data", "Forecasting"],
    metrics: [
      { icon: <Star className="w-3.5 h-3.5" />, label: "Less overstock", value: 18, suffix: "%" },
      { icon: <Star className="w-3.5 h-3.5" />, label: "Forecast ↑", value: 20, suffix: "%" },
    ],
  },
];

const techSkills: Array<{ name: string; level: number; icon?: React.ReactNode }> = [
  { name: "TypeScript/React", level: 86 },
  { name: "Swift/SwiftUI", level: 78, icon: <Smartphone className="w-3.5 h-3.5" /> },
  { name: "Python", level: 74 },
  { name: "SQL", level: 72, icon: <Database className="w-3.5 h-3.5" /> },
  { name: "PHP/MySQL", level: 70 },
  { name: "C/C++/Java", level: 68 },
];

const softSkills: Array<string> = ["Communication", "Problem‑Solving", "Teamwork"];

function CountUpNumber({
  to,
  duration = 1200,
  suffix = "",
  className = "",
}: {
  to: number;
  duration?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(containerRef, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    let start: number | null = null;
    const from = 0;
    const target = to;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.floor(from + (target - from) * eased);
      if (ref.current) ref.current.textContent = val.toLocaleString();
      if (t < 1) requestAnimationFrame(step);
    };
    const r = requestAnimationFrame(step);
    return () => cancelAnimationFrame(r);
  }, [inView, to, duration]);

  return (
    <div ref={containerRef} className={className}>
      <span ref={ref} />
      {suffix ? <span className="ml-0.5">{suffix}</span> : null}
    </div>
  );
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-24">
      <h2
        className="text-2xl md:text-3xl font-semibold tracking-wide"
        style={{
          fontFamily: '"Montserrat", "Inter", ui-sans-serif, system-ui',
          letterSpacing: "0.02em",
          background: `linear-gradient(90deg, ${BLUE.headerFrom}, ${BLUE.headerTo})`,
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        {children}
      </h2>
      <div className="mt-2 h-[4px] w-20 rounded-full" style={{ background: BLUE.accent }} />
    </div>
  );
}

function SkillBar({ label, value, delay = 0 }: { label: string; value: number; delay?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // varying shades of blue
  const shades = ["#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#1E88E5", "#1976D2"];
  const shade = shades[Math.min(Math.floor((value / 100) * shades.length), shades.length - 1)];

  return (
    <div ref={ref} className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="opacity-70">{value}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200/60 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: inView ? `${value}%` : 0 }}
          transition={{ duration: 0.8, delay }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${shade}, ${BLUE.headerTo})` }}
        />
      </div>
    </div>
  );
}

function StickyNav() {
  const navigate = useNavigate();
  const items = [
    { id: "profile", label: "Profile" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "contact", label: "Contact" },
  ];
  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <header className="sticky top-0 z-40 border-b bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <button
          className="text-sm font-semibold"
          onClick={() => navigate("/")}
          style={{ color: BLUE.headerTo }}
        >
          ← Modes
        </button>
        <nav className="flex gap-2 md:gap-4">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => go(it.id)}
              className="px-3 py-1.5 rounded-full text-sm border transition"
              style={{
                borderColor: "rgba(13, 71, 161, 0.18)",
                color: "#0D47A1",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0D47A1";
                (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#0D47A1";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "#0D47A1";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(13, 71, 161, 0.18)";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0D47A1";
                (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#0D47A1";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "#0D47A1";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(13, 71, 161, 0.18)";
              }}
            >
              {it.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function BubblesBackground() {
  // Disable bubbles completely
  return null;
}

export default function Classic() {
  const [sending, setSending] = useState(false);
  const [nameVal, setNameVal] = useState("");
  const [emailVal, setEmailVal] = useState("");
  const [messageVal, setMessageVal] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const sendContactEmail = useAction(api.emails.sendContactEmail);

  // Auto-scroll for Certificates carousels (supports multiple rows; respects reduced motion)
  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // Handle multiple carousels by class
    // UPDATED: support both certificates and projects carousels
    const wraps = Array.from(
      document.querySelectorAll<HTMLDivElement>(".certs-auto-scroll-wrap, .projects-auto-scroll-wrap"),
    );
    if (!wraps.length) return;

    const cleanups: Array<() => void> = [];

    for (const wrap of wraps) {
      // UPDATED: detect the correct inner scroller and next button per wrap
      const scroller =
        wrap.querySelector<HTMLDivElement>(".auto-scroll-certs") ||
        wrap.querySelector<HTMLDivElement>(".auto-scroll-projects");
      const nextBtn =
        wrap.querySelector<HTMLButtonElement>('[data-autoscroll-next="1"]') || null;

      let paused = false;
      const onEnter = () => (paused = true);
      const onLeave = () => (paused = false);
      wrap.addEventListener("mouseenter", onEnter);
      wrap.addEventListener("mouseleave", onLeave);

      // Looping behavior (always forward, wrap to start at the end)
      const stepEveryMs = 3200;
      const timer = setInterval(() => {
        if (paused) return;

        if (scroller) {
          const stepAmount = Math.round(scroller.clientWidth * 0.9);
          const max = scroller.scrollWidth - scroller.clientWidth - 2;
          const nextLeft = scroller.scrollLeft + stepAmount;

          if (nextLeft >= max) {
            // Jump back to start without animation to avoid long reverse scroll
            scroller.scrollTo({ left: 0, behavior: "auto" });
          } else {
            scroller.scrollTo({ left: nextLeft, behavior: "smooth" });
          }
          return;
        }

        // Fallback: click "next"
        if (nextBtn) nextBtn.click();
      }, stepEveryMs);

      cleanups.push(() => {
        clearInterval(timer);
        wrap.removeEventListener("mouseenter", onEnter);
        wrap.removeEventListener("mouseleave", onLeave);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  const validate = () => {
    const next: { name?: string; email?: string; message?: string } = {};
    if (!nameVal.trim()) next.name = "Please enter your name.";
    if (!emailVal.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) next.email = "Enter a valid email.";
    if (!messageVal.trim() || messageVal.trim().length < 10) next.message = "Message must be at least 10 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmitContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setSending(true);
    try {
      await sendContactEmail({
        name: nameVal,
        email: emailVal,
        message: messageVal,
      });
      toast.success("Message sent successfully! I'll get back to you soon.");
      setNameVal("");
      setEmailVal("");
      setMessageVal("");
      setErrors({});
    } catch (error) {
      toast.error("Failed to send message. Please try again or email me directly.");
      console.error("Contact form error:", error);
    } finally {
      setSending(false);
    }
  };

  // Simple ripple effect for the send button
  const addRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const circle = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    circle.style.position = "absolute";
    circle.style.left = `${e.clientX - rect.left - size / 2}px`;
    circle.style.top = `${e.clientY - rect.top - size / 2}px`;
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.borderRadius = "9999px";
    circle.style.background = "rgba(13,71,161,0.3)";
    circle.style.transform = "scale(0)";
    circle.style.opacity = "0.9";
    circle.style.pointerEvents = "none";
    circle.style.transition = "transform 450ms ease, opacity 600ms ease";
    btn.appendChild(circle);
    requestAnimationFrame(() => {
      circle.style.transform = "scale(1.6)";
      circle.style.opacity = "0";
    });
    setTimeout(() => circle.remove(), 650);
  };

  const headerGradient = { background: `linear-gradient(90deg, ${BLUE.headerFrom}, ${BLUE.headerTo})` };

  const extras = useMemo<Array<{ icon: React.ReactNode; title: string; desc: string }>>(
    () => [],
    [],
  );

  return (
    <div className="min-h-screen relative" style={{ background: BLUE.bgTint }}>
      <StickyNav />

      {/* Hero / Profile */}
      <motion.section
        id="profile"
        className="border-b"
        style={headerGradient}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto max-w-6xl px-4 py-10 md:py-14 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="shrink-0 relative">
              <div className="w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-white/40 shadow-xl">
                <img
                  src="https://harmless-tapir-303.convex.cloud/api/storage/fbbcab3e-d3b1-4639-99b4-311c5e1ab7ca"
                  alt="Profile"
                  className="w-full h-full object-cover opacity-100"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="absolute inset-0 rounded-full blur-2xl opacity-50 -z-10" style={{ background: BLUE.accent }} />
            </div>

            <div className="text-center md:text-left">
              <h1
                className="text-3xl md:text-4xl font-bold tracking-tight"
                style={{ fontFamily: '"Montserrat","Inter",ui-sans-serif,system-ui' }}
              >
                Darshita Patel
              </h1>
              <p className="mt-1 text-base md:text-lg opacity-95">
                Data Analyst & Developer
              </p>
              <motion.p
                className="mt-2 text-sm md:text-base opacity-95"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                <span className="inline-flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4" aria-hidden="true" />
                    <span>Transforming data into insights</span>
                  </span>
                  <span aria-hidden="true" className="opacity-50">|</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Code2 className="w-4 h-4" aria-hidden="true" />
                    <span>Building solutions through code</span>
                  </span>
                </span>
              </motion.p>

              <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="bg-white text-black border-white/60 hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="Open LinkedIn profile">
                    <span className="inline-flex items-center gap-2">
                      <Linkedin className="w-4 h-4" aria-hidden="true" />
                      <span>LinkedIn</span>
                    </span>
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="bg-white text-black border-white/60 hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="Open GitHub profile">
                    <span className="inline-flex items-center gap-2">
                      <Github className="w-4 h-4" aria-hidden="true" />
                      <span>GitHub</span>
                    </span>
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="bg-white text-black border-white/60 hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  <a href="#contact">📬 Contact</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* About Me */}
      <motion.section
        id="about"
        className="container mx-auto max-w-6xl px-4 py-8 md:py-10"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <SectionTitle id="about-title">About Me</SectionTitle>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-1 gap-6 items-center">
          <motion.div
            className="text-slate-700"
            initial={{ x: -24, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <p>
              I am a Master's in Information Systems graduate (GPA 4.0) from Illinois State University with a strong focus on
              data analysis, system design, and web/mobile development. I enjoy exploring datasets to uncover insights and
              building innovative solutions that merge creativity with technology. My journey combines analytical thinking,
              teaching, and project management with hands-on experience in IT systems.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Projects moved below Experience section */}

      {/* Skills – Blue/White circular chips with radial progress, legends, averages */}
      <motion.section
        className="py-10"
        style={{ background: BLUE.bgTint }}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto max-w-6xl px-4">
          <div id="skills" className="scroll-mt-20">
            <SectionTitle id="skills-title">Skills</SectionTitle>
          </div>

          {(() => {
            type Skill = {
              category: string;
              name: string;
              level: "Beginner" | "Intermediate" | "Advanced";
              percent: number;
              notes?: string;
            };

            // Source-of-truth skills per category
            const data: Array<{ title: string; icon: string; items: Array<Skill> }> = [
              {
                title: "Data Skills",
                icon: "data",
                items: [
                  { category: "Data", name: "SQL", percent: 85, level: "Advanced", notes: "MySQL, Oracle; complex joins, window funcs, tuning" },
                  { category: "Data", name: "Python", percent: 85, level: "Intermediate", notes: "Pandas, NumPy, data wrangling" },
                  { category: "Data", name: "Tableau", percent: 80, level: "Intermediate", notes: "Dashboards, storytelling, parameters" },
                  { category: "Data", name: "Power BI", percent: 80, level: "Intermediate", notes: "Reports, DAX basics" },
                  { category: "Data", name: "Excel", percent: 85, level: "Advanced", notes: "Pivots, VLOOKUP/XLOOKUP, formulas" },
                  { category: "Data", name: "Data Viz", percent: 75, level: "Intermediate", notes: "Best practices, layouts" },
                  { category: "Data", name: "Reporting", percent: 80, level: "Advanced" },
                  { category: "Data", name: "Snowflake", percent: 70, level: "Intermediate", notes: "Cloud DW, SQL, performance basics" },
                  { category: "Data", name: "Data Concepts", percent: 80, level: "Advanced", notes: "Modeling, normalization, ETL, governance" },
                ],
              },
              {
                title: "Development Skills",
                icon: "dev",
                items: [
                  { category: "Dev", name: "React", percent: 80, level: "Advanced", notes: "Hooks, components, state" },
                  { category: "Dev", name: "SwiftUI", percent: 85, level: "Advanced", notes: "MVVM, Core Data basics" },
                  { category: "Dev", name: "PHP", percent: 70, level: "Advanced" },
                  { category: "Dev", name: "HTML/CSS/JS", percent: 90, level: "Advanced", notes: "Semantic HTML, accessible UI" },
                  { category: "Dev", name: "Java", percent: 85, level: "Advanced" },
                  { category: "Dev", name: "C/C++", percent: 85, level: "Advanced" },
                  { category: "Dev", name: "Node.js", percent: 70, level: "Advanced" },
                  { category: "Dev", name: "Git & GitHub", percent: 85, level: "Advanced" },
                  { category: "Dev", name: "WordPress", percent: 90, level: "Advanced", notes: "Themes, plugins, content workflows" },
                  { category: "Dev", name: "Shopify", percent: 90, level: "Advanced", notes: "Store setup, Liquid basics" },
                ],
              },
              {
                title: "Interpersonal",
                icon: "interpersonal",
                items: [
                  { category: "Interpersonal", name: "Leadership", percent: 95, level: "Advanced" },
                  { category: "Interpersonal", name: "Communication", percent: 95, level: "Advanced" },
                  { category: "Interpersonal", name: "Problem‑Solving", percent: 95, level: "Advanced" },
                  { category: "Interpersonal", name: "Time Management", percent: 95, level: "Advanced" },
                  { category: "Interpersonal", name: "Critical Thinking", percent: 95, level: "Advanced" },
                  { category: "Interpersonal", name: "Collaboration", percent: 95, level: "Advanced" },
                  { category: "Interpersonal", name: "Adaptability", percent: 95, level: "Advanced" },
                  { category: "Interpersonal", name: "Analytical Thinking", percent: 95, level: "Advanced" },
                  { category: "Interpersonal", name: "Creativity", percent: 95, level: "Advanced" },
                  { category: "Interpersonal", name: "Project Coordination", percent: 95, level: "Advanced" },
                ],
              },
              {
                title: "Tools & Others",
                icon: "tools",
                items: [
                  { category: "Tools", name: "AWS", percent: 80, level: "Intermediate", notes: "EC2, RDS, S3, VPC basics" },
                  { category: "Tools", name: "Jira/Confluence", percent: 80, level: "Advanced" },
                  { category: "Tools", name: "Docker", percent: 70, level: "Beginner" },
                  { category: "Tools", name: "MS Office", percent: 90, level: "Advanced" },
                  { category: "Tools", name: "Snowflake", percent: 80, level: "Intermediate" },
                  { category: "Tools", name: "Power Query/Tableau Prep", percent: 80, level: "Intermediate", notes: "Data shaping and prep" },
                  { category: "Tools", name: "Figma", percent: 80, level: "Intermediate", notes: "Wireframes, handoff" },
                  { category: "Tools", name: "MS Project/Trello", percent: 80, level: "Advanced", notes: "Plans, boards, tracking" },
                ],
              },
            ];

            const prefersReduced =
              typeof window !== "undefined" &&
              window.matchMedia &&
              window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            const Brand = {
              track: "oklch(94% 0.02 240 / 0.75)", // very light blue track
              fill: "#0D47A1", // brand/navy fill
              text: "#0D47A1",
              cardBorder: "rgba(13,71,161,0.16)",
              glow: "0 0 0 6px rgba(13,71,161,0.10), 0 10px 18px rgba(13,71,161,0.18)",
            };

            // Add level-based ring colors
            const levelRing: Record<"Beginner" | "Intermediate" | "Advanced", string> = {
              Beginner: "#A7C7E7",      // light blue
              Intermediate: "#4682B4",  // medium blue
              Advanced: "#004AAD",      // deep professional blue
            };

            function Legend() {
              const item = (label: string, color: string) => (
                <span className="inline-flex items-center gap-1 text-[10px] md:text-xs text-slate-600">
                  <i className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  {label}
                </span>
              );
              return (
                <div className="flex flex-wrap gap-2 mt-1">
                  {item("Beginner (0–39%)", levelRing.Beginner)}
                  {item("Intermediate (40–69%)", levelRing.Intermediate)}
                  {item("Advanced (70–100%)", levelRing.Advanced)}
                </div>
              );
            }

            function avg(arr: Array<Skill>): number {
              if (!arr.length) return 0;
              return Math.round(arr.reduce((a, b) => a + b.percent, 0) / arr.length);
            }

            // Animate Category Average width from 0 when in view
            function CategoryAverage({ value }: { value: number }) {
              const ref = useRef<HTMLDivElement | null>(null);
              const inView = useInView(ref, { once: true, margin: "-80px" });
              return (
                <div ref={ref} className="mt-2">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    <span>Category average</span>
                    <span className="font-medium" style={{ color: Brand.text }}>{value}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-200/60 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-[width] duration-700"
                      style={{ width: inView ? `${value}%` : "0%", background: Brand.fill }}
                    />
                  </div>
                </div>
              );
            }

            function SkillCircle({ skill, index }: { skill: Skill; index: number }) {
              const prefersReduced =
                typeof window !== "undefined" &&
                window.matchMedia &&
                window.matchMedia("(prefers-reduced-motion: reduce)").matches;

              // Animate only on hover/focus/tap
              const [active, setActive] = useState(false);
              const [open, setOpen] = useState(false);

              const pct = Math.max(0, Math.min(skill.percent, 100));
              const [progress, setProgress] = useState(0);
              const [pulse, setPulse] = useState(false);

              const btnRef = useRef<HTMLButtonElement | null>(null);

              // Hover-only animation logic
              useEffect(() => {
                if (!active) {
                  // reset when leaving
                  setProgress(0);
                  setPulse(false);
                  return;
                }

                if (prefersReduced) {
                  setProgress(pct);
                  // brief emphasis without motion
                  setPulse(true);
                  const id = setTimeout(() => setPulse(false), 300);
                  return () => clearTimeout(id);
                }

                let raf = 0;
                let start: number | null = null;
                const from = 0;
                const to = pct;
                const duration = 800; // ms
                const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

                const step = (ts: number) => {
                  if (start === null) start = ts;
                  const elapsed = ts - start;
                  const t = Math.min(1, elapsed / duration);
                  const eased = easeOutCubic(t);
                  const val = from + (to - from) * eased;
                  setProgress(val);
                  if (t < 1) {
                    raf = requestAnimationFrame(step);
                  } else {
                    setPulse(true);
                    const id = setTimeout(() => setPulse(false), 400);
                    // store timeout cleanup in closure
                    (step as any)._tid = id;
                  }
                };
                raf = requestAnimationFrame(step);

                return () => {
                  cancelAnimationFrame(raf);
                  const tid = (step as any)?._tid;
                  if (tid) clearTimeout(tid);
                };
              }, [active, pct, prefersReduced]);

              const label = `${skill.level} · ${pct}%`;
              const aria = `${skill.name}: ${skill.level}, ${pct}%`;

              const sizeMobile = 60;
              const sizeTablet = 72;
              const sizeDesktop = 84;

              const ringColor = levelRing[skill.level];
              const ringTrack = Brand.track;

              const pulseShadow = pulse
                ? `0 0 0 0 rgba(13,71,161,0.18), 0 10px 18px rgba(13,71,161,0.18)`
                : active
                  ? Brand.glow
                  : "0 4px 12px rgba(13,71,161,0.08)";

              return (
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <button
                      ref={btnRef}
                      type="button"
                      onMouseEnter={() => setActive(true)}
                      onMouseLeave={() => setActive(false)}
                      onFocus={() => setActive(true)}
                      onBlur={() => setActive(false)}
                      onClick={() => (skill.notes ? setOpen((v) => !v) : void 0)}
                      aria-label={aria}
                      className="relative grid place-items-center rounded-full select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-transform duration-200 hover:scale-[1.06]"
                      style={{
                        outlineColor: "#BAE1FF",
                        width: sizeMobile,
                        height: sizeMobile,
                        background: `conic-gradient(${ringColor} ${progress}%, ${ringTrack} ${progress}%)`,
                        transition: prefersReduced ? undefined : "background 800ms ease",
                        boxShadow: pulseShadow,
                      }}
                    >
                      {/* border ring */}
                      <span
                        className="absolute inset-0 rounded-full"
                        aria-hidden="true"
                        style={{ border: `1px solid ${Brand.cardBorder}` }}
                      />
                      {/* inner white circle */}
                      <span
                        className="absolute inset-[6%] rounded-full bg-white shadow-sm"
                        aria-hidden="true"
                        style={{ border: `1px solid ${Brand.cardBorder}` }}
                      />
                      {/* content: name (idle) or counting percent (active) */}
                      <span
                        className="relative text-[11px] md:text-xs font-medium text-center"
                        style={{ color: Brand.text, lineHeight: 1.1 }}
                      >
                        {active ? `${Math.round(progress)}%` : skill.name}
                      </span>

                      {/* stronger hover shadow and responsive sizing */}
                      <style>
                        {`
                          button[aria-label="${aria}"]:hover { box-shadow: 0 6px 18px rgba(13,71,161,0.18) !important; }
                          @media (min-width: 768px) { /* md */
                            button[aria-label="${aria}"] { width: ${sizeTablet}px !important; height: ${sizeTablet}px !important; }
                          }
                          @media (min-width: 1024px) { /* lg */
                            button[aria-label="${aria}"] { width: ${sizeDesktop}px !important; height: ${sizeDesktop}px !important; }
                          }
                        `}
                      </style>
                    </button>
                  </PopoverTrigger>
                  {skill.notes ? (
                    <PopoverContent side="top" align="center" className="p-2 text-xs max-w-[220px]">
                      <div className="font-medium mb-1" style={{ color: Brand.text }}>
                        {skill.name} — {label}
                      </div>
                      <div className="text-slate-700">{skill.notes}</div>
                    </PopoverContent>
                  ) : null}
                </Popover>
              );
            }

            return (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.map((cat, ci) => {
                  const average = avg(cat.items);
                  return (
                    <Card
                      key={cat.title}
                      className="border-blue-100 shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      style={{ borderColor: Brand.cardBorder }}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-slate-900 inline-flex items-center gap-2">
                          <span aria-hidden="true" className="text-blue-700">
                            {cat.icon === "data" ? (
                              <BarChart3 className="w-4 h-4" />
                            ) : cat.icon === "dev" ? (
                              <Code2 className="w-4 h-4" />
                            ) : cat.icon === "interpersonal" ? (
                              <Users className="w-4 h-4" />
                            ) : cat.icon === "tools" ? (
                              <Wrench className="w-4 h-4" />
                            ) : null}
                          </span>
                          <span>{cat.title}</span>
                        </CardTitle>
                        <Legend />
                        <CategoryAverage value={average} />
                      </CardHeader>
                      <CardContent>
                        <div
                          className="grid gap-3"
                          style={{
                            gridTemplateColumns:
                              "repeat(5, minmax(0,1fr))",
                          }}
                        >
                          <style>
                            {`
                              @media (min-width: 640px) { /* sm */
                                #cat-grid-${ci} { grid-template-columns: repeat(5, minmax(0,1fr)); }
                              }
                              @media (min-width: 768px) { /* md */
                                #cat-grid-${ci} { grid-template-columns: repeat(5, minmax(0,1fr)); }
                              }
                              @media (min-width: 1024px) { /* lg */
                                #cat-grid-${ci} { grid-template-columns: repeat(6, minmax(0,1fr)); }
                              }
                              @media (min-width: 1280px) { /* xl */
                                #cat-grid-${ci} { grid-template-columns: repeat(8, minmax(0,1fr)); }
                              }
                            `}
                          </style>
                          <div id={`cat-grid-${ci}`} className="contents" />
                          {cat.items.map((skill, i) => (
                            <div key={skill.name} className="flex items-center justify-center">
                              <SkillCircle skill={skill} index={i} />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </motion.section>

      {/* Experience Timeline - replaces previous Experience grid content */}
      <motion.section
        className="container mx-auto max-w-6xl px-4 py-10"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <div id="experience" className="scroll-mt-20">
          <SectionTitle id="experience-title">Experience Timeline</SectionTitle>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          {/* Add local state for filter */}
          {/* NOTE: this uses the component's state; ensure it's placed within the component scope */}
        </div>

        {/* Experience timeline with tap-to-expand, metrics, tags, org cue, link */}
        {(() => {
          // Local state for filters and expansion
          const [expFilter, setExpFilter] = useState<"All" | "Teaching" | "Internships" | "Data Analytics">("All");
          const [openIdx, setOpenIdx] = useState<number | null>(null);

          type ExpItem = {
            icon: React.ReactNode;
            title: string;
            period: string;
            desc: string;
            orgColor: string;
            tags: Array<string>;
            metrics?: Array<string>;
            link?: string;
            category: "Teaching" | "Internships";
          };

          const items: Array<ExpItem> = [
            {
              icon: <Briefcase className="w-4 h-4 text-blue-700" />,
              title: "Graduate Teaching Assistant | Illinois State University",
              period: "Aug 2024 – May 2025",
              desc:
                "Instructed and supported 120+ students in IT productivity tools; developed lab content and guided students in Microsoft Office Suite and data tools.",
              orgColor: "#1E88E5",
              tags: ["Teaching", "MS Office", "Student Support"],
              metrics: ["120+ students"],
              link: "https://coursefinder.illinoisstate.edu/it/150/",
              category: "Teaching",
            },
            {
              icon: <Database className="w-4 h-4 text-blue-700" />,
              title: "CIIWAS NGO | Data and Web Development Intern — Normal, IL",
              period: "08/2024 – 12/2024",
              desc:
                "• Designed and deployed interactive web modules that centralized workshop resources, converting raw program data into structured dashboards used by 100+ women participants to track IT learning progress\n• Optimized MySQL queries and automated pipelines to manage participant records, accelerating enrollment insights and improving registration efficiency by 25%\n• Engineered React-based visualization components that translated training outcomes in Python, IT tools, and career readiness into accessible metrics, enabling leadership to measure program impact and refine workshops",
              orgColor: "#2E7D32",
              tags: ["React", "MySQL", "Data Analytics", "Dashboards"],
              metrics: ["100+ participants", "+25% efficiency"],
              // For CIIWAS: include direct contacts instead of creating a new page
              // We'll show contacts as extra links in the card instead of a dedicated route.
              category: "Internships",
            },
            {
              icon: <Database className="w-4 h-4 text-blue-700" />,
              title: "GMP MachPro | Data Analyst Intern — India",
              period: "01/2023 – 06/2023",
              desc:
                "• Analyzed production datasets from granulation and liquid packaging lines, identifying efficiency gaps that reduced downtime by 8% and contributed to operational savings\n• Developed Power BI dashboards to monitor KPIs — machine output, rejection rates, and utilization — giving leadership realtime visibility into production performance\n• Conducted statistical reviews of sales and quality data, uncovering demand trends and batch variances that improved forecasting accuracy by 15% and strengthened compliance",
              orgColor: "#6D28D9",
              tags: ["Power BI", "KPIs", "Data Analytics"],
              metrics: ["-8% downtime", "+15% forecasting accuracy"],
              link: "https://www.gmpmachpro.com/",
              category: "Internships",
            },
            {
              icon: <Database className="w-4 h-4 text-blue-700" />,
              title: "ORANGES NGO | IT Data Analyst Intern — India",
              period: "04/2022 – 12/2022",
              desc:
                "• Standardized donor datasets from 80+ regions, strengthening pipelines and improving reporting accuracy\n• Queried and modeled SQL datasets to uncover donation trends and community needs, delivering insights that boosted donor participation by 25% in 2 months\n• Automated cross-regional reporting by converting manual records into structured datasets, enabling leadership to track 2,000+ beneficiaries and optimize resource allocation in partnership with organizations like Smile Train",
              orgColor: "#D97706",
              tags: ["SQL", "Reporting", "Data Analytics"],
              metrics: ["80+ regions", "+25% participation", "2000+ beneficiaries"],
              link: "https://www.linkedin.com/in/oranges-ngo-4459411a9/",
              category: "Internships",
            },
          ];

          const filtered =
            expFilter === "All"
              ? items
              : expFilter === "Data Analytics"
                ? items.filter((it) => it.tags.includes("Data Analytics"))
                : items.filter((it) => it.category === expFilter);

          return (
            <div className="mt-4">
              {/* Filter chips */}
              <div className="mb-4 flex flex-wrap gap-2">
                {(["All", "Teaching", "Internships", "Data Analytics"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setExpFilter(f)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition ${
                      expFilter === f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                    aria-pressed={expFilter === f}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="mt-6 relative">
                {/* Style the vertical line: dark blue gradient + subtle glow */}
                <div
                  className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-blue-700 via-blue-800 to-blue-700 shadow-[0_0_20px_rgba(30,58,138,0.25)] transition-shadow"
                  aria-hidden="true"
                  style={{ willChange: "filter" }}
                />
                <div className="space-y-6">
                  {filtered.map((item, i) => {
                    const idx = i; // index within filtered list
                    const isOpen = openIdx === idx;
                    const descId = `exp-desc-${idx}`;

                    return (
                      // Make this a group wrapper so the line & dot can respond to hover/focus of the card
                      <div key={item.title} className="relative group">
                        {/* Timeline dot placed on the vertical line; one per item */}
                        <span
                          className={`pointer-events-none absolute left-4 md:left-1/2 -translate-x-1/2 top-3 w-3.5 h-3.5 rounded-full ring-4 transition-all duration-300 ease-out shadow-[0_2px_10px_rgba(37,99,235,0.25)] group-hover:shadow-[0_0_14px_rgba(37,99,235,0.35)] group-focus-within:shadow-[0_0_14px_rgba(37,99,235,0.35)] ${isOpen ? "ring-blue-300 scale-[1.05]" : "ring-blue-200"}`}
                          aria-hidden="true"
                          style={{
                            background: "linear-gradient(135deg, #93c5fd, #3b82f6)",
                            border: "1px solid rgba(255,255,255,0.7)",
                          }}
                        />
                        <motion.div
                          initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-80px" }}
                          transition={{ duration: 0.45 }}
                          className={`pl-10 md:w-1/2 ${idx % 2 === 0 ? "md:pl-10 md:ml-auto" : "md:pr-10"}`}
                        >
                          <Card
                            className="group cursor-pointer shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                            role="button"
                            tabIndex={0}
                            aria-expanded={isOpen}
                            aria-controls={descId}
                            onClick={() => setOpenIdx(isOpen ? null : idx)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setOpenIdx(isOpen ? null : idx);
                              }
                            }}
                            style={{ background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)", borderColor: "#90CAF9" }}
                          >
                            <CardHeader className="pb-1">
                              <CardTitle className="text-base md:text-lg text-slate-900 inline-flex items-center gap-2">
                                <span className="shrink-0">{item.icon}</span>
                                {/* org color cue */}
                                <span
                                  className="inline-block w-2.5 h-2.5 rounded-full"
                                  style={{ background: item.orgColor }}
                                  aria-hidden="true"
                                />
                                <span className="flex-1">{item.title}</span>
                                {/* deep link if available */}
                                {item.title.startsWith("CIIWAS NGO") ? (
                                  <span className="flex items-center gap-2">
                                    <a
                                      href="https://www.linkedin.com/in/mehtaakanksha/"
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-blue-700 hover:underline text-xs inline-flex items-center gap-1"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      Akanksha <ExternalLink className="w-3 h-3" />
                                    </a>
                                    <a
                                      href="https://www.linkedin.com/in/vanithagiriprakash/"
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-blue-700 hover:underline text-xs inline-flex items-center gap-1"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      Vanitha <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </span>
                                ) : item.link ? (
                                  <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-700 hover:underline inline-flex items-center gap-1 text-xs"
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label="Open organization link"
                                  >
                                    Visit <ExternalLink className="w-3 h-3" />
                                  </a>
                                ) : null}
                              </CardTitle>
                              <p className="text-xs text-slate-500 mt-1">{item.period}</p>

                              {/* Metrics row */}
                              {item.metrics && item.metrics.length > 0 ? (
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  {item.metrics.map((m, k) => (
                                    <span
                                      key={k}
                                      className="px-2 py-0.5 rounded-full text-[10px] bg-blue-50 text-blue-700 border border-blue-200"
                                    >
                                      {m}
                                    </span>
                                  ))}
                                </div>
                              ) : null}

                              {/* Tech/topic tags */}
                              {item.tags && item.tags.length > 0 ? (
                                <div className="mt-1 flex flex-wrap gap-1.5">
                                  {item.tags.map((t) => (
                                    <span
                                      key={t}
                                      className="px-2 py-0.5 rounded-full text-[10px] bg-slate-50 text-slate-700 border border-slate-200"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              ) : null}
                            </CardHeader>

                            <CardContent>
                              {/* Description: hidden by default, reveal on hover/focus or when expanded; supports line breaks */}
                              <div
                                id={descId}
                                className={`text-sm text-slate-700 whitespace-pre-line transition-all duration-300 ease-out ${
                                  isOpen
                                    ? "max-h-[700px] opacity-100"
                                    : "max-h-0 opacity-0"
                                }`}
                              >
                                {item.desc}
                              </div>

                              {/* Compact Read more affordance (visible when not expanded) */}
                              {!isOpen && (
                                <div className="mt-2 text-xs text-blue-700 opacity-80 group-hover:opacity-100 transition flex items-center gap-1">
                                  <span>Read more</span>
                                  <span aria-hidden="true">▾</span>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}
      </motion.section>

      {/* Projects */}
      <motion.section
        className="container mx-auto max-w-6xl px-4 py-10"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <div id="projects" className="scroll-mt-20">
          <SectionTitle id="projects-title">Projects</SectionTitle>
        </div>

        {/* UPDATED: Auto-scrolling carousel with prioritized ordering */}
        {(() => {
          const priority = ["ai-predictive-analytics", "it-services-optimization", "retail-analytics-candles"] as const;
          const rank: Record<string, number> = Object.fromEntries(priority.map((id, i) => [id, i]));
          const ordered = [...featuredProjects].sort((a, b) => {
            const ra = rank[a.id] ?? Number.POSITIVE_INFINITY;
            const rb = rank[b.id] ?? Number.POSITIVE_INFINITY;
            return ra - rb;
          });

          return (
            <div className="mt-6 projects-auto-scroll-wrap">
              <Carousel className="w-full">
                <CarouselContent className="flex gap-4 auto-scroll-projects">
                  {ordered.map((p) => {
                    const CardInner = (
                      <Card 
                        className="overflow-hidden transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                        style={{ 
                          background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
                          borderColor: "#90CAF9"
                        }}
                      >
                        <div className="relative h-40 w-full overflow-hidden">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle
                            className="text-lg"
                            style={{ letterSpacing: "0.3px", fontFamily: '"Montserrat","Inter",ui-sans-serif' }}
                          >
                            {p.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-slate-600">{p.summary}</p>
                          <div className="flex flex-wrap gap-2">
                            {p.tags.map((t) => (
                              <Badge key={t} variant="secondary" className="bg-[#E8F2FF] text-[#0D47A1] border-blue-200">
                                {t}
                              </Badge>
                            ))}
                          </div>
                          {p.metrics && p.metrics.length > 0 && (
                            <div className="pt-1 grid grid-cols-2 gap-3 text-xs text-slate-700">
                              {p.metrics.map((m, idx) => (
                                <div key={idx} className="inline-flex items-center gap-1.5">
                                  <span className="text-blue-700">{m.icon}</span>
                                  {typeof m.value === "number" ? (
                                    <>
                                      <CountUpNumber
                                        to={m.value}
                                        suffix={m.suffix}
                                        className="font-semibold text-slate-900"
                                      />
                                      <span className="opacity-70">{m.label}</span>
                                    </>
                                  ) : (
                                    <span>{m.label}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );

                    return (
                      <CarouselItem
                        key={p.id}
                        className="basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/3"
                      >
                        {p.link ? (
                          <motion.a
                            href={p.link}
                            target="_blank"
                            rel="noreferrer"
                            whileHover={{ y: -6, scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 250, damping: 20 }}
                            className="group block"
                            aria-label={`Open project ${p.title}`}
                          >
                            {CardInner}
                          </motion.a>
                        ) : (
                          <motion.div
                            whileHover={{ y: -6, scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 250, damping: 20 }}
                            className="group"
                            aria-label={`${p.title} project`}
                          >
                            {CardInner}
                          </motion.div>
                        )}
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious data-autoscroll-prev="1" />
                <CarouselNext data-autoscroll-next="1" />
              </Carousel>
            </div>
          );
        })()}
      </motion.section>

      {/* Education - rewritten with clean edu-* structure */}
      <motion.section
        className="container mx-auto max-w-6xl px-4 py-10"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <SectionTitle id="education-title">Education</SectionTitle>

        {/* New edu-* styles and reduced-motion handling */}
        <style>
          {`
            .edu-card {
              perspective: 1000px;
            }
            .edu-flip {
              position: relative;
              transform-style: preserve-3d;
              will-change: transform;
              transition: transform var(--flip-duration, 600ms) cubic-bezier(.22,.61,.36,1);
            }
            .edu-front,
            .edu-back {
              position: absolute;
              inset: 0;
              backface-visibility: hidden;
              -webkit-backface-visibility: hidden;
              transform: translateZ(1px); /* paint stability */
            }
            .edu-front {
              transform: rotateY(0deg) translateZ(1px);
              z-index: 2;
            }
            .edu-back {
              transform: rotateY(180deg) translateZ(1px);
              z-index: 1;
            }
            .edu-card:hover .edu-flip,
            .edu-card:focus-within .edu-flip {
              transform: rotateY(180deg);
            }
            /* Accessibility: toggle via aria-expanded on the button wrapper */
            .edu-toggle[aria-expanded="true"] + .edu-flip {
              transform: rotateY(180deg);
            }

            /* Reduced motion: no 3D flip; cross-fade instead */
            @media (prefers-reduced-motion: reduce) {
              .edu-front,
              .edu-back {
                transform: none;
              }
              .edu-flip {
                transition: none;
              }
              .edu-card:hover .edu-flip,
              .edu-card:focus-within .edu-flip {
                transform: none;
              }
              .edu-front,
              .edu-back {
                opacity: 1;
                transition: opacity 250ms ease;
              }
              .edu-toggle[aria-expanded="true"] + .edu-flip .edu-front {
                opacity: 0;
              }
              .edu-toggle[aria-expanded="true"] + .edu-flip .edu-back {
                opacity: 1;
              }
            }
          `}
        </style>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              uni: "Illinois State University (ISU)",
              details: "M.S. in Information Systems | GPA: 4.0 | 2025\nInternet Application Development Sequence",
            },
            {
              uni: "Devi Ahilya Vishwavidyalaya (DAVV), India",
              details: "B.C.A. (Hons.) | GPA: 3.5 | 2022",
            },
          ].map((ed) => (
            <div key={ed.uni} className="edu-card relative">
              {/* Button for mobile toggle (aria-expanded). Kept visually minimal. */}
              <button
                type="button"
                className="edu-toggle sr-only"
                aria-expanded={false}
                aria-label={`Toggle details for ${ed.uni}`}
                onClick={(e) => {
                  const btn = e.currentTarget;
                  const expanded = btn.getAttribute("aria-expanded") === "true";
                  btn.setAttribute("aria-expanded", expanded ? "false" : "true");
                }}
              />
              <div className="edu-flip h-40 w-full">
                {/* FRONT */}
                <div
                  className="edu-front rounded-xl border shadow-sm p-4 grid place-items-start content-start"
                  style={{ 
                    backfaceVisibility: "hidden", 
                    WebkitBackfaceVisibility: "hidden",
                    background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
                    borderColor: "#90CAF9"
                  }}
                >
                  <div className="w-full">
                    {/* add two line breaks for extra top spacing */}
                    <div aria-hidden="true" className="text-transparent select-none leading-[0]">
                      <br />
                      <br />
                    </div>
                    <div
                      className="text-left text-lg md:text-xl whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ color: "#000000", fontWeight: 400, fontFamily: '"Montserrat","Inter",ui-sans-serif' }}
                    >
                      {ed.uni}
                    </div>
                  </div>
                </div>

                {/* BACK */}
                <div
                  className="edu-back rounded-xl border shadow-sm grid place-items-center"
                  style={{ 
                    backfaceVisibility: "hidden", 
                    WebkitBackfaceVisibility: "hidden",
                    background: "linear-gradient(135deg, #BBDEFB 0%, #90CAF9 100%)",
                    borderColor: "#64B5F6"
                  }}
                >
                  <CardContent className="text-center whitespace-pre-line text-sm text-slate-700 px-4">
                    {ed.details}
                    {/* Certificate note should appear only for ISU */}
                    {ed.uni.includes("Illinois State University") ? (
                      <div className="mt-2 text-slate-800 text-[13px] leading-snug">
                        <span aria-hidden="true" className="mr-1">🏆</span>
                        Systems Analyst Certificate
                      </div>
                    ) : null}
                  </CardContent>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Certificates & Achievements - SINGLE HORIZONTAL CAROUSEL */}
      <motion.section
        className="container mx-auto max-w-6xl px-4 py-8 md:py-10"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <SectionTitle id="certs-title">Certificates & Achievements</SectionTitle>

        <div className="mt-6 certs-auto-scroll-wrap">
          <Carousel className="w-full">
            <CarouselContent className="flex gap-4 auto-scroll-certs">
              {[
                { title: "Outstanding Graduate Student Award – ISU", year: "2025", icon: "🏅" },
                { title: "ISU Research Symposium Poster – AI in Banking", year: "2025", icon: "📜" },
                { title: "System Analyst Certificate – ISU", year: "2025", icon: "🏆" },
                { title: "LinkedIn Learning – Data Analysis & SQL", year: "", icon: "📘" },
                { title: "AWS Cloud Practitioner (In Progress)", year: "", icon: "☁️" },
                { title: "Tableau Desktop Specialist (In Progress)", year: "", icon: "📊" },
                { title: "Google Data Analytics Professional Certificate (Future)", year: "", icon: "🎓" },
                { title: "Microsoft Power BI Data Analyst Associate (Future)", year: "", icon: "📈" },
                { title: "Snowflake SnowPro Core Certification (Future)", year: "", icon: "❄️" },
              ].map((c) => (
                <CarouselItem
                  key={c.title}
                  className="basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <Card 
                    className="h-[150px] max-w-[260px] mx-auto rounded-xl shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    style={{ 
                      background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
                      borderColor: "#90CAF9"
                    }}
                  >
                    <div className="h-full p-3 flex flex-col items-center justify-between text-center">
                      <div className="text-xl" aria-hidden="true">{c.icon}</div>
                      <div className="px-1">
                        <div
                          className="font-medium text-[14px] sm:text[15px] leading-snug text-slate-900"
                          style={{ fontFamily: '"Montserrat","Inter",ui-sans-serif' }}
                        >
                          {c.title}
                        </div>
                      </div>
                      {c.year ? (
                        <div className="text-[12px] text-slate-500">{c.year}</div>
                      ) : (
                        <div className="h-[14px]" aria-hidden="true" />
                      )}
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious data-autoscroll-prev="1" />
            <CarouselNext data-autoscroll-next="1" />
          </Carousel>
        </div>
      </motion.section>

      {/* Hobbies & Interests - NEW */}
      <motion.section
        className="container mx-auto max-w-6xl px-4 py-10"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <SectionTitle id="hobbies-title">Hobbies & Interests</SectionTitle>
        <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {[
            ["https://harmless-tapir-303.convex.cloud/api/storage/eeab8198-ae99-483c-9e3c-270f3fc0978b", "Photography & Visual Design"],
            ["🎨", "Creative Designing & Posters"],
            ["✍️", "Blogging & Storytelling"],
            ["💡", "Exploring AI & Tech Trends"],
            ["🍳", "Cooking"],
            ["🎹", "Piano"],
            ["🏸", "Badminton"],
          ].map(([icon, label]) => (
            <div
              key={label}
              className="group rounded-lg p-3 border text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-blue-300 focus-within:-translate-y-0.5 focus-within:shadow-md focus-within:border-blue-300"
              role="group"
              style={{ 
                background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
                borderColor: "#90CAF9"
              }}
            >
              <div className="text-2xl transition-transform duration-200 group-hover:scale-110 group-focus-within:scale-110">
                {icon.startsWith("http") ? (
                  <img 
                    src={icon} 
                    alt={label} 
                    className="w-8 h-8 mx-auto object-contain"
                    loading="lazy"
                  />
                ) : (
                  icon
                )}
              </div>
              <div className="mt-1 text-[11px] text-slate-700 truncate group-hover:text-slate-900 group-focus-within:text-slate-900">
                {label}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials & Career Goal - NEW */}
      <motion.section
        className="container mx-auto max-w-6xl px-4 py-10"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <SectionTitle id="extras-title">Testimonials & Goals</SectionTitle>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="shadow-sm md:col-span-2">
            <CardHeader className="pb-2"><CardTitle className="text-lg">Testimonials</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-700">
              <p>“Darshita is a dedicated and resourceful professional who blends analytical precision with creativity." – Professor, ISU</p>
              <p>“Her ability to simplify complex data into actionable insights is impressive." – Supervisor, NGO Internship</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-lg">Career Goal</CardTitle></CardHeader>
            <CardContent className="text-sm text-slate-700">
              To combine my data analysis expertise with development skills to solve real-world business problems and create impactful IT solutions.
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Extras */}
      {extras.length > 0 && (
        <motion.section
          className="container mx-auto max-w-6xl px-4 pb-6"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {extras.map((x, i) => (
              <Card key={i} className="shadow-sm">
                <CardHeader className="pb-2 flex items-center gap-2">
                  <span className="text-blue-700">{x.icon}</span>
                  <CardTitle className="text-lg">{x.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-600">{x.desc}</CardContent>
              </Card>
            ))}
          </div>
        </motion.section>
      )}

      {/* Contact */}
      <motion.section
        className="bg-white border-t"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto max-w-6xl px-4 py-7">
          <div id="contact" className="scroll-mt-20">
            <SectionTitle id="contact-title">Contact</SectionTitle>
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-1 gap-5">
            <Card className="shadow-sm border-blue-200" style={{ background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)" }}>
              <CardHeader className="pb-1">
                <CardTitle className="text-lg">Let's connect</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmitContact} className="space-y-2.5 relative">
                  {/* Name */}
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true">
                      <User className="w-[16px] h-[16px]" />
                    </span>
                    <Input
                      name="name"
                      placeholder="Your name"
                      value={nameVal}
                      onChange={(e) => setNameVal(e.target.value)}
                      onBlur={validate}
                      aria-invalid={!!errors.name}
                      className={`pl-9 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : nameVal ? "border-green-500 focus-visible:ring-green-500" : ""}`}
                      required
                    />
                    {nameVal && !errors.name ? (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 text-sm">✅</span>
                    ) : null}
                    {errors.name ? <div className="mt-1 text-xs text-red-600">{errors.name}</div> : null}
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true">
                      <Mail className="w-[16px] h-[16px]" />
                    </span>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={emailVal}
                      onChange={(e) => setEmailVal(e.target.value)}
                      onBlur={validate}
                      aria-invalid={!!errors.email}
                      className={`pl-9 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : emailVal ? "border-green-500 focus-visible:ring-green-500" : ""}`}
                      required
                    />
                    {emailVal && !errors.email ? (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 text-sm">✅</span>
                    ) : null}
                    {errors.email ? <div className="mt-1 text-xs text-red-600">{errors.email}</div> : null}
                  </div>

                  {/* Message */}
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-500" aria-hidden="true">
                      <MessageSquare className="w-[16px] h-[16px]" />
                    </span>
                    <Textarea
                      name="message"
                      placeholder="Message"
                      value={messageVal}
                      onChange={(e) => setMessageVal(e.target.value)}
                      onBlur={validate}
                      aria-invalid={!!errors.message}
                      className={`pl-9 min-h-[110px] ${errors.message ? "border-red-500 focus-visible:ring-red-500" : messageVal ? "border-green-500 focus-visible:ring-green-500" : ""}`}
                      required
                    />
                    {messageVal && !errors.message ? (
                      <span className="absolute right-2 top-2 text-green-600 text-sm">✅</span>
                    ) : null}
                    {errors.message ? <div className="mt-1 text-xs text-red-600">{errors.message}</div> : null}
                  </div>

                  {/* Send button with hover + ripple */}
                  <div className="pt-1.5">
                    <Button
                      type="submit"
                      disabled={sending}
                      onClick={addRipple}
                      className="relative overflow-hidden bg-blue-700 hover:bg-blue-800 active:scale-[0.99] transition"
                    >
                      {sending ? "Preparing…" : "Send"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  {/* Divider between Send button and Social row */}
                  <Separator className="my-4" />

                  {/* Compact Social row (icon-only) */}
                  <div
                    className="flex flex-wrap items-center gap-3 sm:gap-4"
                    aria-label="Social links"
                  >
                    <a
                      href="https://www.linkedin.com/"
                      target="_blank"
                      rel="noopener"
                      aria-label="Open LinkedIn"
                      className="grid place-items-center rounded-full w-9 h-9 sm:w-10 sm:h-10 bg-blue-50 text-blue-700 border border-blue-100 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-colors duration-150 ease-out hover:bg-blue-800 hover:text-white"
                    >
                      <Linkedin className="w-[18px] h-[18px]" />
                    </a>

                    <a
                      href="https://github.com/"
                      target="_blank"
                      rel="noopener"
                      aria-label="Open GitHub"
                      className="grid place-items-center rounded-full w-9 h-9 sm:w-10 sm:h-10 bg-blue-50 text-blue-700 border border-blue-100 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-colors duration-150 ease-out hover:bg-blue-800 hover:text-white"
                    >
                      <Github className="w-[18px] h-[18px]" />
                    </a>

                    <a
                      href="mailto:darshitapatel1506@gmail.com"
                      aria-label="Email Darshita"
                      className="grid place-items-center rounded-full w-9 h-9 sm:w-10 sm:h-10 bg-blue-50 text-blue-700 border border-blue-100 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-colors duration-150 ease-out hover:bg-blue-800 hover:text-white"
                    >
                      <Mail className="w-[18px] h-[18px]" />
                    </a>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Social card removed as requested */}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="mt-6">
        <div
          className="py-6 text-center text-xs text-white"
          style={{ background: `linear-gradient(90deg, ${BLUE.headerFrom}, ${BLUE.headerTo})` }}
        >
          © {new Date().getFullYear()} Darshita Patel — All rights reserved.
        </div>
      </footer>
    </div>
  );
}