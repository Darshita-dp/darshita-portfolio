import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface Mode {
  id: string;
  title: string;
}

interface AnalyticsDisplayProps {
  modes: Mode[];
}

export function AnalyticsDisplay({ modes }: AnalyticsDisplayProps) {
  const modeCounts = useQuery(api.analytics.getOpenModeCounts, {});

  return (
    <>
      {/* Desktop: Full analytics display */}
      <div className="mt-4 md:mt-5 max-w-4xl w-full px-0 hidden sm:block">
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

      {/* Mobile: Compact analytics display */}
      <div className="mt-3 md:hidden max-w-4xl w-full px-0">
        <div className="flex flex-wrap items-center gap-1 text-xs text-slate-700/70 justify-center">
          <span className="opacity-80">Opens:</span>
          {modes.map((m) => (
            <span
              key={`count-mobile-${m.id}`}
              className="rounded-full border px-1.5 py-0.5 bg-white/70 backdrop-blur-sm text-xs"
              title={`${m.title} opens`}
              aria-label={`${m.title} opens ${modeCounts?.[m.id] ?? 0}`}
            >
              {m.title.charAt(0)}: <strong>{modeCounts?.[m.id] ?? 0}</strong>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
