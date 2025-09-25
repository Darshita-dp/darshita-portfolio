import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import "./Landing.icon-bounce.css";

const modes = [
  {
    id: "classic",
    title: "Classic",
    description: "Traditional portfolio view with clean design",
    symbol: "📜", // kawaii vibe
    color: "#F5D1C3", // pastel pink
    path: "/classic",
  },
  {
    id: "story",
    title: "Story",
    description: "Immersive scroll-driven narrative experience",
    symbol: "🎐", // wind chime
    color: "#F8CBA6", // pastel orange
    path: "/story",
  },
  {
    id: "play",
    title: "Play",
    description: "Gamified exploration of projects and skills",
    symbol: "🎮",
    color: "#FDE7A9", // pastel yellow
    path: "/play",
  },
  {
    id: "ai",
    title: "AI Chat",
    description: "Interactive conversation about my work",
    symbol: "🧠",
    color: "#BAE1FF", // pastel blue
    path: "/ai",
  },
];

function SunflowerHead({ size = 96 }: { size: number }) {
  // Pure flower face (no stem), kawaii style: yellow petals + warm center
  const petalCount = 12;
  const petals = Array.from({ length: petalCount });
  const cx = 50;
  const cy = 50;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
      style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.12))" }}
    >
      {/* Petals */}
      {petals.map((_, i) => {
        const angle = (i * 360) / petalCount;
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy - 28}
            rx="10"
            ry="24"
            fill="#FDE68A"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth="0.5"
            transform={`rotate(${angle} ${cx} ${cy})`}
          />
        );
      })}
      {/* Inner ring */}
      <circle cx={cx} cy={cy} r="22" fill="#A16207" />
      {/* Center */}
      <circle cx={cx} cy={cy} r="16" fill="#8B5E34" />
    </svg>
  );
}

function FlowerField({ densityScale = 1 }: { densityScale?: number }) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const spritesRef = useRef<Array<{
    el: HTMLDivElement;
    x: number;
    baseY: number;
    speed: number;
    amp: number;
    freq: number;
    phase: number;
    scale: number;
    opacity: number;
    rotPhase: number;
    rotAmp: number;
  }>>([]);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const hiddenRef = useRef<boolean>(false);
  const resizeRafRef = useRef<number | null>(null);

  useEffect(() => {
    const onVis = () => {
      hiddenRef.current = document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const clamp = (n: number, a: number, b: number) => Math.min(Math.max(n, a), b);
    // [EDIT] count scaled by density and still respecting reduced motion
    const baseCount = prefersReducedMotion ? 4 : clamp(Math.round(vw / 90), 12, 22);
    const count = Math.max(1, Math.floor(baseCount * densityScale));

    // helper to create randomized sprite params
    const newParams = () => ({
      x: -140 - Math.random() * 100,
      // [EDIT] baseY staggered using index injection later, here as placeholder
      baseY: Math.random() * vh,
      speed: 20 + Math.random() * 40, // [20, 60] px/s
      amp: 10 + Math.random() * 35, // [10, 45]
      freq: 0.6 + Math.random() * 1.2, // [0.6, 1.8]
      phase: Math.random() * Math.PI * 2, // [0, 2π]
      scale: 0.7 + Math.random() * 0.45, // [0.7, 1.15]
      opacity: 0.35 + Math.random() * 0.4, // 0.35–0.75
      rotPhase: Math.random() * Math.PI * 2,
      rotAmp: 3 + Math.random() * 3, // 3–6 deg
    });

    // initialize sprites
    spritesRef.current = [];
    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.style.position = "absolute";
      el.style.left = "0px";
      el.style.top = "0px";
      el.style.willChange = "transform";
      el.style.pointerEvents = "none";
      el.style.filter = "drop-shadow(0 2px 2px rgba(0,0,0,0.12))";

      const wrap = document.createElement("div");
      // render SVG once per sprite
      // scale applied via transform on wrapper for better perf
      wrap.innerHTML = "";
      el.appendChild(wrap);

      container.appendChild(el);

      const p = newParams();
      // [EDIT] stagger baseY by index to avoid clustering
      const band = vh / count;
      p.baseY = Math.max(0, Math.min(vh, band * i + (band * 0.2 + Math.random() * band * 0.6)));

      spritesRef.current.push({ el, ...p });
    }

    // mount SVGs after elements exist
    spritesRef.current.forEach((s: {
      el: HTMLDivElement;
      x: number;
      baseY: number;
      speed: number;
      amp: number;
      freq: number;
      phase: number;
      scale: number;
      opacity: number;
      rotPhase: number;
      rotAmp: number;
    }) => {
      const size = 96; // base size, scale via transform
      const svg = (function makeSvg() {
        const petalCount = 18;
        const cx = 50;
        const cy = 50;
        // build SVG element
        const ns = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(ns, "svg");
        svg.setAttribute("width", String(size));
        svg.setAttribute("height", String(size));
        svg.setAttribute("viewBox", "0 0 100 100");
        svg.setAttribute("aria-hidden", "true");
        // petals with gentle gradient
        const defs = document.createElementNS(ns, "defs");
        const gPetal = document.createElementNS(ns, "linearGradient");
        gPetal.setAttribute("id", "petalGrad");
        gPetal.setAttribute("x1", "0%");
        gPetal.setAttribute("y1", "0%");
        gPetal.setAttribute("x2", "0%");
        gPetal.setAttribute("y2", "100%");
        const stop1 = document.createElementNS(ns, "stop");
        stop1.setAttribute("offset", "0%");
        stop1.setAttribute("stop-color", "#FFE07B");
        const stop2 = document.createElementNS(ns, "stop");
        stop2.setAttribute("offset", "100%");
        stop2.setAttribute("stop-color", "#FFC94A");
        gPetal.appendChild(stop1);
        gPetal.appendChild(stop2);

        const gCenter = document.createElementNS(ns, "radialGradient");
        gCenter.setAttribute("id", "centerGrad");
        const c1 = document.createElementNS(ns, "stop");
        c1.setAttribute("offset", "0%");
        c1.setAttribute("stop-color", "#7A4A2B");
        const c2 = document.createElementNS(ns, "stop");
        c2.setAttribute("offset", "100%");
        c2.setAttribute("stop-color", "#5A3A23");
        gCenter.appendChild(c1);
        gCenter.appendChild(c2);

        defs.appendChild(gPetal);
        defs.appendChild(gCenter);
        svg.appendChild(defs);

        for (let i = 0; i < petalCount; i++) {
          const angle = (i * 360) / petalCount;
          const ellipse = document.createElementNS(ns, "ellipse");
          ellipse.setAttribute("cx", String(cx));
          ellipse.setAttribute("cy", String(cy - 28));
          ellipse.setAttribute("rx", "9.5");
          ellipse.setAttribute("ry", "23");
          ellipse.setAttribute("fill", "url(#petalGrad)");
          ellipse.setAttribute("stroke", "rgba(0,0,0,0.06)");
          ellipse.setAttribute("stroke-width", "0.5");
          ellipse.setAttribute("transform", `rotate(${angle} ${cx} ${cy})`);
          svg.appendChild(ellipse);
        }
        const ring = document.createElementNS(ns, "circle");
        ring.setAttribute("cx", String(cx));
        ring.setAttribute("cy", String(cy));
        ring.setAttribute("r", "22");
        ring.setAttribute("fill", "url(#centerGrad)");
        svg.appendChild(ring);
        const center = document.createElementNS(ns, "circle");
        center.setAttribute("cx", String(cx));
        center.setAttribute("cy", String(cy));
        center.setAttribute("r", "16");
        center.setAttribute("fill", "#5A3A23");
        svg.appendChild(center);
        return svg;
      })();
      svg.style.opacity = String(s.opacity);
      (s.el.firstChild as HTMLDivElement).appendChild(svg);
    });

    const step = (ts: number) => {
      if (hiddenRef.current || prefersReducedMotion) {
        lastTsRef.current = ts;
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      const last = lastTsRef.current || ts;
      const dt = (ts - last) / 1000; // seconds
      lastTsRef.current = ts;

      const vwNow = window.innerWidth;
      const vhNow = window.innerHeight;

      for (const s of spritesRef.current) {
        s.x += s.speed * dt;
        const y = s.baseY + s.amp * Math.sin(s.freq * ts / 1000 + s.phase);
        // Add subtle rotation wobble
        const rot = Math.sin((ts / 1000) * 0.6 + s.rotPhase) * s.rotAmp;

        s.el.style.transform = `translate(${s.x}px, ${y}px) scale(${s.scale}) rotate(${rot}deg)`;

        // Limit travel to roughly half the screen, then recycle with fresh params
        const limitX = vwNow * 0.5 + 60;
        if (s.x > limitX) {
          const p = newParams();
          s.x = p.x;
          s.baseY = Math.random() * vhNow;
          s.speed = p.speed;
          s.amp = p.amp;
          s.freq = p.freq;
          s.phase = p.phase;
          s.scale = p.scale;
          s.opacity = p.opacity;
          s.rotPhase = p.rotPhase;
          s.rotAmp = p.rotAmp;

          // Update the mounted SVG's opacity to match the new sprite opacity
          const wrap = s.el.firstChild as HTMLDivElement | null;
          const svg = wrap?.firstChild as SVGElement | null;
          if (svg) svg.style.opacity = String(s.opacity);
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };

    if (!prefersReducedMotion) {
      lastTsRef.current = performance.now();
      rafRef.current = requestAnimationFrame(step);
    } else {
      // Static placement for reduced motion
      spritesRef.current.forEach((s: {
        el: HTMLDivElement;
        x: number;
        baseY: number;
        speed: number;
        amp: number;
        freq: number;
        phase: number;
        scale: number;
        opacity: number;
        rotPhase: number;
        rotAmp: number;
      }) => {
        s.x = Math.random() * vw - 60;
        const y = Math.random() * vh;
        s.el.style.transform = `translate(${s.x}px, ${y}px) scale(${s.scale})`;
      });
    }

    // [EDIT] z-index behind clouds, stays behind content
    container.style.zIndex = "0";

    // [EDIT] rAF-throttled resize handler
    const onResize = () => {
      if (resizeRafRef.current) return;
      resizeRafRef.current = requestAnimationFrame(() => {
        resizeRafRef.current = null;
        const vwN = window.innerWidth;
        const vhN = window.innerHeight;
        spritesRef.current.forEach((s: {
          el: HTMLDivElement;
          x: number;
          baseY: number;
          speed: number;
          amp: number;
          freq: number;
          phase: number;
          scale: number;
          opacity: number;
          rotPhase: number;
          rotAmp: number;
        }) => {
          s.baseY = Math.min(Math.max(s.baseY, 0), vhN);
          if (s.x > vwN + 80) s.x = -100;
        });
      });
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      spritesRef.current = [];
      if (container) container.innerHTML = "";
    };
  }, [prefersReducedMotion, densityScale]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}

function LeavesField({ densityScale = 1 }: { densityScale?: number }) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const spritesRef = useRef<Array<{
    el: HTMLDivElement;
    x: number;
    baseY: number;
    speed: number;
    amp: number;
    freq: number;
    phase: number;
    scale: number;
    opacity: number;
    rotPhase: number;
    rotAmp: number;
  }>>([]);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const hiddenRef = useRef<boolean>(false);
  const resizeRafRef = useRef<number | null>(null);

  useEffect(() => {
    const onVis = () => {
      hiddenRef.current = document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const clamp = (n: number, a: number, b: number) => Math.min(Math.max(n, a), b);
    const baseCount = prefersReducedMotion ? 3 : clamp(Math.round(vw / 90), 12, 26);
    const count = Math.max(1, Math.floor(baseCount * densityScale));

    // Randomized params, matching opacity & shadow vibe of flowers
    const newParams = () => ({
      x: -140 - Math.random() * 120,
      baseY: Math.random() * vh,
      speed: 15 + Math.random() * 30, // a bit calmer than flowers
      amp: 8 + Math.random() * 26,
      freq: 0.5 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
      scale: 0.6 + Math.random() * 0.6,
      opacity: 0.35 + Math.random() * 0.35, // match flower transparency range
      rotPhase: Math.random() * Math.PI * 2,
      rotAmp: 2 + Math.random() * 3,
    });

    spritesRef.current = [];
    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.style.position = "absolute";
      el.style.left = "0px";
      el.style.top = "0px";
      el.style.willChange = "transform";
      el.style.pointerEvents = "none";
      el.style.filter = "drop-shadow(0 2px 2px rgba(0,0,0,0.12))"; // same shadow as flowers

      const wrap = document.createElement("div");
      wrap.innerHTML = "";
      el.appendChild(wrap);

      container.appendChild(el);

      const p = newParams();
      // [EDIT] stagger baseY by index to avoid clustering
      const band = vh / count;
      p.baseY = Math.max(0, Math.min(vh, band * i + (band * 0.2 + Math.random() * band * 0.6)));

      spritesRef.current.push({ el, ...p });
    }

    // Mount emoji leaves (🍃) instead of SVGs
    spritesRef.current.forEach((s: {
      el: HTMLDivElement;
      x: number;
      baseY: number;
      speed: number;
      amp: number;
      freq: number;
      phase: number;
      scale: number;
      opacity: number;
      rotPhase: number;
      rotAmp: number;
    }) => {
      const size = 60; // reduced size for subtler leaves while adding more overall
      const span = document.createElement("span");
      span.textContent = "🍃";
      span.setAttribute("aria-hidden", "true");
      span.style.display = "block";
      span.style.fontSize = `${size}px`;
      span.style.lineHeight = `${size}px`;
      span.style.opacity = String(s.opacity); // match flower transparency behavior
      // Wrapper already has drop-shadow matching flowers
      (s.el.firstChild as HTMLDivElement).appendChild(span);
    });

    const step = (ts: number) => {
      if (hiddenRef.current || prefersReducedMotion) {
        lastTsRef.current = ts;
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      const last = lastTsRef.current || ts;
      const dt = (ts - last) / 1000;
      lastTsRef.current = ts;

      const vwNow = window.innerWidth;
      const vhNow = window.innerHeight;

      for (const s of spritesRef.current) {
        s.x += s.speed * dt;
        const y = s.baseY + s.amp * Math.sin((s.freq * ts) / 1000 + s.phase);
        const rot = Math.sin((ts / 1000) * 0.6 + s.rotPhase) * s.rotAmp;

        s.el.style.transform = `translate(${s.x}px, ${y}px) scale(${s.scale}) rotate(${rot}deg)`;

        // Recycle halfway across screen (match flowers)
        const limitX = vwNow * 0.5 + 60;
        if (s.x > limitX) {
          const p = newParams();
          s.x = p.x;
          s.baseY = Math.random() * vhNow;
          s.speed = p.speed;
          s.amp = p.amp;
          s.freq = p.freq;
          s.phase = p.phase;
          s.scale = p.scale;
          s.opacity = p.opacity;
          s.rotPhase = p.rotPhase;
          s.rotAmp = p.rotAmp;

          const wrap = s.el.firstChild as HTMLDivElement | null;
          const emoji = wrap?.firstChild as HTMLElement | null;
          if (emoji) emoji.style.opacity = String(s.opacity);
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };

    if (!prefersReducedMotion) {
      lastTsRef.current = performance.now();
      rafRef.current = requestAnimationFrame(step);
    } else {
      // Static layout for reduced motion
      spritesRef.current.forEach((s: {
        el: HTMLDivElement;
        x: number;
        baseY: number;
        speed: number;
        amp: number;
        freq: number;
        phase: number;
        scale: number;
        opacity: number;
        rotPhase: number;
        rotAmp: number;
      }) => {
        s.x = Math.random() * vw - 60;
        const y = Math.random() * vh;
        s.el.style.transform = `translate(${s.x}px, ${y}px) scale(${s.scale})`;
      });
    }

    // [EDIT] z-index behind clouds
    container.style.zIndex = "0";

    // [EDIT] rAF-throttled resize handler
    const onResize = () => {
      if (resizeRafRef.current) return;
      resizeRafRef.current = requestAnimationFrame(() => {
        resizeRafRef.current = null;
        const vhN = window.innerHeight;
        const vwN = window.innerWidth;
        spritesRef.current.forEach((s: {
          el: HTMLDivElement;
          x: number;
          baseY: number;
          speed: number;
          amp: number;
          freq: number;
          phase: number;
          scale: number;
          opacity: number;
          rotPhase: number;
          rotAmp: number;
        }) => {
          s.baseY = Math.min(Math.max(s.baseY, 0), vhN);
          if (s.x > vwN + 80) s.x = -100;
        });
      });
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      spritesRef.current = [];
      if (container) container.innerHTML = "";
    };
  }, [prefersReducedMotion, densityScale]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const trackEvent = useMutation(api.analytics.trackEvent);
  // [EDIT] local toggle to reduce visuals (persisted)
  const [reduced, setReduced] = useState<boolean>(() => {
    const v = localStorage.getItem("landing_reduce_visuals");
    return v === "1";
  });
  useEffect(() => {
    localStorage.setItem("landing_reduce_visuals", reduced ? "1" : "0");
  }, [reduced]);
  const densityScale = prefersReducedMotion ? 0.25 : reduced ? 0.5 : 1;

  // [EDIT] lightweight parallax state via CSS variables
  const gridRef = useRef<HTMLDivElement | null>(null);
  const onGridMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = gridRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width; // -0.5..0.5
    const dy = (e.clientY - cy) / rect.height;
    el.style.setProperty("--dx", String(dx));
    el.style.setProperty("--dy", String(dy));
  };
  const onGridMouseLeave = () => {
    const el = gridRef.current;
    if (!el) return;
    el.style.setProperty("--dx", "0");
    el.style.setProperty("--dy", "0");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Kawaii Sky Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #FDE7A9 0%, #F8CBA6 25%, #F5D1C3 55%, #BAE1FF 100%)",
        }}
      />

      {/* Gentle cloud puffs (ensure clouds above flowers/leaves) */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: -200 }}
            animate={{ x: "110%" }}
            transition={{ duration: 32 + i * 7, repeat: Infinity, ease: "linear", delay: i * 2 }}
            className="absolute top-10"
            style={{
              top: `${8 + i * 12}%`,
              left: `${-20 - i * 8}%`,
              opacity: 0.85 - (i % 3) * 0.08,
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-28 h-10 rounded-full bg-white/60"
                style={{ filter: `blur(${1 + (i % 3)}px)` }}
              />
              <div
                className="w-16 h-8 rounded-full bg-white/50"
                style={{ filter: `blur(${0.5 + ((i + 1) % 3)}px)` }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Flower and Leaves layers behind content */}
      <FlowerField densityScale={densityScale} />
      <LeavesField densityScale={densityScale} />

      {/* Skip link for keyboard users */}
      <a
        href="#modes-grid"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 bg-white text-slate-900 px-3 py-2 rounded"
      >
        Skip to modes
      </a>

      {/* Content container */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 pt-20 md:pt-28">
        {/* Subtle vignette behind content */}
        <div
          className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: "min(1000px, 90vw)",
            height: "min(700px, 70vh)",
            borderRadius: "28px",
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.45), rgba(255,255,255,0.18) 55%, rgba(255,255,255,0) 75%)",
            filter: "blur(2px)",
          }}
        />

        {/* Top-right small control: reduce visuals toggle */}
        <div className="absolute top-4 right-4 z-30">
          <button
            onClick={() => setReduced((v) => !v)}
            className="text-xs rounded-full px-3 py-1 border bg-white/70 backdrop-blur hover:bg-white/90 transition"
            aria-pressed={reduced}
            aria-label={reduced ? "Background visuals: Reduced" : "Background visuals: Full"}
            title="Toggle background visuals"
          >
            {reduced ? "Background: Reduced" : "Background: Full"}
          </button>
        </div>

        {/* Name & Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 relative"
        >
          <h1
            className="tracking-tight text-6xl md:text-8xl"
            style={{
              fontFamily:
                '"Great Vibes", "Gwendolyn", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
              letterSpacing: "0.4px",
              color: "oklch(20% 0.04 150)",
              textShadow:
                "0 2px 0 rgba(248,203,166,0.85), 0 10px 24px rgba(34, 85, 54, 0.18), 0 1px 0 rgba(0,0,0,0.05)",
            }}
          >
            <span className="inline-block select-none">Darshita Patel</span>
          </h1>
          {/* Single decorative tiny leaf */}
          <span
            aria-hidden="true"
            className="absolute -top-2 left-1/2 -translate-x-[56%] text-2xl"
            style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.12))", opacity: 0.9 }}
          >
            🍃
          </span>
          <p
            className="mt-3 text-lg md:text-xl text-slate-700/90"
            style={{
              fontFamily: "ui-serif, Georgia, Cambria, Times New Roman, Times, serif",
              letterSpacing: "0.2px",
              textShadow:
                "0 1px 0 rgba(255,255,255,0.45), 0 10px 24px rgba(34,85,54,0.10)",
            }}
          >
            — where data finds its story in pastel hues
          </p>
        </motion.div>

        {/* Mode Selection Grid with light parallax */}
        <motion.div
          id="modes-grid"
          ref={gridRef}
          onMouseMove={onGridMouseMove}
          onMouseLeave={onGridMouseLeave}
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 max-w-4xl w-full"
          style={{
            // base values
            // @ts-ignore - CSS var used inline
            "--dx": 0,
            "--dy": 0,
          } as React.CSSProperties}
        >
          {modes.map((mode, index) => (
            <motion.button
              key={mode.id}
              type="button"
              title={`Open ${mode.title} mode`}
              aria-label={`Open ${mode.title} mode — ${mode.description}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.08 * index }}
              whileHover={{ y: -4, scale: 1.02, rotate: index % 2 === 0 ? 1.5 : -1.5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                // Track mode open event, then navigate
                void trackEvent({
                  event: "open_mode",
                  mode: mode.id,
                  metadata: {
                    userAgent: navigator.userAgent,
                    referrer: document.referrer || undefined,
                  },
                });
                navigate(mode.path);
              }}
              className="group cursor-pointer w-full text-left rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                outlineColor: "#BAE1FF",
                transform:
                  "translate3d(calc(var(--dx) * 6px), calc(var(--dy) * 6px), 0)",
                transition: "transform 120ms ease",
              }}
            >
              <Card
                className="border-[1.5px] transition-all duration-300 h-full"
                style={{
                  backgroundColor: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(8px)",
                  borderColor: "rgba(0,0,0,0.06)",
                }}
              >
                <CardHeader className="text-center pb-3">
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-full grid place-items-center transition-transform duration-300 shine-once"
                    style={{
                      // subtle inner highlight over the base pastel color
                      background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0) 42%), ${mode.color}`,
                      boxShadow:
                        "inset 0 -4px 0 rgba(0,0,0,0.08), 0 10px 18px rgba(0,0,0,0.10)",
                      border: "1px solid rgba(0,0,0,0.06)",
                      animation: "icon-bounce 2s infinite",
                      ["--shine-delay" as any]: `${120 + ((index * 90) % 260)}ms`,
                    }}
                  >
                    <span
                      className="text-3xl"
                      style={{
                        // Darken just the Story card icon a bit more for stronger contrast
                        filter:
                          mode.id === "story"
                            ? "brightness(0.78) contrast(1.2) saturate(1.2)"
                            : "brightness(0.88) contrast(1.1) saturate(1.15)",
                        textShadow: "0 1px 0 rgba(0,0,0,0.18), 0 6px 12px rgba(0,0,0,0.14)",
                      }}
                    >
                      {mode.symbol}
                    </span>
                  </div>
                  <CardTitle className="text-2xl text-slate-900 tracking-tight">
                    {mode.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-slate-700/80 text-base">
                    {mode.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.button>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <p className="text-slate-700/70 text-sm">
            Built with React, Convex, and a sprinkle of kawaii ✨
          </p>
        </motion.div>
      </div>
    </div>
  );
}