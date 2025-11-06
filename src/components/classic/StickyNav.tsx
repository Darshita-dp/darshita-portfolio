import { useNavigate } from "react-router";

const BLUE = {
  headerTo: "#0D47A1",
};

export function StickyNav() {
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
    <header className="fixed top-0 left-0 right-0 z-40 border-b bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <button
          className="text-sm font-semibold hidden md:block"
          onClick={() => navigate("/")}
          style={{ color: BLUE.headerTo }}
        >
          ← Modes
        </button>
        <nav className="flex gap-1 md:gap-4 flex-wrap justify-center md:justify-end flex-1 md:flex-none">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => go(it.id)}
              className="px-2 md:px-3 py-1.5 rounded-full text-xs md:text-sm border transition focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                borderColor: "rgba(13, 71, 161, 0.18)",
                color: "#0D47A1",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0D47A1";
                (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#0D47A1";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "#0D47A1";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(13, 71, 161, 0.18)";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0D47A1";
                (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#0D47A1";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "#0D47A1";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(13, 71, 161, 0.18)";
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
