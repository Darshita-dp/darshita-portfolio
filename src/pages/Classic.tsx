import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ArrowRight, Award, Briefcase, Database, Github, Linkedin, Mail, Phone, Smartphone, Star } from "lucide-react";

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
    image: "/logo_bg.png",
    tags: ["SwiftUI", "Core Data", "MVVM"],
    link: "#",
    metrics: [
      { icon: <Star className="w-3.5 h-3.5" />, label: "Impact", value: 100, suffix: "%" },
      { icon: <Smartphone className="w-3.5 h-3.5" />, label: "Platform", value: 1 },
    ],
  },
  {
    id: "film-fusion",
    title: "Film‑Fusion",
    summary: "Interactive movie reviews with search, reviews, login; PHP + JSON/AJAX.",
    image: "/logo_bg.png",
    tags: ["HTML/CSS/JS", "PHP", "AJAX"],
    link: "#",
    metrics: [
      { icon: <Database className="w-3.5 h-3.5" />, label: "APIs", value: 2 },
      { icon: <Star className="w-3.5 h-3.5" />, label: "Features", value: 12, suffix: "+" },
    ],
  },
  {
    id: "scholarship-automation",
    title: "Scholarship Automation",
    summary: "Process analysis with RFP & BPMN; vendor comparison and automation framework.",
    image: "/logo_bg.png",
    tags: ["Process", "BPMN", "RFP"],
    link: "#",
    metrics: [
      { icon: <Star className="w-3.5 h-3.5" />, label: "Efficiency", value: 40, suffix: "%" },
      { icon: <Database className="w-3.5 h-3.5" />, label: "Docs", value: 8, suffix: "+" },
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
      <div className="mt-2 h-[3px] w-20 rounded-full" style={{ background: BLUE.accent }} />
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
              className="px-3 py-1.5 rounded-full text-sm border hover:shadow-sm transition"
              style={{
                borderColor: "rgba(13, 71, 161, 0.18)",
                color: "#0D47A1",
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
  // Lightweight, CSS-driven bubbles; respects reduced motion
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Increase density slightly for better presence on desktop
  const count = reduced ? 10 : 34;
  const bubbles = Array.from({ length: count });

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Keyframes local to this page */}
      <style>
        {`
        @keyframes bubble-rise {
          0%   { transform: translate3d(var(--bx, 0), 100%, 0) scale(var(--bs, 1)); opacity: 0; }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.7; }
          100% { transform: translate3d(calc(var(--bx, 0) + var(--bshift, 0px)), -20%, 0) scale(var(--bs, 1)); opacity: 0; }
        }
      `}
      </style>
      {bubbles.map((_, i) => {
        // Updated: broader, more visible sizes
        const size = 14 + Math.random() * 42; // 14–56px
        const left = Math.random() * 100; // vw %

        // Larger bubbles rise slower; preserve smoothness
        const norm = (size - 14) / 42; // 0 (small) -> 1 (large)
        const dur = 26 + norm * 22 + Math.random() * 8; // ~26–56s, larger = slower
        const delay = Math.random() * 8; // 0–8s
        const scale = 0.9 + Math.random() * 0.5; // subtle size variation
        const shift = (Math.random() * 90 - 45).toFixed(1) + "px"; // -45..45px drift

        // Enriched palette: brighter whites + clearer blues for contrast on pastel bg
        const palette = [
          "rgba(255,255,255,0.95)", // bright white
          "rgba(255,255,255,0.80)", // soft white
          "rgba(230,244,255,0.85)", // very light blue
          "rgba(189,222,255,0.80)", // light blue
          "rgba(120,169,255,0.40)", // soft navy tint
        ];
        const bg = palette[i % palette.length];

        return (
          <span
            key={i}
            aria-hidden="true"
            className="absolute rounded-full backdrop-blur-[1px]"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              bottom: "-10%",
              background: bg,
              // Slightly stronger border for visibility
              border: "1px solid rgba(255,255,255,0.5)",
              // Slightly stronger shadow for separation from bg
              boxShadow: "0 3px 10px rgba(13,71,161,0.12)",
              // Motion
              animation: reduced ? undefined : `bubble-rise ${dur}s linear ${delay}s infinite`,
              // Per-bubble CSS vars
              // @ts-ignore custom properties
              "--bx": "0px",
              "--bs": scale,
              "--bshift": shift,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}

export default function Classic() {
  const [sending, setSending] = useState(false);

  const onSubmitContact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "");
    const email = String(fd.get("email") || "");
    const message = String(fd.get("message") || "");
    setSending(true);
    setTimeout(() => {
      setSending(false);
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
      window.location.href = `mailto:darshitaa2001@gmail.com?subject=${subject}&body=${body}`;
    }, 450);
  };

  const headerGradient = { background: `linear-gradient(90deg, ${BLUE.headerFrom}, ${BLUE.headerTo})` };

  const extras = useMemo(
    () => [
      {
        icon: <Award className="w-4 h-4" />,
        title: "Outstanding Graduate Student Award (Nom.)",
        desc: "Recognized for academic excellence and impact.",
      },
      {
        icon: <Briefcase className="w-4 h-4" />,
        title: "Certifications",
        desc: "Foundations in SQL, Agile practices; exploring AWS.",
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen relative" style={{ background: BLUE.bgTint }}>
      <BubblesBackground />
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
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-white/40 shadow-xl">
                <img
                  src="https://harmless-tapir-303.convex.cloud/api/storage/fbbcab3e-d3b1-4639-99b4-311c5e1ab7ca"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-full blur-2xl opacity-50" style={{ background: BLUE.accent }} />
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
                "Transforming data into insights 📊 | Building solutions through code 💻"
              </motion.p>

              <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2">
                <Button asChild variant="secondary" className="bg-white text-black hover:bg-white/90">
                  <a href="#" onClick={(e) => e.preventDefault()}>📄 Resume</a>
                </Button>
                <Button asChild variant="outline" className="bg-white text-black border-white/60 hover:bg-white/90">
                  <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">🔗 LinkedIn</a>
                </Button>
                <Button asChild variant="outline" className="bg-white text-black border-white/60 hover:bg-white/90">
                  <a href="https://github.com/" target="_blank" rel="noreferrer">🖥️ GitHub</a>
                </Button>
                <Button asChild variant="outline" className="bg-white text-black border-white/60 hover:bg-white/90">
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
        className="container mx-auto max-w-6xl px-4 py-10"
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

      {/* Projects */}
      <motion.section
        id="projects"
        className="container mx-auto max-w-6xl px-4 py-10"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <SectionTitle id="projects-title">Projects</SectionTitle>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredProjects.map((p, i) => (
            <motion.a
              key={p.id}
              href={p.link || "#"}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="group"
              aria-label={`Open project ${p.title}`}
            >
              <Card className="overflow-hidden border-slate-200 hover:border-blue-300 transition-all shadow-sm hover:shadow-lg">
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
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
            </motion.a>
          ))}
        </div>
      </motion.section>

      {/* Skills – 4 categories as bubble cards */}
      <motion.section
        id="skills"
        className="py-10"
        style={{ background: BLUE.bgTint }}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto max-w-6xl px-4">
          <SectionTitle id="skills-title">Skills</SectionTitle>
          {/*
            Bubble cards per category; enlarge on hover
          */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Data Skills */}
            <Card className="border-blue-100 shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-lg">📊 Data Skills</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {[
                  "SQL (MySQL, Oracle)",
                  "Python (Pandas, NumPy)",
                  "Tableau",
                  "Power BI",
                  "Excel (Pivots/Lookups)",
                  "Data Cleaning",
                  "Data Visualization",
                  "Reporting",
                ].map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-full text-sm bg-white hover:shadow transition transform hover:scale-105 border"
                    style={{ borderColor: "rgba(13,71,161,0.18)", color: "#0D47A1" }}>
                    {s}
                  </span>
                ))}
              </CardContent>
            </Card>
            {/* Development Skills */}
            <Card className="border-blue-100 shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-lg">💻 Development Skills</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {[
                  "React",
                  "SwiftUI",
                  "PHP",
                  "HTML/CSS/JS",
                  "Java",
                  "C/C++",
                  "Node.js (basics)",
                  "Git & GitHub",
                ].map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-full text-sm bg-white hover:shadow transition transform hover:scale-105 border"
                    style={{ borderColor: "rgba(13,71,161,0.18)", color: "#0D47A1" }}>
                    {s}
                  </span>
                ))}
              </CardContent>
            </Card>
            {/* Interpersonal */}
            <Card className="border-blue-100 shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-lg">🧠 Interpersonal</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {[
                  "Leadership & Teamwork",
                  "Communication & Mentorship",
                  "Problem‑Solving",
                  "Time Management",
                  "Critical Thinking",
                ].map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-full text-sm bg-white hover:shadow transition transform hover:scale-105 border"
                    style={{ borderColor: "rgba(13,71,161,0.18)", color: "#0D47A1" }}>
                    {s}
                  </span>
                ))}
              </CardContent>
            </Card>
            {/* Tools & Others */}
            <Card className="border-blue-100 shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-lg">🌐 Tools & Others</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {[
                  "AWS (EC2, RDS, S3, VPC)",
                  "Jira & Confluence",
                  "Docker (basics)",
                  "Microsoft Office Suite",
                ].map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-full text-sm bg-white hover:shadow transition transform hover:scale-105 border"
                    style={{ borderColor: "rgba(13,71,161,0.18)", color: "#0D47A1" }}>
                    {s}
                  </span>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.section>

      {/* Experience Timeline - replaces previous Experience grid content */}
      <motion.section
        id="experience"
        className="container mx-auto max-w-6xl px-4 py-10"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <SectionTitle id="experience-title">Experience Timeline</SectionTitle>
        <div className="mt-6 relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[3px] bg-blue-200/70 rounded" />
          <div className="space-y-6">
            {[
              {
                title: "Graduate Teaching Assistant | Illinois State University",
                period: "Aug 2024 – May 2025",
                desc:
                  "Instructed and supported 120+ students in IT productivity tools; developed lab content and guided students in Microsoft Office Suite and data tools.",
              },
              {
                title: "Product Supervisor | Chaudhary Tea Processors & Packets Pvt. Ltd.",
                period: "2023",
                desc:
                  "Oversaw product information management systems; ensured data accuracy and coordinated smooth workflows.",
              },
              {
                title: "Web Development Intern | CIIWAS NGO",
                period: "Aug 2024 – Dec 2024",
                desc:
                  "Maintained NGO website; processed community datasets to improve reporting accuracy.",
              },
              {
                title: "IT Analyst Intern | ORANGES NGO",
                period: "Apr 2022 – Dec 2022",
                desc:
                  "Processed and cleansed donor/beneficiary datasets from 80+ regions; automated workflows to improve governance and reporting.",
              },
              {
                title: "Capstone & Project Work | ISU",
                period: "2023 – 2025",
                desc:
                  "Revamped Courtside Leadership WordPress site; delivered Managed IT Services RFP (Hazel Crest) with data analysis & strategy.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45 }}
                className={`relative md:w-1/2 ${i % 2 === 0 ? "md:pr-8 md:ml-auto" : "md:pl-8"}`}
                style={{ paddingLeft: "2.5rem" }}
              >
                <span className="absolute left-4 md:left-1/2 -translate-x-1/2 top-3 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-200" />
                <Card className="shadow-sm">
                  <CardHeader className="pb-1">
                    <CardTitle className="text-base md:text-lg text-slate-900">{item.title}</CardTitle>
                    <p className="text-xs text-slate-500 mt-1">{item.period}</p>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-700">{item.desc}</CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Certificates & Achievements - NEW */}
      <motion.section
        className="container mx-auto max-w-6xl px-4 py-10"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <SectionTitle id="certs-title">Certificates & Achievements</SectionTitle>
        <div className="mt-6">
          <Carousel className="w-full">
            <CarouselContent className="flex gap-4">
              {[
                "AWS Cloud Practitioner (In Progress)",
                "Tableau Desktop Specialist (In Progress)",
                "LinkedIn Learning – Data Analysis & SQL",
                "Outstanding Graduate Student Award – ISU (2025)",
                "ISU Research Symposium Poster (AI in Banking, 2025)",
              ].map((c) => (
                <CarouselItem key={c} className="basis-5/6 md:basis-1/3">
                  <Card className="h-full shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm md:text-base">{c}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 grid place-items-center text-4xl">🏅</div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </motion.section>

      {/* Education - NEW */}
      <motion.section
        className="container mx-auto max-w-6xl px-4 py-10"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <SectionTitle id="education-title">Education</SectionTitle>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              front: "Illinois State University (ISU)",
              back: "M.S. in Information Systems | GPA: 4.0 | 2025\nInternet Application Development Sequence",
            },
            {
              front: "Devi Ahilya Vishwavidyalaya (DAVV), India",
              back: "B.C.A. (Hons.) | GPA: 3.5 | 2022",
            },
          ].map((ed) => (
            <div key={ed.front} className="group [perspective:1000px]">
              <div className="relative h-40 w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                <Card className="absolute inset-0 grid place-items-center backface-hidden shadow-sm">
                  <CardHeader><CardTitle className="text-center">{ed.front}</CardTitle></CardHeader>
                </Card>
                <Card className="absolute inset-0 grid place-items-center backface-hidden [transform:rotateY(180deg)] shadow-sm">
                  <CardContent className="text-center whitespace-pre-line text-sm text-slate-700">{ed.back}</CardContent>
                </Card>
              </div>
            </div>
          ))}
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
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            ["📸", "Photography & Visual Design"],
            ["🎨", "Creative Designing & Posters"],
            ["✍️", "Blogging & Storytelling"],
            ["💡", "Exploring AI & Tech Trends"],
            ["👭", "Time with sisters"],
          ].map(([icon, label]) => (
            <div key={label} className="rounded-xl bg-white p-4 border hover:shadow-md transition transform hover:scale-105 text-center">
              <div className="text-3xl">{icon}</div>
              <div className="mt-2 text-xs text-slate-700">{label}</div>
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
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Resume</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Button variant="outline" asChild>
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Download Resume
                </a>
              </Button>
              <span className="text-xs text-slate-500">Add your resume link later.</span>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Contact */}
      <motion.section
        id="contact"
        className="bg-white border-t"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <SectionTitle id="contact-title">Contact</SectionTitle>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Let's talk</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmitContact} className="space-y-3">
                  <Input name="name" placeholder="Your name" required />
                  <Input type="email" name="email" placeholder="Email" required />
                  <Textarea name="message" placeholder="Message" required className="min-h-[120px]" />
                  <Button type="submit" disabled={sending}>
                    {sending ? "Preparing…" : "Send"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                  <a href="mailto:darshitaa2001@gmail.com" className="inline-flex items-center gap-1 text-blue-700 hover:underline">
                    <Mail className="w-4 h-4" /> Email
                  </a>
                  <a href="tel:+1" className="inline-flex items-center gap-1 text-blue-700 hover:underline">
                    <Phone className="w-4 h-4" /> Phone
                  </a>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Social</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button asChild variant="outline">
                  <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
                    <Linkedin className="w-4 h-4 mr-2" /> LinkedIn
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="https://github.com/" target="_blank" rel="noreferrer">
                    <Github className="w-4 h-4 mr-2" /> GitHub
                  </a>
                </Button>
              </CardContent>
            </Card>
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