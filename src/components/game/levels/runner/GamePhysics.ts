import { RUNNER_CONFIG } from "./gameConfig";

export interface PhysicsState {
  player: {
    x: number;
    y: number;
    vy: number;
    jumping: boolean;
    onGround: boolean;
  };
  platforms: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  scrollOffset: number;
  groundY: number;
}

export class GamePhysics {
  static updatePlayer(state: PhysicsState) {
    state.player.vy += RUNNER_CONFIG.gravity;
    state.player.y += state.player.vy;

    state.player.onGround = false;

    for (const platform of state.platforms) {
      const playerBottom = state.player.y + RUNNER_CONFIG.playerHeight;
      const playerTop = state.player.y;
      const platformTop = platform.y;
      const platformBottom = platform.y + platform.height;

      // Check if player is horizontally aligned with platform
      const isHorizontallyAligned =
        state.player.x + RUNNER_CONFIG.playerWidth > platform.x &&
        state.player.x < platform.x + platform.width;

      if (!isHorizontallyAligned) continue;

      // Landing on platform from above (falling down)
      if (state.player.vy >= 0 && playerBottom >= platformTop && playerBottom <= platformTop + 20) {
        state.player.y = platformTop - RUNNER_CONFIG.playerHeight;
        state.player.vy = 0;
        state.player.jumping = false;
        state.player.onGround = true;
        break;
      }

      // Hitting platform from below (jumping up)
      if (state.player.vy < 0 && playerTop <= platformBottom && playerTop >= platformBottom - 20) {
        state.player.y = platformBottom;
        state.player.vy = 0;
        break;
      }
    }

    if (state.player.y < 30) {
      state.player.y = 30;
      state.player.vy = 0;
    }
  }

  static jump(state: PhysicsState) {
    if (state.player.onGround) {
      state.player.jumping = true;
      state.player.vy = RUNNER_CONFIG.jumpPower;
      state.player.onGround = false;
    }
  }

  static updateScroll(state: PhysicsState, isMobile: boolean) {
    const scrollSpeed = isMobile ? RUNNER_CONFIG.mobile.autoScrollSpeed : RUNNER_CONFIG.autoScrollSpeed;
    state.scrollOffset += scrollSpeed;
  }
}
