import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/use-mobile";

interface ChatInputProps {
  input: string;
  isTyping: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

export function ChatInput({ input, isTyping, onInputChange, onSend }: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const placeholder = isMobile ? "Type your question..." : "Type your question before my code daydreams again...";

  return (
    <div className="bg-[#F0F0F0] dark:bg-slate-900 p-2 flex items-center gap-2 border-t flex-shrink-0 sticky bottom-0">
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        disabled={isTyping}
        className="bg-white dark:bg-slate-800 flex-1"
      />
      <button
        type="button"
        onClick={onSend}
        disabled={isTyping}
        aria-label="Send message"
        className="h-12 w-12 shrink-0 grid place-items-center rounded-full bg-[#128C7E] text-white hover:bg-[#90EE90] active:scale-95 transition shadow focus:outline-none focus:ring-2 focus:ring-[rgba(18,140,126,.35)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          className="-rotate-6 h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 2L11 13"></path>
          <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
        </svg>
      </button>
    </div>
  );
}
