/**
 * RainDrop.jsx - Physics and rendering primitives for realistic water droplets on glass.
 * Implements 4-tier droplet sizing, organic deformation, specular highlights,
 * dark refraction rims, internal caustics, wet trails, and depth-of-field styling.
 */

/** Parse "#rrggbb" into { r, g, b }. */
export const hexToRgb = (hex) => {
  const h = (hex || "#dbeafe").replace("#", "");
  const v = parseInt(
    h.length === 3 ? h.split("").map((c) => c + c).join("") : h,
    16
  );
  return {
    r: (v >> 16) & 255,
    g: (v >> 8) & 255,
    b: v & 255,
  };
};

/** Darken an RGB color object by factor (0-1). */
export const darkenRgb = (rgb, factor) => ({
  r: Math.round(rgb.r * factor),
  g: Math.round(rgb.g * factor),
  b: Math.round(rgb.b * factor),
});

/** Return rgba string. */
export const toRgba = (rgb, alpha) =>
  `rgba(${rgb.r},${rgb.g},${rgb.b},${Math.max(0, Math.min(1, alpha))})`;

/**
 * Creates a randomized droplet model.
 * Size tiers:
 *  - Tiny:   1 - 3px   (numerous, slow drift)
 *  - Small:  3 - 7px   (moderate speed)
 *  - Medium: 7 - 16px  (starts stationary then gathers mass & slides)
 *  - Large:  16 - 32px (heavy, accelerates, absorbs others, wet trail)
 */
export const createDrop = (width, sizeMultiplier = 1, forceTier = null) => {
  const rand = Math.random();
  let tier = forceTier;
  if (!tier) {
    if (rand < 0.50) tier = "tiny";
    else if (rand < 0.80) tier = "small";
    else if (rand < 0.95) tier = "medium";
    else tier = "large";
  }

  let r = 1;
  let maxR = 2;
  let sliding = false;
  let baseSpeed = 1;
  let depth = 1; // 0: background (blurred/faint), 1: midground, 2: foreground (sharp)

  switch (tier) {
    case "tiny":
      r = (1.0 + Math.random() * 2.0) * sizeMultiplier;
      maxR = r * (1.1 + Math.random() * 0.4);
      sliding = Math.random() < 0.35;
      baseSpeed = 0.15 + Math.random() * 0.35;
      depth = Math.random() < 0.4 ? 0 : 1;
      break;
    case "small":
      r = (3.0 + Math.random() * 4.0) * sizeMultiplier;
      maxR = r * (1.3 + Math.random() * 0.6);
      sliding = Math.random() < 0.25;
      baseSpeed = 0.35 + Math.random() * 0.65;
      depth = 1;
      break;
    case "medium":
      r = (7.0 + Math.random() * 9.0) * sizeMultiplier;
      maxR = r * (1.4 + Math.random() * 0.8);
      sliding = false; // clings to glass until critical mass
      baseSpeed = 0.8 + Math.random() * 1.2;
      depth = Math.random() < 0.3 ? 1 : 2;
      break;
    case "large":
    default:
      r = (14.0 + Math.random() * 16.0) * sizeMultiplier;
      maxR = r * (1.2 + Math.random() * 0.5);
      sliding = true; // heavy gravity slide
      baseSpeed = 1.4 + Math.random() * 1.8;
      depth = 2;
      break;
  }

  return {
    tier,
    depth,
    x: Math.random() * width,
    y: -r * 2 - Math.random() * 40,
    r,
    initR: r,
    maxR,
    vy: sliding ? baseSpeed : 0,
    vx: (Math.random() - 0.5) * 0.15,
    baseSpeed,
    sliding,
    pauseTimer: Math.random() < 0.2 ? Math.random() * 2.5 : 0,
    trail: 0,
    trailSegments: [],
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.5 + Math.random() * 1.5,
    irregularity: (Math.random() - 0.5) * 0.15, // organic shape deviation
  };
};

/**
 * Draw a wet trail behind sliding droplets.
 */
export const drawDropTrail = (ctx, d, baseColor, opacity) => {
  if (!d.sliding || d.trail <= 0.2) return;
  const { x, y, r, trail } = d;
  const trailLen = Math.min(trail * 20, 90);
  const wTop = Math.max(r * 0.18, 0.7);
  const wBot = Math.max(r * 0.45, 1.2);

  ctx.save();
  // Outer soft wet smear
  const smear = ctx.createLinearGradient(0, y - trailLen, 0, y);
  smear.addColorStop(0, toRgba(baseColor, 0));
  smear.addColorStop(0.6, toRgba(baseColor, 0.08 * opacity));
  smear.addColorStop(1, toRgba(baseColor, 0.20 * opacity));

  ctx.beginPath();
  ctx.moveTo(x - wBot, y);
  ctx.lineTo(x - wTop, y - trailLen);
  ctx.lineTo(x + wTop, y - trailLen);
  ctx.lineTo(x + wBot, y);
  ctx.closePath();
  ctx.fillStyle = smear;
  ctx.fill();

  // Thin reflective core highlight streak
  const core = ctx.createLinearGradient(0, y - trailLen * 0.9, 0, y);
  core.addColorStop(0, "rgba(255, 255, 255, 0)");
  core.addColorStop(0.8, toRgba({ r: 255, g: 255, b: 255 }, 0.16 * opacity));
  core.addColorStop(1, toRgba({ r: 255, g: 255, b: 255 }, 0.28 * opacity));

  ctx.beginPath();
  ctx.moveTo(x - wBot * 0.25, y);
  ctx.lineTo(x - wTop * 0.2, y - trailLen * 0.9);
  ctx.lineTo(x + wTop * 0.2, y - trailLen * 0.9);
  ctx.lineTo(x + wBot * 0.25, y);
  ctx.closePath();
  ctx.fillStyle = core;
  ctx.fill();
  ctx.restore();
};

/**
 * Render an individual realistic water droplet.
 */
export const drawRealisticDrop = (ctx, d, colors, globalOpacity = 1) => {
  const { x, y, r, depth, sliding, vy, irregularity } = d;
  const o = globalOpacity * (depth === 0 ? 0.45 : depth === 1 ? 0.85 : 1.0);
  if (o <= 0.01) return;

  const stretch = sliding ? Math.min(1 + vy * 0.18, 1.7) : 1.0;
  const rx = r * (1 + irregularity);
  const ry = r * stretch * (1 - irregularity * 0.5);

  const { base, edge, deep, white } = colors;

  // 1. Soft Glass Contact Drop Shadow
  ctx.beginPath();
  const shadowGrad = ctx.createRadialGradient(
    x, y + ry * 0.85, rx * 0.15,
    x, y + ry * 1.1, rx * 1.15
  );
  shadowGrad.addColorStop(0, `rgba(0, 0, 0, ${0.28 * o})`);
  shadowGrad.addColorStop(0.6, `rgba(0, 0, 0, ${0.12 * o})`);
  shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = shadowGrad;
  ctx.ellipse(x, y + ry * 0.45, rx * 1.1, ry * 1.05, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Main Refractive Lens Body
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.clip();

  // Base spherical lens gradient
  const lensGrad = ctx.createRadialGradient(
    x - rx * 0.28, y - ry * 0.32, rx * 0.08,
    x, y, Math.max(rx, ry)
  );
  lensGrad.addColorStop(0, toRgba(white, 0.45 * o));
  lensGrad.addColorStop(0.4, toRgba(base, 0.12 * o));
  lensGrad.addColorStop(0.8, toRgba(edge, 0.22 * o));
  lensGrad.addColorStop(1, toRgba(deep, 0.38 * o));

  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = lensGrad;
  ctx.fill();

  // Internal Bottom-Right Caustic Glow (refracted light focus)
  const causticGrad = ctx.createRadialGradient(
    x + rx * 0.15, y + ry * 0.42, rx * 0.05,
    x + rx * 0.15, y + ry * 0.45, rx * 0.85
  );
  causticGrad.addColorStop(0, toRgba(white, 0.42 * o));
  causticGrad.addColorStop(0.5, toRgba(white, 0.12 * o));
  causticGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.beginPath();
  ctx.ellipse(x, y + ry * 0.4, rx * 0.9, ry * 0.75, 0, 0, Math.PI * 2);
  ctx.fillStyle = causticGrad;
  ctx.fill();

  // Dark Outer Refraction Rim (bottom-right curvature)
  ctx.beginPath();
  ctx.ellipse(x, y, rx * 0.98, ry * 0.98, 0, Math.PI * 0.05, Math.PI * 0.75);
  ctx.strokeStyle = toRgba(deep, 0.65 * o);
  ctx.lineWidth = Math.max(rx * 0.10, 0.7);
  ctx.stroke();

  // Top-Left Bright Specular Edge Rim Light
  ctx.beginPath();
  ctx.ellipse(x, y, rx * 0.96, ry * 0.96, 0, Math.PI * 0.95, Math.PI * 1.65);
  ctx.strokeStyle = toRgba(white, 0.65 * o);
  ctx.lineWidth = Math.max(rx * 0.12, 0.8);
  ctx.stroke();

  // Primary Specular Pinpoint Glint (Sky/light source reflection)
  ctx.beginPath();
  ctx.arc(x - rx * 0.32, y - ry * 0.38, Math.max(rx * 0.14, 0.7), 0, Math.PI * 2);
  ctx.fillStyle = toRgba(white, 0.88 * o);
  ctx.fill();

  // Secondary Soft Specular Halo
  ctx.beginPath();
  ctx.arc(x - rx * 0.32, y - ry * 0.38, Math.max(rx * 0.28, 1.2), 0, Math.PI * 2);
  ctx.fillStyle = toRgba(white, 0.18 * o);
  ctx.fill();

  // Window Frame Environmental Reflection Arc
  if (rx > 3.5) {
    ctx.beginPath();
    ctx.arc(x - rx * 0.22, y + ry * 0.1, rx * 0.45, Math.PI * 0.35, Math.PI * 1.1);
    ctx.strokeStyle = toRgba(white, 0.32 * o);
    ctx.lineWidth = Math.max(rx * 0.06, 0.5);
    ctx.stroke();
  }

  ctx.restore();
};
