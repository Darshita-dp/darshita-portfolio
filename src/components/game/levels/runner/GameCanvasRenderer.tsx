import { RUNNER_CONFIG, GAME_COLORS } from "./gameConfig";
import { BYTE_BUBBLES_THEME } from "@/lib/byteBubblesData";

export interface GameState {
  player: {
    x: number;
    y: number;
    vy: number;
    jumping: boolean;
    onGround: boolean;
  };
  stars: Array<{
    x: number;
    y: number;
    collected: boolean;
    id: number;
  }>;
  platforms: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  scrollOffset: number;
  collectedStars: Set<number>;
  processedStars: Set<number>;
  missedStars: number;
  groundY: number;
}

export class GameCanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private images: {
    player: HTMLImageElement;
    bg: HTMLImageElement;
    jellyfish: HTMLImageElement;
  };

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.images = {
      player: new Image(),
      bg: new Image(),
      jellyfish: new Image(),
    };
    this.loadImages();
  }

  private loadImages() {
    this.images.player.src =
      "https://harmless-tapir-303.convex.cloud/api/storage/8926a390-96f1-48da-9484-80297ff081ae";
    this.images.bg.src =
      "https://harmless-tapir-303.convex.cloud/api/storage/e465bbfd-c5cb-4dcc-a361-a05673746d5c";
    this.images.jellyfish.src =
      "https://harmless-tapir-303.convex.cloud/api/storage/4969c52c-a6ca-45c0-adf2-c79d6a95fbe9";
  }

  render(state: GameState, isMobile: boolean) {
    const rect = this.canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw background
    this.drawBackground(rect);

    // Draw platforms
    this.drawPlatforms(state, rect);

    // Draw jellyfish
    this.drawJellyfish(state, rect, isMobile);

    // Draw player
    this.drawPlayer(state);
  }

  private drawBackground(rect: DOMRect) {
    if (this.images.bg.complete) {
      this.ctx.drawImage(this.images.bg, 0, 0, rect.width, rect.height);
    } else {
      const gradient = this.ctx.createLinearGradient(0, 0, 0, rect.height);
      gradient.addColorStop(0, BYTE_BUBBLES_THEME.bgStart);
      gradient.addColorStop(0.5, BYTE_BUBBLES_THEME.bgMid);
      gradient.addColorStop(1, BYTE_BUBBLES_THEME.bgEnd);
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, rect.width, rect.height);
    }
  }

  private drawPlatforms(state: GameState, rect: DOMRect) {
    this.ctx.fillStyle = GAME_COLORS.platformFill;
    state.platforms.forEach((platform) => {
      const x = platform.x - state.scrollOffset;
      if (x > -platform.width && x < rect.width) {
        this.roundRect(x, platform.y, platform.width, platform.height, 8);
      }
    });
  }

  private drawJellyfish(state: GameState, rect: DOMRect, isMobile: boolean) {
    const time = Date.now() / 1000;
    const config = isMobile ? RUNNER_CONFIG.mobile : RUNNER_CONFIG;

    state.stars.forEach((star) => {
      if (state.processedStars.has(star.id)) return;

      const x = star.x - state.scrollOffset;

      if (x > -50 && x < rect.width) {
        this.ctx.save();

        const bobOffset = Math.sin(time * RUNNER_CONFIG.starBobSpeed + star.id * 0.5) * RUNNER_CONFIG.starBobAmount;
        const rotationAngle = Math.sin(time * 1.5 + star.id) * 0.1;

        this.ctx.translate(x, star.y + bobOffset);
        this.ctx.rotate(rotationAngle);

        const glowIntensity = 0.6 + Math.sin(time * 3 + star.id) * 0.4;
        const glowSize = 25 + glowIntensity * 20;

        this.ctx.shadowColor = GAME_COLORS.jellyfishGlow;
        this.ctx.shadowBlur = glowSize;

        this.ctx.fillStyle = GAME_COLORS.jellyfishGlowOuter;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 35, 0, Math.PI * 2);
        this.ctx.fill();

        if (this.images.jellyfish.complete) {
          const jellyfishSize = 50 + Math.sin(time * 2.5 + star.id) * 3;
          this.ctx.drawImage(
            this.images.jellyfish,
            -jellyfishSize / 2,
            -jellyfishSize / 2,
            jellyfishSize,
            jellyfishSize
          );
        } else {
          this.ctx.fillStyle = `rgba(255, 105, 180, 0.8)`;
          this.ctx.beginPath();
          this.ctx.arc(0, 0, 25, 0, Math.PI * 2);
          this.ctx.fill();
        }

        this.ctx.restore();
      }
    });
  }

  private drawPlayer(state: GameState) {
    this.ctx.save();
    this.ctx.translate(state.player.x, state.player.y);

    if (this.images.player.complete) {
      this.ctx.drawImage(
        this.images.player,
        -RUNNER_CONFIG.playerWidth / 2,
        -RUNNER_CONFIG.playerHeight / 2,
        RUNNER_CONFIG.playerWidth,
        RUNNER_CONFIG.playerHeight
      );
    } else {
      this.ctx.fillStyle = GAME_COLORS.playerFallback;
      this.ctx.fillRect(
        -RUNNER_CONFIG.playerWidth / 2,
        -RUNNER_CONFIG.playerHeight / 2,
        RUNNER_CONFIG.playerWidth,
        RUNNER_CONFIG.playerHeight
      );
    }

    this.ctx.restore();
  }

  private roundRect(x: number, y: number, width: number, height: number, radius: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
    this.ctx.fill();
  }
}
