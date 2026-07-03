const BLUE = {
  headerFrom: "#0D47A1",
  headerTo: "#0D47A1",
  accent: "#A3D0FF",
};

export function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
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
      <div className="mt-2 h-[4px] w-20 rounded-full" style={{ background: BLUE.accent }} />
    </div>
  );
}
