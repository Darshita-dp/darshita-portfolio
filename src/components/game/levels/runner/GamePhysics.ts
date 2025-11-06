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
      if (
        state.player.x + RUNNER_CONFIG.playerWidth > platform.x &&
        state.player.x < platform.x + platform.width &&
        state.player.y + RUNNER_CONFIG.playerHeight >= platform.y &&
        state.player.y + RUNNER_CONFIG.playerHeight <= platform.y + platform.height + 10 &&
        state.player.vy >= 0
      ) {
        state.player.y = platform.y - RUNNER_CONFIG.playerHeight;
        state.player.vy = 0;
        state.player.jumping = false;
        state.player.onGround = true;
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
