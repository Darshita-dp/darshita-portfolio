import { ReactNode } from "react";
import { PageFace } from "./PageFace";

interface PaperProps {
  front: ReactNode;
  back?: ReactNode;
  className?: string;
}

export function Paper({ front, back, className = "" }: PaperProps) {
  return (
    <div className={`book-page ${className}`} style={{ transformStyle: "preserve-3d" }}>
      <PageFace side="front">{front}</PageFace>
      {back && <PageFace side="back">{back}</PageFace>}
    </div>
  );
}
