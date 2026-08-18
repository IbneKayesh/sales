/**
 * SnowLayer.jsx - Snow particle simulation and rendering manager.
 * Handles snowflake spawning, drifting, rotation, fading, and crystal rendering.
 */
import {
  createSnowflake,
  drawRealisticFlake,
} from "./Snowflake";

export class SnowSimulation {
  constructor() {
    this.flakes = [];
    this.spawnAccumulator = 0;
  }

  reset() {
    this.flakes = [];
    this.spawnAccumulator = 0;
  }

  /**
   * Target count for snowflakes based on area, density, and snow ratio.
   */
  getTargetFlakeCount(width, height, density, snowRatio) {
    const totalParticles = Math.min(240, Math.round(((width * height) / 22000) * density));
    return Math.round(totalParticles * snowRatio);
  }

  /**
   * Update snow particle motion, rotation, sway, and fading.
   */
  update({ width, height, dt, now, density, size, speed, snowRatio }) {
    if (snowRatio <= 0) {
      this.flakes = [];
      return;
    }

    // 1. Spawning
    this.spawnAccumulator += dt;
    const target = this.getTargetFlakeCount(width, height, density, snowRatio);
    if (this.flakes.length < target && this.spawnAccumulator > 0.07) {
      this.flakes.push(createSnowflake(width, size, speed));
      this.spawnAccumulator = 0;
    }

    // 2. Lifecycle & Motion
    for (let i = this.flakes.length - 1; i >= 0; i--) {
      const f = this.flakes[i];

      // Lateral sway + slow downward drift
      f.x += f.vx + Math.sin(now * 0.0005 * f.wobbleSpeed + f.wobble) * 0.22 * speed;
      f.y += f.vy * speed;
      f.angle += f.rotSpeed * dt;

      // Gentle fade in on entrance
      if (f.fadeIn) {
        f.alpha = Math.min(f.alpha + dt * 1.5, f.maxAlpha);
        if (f.alpha >= f.maxAlpha) {
          f.fadeIn = false;
        }
      }

      // Smooth fade out near screen bottom
      const fadeThreshold = height * 0.85;
      if (f.y > fadeThreshold) {
        f.alpha = Math.max(0, f.maxAlpha * (1 - (f.y - fadeThreshold) / (height * 0.16)));
      }

      // Remove out-of-bounds flakes
      if (f.y - f.r > height + 20) {
        this.flakes.splice(i, 1);
      }
    }
  }

  /**
   * Render all snowflakes.
   */
  render(ctx, colors, opacity) {
    for (let i = 0; i < this.flakes.length; i++) {
      drawRealisticFlake(ctx, this.flakes[i], colors, opacity);
    }
  }
}
