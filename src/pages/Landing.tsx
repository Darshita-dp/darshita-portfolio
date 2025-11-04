import { useNavigate } from "react-router";
import { motion, useReducedMotion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useMemo, useRef, useState } from "react";
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
    // Increase total flower count by +5
    const baseCount = prefersReducedMotion ? 4 : clamp(Math.round(vw / 90), 12, 22);
    const count = Math.max(1, Math.floor(baseCount * densityScale)) + 5;

    // helper to create randomized sprite params with larger scales
    const newParams = () => ({
      x: -140 - Math.random() * 100,
      baseY: Math.random() * vh,
      speed: 20 + Math.random() * 40, // [20, 60] px/s
      amp: 10 + Math.random() * 35, // [10, 45]
      freq: 0.6 + Math.random() * 1.2, // [0.6, 1.8]
      phase: Math.random() * Math.PI * 2, // [0, 2π]
      // Larger overall flower sizes
      scale: 0.9 + Math.random() * 0.5, // [0.9, 1.4]
      opacity: 0.25 + Math.random() * 0.35, // 0.25–0.60
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

    // Mount sunflower sticker images with a larger base size
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
      const size = 110; // increased from 92
      const img = document.createElement("img");
      img.src = "https://harmless-tapir-303.convex.cloud/api/storage/661753be-a350-4324-8eb5-60d69f761ad5";
      img.setAttribute("aria-hidden", "true");
      img.style.display = "block";
      img.style.width = `${size}px`;
      img.style.height = `${size}px`;
      img.style.objectFit = "contain";
      img.style.opacity = String(s.opacity);
      (s.el.firstChild as HTMLDivElement).appendChild(img);
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

          // Update opacity reference on recycle to target the image instead of the SVG
          const wrap = s.el.firstChild as HTMLDivElement | null;
          const imgEl = wrap?.firstChild as HTMLImageElement | null;
          if (imgEl) imgEl.style.opacity = String(s.opacity);
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

    // Mount leaf sticker images instead of emojis
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
      const img = document.createElement("img");
      img.src = "https://harmless-tapir-303.convex.cloud/api/storage/0bfa77c9-0eb4-46a1-b180-47d0ce1c295f";
      img.setAttribute("aria-hidden", "true");
      img.style.display = "block";
      img.style.width = `${size}px`;
      img.style.height = `${size}px`;
      img.style.objectFit = "contain";
      img.style.opacity = String(s.opacity); // match flower transparency behavior
      // Wrapper already has drop-shadow matching flowers
      (s.el.firstChild as HTMLDivElement).appendChild(img);
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

/**
 * Extra layer: exactly 10 small leaves sprinkled between other animations.
 * Uses the provided small leaf sticker URL and lighter motion.
 */
function SmallLeavesField() {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const spritesRef = useRef<
    Array<{
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
    }>
  >([]);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const hiddenRef = useRef<boolean>(false);

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

    const count = 10; // exactly 10 small leaves

    const newParams = () => ({
      x: -140 - Math.random() * 120,
      baseY: Math.random() * vh,
      speed: 18 + Math.random() * 22,
      amp: 6 + Math.random() * 16,
      freq: 0.6 + Math.random() * 1.0,
      phase: Math.random() * Math.PI * 2,
      scale: 0.5 + Math.random() * 0.3, // smaller than main leaves
      opacity: 0.45 + Math.random() * 0.35,
      rotPhase: Math.random() * Math.PI * 2,
      rotAmp: 2 + Math.random() * 2,
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
      el.style.filter = "drop-shadow(0 2px 2px rgba(0,0,0,0.12))";

      const wrap = document.createElement("div");
      el.appendChild(wrap);
      container.appendChild(el);

      const p = newParams();

      // spread vertically
      const band = vh / count;
      p.baseY = Math.max(0, Math.min(vh, band * i + (band * 0.2 + Math.random() * band * 0.6)));

      spritesRef.current.push({ el, ...p });
    }

    // Mount provided small leaf sticker
    spritesRef.current.forEach((s) => {
      const size = 36;
      const img = document.createElement("img");
      img.src = "https://harmless-tapir-303.convex.cloud/api/storage/e212e13f-cc12-4058-9359-6e3959c6d228";
      img.setAttribute("aria-hidden", "true");
      img.style.display = "block";
      img.style.width = `${size}px`;
      img.style.height = `${size}px`;
      img.style.objectFit = "contain";
      img.style.opacity = String(s.opacity);
      (s.el.firstChild as HTMLDivElement).appendChild(img);
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
          const imgEl = wrap?.firstChild as HTMLImageElement | null;
          if (imgEl) imgEl.style.opacity = String(s.opacity);
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };

    if (!prefersReducedMotion) {
      lastTsRef.current = performance.now();
      rafRef.current = requestAnimationFrame(step);
    } else {
      spritesRef.current.forEach((s) => {
        s.x = Math.random() * vw - 60;
        const y = Math.random() * vh;
        s.el.style.transform = `translate(${s.x}px, ${y}px) scale(${s.scale})`;
      });
    }

    container.style.zIndex = "0";

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      spritesRef.current = [];
      if (container) container.innerHTML = "";
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}

function GlitterField({ count = 20 }: { count?: number }) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const spritesRef = useRef<
    Array<{
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
      twinkleFreq: number;
      twinklePhase: number;
      size: number;
    }>
  >([]);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const hiddenRef = useRef<boolean>(false);

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

    // using count from props; default 20 (mostly smaller than the small leaves)

    const newParams = () => {
      const size = 10 + Math.random() * 12; // 10–22px
      return {
        x: -140 - Math.random() * 140,
        baseY: Math.random() * vh,
        speed: 12 + Math.random() * 18,
        amp: 5 + Math.random() * 14,
        freq: 0.5 + Math.random() * 1.0,
        phase: Math.random() * Math.PI * 2,
        scale: 0.8 + Math.random() * 0.4,
        opacity: 0.5 + Math.random() * 0.35,
        rotPhase: Math.random() * Math.PI * 2,
        rotAmp: 4 + Math.random() * 6,
        twinkleFreq: 2 + Math.random() * 3, // Hz
        twinklePhase: Math.random() * Math.PI * 2,
        size,
      };
    };

    spritesRef.current = [];
    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.style.position = "absolute";
      el.style.left = "0px";
      el.style.top = "0px";
      el.style.willChange = "transform, opacity";
      el.style.pointerEvents = "none";
      el.style.filter = "drop-shadow(0 1px 2px rgba(0,0,0,0.10))";

      const img = document.createElement("img");
      img.src = "https://harmless-tapir-303.convex.cloud/api/storage/d943df10-c9ab-4a26-a8c2-0c6b464f00be";
      img.setAttribute("aria-hidden", "true");
      img.style.display = "block";
      el.appendChild(img);

      container.appendChild(el);

      const p = newParams();
      img.style.width = `${p.size}px`;
      img.style.height = `${p.size}px`;

      // distribute vertically to avoid clumping
      const band = vh / count;
      p.baseY = Math.max(0, Math.min(vh, band * i + (band * 0.2 + Math.random() * band * 0.6)));

      spritesRef.current.push({ el, ...p });
    }

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
        const rot = Math.sin((ts / 1000) * 0.7 + s.rotPhase) * s.rotAmp;
        const twinkle = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(s.twinkleFreq * (ts / 1000) * Math.PI * 2 + s.twinklePhase)); // 0.6–1
        s.el.style.transform = `translate(${s.x}px, ${y}px) scale(${s.scale}) rotate(${rot}deg)`;
        s.el.style.opacity = String(s.opacity * twinkle);

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
          s.twinkleFreq = p.twinkleFreq;
          s.twinklePhase = p.twinklePhase;

          const imgEl = s.el.firstChild as HTMLImageElement | null;
          if (imgEl) {
            imgEl.style.width = `${p.size}px`;
            imgEl.style.height = `${p.size}px`;
          }
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };

    if (!prefersReducedMotion) {
      lastTsRef.current = performance.now();
      rafRef.current = requestAnimationFrame(step);
    } else {
      // Static placement for reduced motion
      spritesRef.current.forEach((s) => {
        s.x = Math.random() * vw - 60;
        const y = Math.random() * vh;
        s.el.style.transform = `translate(${s.x}px, ${y}px) scale(${s.scale})`;
        s.el.style.opacity = String(s.opacity);
      });
    }

    // ensure behind content and clouds like other fields
    container.style.zIndex = "0";

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      spritesRef.current = [];
      if (container) container.innerHTML = "";
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}

function SparkleEmitter() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = ref.current?.parentElement as HTMLElement | null;
    const container = ref.current;
    if (!container || !root) return;

    // Provided glitter images
    const sparkleUrls: Array<string> = [
      "https://harmless-tapir-303.convex.cloud/api/storage/a34cb6e9-c85e-4ff7-b88c-8c40dd894c9a",
      "https://harmless-tapir-303.convex.cloud/api/storage/24034358-bb1b-449a-a645-cd132257c609",
    ];

    type P = {
      el: HTMLImageElement;
      alive: boolean;
      life: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      scale: number;
    };

    // Build particle pool
    const pool: Array<P> = [];
    const POOL_SIZE = 60;
    for (let i = 0; i < POOL_SIZE; i++) {
      const img = document.createElement("img");
      img.src = sparkleUrls[i % sparkleUrls.length];
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      img.style.position = "absolute";
      img.style.left = "0";
      img.style.top = "0";
      img.style.opacity = "0";
      img.style.pointerEvents = "none";
      img.style.filter = "drop-shadow(0 0 6px rgba(255,255,255,0.75))";
      container.appendChild(img);

      pool.push({
        el: img,
        alive: false,
        life: 0,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        scale: 1,
      });
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Emission rate tied to boost state
    let rate = 0; // particles per second
    const updateRate = () => {
      const boosted = root.getAttribute("data-boost") === "1";
      rate = boosted ? (prefersReduced ? 8 : 18) : (prefersReduced ? 3 : 6);
    };
    const mo = new MutationObserver(updateRate);
    mo.observe(root, { attributes: true, attributeFilter: ["data-boost"] });
    updateRate();

    let last = performance.now();
    let acc = 1.2; // spawn immediately so user sees sparkles
    let raf = 0;

    function loop(now: number) {
      const dt = (now - last) / 1000;
      last = now;

      // Emit particles
      acc += dt * rate;
      while (acc > 1) {
        const p = pool.find((pp) => !pp.alive);
        if (!p) break;
        acc -= 1;

        // Initialize particle
        p.alive = true;
        p.life = 0;
        p.x = 0;
        p.y = 0;
        p.vx = (Math.random() - 0.5) * 28; // slight horizontal jitter
        p.vy = 70 + Math.random() * 70; // downward velocity
        p.scale = 0.8 + Math.random() * 0.4;

        // Random glitter image and small size (smaller than small leaves)
        const url = sparkleUrls[Math.random() < 0.5 ? 0 : 1];
        p.el.src = url;
        const baseSize = 10 + Math.random() * 6; // 10–16px
        p.el.style.width = `${baseSize}px`;
        p.el.style.height = `${baseSize}px`;

        p.el.style.opacity = "1";
        p.el.style.transform = `translate3d(0, 0, 0) scale(${p.scale}) rotate(0deg)`;
      }

      // Animate active particles
      for (const p of pool) {
        if (!p.alive) continue;
        p.life += dt;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const fade = Math.max(0, 1 - p.life / 0.85); // ~0.85s lifetime
        p.el.style.opacity = fade.toString();
        p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) scale(${p.scale})`;

        if (p.life > 0.9) {
          p.alive = false;
          p.el.style.opacity = "0";
        }
      }

      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      container.innerHTML = "";
    };
  }, []);

  // Center the emitter at the cursor and ensure it layers above the flower
  return (
    <div
      ref={ref}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      aria-hidden="true"
      style={{ zIndex: 2 }}
    />
  );
}

function SunflowerCursor() {
  const ref = useRef<HTMLDivElement | null>(null);
  const state = useRef<{ x: number; y: number; boost: boolean }>({ x: -100, y: -100, boost: false });

  // Use provided sticker for the cursor flower (both base and hover)
  const sunflowerStickerUrl = "https://harmless-tapir-303.convex.cloud/api/storage/e2bd4901-a77f-4767-8132-491818b20b90";
  const sunflowerBg = useMemo(() => `url("${sunflowerStickerUrl}")`, []);
  const sunflowerBgHover = useMemo(() => `url("${sunflowerStickerUrl}")`, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Initialize cursor at current mouse position or center of screen
    const initX = window.innerWidth / 2;
    const initY = window.innerHeight / 2;
    state.current.x = initX;
    state.current.y = initY;
    
    // Set initial position immediately
    el.style.transform = `translate3d(${initX}px, ${initY}px, 0)`;

    // Track target pointer position
    const onMove = (e: PointerEvent) => {
      state.current.x = e.clientX;
      state.current.y = e.clientY;
    };

    // Universal boost: any interactive element OR explicit data-cursor-boost
    const interactiveSel =
      "button, a, input, select, textarea, label, summary, details, [role='button'], [role='link'], [tabindex]:not([tabindex='-1']), [contenteditable='true']";
    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const isInteractive = !!t?.closest(interactiveSel);
      const explicitBoost = !!t?.closest("[data-cursor-boost='true']");
      state.current.boost = isInteractive || explicitBoost;
    };

    // Ensure boost is cleared when pointer leaves the window
    const onLeave = () => {
      state.current.boost = false;
    };

    // Also support keyboard focus for accessibility
    const onFocusIn = () => {
      const active = document.activeElement as HTMLElement | null;
      const isInteractive = !!active?.closest(interactiveSel);
      const explicitBoost = !!active?.closest("[data-cursor-boost='true']");
      state.current.boost = isInteractive || explicitBoost;
    };
    const onFocusOut = () => {
      // Defer to next frame so focus change can settle
      requestAnimationFrame(() => {
        const active = document.activeElement as HTMLElement | null;
        const isInteractive = !!active?.closest(interactiveSel);
        const explicitBoost = !!active?.closest("[data-cursor-boost='true']");
        state.current.boost = isInteractive || explicitBoost;
      });
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave, { passive: true });
    document.addEventListener("focusin", onFocusIn, { passive: true });
    document.addEventListener("focusout", onFocusOut, { passive: true });

    // Smooth follow lag + micro-rotation wobble (boosted only)
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let prevX = state.current.x;
    let prevY = state.current.y;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const ease = 0.18; // subtle lag

    function loop(now: number) {
      const node = ref.current;
      if (!node) return;

      // Smoothly follow pointer
      prevX = lerp(prevX, state.current.x, ease);
      prevY = lerp(prevY, state.current.y, ease);

      node.style.transform = `translate3d(${prevX}px, ${prevY}px, 0)`;
      node.setAttribute("data-boost", state.current.boost ? "1" : "0");

      // Micro wobble when boosted (disabled for reduced motion)
      const wobble = state.current.boost && !prefersReduced ? Math.sin(now * 0.002) * 1.2 : 0;
      node.style.setProperty("--cursor-rot", `${wobble}deg`);

      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="cursor-root"
      aria-hidden="true"
      // Ensure the cursor + sparkles sit above all content and don't block interactions
      style={{ position: "fixed", top: 0, left: 0, zIndex: 9999, pointerEvents: "none", overflow: "visible" }}
    >
      {/* Base (yellow) layer */}
      <div
        className="cursor-sunflower"
        style={{
          backgroundImage: sunflowerBg,
          width: 72,
          height: 72,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.18))",
        }}
      />
      {/* Hover (yellow vivid) layer that crossfades on boost */}
      <div
        className="cursor-sunflower cursor-sunflower--hover"
        style={{
          backgroundImage: sunflowerBgHover,
          width: 72,
          height: 72,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.18))",
        }}
      />
      <SparkleEmitter />
    </div>
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

  const modeCounts = useQuery(api.analytics.getOpenModeCounts, {}); // realtime counts

  // Replace native cursor image with provided sunflower for consistency
  const sunflowerCursor = useMemo(() => {
    const url = "https://harmless-tapir-303.convex.cloud/api/storage/e2bd4901-a77f-4767-8132-491818b20b90";
    return `url("${url}") 16 16, auto`;
  }, []);

  const sunflowerCursorHover = useMemo(() => {
    const url = "https://harmless-tapir-303.convex.cloud/api/storage/e2bd4901-a77f-4767-8132-491818b20b90";
    return `url("${url}") 22 22, auto`;
  }, []);

  // Sunflower cursor (Landing page only)
  const sunflowerCursorSVG = useMemo(() => {
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 100 100'>
        <defs>
          <linearGradient id='p' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stop-color='#FFE07B' stop-opacity='1'/>
            <stop offset='100%' stop-color='#FFC94A' stop-opacity='1'/>
          </linearGradient>
          <radialGradient id='c'>
            <stop offset='0%' stop-color='#7A4A2B' stop-opacity='1'/>
            <stop offset='100%' stop-color='#5A3A23' stop-opacity='1'/>
          </radialGradient>
        </defs>
        <ellipse cx='50' cy='58' rx='28' ry='28' fill='black' opacity='0'/>
        <g opacity='1'>
          ${Array.from({length: 18}).map((_,i)=>{
            const angle = (i*360)/18;
            return `<ellipse cx='50' cy='22' rx='9' ry='22' fill='url(#p)' stroke='rgba(0,0,0,0.22)' stroke-width='0.6' transform='rotate(${angle} 50 50)'/>`
          }).join('')}
          <circle cx='50' cy='50' r='22' fill='url(#c)' stroke='rgba(0,0,0,0.25)' stroke-width='0.6'/>
          <circle cx='50' cy='50' r='15' fill='#50331E'/>
        </g>
      </svg>
    `;
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") 16 16, auto`;
  }, []);

  // Larger, hover sunflower cursor with #FFC067 petals and subtle transparency
  const sunflowerCursorHoverSVG = useMemo(() => {
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 100 100'>
        <defs>
          <linearGradient id='p2' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stop-color='#FFC067' stop-opacity='0.88'/>
            <stop offset='100%' stop-color='#FFC067' stop-opacity='0.88'/>
          </linearGradient>
          <radialGradient id='c2'>
            <stop offset='0%' stop-color='#5B311B' stop-opacity='0.9'/>
            <stop offset='100%' stop-color='#3E2414' stop-opacity='0.9'/>
          </radialGradient>
        </defs>
        <ellipse cx='50' cy='60' rx='30' ry='30' fill='black' opacity='0'/>
        <g opacity='0.86'>
          ${Array.from({length: 18}).map((_,i)=>{
            const angle = (i*360)/18;
            return `<ellipse cx='50' cy='22' rx='10' ry='23' fill='url(#p2)' stroke='rgba(0,0,0,0.24)' stroke-width='0.65' transform='rotate(${angle} 50 50)'/>`
          }).join('')}
          <circle cx='50' cy='50' r='23' fill='url(#c2)' stroke='rgba(0,0,0,0.26)' stroke-width='0.65'/>
          <circle cx='50' cy='50' r='16' fill='#3E2414' fill-opacity='0.92'/>
        </g>
      </svg>
    `;
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") 22 22, auto`;
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      // Replace image cursor with hidden native cursor so follower is the only cursor
      style={{ cursor: "none" }}
    >
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
      <SmallLeavesField />
      <GlitterField />
      <LeavesField densityScale={densityScale} />
      <GlitterField />
      <GlitterField count={50} />
      <GlitterField count={100} />

      {/* Skip link for keyboard users */}
      <a
        href="#modes-grid"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 bg-white text-slate-900 px-3 py-2 rounded"
      >
        Skip to modes
      </a>

      {/* Content container */}
      <div className="relative z-20 flex flex-col items-center justify-start min-h-screen px-4 pt-6 md:pt-10">
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
          <motion.button
            onClick={() => setReduced((v) => !v)}
            className="text-xs rounded-full px-3 py-1 border bg-white/70 backdrop-blur hover:bg-white/90 transition"
            aria-pressed={reduced}
            aria-label={reduced ? "Background visuals: Reduced" : "Background visuals: Full"}
            title="Toggle background visuals"
            style={{ cursor: sunflowerCursor }}
            whileHover={{ cursor: sunflowerCursorHover }}
          >
            {reduced ? "Background: Reduced" : "Background: Full"}
          </motion.button>
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
            // @ts-ignore - CSS var used inline
            "--dx": 0,
            "--dy": 0,
          } as React.CSSProperties}
        >
          {modes.map((mode, index) => (
            <motion.button
              key={mode.id}
              type="button"
              data-cursor-boost="true"
              title={`Open ${mode.title} mode`}
              aria-label={`Open ${mode.title} mode — ${mode.description}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.08 * index }}
              // Replace tilt hover with lift + glow (no rotate)
              whileHover={{ y: -6, scale: 1.03, cursor: sunflowerCursorHoverSVG }}
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
                cursor: sunflowerCursor,
              }}
            >
              <Card
                // Add subtle hover glow via group-hover
                className="relative overflow-hidden border-[1.5px] transition-all duration-300 h-full shadow-sm group-hover:shadow-xl group-hover:border-primary/30"
                style={{
                  backgroundColor: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(8px)",
                  borderColor: "rgba(0,0,0,0.06)",
                }}
              >
                <CardHeader className="text-center pb-3">
                  <div
                    className="relative w-16 h-16 mx-auto mb-4 rounded-full grid place-items-center transition-transform duration-300 shine-once"
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

        {/* Live analytics: mode opens */}
        <div className="mt-4 md:mt-5 max-w-4xl w-full px-0">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700/70">
            <span className="opacity-80">Live mode opens:</span>
            {modes.map((m) => (
              <span
                key={`count-${m.id}`}
                className="rounded-full border px-2 py-1 bg-white/70 backdrop-blur-sm"
                title={`${m.title} opens`}
                aria-label={`${m.title} opens ${modeCounts?.[m.id] ?? 0}`}
              >
                {m.title}: <strong className="ml-1">{modeCounts?.[m.id] ?? 0}</strong>
              </span>
            ))}
          </div>
        </div>

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

      {/* Global follower cursor for this page */}
      <SunflowerCursor />
    </div>
  );
}