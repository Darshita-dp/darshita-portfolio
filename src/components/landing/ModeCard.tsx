import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ModeCardProps {
  id: string;
  title: string;
  description: string;
  symbol: string;
  color: string;
  index: number;
  onSelect: () => void;
  sunflowerCursor: string;
  sunflowerCursorHover: string;
}

export function ModeCard({
  id,
  title,
  description,
  symbol,
  color,
  index,
  onSelect,
  sunflowerCursor,
  sunflowerCursorHover,
}: ModeCardProps) {
  return (
    <motion.button
      key={id}
      type="button"
      data-cursor-boost="true"
      title={`Open ${title} mode`}
      aria-label={`Open ${title} mode — ${description}`}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, delay: 0.08 * index }}
      whileHover={{ y: -6, scale: 1.03, cursor: sunflowerCursorHover }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="group cursor-pointer w-full text-left rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{
        outlineColor: "#BAE1FF",
        transform: "translate3d(calc(var(--dx) * 6px), calc(var(--dy) * 6px), 0)",
        transition: "transform 120ms ease",
        cursor: sunflowerCursor,
      }}
    >
      <Card
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
              background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0) 42%), ${color}`,
              boxShadow: "inset 0 -4px 0 rgba(0,0,0,0.08), 0 10px 18px rgba(0,0,0,0.10)",
              border: "1px solid rgba(0,0,0,0.06)",
              animation: "icon-bounce 2s infinite",
              ["--shine-delay" as any]: `${120 + ((index * 90) % 260)}ms`,
            }}
          >
            {symbol.startsWith("http") ? (
              <img
                src={symbol}
                alt={title}
                className="w-10 h-10 object-contain"
                style={{
                  filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.18)) drop-shadow(0 6px 12px rgba(0,0,0,0.14))",
                }}
              />
            ) : (
              <span
                className="text-3xl"
                style={{
                  filter:
                    id === "story"
                      ? "brightness(0.78) contrast(1.2) saturate(1.2)"
                      : "brightness(0.88) contrast(1.1) saturate(1.15)",
                  textShadow: "0 1px 0 rgba(0,0,0,0.18), 0 6px 12px rgba(0,0,0,0.14)",
                }}
              >
                {symbol}
              </span>
            )}
          </div>
          <CardTitle className="text-2xl text-slate-900 tracking-tight">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <CardDescription className="text-slate-700/80 text-base">{description}</CardDescription>
        </CardContent>
      </Card>
    </motion.button>
  );
}
