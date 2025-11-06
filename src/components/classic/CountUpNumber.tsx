import { useRef, useEffect } from "react";
import { useInView } from "framer-motion";

export function CountUpNumber({
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
