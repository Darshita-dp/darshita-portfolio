import { ReactNode } from "react";

interface BookProps {
  children: ReactNode;
  className?: string;
}

export function Book({ children, className = "" }: BookProps) {
  return (
    <div className={`book-container ${className}`} style={{ perspective: "2000px" }}>
      {children}
    </div>
  );
}
