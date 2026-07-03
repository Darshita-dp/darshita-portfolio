import { useEffect, useRef, useMemo } from "react";

function SparkleEmitter() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = ref.current?.parentElement as HTMLElement | null;
    const container = ref.current;
    if (!container || !root) return;

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

    let rate = 0;
    const updateRate = () => {
      const boosted = root.getAttribute("data-boost") === "1";
      rate = boosted ? (prefersReduced ? 8 : 18) : (prefersReduced ? 3 : 6);
    };
    const mo = new MutationObserver(updateRate);
    mo.observe(root, { attributes: true, attributeFilter: ["data-boost"] });
    updateRate();

    let last = performance.now();
    let acc = 1.2;
    let raf = 0;

    function loop(now: number) {
      const dt = (now - last) / 1000;
      last = now;

      acc += dt * rate;
      while (acc > 1) {
        const p = pool.find((pp) => !pp.alive);
        if (!p) break;
        acc -= 1;

        p.alive = true;
        p.life = 0;
        p.x = 0;
        p.y = 0;
        p.vx = (Math.random() - 0.5) * 28;
        p.vy = 70 + Math.random() * 70;
        p.scale = 0.8 + Math.random() * 0.4;

        const url = sparkleUrls[Math.random() < 0.5 ? 0 : 1];
        p.el.src = url;
        const baseSize = 10 + Math.random() * 6;
        p.el.style.width = `${baseSize}px`;
        p.el.style.height = `${baseSize}px`;

        p.el.style.opacity = "1";
        p.el.style.transform = `translate3d(0, 0, 0) scale(${p.scale}) rotate(0deg)`;
      }

      for (const p of pool) {
        if (!p.alive) continue;
        p.life += dt;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const fade = Math.max(0, 1 - p.life / 0.85);
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

  return (
    <div
      ref={ref}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      aria-hidden="true"
      style={{ zIndex: 2 }}
    />
  );
}

export function SunflowerCursor() {
  const ref = useRef<HTMLDivElement | null>(null);
  const state = useRef<{ x: number; y: number; boost: boolean }>({ x: -100, y: -100, boost: false });

  const sunflowerStickerUrl = "https://harmless-tapir-303.convex.cloud/api/storage/e2bd4901-a77f-4767-8132-491818b20b90";
  const sunflowerBg = useMemo(() => `url("${sunflowerStickerUrl}")`, []);
  const sunflowerBgHover = useMemo(() => `url("${sunflowerStickerUrl}")`, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const initX = window.innerWidth / 2;
    const initY = window.innerHeight / 2;
    state.current.x = initX;
    state.current.y = initY;
    
    el.style.transform = `translate3d(${initX}px, ${initY}px, 0)`;

    const onMove = (e: PointerEvent) => {
      state.current.x = e.clientX;
      state.current.y = e.clientY;
    };

    const interactiveSel =
      "button, a, input, select, textarea, label, summary, details, [role='button'], [role='link'], [tabindex]:not([tabindex='-1']), [contenteditable='true']";
    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const isInteractive = !!t?.closest(interactiveSel);
      const explicitBoost = !!t?.closest("[data-cursor-boost='true']");
      state.current.boost = isInteractive || explicitBoost;
    };

    const onLeave = () => {
      state.current.boost = false;
    };

    const onFocusIn = () => {
      const active = document.activeElement as HTMLElement | null;
      const isInteractive = !!active?.closest(interactiveSel);
      const explicitBoost = !!active?.closest("[data-cursor-boost='true']");
      state.current.boost = isInteractive || explicitBoost;
    };
    const onFocusOut = () => {
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

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let prevX = state.current.x;
    let prevY = state.current.y;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const ease = 0.18;

    function loop(now: number) {
      const node = ref.current;
      if (!node) return;

      prevX = lerp(prevX, state.current.x, ease);
      prevY = lerp(prevY, state.current.y, ease);

      node.style.transform = `translate3d(${prevX}px, ${prevY}px, 0)`;
      node.setAttribute("data-boost", state.current.boost ? "1" : "0");

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
      style={{ position: "fixed", top: 0, left: 0, zIndex: 9999, pointerEvents: "none", overflow: "visible" }}
    >
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
