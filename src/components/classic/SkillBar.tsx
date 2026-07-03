import { useRef } from "react";
import { useInView, motion } from "framer-motion";

const BLUE = {
  headerFrom: "#0D47A1",
  headerTo: "#0D47A1",
};

export function SkillBar({ label, value, delay = 0 }: { label: string; value: number; delay?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const shades = ["#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#1E88E5", "#1976D2"];
  const shade = shades[Math.min(Math.floor((value / 100) * shades.length), shades.length - 1)];

  return (
    <div ref={ref} className="space-y-1">
      <div className="flex items-center justify-between text-xs md:text-sm">
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
