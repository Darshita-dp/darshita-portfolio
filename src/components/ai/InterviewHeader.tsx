import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function InterviewHeader() {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 bg-[#0B6A5B] border-b">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between text-white">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 hover:bg-[#90EE90] hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Modes
        </Button>
        <div className="text-sm opacity-70">AI Chat</div>
      </div>
    </header>
  );
}
