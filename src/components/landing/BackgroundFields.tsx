import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

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
    const baseCount = prefersReducedMotion ? 4 : clamp(Math.round(vw / 90), 12, 22);
    const count = Math.max(1, Math.floor(baseCount * densityScale)) + 5;

    const newParams = () => ({
      x: -140 - Math.random() * 100,
      baseY: Math.random() * vh,
      speed: 20 + Math.random() * 40,
      amp: 10 + Math.random() * 35,
      freq: 0.6 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2,
      scale: 0.9 + Math.random() * 0.5,
      opacity: 0.25 + Math.random() * 0.35,
      rotPhase: Math.random() * Math.PI * 2,
      rotAmp: 3 + Math.random() * 3,
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
      wrap.innerHTML = "";
      el.appendChild(wrap);

      container.appendChild(el);

      const p = newParams();
      const band = vh / count;
      p.baseY = Math.max(0, Math.min(vh, band * i + (band * 0.2 + Math.random() * band * 0.6)));

      spritesRef.current.push({ el, ...p });
    }

    spritesRef.current.forEach((s) => {
      const size = 110;
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
      const dt = (ts - last) / 1000;
      lastTsRef.current = ts;

      const vwNow = window.innerWidth;
      const vhNow = window.innerHeight;

      for (const s of spritesRef.current) {
        s.x += s.speed * dt;
        const y = s.baseY + s.amp * Math.sin(s.freq * ts / 1000 + s.phase);
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

    const onResize = () => {
      if (resizeRafRef.current) return;
      resizeRafRef.current = requestAnimationFrame(() => {
        resizeRafRef.current = null;
        const vwN = window.innerWidth;
        const vhN = window.innerHeight;
        spritesRef.current.forEach((s) => {
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

    const newParams = () => ({
      x: -140 - Math.random() * 120,
      baseY: Math.random() * vh,
      speed: 15 + Math.random() * 30,
      amp: 8 + Math.random() * 26,
      freq: 0.5 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
      scale: 0.6 + Math.random() * 0.6,
      opacity: 0.35 + Math.random() * 0.35,
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
      el.style.filter = "drop-shadow(0 2px 2px rgba(0,0,0,0.12))";

      const wrap = document.createElement("div");
      wrap.innerHTML = "";
      el.appendChild(wrap);

      container.appendChild(el);

      const p = newParams();
      const band = vh / count;
      p.baseY = Math.max(0, Math.min(vh, band * i + (band * 0.2 + Math.random() * band * 0.6)));

      spritesRef.current.push({ el, ...p });
    }

    spritesRef.current.forEach((s) => {
      const size = 60;
      const img = document.createElement("img");
      img.src = "https://harmless-tapir-303.convex.cloud/api/storage/0bfa77c9-0eb4-46a1-b180-47d0ce1c295f";
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
      spritesRef.current.forEach((s) => {
        s.x = Math.random() * vw - 60;
        const y = Math.random() * vh;
        s.el.style.transform = `translate(${s.x}px, ${y}px) scale(${s.scale})`;
      });
    }

    container.style.zIndex = "0";

    const onResize = () => {
      if (resizeRafRef.current) return;
      resizeRafRef.current = requestAnimationFrame(() => {
        resizeRafRef.current = null;
        const vhN = window.innerHeight;
        const vwN = window.innerWidth;
        spritesRef.current.forEach((s) => {
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

function SmallLeavesField() {
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

    const count = 10;

    const newParams = () => ({
      x: -140 - Math.random() * 120,
      baseY: Math.random() * vh,
      speed: 18 + Math.random() * 22,
      amp: 6 + Math.random() * 16,
      freq: 0.6 + Math.random() * 1.0,
      phase: Math.random() * Math.PI * 2,
      scale: 0.5 + Math.random() * 0.3,
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
      const band = vh / count;
      p.baseY = Math.max(0, Math.min(vh, band * i + (band * 0.2 + Math.random() * band * 0.6)));

      spritesRef.current.push({ el, ...p });
    }

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
    twinkleFreq: number;
    twinklePhase: number;
    size: number;
  }>>([]);
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

    const newParams = () => {
      const size = 10 + Math.random() * 12;
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
        twinkleFreq: 2 + Math.random() * 3,
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
        const twinkle = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(s.twinkleFreq * (ts / 1000) * Math.PI * 2 + s.twinklePhase));
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
      spritesRef.current.forEach((s) => {
        s.x = Math.random() * vw - 60;
        const y = Math.random() * vh;
        s.el.style.transform = `translate(${s.x}px, ${y}px) scale(${s.scale})`;
        s.el.style.opacity = String(s.opacity);
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

export { FlowerField, LeavesField, SmallLeavesField, GlitterField };
