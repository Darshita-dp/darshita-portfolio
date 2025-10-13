import { ReactNode } from "react";

interface PageFaceProps {
  children: ReactNode;
  side: "front" | "back";
  className?: string;
}

export function PageFace({ children, side, className = "" }: PageFaceProps) {
  return (
    <div className={`page-face page-face-${side} ${className}`}>
      {children}
    </div>
  );
}
