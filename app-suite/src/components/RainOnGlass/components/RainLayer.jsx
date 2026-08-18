/**
 * RainLayer.jsx - Rain physics simulation and rendering manager.
 * Handles drop creation, friction, mass growth, gravity acceleration,
 * collision/merging dynamics, trails, and rendering.
 */
import {
  createDrop,
  drawDropTrail,
  drawRealisticDrop,
} from "./RainDrop";

export class RainSimulation {
  constructor() {
    this.drops = [];
    this.spawnAccumulator = 0;
  }

  reset() {
    this.drops = [];
    this.spawnAccumulator = 0;
  }

  /**
   * Calculate target active drop count based on canvas area and density.
   */
  getTargetDropCount(width, height, density) {
    return Math.min(320, Math.max(20, Math.round(((width * height) / 22000) * density)));
  }

  /**
   * Update all droplet physics, growth, gravity, mergers, and lifetime.
   */
  update({ width, height, dt, now, density, size, speed }) {
    // 1. Spawning
    this.spawnAccumulator += dt;
    const target = this.getTargetDropCount(width, height, density);
    if (this.drops.length < target && this.spawnAccumulator > 0.045) {
      this.drops.push(createDrop(width, size));
      this.spawnAccumulator = 0;
    }

    // 2. Physics & Lifecycle
    for (let i = this.drops.length - 1; i >= 0; i--) {
      const d = this.drops[i];

      // Handle pause timers (surface tension cling)
      if (d.pauseTimer > 0) {
        d.pauseTimer -= dt;
        continue;
      }

      if (!d.sliding) {
        // Stationary droplets slowly collect humidity and drift slightly
        d.r += dt * 0.45 * size;
        d.y += dt * 5.0 * speed;
        if (d.r >= d.maxR) {
          d.sliding = true;
          d.vy = (0.6 + d.r * 0.15) * speed;
        }
      } else {
        // Gravity acceleration with terminal velocity
        const maxVy = (1.5 + d.r * 1.4) * speed;
        d.vy = Math.min(d.vy + dt * 68 * speed, maxVy);
        d.y += d.vy;

        // Subtle lateral wobble and wind drift
        d.x += Math.sin(now * 0.0007 * d.wobbleSpeed + d.wobble) * 0.14 * speed + (speed - 1) * 0.18 + d.vx;
        d.trail = Math.max(d.trail, d.vy * 0.55);

        // Merge smaller droplets encountered during the slide
        for (let j = this.drops.length - 1; j >= 0; j--) {
          if (j === i) continue;
          const o = this.drops[j];
          const dx = o.x - d.x;
          const dy = o.y - d.y;
          const hitDistSq = (d.r + o.r) * (d.r + o.r) * 0.65;

          if (dx * dx + dy * dy < hitDistSq) {
            // Merge masses (volume is proportional to r^2)
            d.r = Math.min(Math.sqrt(d.r * d.r + o.r * o.r), 26 * size);
            d.vy = Math.min(d.vy + o.vy * 0.18 + 0.15, maxVy * 1.2);
            d.trail = Math.min(d.trail + 1.2, 5.0);

            // Remove consumed drop
            this.drops.splice(j, 1);
            if (j < i) i--;
          }
        }
      }

      // Remove drops that have fallen off-screen
      if (d.y - d.r > height + 25) {
        this.drops.splice(i, 1);
      }
    }
  }

  /**
   * Render all wet trails and realistic droplets.
   */
  render(ctx, colors, opacity) {
    // 1. Draw all trails first (behind the water droplets)
    for (let i = 0; i < this.drops.length; i++) {
      drawDropTrail(ctx, this.drops[i], colors.base, opacity);
    }

    // 2. Draw background (bokeh) droplets
    for (let i = 0; i < this.drops.length; i++) {
      if (this.drops[i].depth === 0) {
        drawRealisticDrop(ctx, this.drops[i], colors, opacity);
      }
    }

    // 3. Draw midground and foreground droplets
    for (let i = 0; i < this.drops.length; i++) {
      if (this.drops[i].depth !== 0) {
        drawRealisticDrop(ctx, this.drops[i], colors, opacity);
      }
    }
  }
}
