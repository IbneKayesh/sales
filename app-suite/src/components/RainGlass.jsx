import { useEffect, useRef } from "react";

/** Parse "#rrggbb" into { r, g, b }. */
const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  const v = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
};

/** Darken an rgb object by a factor (0–1). */
const darken = (rgb, f) => ({
  r: Math.round(rgb.r * f),
  g: Math.round(rgb.g * f),
  b: Math.round(rgb.b * f),
});

const rgba = (rgb, a) => `rgba(${rgb.r},${rgb.g},${rgb.b},${a})`;

/**
 * RainGlass — a decorative "rain on glass + snowfall" canvas animation.
 *
 * Rain behaves like water on a window pane:
 *  - Surface tension: droplets are round and slowly grow by gathering mass.
 *  - Gravity: once a drop is heavy enough it starts sliding down; heavier
 *    drops fall faster.
 *  - Tracks: sliding drops absorb smaller drops they catch and leave streaks.
 *  - Reflection/lens: each drop is drawn with a radial gradient, rim and
 *    specular highlight so it reads like a tiny lens bending light.
 *
 * Snowflakes are drawn as delicate 6-arm star crystals that drift, sway and
 * lean into the wind as gusts build and fade.
 *
 * Props:
 *   density    — 0–2 multiplier for the number of particles (default 1)
 *   color      — drop/flake tint as a hex color (default light blue)
 *   opacity    — 0–1 overall strength (default 1)
 *   size       — 0.5–1.5 scale for droplet/flake radii (default 1)
 *   speed      — 0.5–2 fall-speed multiplier (default 1)
 *   snowRatio  — 0–1 fraction of particles that are snowflakes (default 0.25)
 *   wind       — 0–1 gust strength; 0 means always calm (default 0.6)
 *   gustSpeed  — 0.2–2 how often gusts build up and switch direction (default 1)
 */
export default function RainGlass({
  density = 1,
  color = "#dbeafe",
  opacity = 1,
  size = 1,
  speed = 1,
  snowRatio = 0.25,
  wind = 0.6,
  gustSpeed = 1,
  className = "",
  ...rest
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Precompute color stops for the drop body.
    const base = hexToRgb(color);
    const edge = darken(base, 0.55);
    const deep = darken(base, 0.35);

    let width = 0;
    let height = 0;
    let drops = [];   // rain drops
    let flakes = [];  // snow flakes
    let rafId = 0;
    let lastTime = performance.now();
    let spawnAccum = 0;

    // Wind state: gusts swell up, peak, and fade in cycles (a gust envelope).
    // The direction persists across several gusts and only flips occasionally,
    // like real weather.
    let windVel = 0;     // current horizontal wind speed (px/s), sign = direction
    let gustPhase = 0;   // 0..1 progress through the current gust cycle
    let gustCycle = 3.5; // seconds per full swell (build → fade)
    let gustDir = 1;     // +1 blows right, -1 blows left

    const resize = () => {
      if (getComputedStyle(canvas).position === "fixed") {
        width = window.innerWidth;
        height = window.innerHeight;
      } else {
        const rect = canvas.parentElement?.getBoundingClientRect();
        width = rect?.width || window.innerWidth;
        height = rect?.height || window.innerHeight;
      }
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Spawn a rain drop at the top.
    const spawnDrop = () => {
      drops.push({
        x: Math.random() * width,
        y: -6 - Math.random() * 24,
        r: (0.5 + Math.random() * 1.4) * size,
        maxR: (2.2 + Math.random() * 4.5) * size,
        vy: 0,
        sliding: false,
        trail: 0,
        wobble: Math.random() * Math.PI * 2,
      });
    };

    // Spawn a snowflake at the top.
    const spawnFlake = () => {
      const r = (5.0 + Math.random() * 8.5) * size;
      flakes.push({
        x: Math.random() * width,
        y: -r - Math.random() * 30,
        r,
        vy: (0.32 + Math.random() * 0.55) * speed,
        vx: (Math.random() - 0.5) * 0.5 * speed,
        angle: (Math.random() - 0.5) * 0.5, // start near vertical
        wobble: Math.random() * Math.PI * 2,
        alpha: 0,        // fade in
        fadeIn: true,
      });
    };

    // Total target particle count scaled by area + density.
    const targetCount = () =>
      Math.min(240, Math.round(((width * height) / 26000) * density));

    const frame = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      ctx.clearRect(0, 0, width, height);

      // Wind update — each cycle is a swell: it builds fast (first 30%),
      // peaks, then fades slowly (remaining 70%). The cycle length is driven
      // by gustSpeed (how often the wind changes); wind scales the peak force
      // (0 = always calm). Direction flips only ~35% of the time so the wind
      // has a prevailing sense, like real weather.
      gustPhase += dt / gustCycle;
      if (gustPhase >= 1) {
        gustPhase -= 1;
        if (Math.random() < 0.35) gustDir *= -1;
        gustCycle =
          ((3 + Math.random() * 2.5) / Math.max(gustSpeed, 0.05)) *
          (0.75 + Math.random() * 0.5);
      }
      const t = gustPhase;
      const gustEnv =
        t < 0.3
          ? Math.sin((t / 0.3) * (Math.PI / 2))          // fast build-up
          : Math.cos(((t - 0.3) / 0.7) * (Math.PI / 2)); // slow fade-out
      windVel = gustDir * wind * 130 * gustEnv;

      // Spawn particles up to the target, respecting the snow ratio.
      spawnAccum += dt;
      const total = drops.length + flakes.length;
      if (total < targetCount() && spawnAccum > 0.055) {
        if (flakes.length / Math.max(total + 1, 1) < snowRatio) {
          spawnFlake();
        } else {
          spawnDrop();
        }
        spawnAccum = 0;
      }

      // --- Rain drops ---
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];

        if (!d.sliding) {
          d.r += dt * 0.55 * size;
          d.y += dt * 8 * speed;
          // Wind pressure nudges clinging drops a little before they let go.
          d.x += windVel * 0.18 * dt;
          if (d.r >= d.maxR) {
            d.sliding = true;
            d.vy = (0.5 + d.r * 0.18) * speed;
          }
        } else {
          d.vy = Math.min(
            d.vy + dt * 70 * speed,
            (1.2 + d.r * 1.35) * speed,
          );
          d.y += d.vy;
          d.x += Math.sin(now * 0.0006 + d.wobble) * 0.12 * speed + (speed - 1) * 0.22 + windVel * dt;
          d.trail = Math.max(d.trail, d.vy * 0.5);

          // Merge smaller drops caught on the way down.
          for (let j = drops.length - 1; j >= 0; j--) {
            if (j === i) continue;
            const o = drops[j];
            const dx = o.x - d.x;
            const dy = o.y - d.y;
            if (dx * dx + dy * dy < (d.r + o.r) * (d.r + o.r) * 0.55) {
              d.r = Math.min(Math.sqrt(d.r * d.r + o.r * o.r), 9 * size);
              d.vy += o.vy * 0.15;
              drops.splice(j, 1);
              if (j < i) i--;
            }
          }
        }

        if (d.y - d.r > height + 12) {
          drops.splice(i, 1);
          continue;
        }

        drawDrop(ctx, d);
      }

      // --- Snowflakes ---
      for (let i = flakes.length - 1; i >= 0; i--) {
        const f = flakes[i];

        // Gentle sway in X, slow drift down — airborne flakes are pushed
        // hardest by the wind. Each crystal tilts toward its fall direction
        // (wind push vs. downward drift) so it leans into gusts and settles
        // back to vertical in calm air, with a subtle flutter.
        const sway = Math.sin(now * 0.0004 + f.wobble) * 0.18 * speed;
        f.x += f.vx + sway + windVel * dt;
        f.y += f.vy;
        const targetLean = Math.atan2(f.vx * 0.5 + windVel, f.vy);
        let leanDiff = targetLean - f.angle;
        leanDiff = Math.atan2(Math.sin(leanDiff), Math.cos(leanDiff)); // shortest way around
        f.angle += leanDiff * Math.min(1, dt * 3) + (Math.random() - 0.5) * 0.04;

        // Fade in near the top.
        if (f.fadeIn) {
          f.alpha = Math.min(f.alpha + dt * 1.2, 1);
          if (f.alpha >= 1) f.fadeIn = false;
        }

        // Fade out as it leaves the screen bottom.
        const fadeStart = height * 0.85;
        const fadeAlpha = f.y > fadeStart
          ? Math.max(0, 1 - (f.y - fadeStart) / (height * 0.18))
          : f.alpha;

        if (f.y - f.r > height + 10) {
          flakes.splice(i, 1);
          continue;
        }

        drawFlake(ctx, f, fadeAlpha);
      }

      rafId = requestAnimationFrame(frame);
    };

    const drawDrop = (ctx, d) => {
      const { x, y } = d;
      const r = d.r;
      const o = opacity;
      const stretch = d.sliding ? Math.min(1 + d.vy * 0.22, 1.6) : 1;
      const rx = r;
      const ry = r * stretch;

      // Track left behind while sliding.
      if (d.sliding && d.trail > 0.4) {
        const len = Math.min(d.trail * 16, 64);
        const wTop = Math.max(rx * 0.16, 0.8);
        const wBot = rx * 0.42;
        const grad = ctx.createLinearGradient(0, y - len, 0, y);
        grad.addColorStop(0, rgba(base, 0));
        grad.addColorStop(1, rgba(base, 0.12 * o));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(x - wBot, y);
        ctx.lineTo(x - wTop, y - len);
        ctx.lineTo(x + wTop, y - len);
        ctx.lineTo(x + wBot, y);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x - wBot * 0.3, y);
        ctx.lineTo(x - wTop * 0.3, y - len * 0.92);
        ctx.lineTo(x + wTop * 0.3, y - len * 0.92);
        ctx.lineTo(x + wBot * 0.3, y);
        ctx.closePath();
        ctx.fillStyle = rgba({ r: 255, g: 255, b: 255 }, 0.1 * o);
        ctx.fill();
      }

      // Shadow pool.
      const pool = ctx.createRadialGradient(
        x, y + ry * 0.9, r * 0.2,
        x, y + ry * 1.15, r * 1.15,
      );
      pool.addColorStop(0, "rgba(0,0,0,0.22)");
      pool.addColorStop(0.55, "rgba(0,0,0,0.1)");
      pool.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.ellipse(x, y + ry * 0.55, r * 1.08, ry * 1.05, 0, 0, Math.PI * 2);
      ctx.fillStyle = pool;
      ctx.fill();

      // Lens body.
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.clip();

      const g = ctx.createRadialGradient(
        x - rx * 0.3, y - ry * 0.35, rx * 0.08,
        x, y, Math.max(rx, ry),
      );
      g.addColorStop(0, rgba({ r: 255, g: 255, b: 255 }, 0.34 * o));
      g.addColorStop(0.45, rgba(base, 0.1 * o));
      g.addColorStop(0.85, rgba(edge, 0.16 * o));
      g.addColorStop(1, rgba(deep, 0.3 * o));
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      // Internal caustic.
      const cau = ctx.createRadialGradient(
        x, y + ry * 0.45, rx * 0.1,
        x, y + ry * 0.5, rx * 0.85,
      );
      cau.addColorStop(0, rgba({ r: 255, g: 255, b: 255 }, 0.32 * o));
      cau.addColorStop(0.6, rgba({ r: 255, g: 255, b: 255 }, 0.08 * o));
      cau.addColorStop(1, rgba({ r: 255, g: 255, b: 255 }, 0));
      ctx.beginPath();
      ctx.ellipse(x, y + ry * 0.5, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = cau;
      ctx.fill();

      // Dark contact rim.
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, Math.PI * 0.02, Math.PI * 0.62);
      ctx.strokeStyle = rgba(deep, 0.5 * o);
      ctx.lineWidth = Math.max(rx * 0.09, 0.7);
      ctx.stroke();

      // Bright rim light.
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, Math.PI * 0.98, Math.PI * 1.62);
      ctx.strokeStyle = rgba({ r: 255, g: 255, b: 255 }, 0.42 * o);
      ctx.lineWidth = Math.max(rx * 0.12, 0.8);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(x, y, rx * 0.96, ry * 0.96, 0, Math.PI * 1.02, Math.PI * 1.58);
      ctx.strokeStyle = rgba({ r: 255, g: 255, b: 255 }, 0.55 * o);
      ctx.lineWidth = Math.max(rx * 0.05, 0.5);
      ctx.stroke();

      // Specular glint.
      ctx.beginPath();
      ctx.arc(x - rx * 0.32, y - ry * 0.42, rx * 0.14, 0, Math.PI * 2);
      ctx.fillStyle = rgba({ r: 255, g: 255, b: 255 }, 0.75 * o);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x - rx * 0.32, y - ry * 0.42, rx * 0.24, 0, Math.PI * 2);
      ctx.fillStyle = rgba({ r: 255, g: 255, b: 255 }, 0.14 * o);
      ctx.fill();

      // Window-frame reflection streak.
      ctx.beginPath();
      ctx.arc(x - rx * 0.3, y + ry * 0.08, rx * 0.42, Math.PI * 0.35, Math.PI * 1.15);
      ctx.strokeStyle = rgba({ r: 255, g: 255, b: 255 }, 0.28 * o);
      ctx.lineWidth = Math.max(rx * 0.05, 0.5);
      ctx.stroke();

      ctx.restore();
    };

    // Draw a 6-arm snowflake crystal at position (f.x, f.y).
    const drawFlake = (ctx, f, alpha) => {
      const { x, y, r, angle } = f;
      const o = opacity * alpha;
      if (o <= 0) return;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // Subtle glow halo behind the crystal.
      const glow = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r * 1.8);
      glow.addColorStop(0, rgba(base, 0.18 * o));
      glow.addColorStop(1, rgba(base, 0));
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // 6 main arms.
      const armColor = rgba({ r: 255, g: 255, b: 255 }, 0.88 * o);
      const branchColor = rgba({ r: 255, g: 255, b: 255 }, 0.62 * o);
      ctx.strokeStyle = armColor;
      ctx.lineWidth = Math.max(r * 0.1, 0.9);
      ctx.lineCap = "round";

      for (let k = 0; k < 6; k++) {
        ctx.save();
        ctx.rotate((k * Math.PI) / 3);

        // Main arm.
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, r);
        ctx.stroke();

        // Two symmetric branches per arm at 35% and 65% of the arm length.
        const bLen = r * 0.38;
        ctx.strokeStyle = branchColor;
        ctx.lineWidth = Math.max(r * 0.075, 0.65);

        [0.35, 0.65].forEach((t) => {
          const by = r * t;
          ctx.beginPath();
          ctx.moveTo(0, by);
          ctx.lineTo(-bLen, by + bLen * 0.55);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, by);
          ctx.lineTo(bLen, by + bLen * 0.55);
          ctx.stroke();
        });

        ctx.strokeStyle = armColor;
        ctx.lineWidth = Math.max(r * 0.1, 0.9);
        ctx.restore();
      }

      // Centre hexagonal plate — small filled hexagon.
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = (k * Math.PI) / 3;
        const px = Math.cos(a) * r * 0.22;
        const py = Math.sin(a) * r * 0.22;
        k === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = rgba({ r: 255, g: 255, b: 255 }, 0.72 * o);
      ctx.fill();

      // Sparkle glint — a tiny bright dot at the centre.
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(r * 0.1, 0.8), 0, Math.PI * 2);
      ctx.fillStyle = rgba({ r: 255, g: 255, b: 255 }, 0.95 * o);
      ctx.fill();

      ctx.restore();
    };

    rafId = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [density, color, opacity, size, speed, snowRatio, wind, gustSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className={`rain-glass${className ? " " + className : ""}`}
      aria-hidden="true"
      {...rest}
    />
  );
}
