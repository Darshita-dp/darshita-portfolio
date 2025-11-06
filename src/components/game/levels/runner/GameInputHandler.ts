export class GameInputHandler {
  private jumpCallback: () => void;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement, jumpCallback: () => void) {
    this.canvas = canvas;
    this.jumpCallback = jumpCallback;
    this.setupListeners();
  }

  private setupListeners() {
    this.canvas.addEventListener("click", () => this.jumpCallback());
    this.canvas.addEventListener("touchstart", () => this.jumpCallback(), { passive: true });
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        this.jumpCallback();
      }
    });
  }

  cleanup() {
    this.canvas.removeEventListener("click", () => this.jumpCallback());
    this.canvas.removeEventListener("touchstart", () => this.jumpCallback());
    window.removeEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        this.jumpCallback();
      }
    });
  }
}
