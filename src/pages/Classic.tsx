import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
    title: "SmartPlanner (iOS)",
    summary: "SwiftUI • Core Data • MVVM — planning app with clean mobile UX.",
    image: "/logo_bg.png",
    tags: ["SwiftUI", "Core Data", "MVVM"],
    link: "#",
    metrics: [
      { icon: <Star className="w-3.5 h-3.5" />, label: "Ratings", value: 120, suffix: "+" },
      { icon: <Smartphone className="w-3.5 h-3.5" />, label: "iOS", value: 1 },
    ],
  },
  {
    id: "film-fusion",
    title: "Film‑Fusion (Web)",
    summary: "Movie discovery site showcasing routing, search, and structured UI.",
    image: "/logo_bg.png",
    tags: ["React", "TypeScript", "UI"],
    link: "#",
    metrics: [
      { icon: <Database className="w-3.5 h-3.5" />, label: "Titles Indexed", value: 8_500, suffix: "+" },
      { icon: <Star className="w-3.5 h-3.5" />, label: "Pages", value: 24 },
    ],
  },
  {
    id: "course-manager",
    title: "Course Manager",
    summary: "Organize courses, assignments, and progress with clarity.",
    image: "/logo_bg.png",
    tags: ["React", "UX", "State"],
    link: "#",
    metrics: [
      { icon: <Star className="w-3.5 h-3.5" />, label: "Reliability", value: 99, suffix: "%" },
      { icon: <Database className="w-3.5 h-3.5" />, label: "Courses Tracked", value: 32 },
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

  const count = reduced ? 8 : 26;
  const bubbles = Array.from({ length: count });

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Keyframes local to this page */}
      <style>
        {`
        @keyframes bubble-rise {
          0%   { transform: translate3d(var(--bx, 0), 100%, 0) scale(var(--bs, 1)); opacity: 0; }
          10%  { opacity: 0.6; }
          90%  { opacity: 0.6; }
          100% { transform: translate3d(calc(var(--bx, 0) + var(--bshift, 0px)), -20%, 0) scale(var(--bs, 1)); opacity: 0; }
        }
      `}
      </style>
      {bubbles.map((_, i) => {
        // Randomize per-bubble vars
        const size = 10 + Math.random() * 34; // 10–44px
        const left = Math.random() * 100; // vw %
        // Refined: larger bubbles rise slower; broadened range for smoother feel
        const norm = (size - 10) / 34; // 0 (small) -> 1 (large)
        const dur = 24 + norm * 20 + Math.random() * 8; // ~24–52s, larger = slower
        const delay = Math.random() * 8; // 0–8s
        const scale = 0.9 + Math.random() * 0.5; // subtle size variation
        const shift = (Math.random() * 80 - 40).toFixed(1) + "px"; // -40..40px drift
        // Color mix: whites + soft blues
        const palette = [
          "rgba(255,255,255,0.9)",
          "rgba(255,255,255,0.7)",
          "rgba(210,233,255,0.65)",
          "rgba(163,208,255,0.55)",
          "rgba(13,71,161,0.08)",
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
              border: "1px solid rgba(255,255,255,0.35)",
              boxShadow: "0 2px 8px rgba(13,71,161,0.08)",
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
              <p className="mt-2 text-sm md:text-base opacity-95">
                Turning data into impactful solutions | Full‑Stack Developer & Analyst
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2">
                <Button asChild variant="secondary" className="bg-white text-slate-900 hover:bg-white/90">
                  <a href="#contact"><Mail className="w-4 h-4 mr-2" /> Let's Connect</a>
                </Button>
                <Button asChild variant="outline" className="border-white/60 text-white hover:bg-white/10">
                  <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
                    <Linkedin className="w-4 h-4 mr-2" /> LinkedIn
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-white/60 text-white hover:bg-white/10">
                  <a href="https://github.com/" target="_blank" rel="noreferrer">
                    <Github className="w-4 h-4 mr-2" /> GitHub
                  </a>
                </Button>
              </div>
            </div>
          </div>
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

      {/* Skills */}
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
          <SectionTitle id="skills-title">Skills & Expertise</SectionTitle>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-blue-100 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Technical</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {techSkills.map((s, idx) => (
                  <div key={s.name} className="space-y-1">
                    <div className="flex items-center gap-2">
                      {s.icon ? <span className="text-blue-700">{s.icon}</span> : null}
                      <span className="font-medium">{s.name}</span>
                    </div>
                    <SkillBar label="" value={s.level} delay={0.1 + idx * 0.06} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-blue-100 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Professional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {softSkills.map((s, i) => (
                  <div key={s} className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-blue-700" />
                    <span>{s}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.section>

      {/* Experience */}
      <motion.section
        id="experience"
        className="container mx-auto max-w-6xl px-4 py-10"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <SectionTitle id="experience-title">Experience Highlights</SectionTitle>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-700" />
              <CardTitle className="text-lg">Graduate Teaching Assistant, ISU</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              Assisted 120+ students in IT‑150 labs; reinforced fundamentals and practical computing.
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-700" />
              <CardTitle className="text-lg">NGO Web Internships</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              Built accessible sites/dashboards for CIIWAS & ORANGES; boosted engagement and clarity.
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