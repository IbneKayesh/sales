/**
 * Snowflake.jsx - Physics and rendering primitives for realistic snowfall.
 * Supports crystalline 6-arm ice particles as well as soft out-of-focus bokeh snow disks.
 */
import { toRgba } from "./RainDrop";

/**
 * Creates a randomized snowflake particle.
 */
export const createSnowflake = (width, sizeMultiplier = 1, speedMultiplier = 1) => {
  const isCrystal = Math.random() < 0.65; // 65% crystal structure, 35% out-of-focus bokeh
  const r = (isCrystal ? 2.5 + Math.random() * 5.5 : 1.5 + Math.random() * 4.0) * sizeMultiplier;
  return {
    isCrystal,
    x: Math.random() * width,
    y: -r * 2 - Math.random() * 30,
    r,
    vy: (0.30 + Math.random() * 0.55) * speedMultiplier,
    vx: (Math.random() - 0.5) * 0.45 * speedMultiplier,
    angle: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.5,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.4 + Math.random() * 0.6,
    alpha: 0,
    maxAlpha: 0.35 + Math.random() * 0.55,
    fadeIn: true,
    depth: Math.random() < 0.4 ? 0 : 1, // 0: background soft blur, 1: foreground
  };
};

/**
 * Render a snowflake particle (either crystal lattice or soft bokeh flake).
 */
export const drawRealisticFlake = (ctx, f, colors, globalOpacity = 1) => {
  const { x, y, r, angle, isCrystal, depth } = f;
  const o = globalOpacity * f.alpha * (depth === 0 ? 0.45 : 0.85);
  if (o <= 0.01) return;

  const { base, white } = colors;

  ctx.save();
  ctx.translate(x, y);

  if (!isCrystal || depth === 0) {
    // Soft bokeh out-of-focus snowflake
    const bokeh = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r * 1.4);
    bokeh.addColorStop(0, toRgba(white, 0.7 * o));
    bokeh.addColorStop(0.5, toRgba(base, 0.25 * o));
    bokeh.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.beginPath();
    ctx.arc(0, 0, r * 1.4, 0, Math.PI * 2);
    ctx.fillStyle = bokeh;
    ctx.fill();
  } else {
    // Crystalline 6-arm snowflake with delicate branches and halo
    ctx.rotate(angle);

    // Soft ice glow halo
    const glow = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r * 1.6);
    glow.addColorStop(0, toRgba(base, 0.16 * o));
    glow.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.6, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    const armColor = toRgba(white, 0.85 * o);
    const branchColor = toRgba(white, 0.55 * o);

    ctx.strokeStyle = armColor;
    ctx.lineWidth = Math.max(r * 0.09, 0.75);
    ctx.lineCap = "round";

    // Draw 6 symmetrical arms with sub-branches
    for (let k = 0; k < 6; k++) {
      ctx.save();
      ctx.rotate((k * Math.PI) / 3);

      // Main arm
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, r);
      ctx.stroke();

      // Delicate symmetric chevron branches
      const bLen = r * 0.35;
      ctx.strokeStyle = branchColor;
      ctx.lineWidth = Math.max(r * 0.07, 0.6);

      [0.35, 0.68].forEach((t) => {
        const by = r * t;
        ctx.beginPath();
        ctx.moveTo(0, by);
        ctx.lineTo(-bLen, by + bLen * 0.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, by);
        ctx.lineTo(bLen, by + bLen * 0.5);
        ctx.stroke();
      });

      ctx.restore();
    }

    // Hexagonal crystal center core
    ctx.beginPath();
    for (let k = 0; k < 6; k++) {
      const a = (k * Math.PI) / 3;
      const px = Math.cos(a) * r * 0.22;
      const py = Math.sin(a) * r * 0.22;
      k === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = toRgba(white, 0.68 * o);
    ctx.fill();

    // Central specular glint
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(r * 0.09, 0.65), 0, Math.PI * 2);
    ctx.fillStyle = toRgba(white, 0.95 * o);
    ctx.fill();
  }

  ctx.restore();
};
