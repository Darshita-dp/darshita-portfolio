import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

interface GameCanvasProps {
  onRender: (ctx: CanvasRenderingContext2D, rect: DOMRect, deltaTime: number) => void;
  isPaused: boolean;
}

export interface GameCanvasHandle {
  getCanvas: () => HTMLCanvasElement | null;
  getContext: () => CanvasRenderingContext2D | null;
}

export const GameCanvas = forwardRef<GameCanvasHandle, GameCanvasProps>(
  ({ onRender, isPaused }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
      getContext: () => ctxRef.current,
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctxRef.current = ctx;

      const resizeCanvas = () => {
        const container = canvas.parentElement;
        if (!container) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        ctx.scale(dpr, dpr);
      };

      resizeCanvas();
      setTimeout(resizeCanvas, 50);
      setTimeout(resizeCanvas, 150);

      window.addEventListener("resize", resizeCanvas);

      let animationId: number;
      let lastTime = Date.now();

      const gameLoop = () => {
        if (isPaused) {
          animationId = requestAnimationFrame(gameLoop);
          return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const now = Date.now();
        const deltaTime = (now - lastTime) / 16.67;
        lastTime = now;

        ctx.clearRect(0, 0, rect.width, rect.height);
        onRender(ctx, rect, deltaTime);

        animationId = requestAnimationFrame(gameLoop);
      };

      animationId = requestAnimationFrame(gameLoop);

      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize", resizeCanvas);
      };
    }, [isPaused, onRender]);

    return (
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          display: "block",
          transform: "translateZ(0)",
          imageRendering: "auto",
          width: "100%",
          height: "100%",
        }}
      />
    );
  }
);

GameCanvas.displayName = "GameCanvas";
