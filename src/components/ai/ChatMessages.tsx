import { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "ai"; text: string; ts: number };

interface ChatMessagesProps {
  messages: Msg[];
  isTyping: boolean;
}

export function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fmtTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="bg-[#EFE7DD]/60 dark:bg-slate-950/60 flex-1 overflow-y-auto p-3 min-h-[170px] max-h-[calc(100vh-280px)]">
      {messages.map((m, idx) => (
        <div key={idx} className={`flex mb-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
          {m.role === "ai" && (
            <div className="mr-2 flex-shrink-0">
              <img
                src="https://harmless-tapir-303.convex.cloud/api/storage/fbbcab3e-d3b1-4639-99b4-311c5e1ab7ca"
                alt=""
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
              />
            </div>
          )}
          <div
            className={`max-w-[78%] rounded-lg px-3 py-2 text-sm relative shadow-sm ${
              m.role === "user"
                ? "bg-[#DCF8C6] rounded-tr-sm"
                : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border rounded-tl-sm"
            }`}
          >
            <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-p:leading-relaxed prose-strong:font-semibold prose-strong:text-slate-900 dark:prose-strong:text-slate-100 prose-ul:my-2 prose-li:my-1">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                }}
              >
                {m.text}
              </ReactMarkdown>
            </div>
            <div className="text-[10px] opacity-60 mt-1 text-right flex items-center justify-end gap-1">
              <span>{fmtTime(m.ts)}</span>
              {m.role === "user" ? <span className="text-blue-500">✓✓</span> : null}
            </div>
          </div>
        </div>
      ))}

      {/* Typing indicator */}
      {isTyping && (
        <div className="flex items-end gap-2 mt-2" aria-live="polite">
          <img
            src="https://harmless-tapir-303.convex.cloud/api/storage/fbbcab3e-d3b1-4639-99b4-311c5e1ab7ca"
            alt=""
            className="h-8 w-8 rounded-full object-cover ring-2 ring-white flex-shrink-0"
          />
          <div className="bg-white px-3 py-2 rounded-2xl shadow-sm border rounded-tl-sm">
            <span className="inline-flex gap-1 text-[#606770]">
              <span className="animate-bounce" style={{ animationDelay: "-0.2s" }}>
                •
              </span>
              <span className="animate-bounce" style={{ animationDelay: "-0.1s" }}>
                •
              </span>
              <span className="animate-bounce">•</span>
            </span>
          </div>
        </div>
      )}

      {/* Invisible div for auto-scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
}
