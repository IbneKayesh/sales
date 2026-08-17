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
 * RainGlass — a decorative "rain on glass" canvas animation for backgrounds.
 *
 * Behaves like water on a window pane:
 *  - Surface tension: droplets are round and slowly grow by gathering mass.
 *  - Gravity: once a drop is heavy enough it starts sliding down; heavier
 *    drops fall faster.
 *  - Tracks: sliding drops absorb smaller drops they catch (growing larger
 *    and speeding up) and leave a faint streak behind.
 *  - Reflection/lens: each drop is drawn with a radial gradient body, a rim
 *    and a specular highlight so it reads like a tiny lens bending light.
 *
 * Props:
 *   density   — 0–2 multiplier for the number of droplets (default 1)
 *   color     — drop tint as a hex color, e.g. "#dbeafe" (default light blue)
 *   opacity   — 0–1 overall drop strength (default 1)
 *   size      — 0.5–1.5 scale for droplet radii (default 1)
 *   speed     — 0.5–2 fall-speed multiplier; also adds a light wind drift
 *               sideways at higher speeds (default 1)
 *   className — extra classes for positioning (e.g. absolute overlay)
 */
export default function RainGlass({
  density = 1,
  color = "#dbeafe",
  opacity = 1,
  size = 1,
  speed = 1,
  className = "",
  ...rest
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Precompute color stops for the drop body (center = white glint, edge =
    // darkened tint) so drawDrop stays fast.
    const base = hexToRgb(color);
    const edge = darken(base, 0.55);
    const deep = darken(base, 0.35);

    let width = 0;
    let height = 0;
    let drops = [];
    let rafId = 0;
    let lastTime = performance.now();
    let spawnAccum = 0;

    const resize = () => {
      // A fixed-position overlay (app-wide rain) fills the whole viewport;
      // otherwise fill the parent pane (e.g. the Workspace page area).
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

    // Spawn a fresh droplet at the top of the pane.
    const spawn = () => {
      drops.push({
        x: Math.random() * width,
        y: -6 - Math.random() * 24,
        r: (0.5 + Math.random() * 1.4) * size, // small round seed
        // size at which gravity wins over surface tension
        maxR: (2.2 + Math.random() * 4.5) * size,
        vy: 0,
        sliding: false,
        trail: 0,
        wobble: Math.random() * Math.PI * 2,
      });
    };

    // How many droplets should be on screen (scaled by pane area + density).
    const targetCount = () =>
      Math.min(220, Math.round(((width * height) / 26000) * density));

    const frame = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      ctx.clearRect(0, 0, width, height);

      // Keep the pane populated: spawn while under target.
      spawnAccum += dt;
      if (drops.length < targetCount() && spawnAccum > 0.06) {
        spawn();
        spawnAccum = 0;
      }

      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];

        if (!d.sliding) {
          // Surface tension: round drop gathers mass, barely moving.
          d.r += dt * 0.55 * size;
          d.y += dt * 8 * speed;
          if (d.r >= d.maxR) {
            d.sliding = true;
            d.vy = (0.5 + d.r * 0.18) * speed; // heavier drops start faster
          }
        } else {
          // Gravity: accelerate downward, capped by size (scaled by speed).
          d.vy = Math.min(
            d.vy + dt * 70 * speed,
            (1.2 + d.r * 1.35) * speed,
          );
          d.y += d.vy;
          // Sideways drift: a light sway plus wind that grows with speed so
          // faster rain is pushed more visibly across the pane.
          d.x += Math.sin(now * 0.0006 + d.wobble) * 0.12 * speed + (speed - 1) * 0.22;
          d.trail = Math.max(d.trail, d.vy * 0.5);

          // Merge with any smaller drop we catch on the way down.
          for (let j = drops.length - 1; j >= 0; j--) {
            if (j === i) continue;
            const o = drops[j];
            const dx = o.x - d.x;
            const dy = o.y - d.y;
            if (dx * dx + dy * dy < (d.r + o.r) * (d.r + o.r) * 0.55) {
              // Conserve volume: r' = sqrt(r^2 + o^2), cap to keep drops tidy.
              d.r = Math.min(Math.sqrt(d.r * d.r + o.r * o.r), 9 * size);
              d.vy += o.vy * 0.15;
              drops.splice(j, 1);
              if (j < i) i--;
            }
          }
        }

        // Remove drops that slid off the bottom of the pane.
        if (d.y - d.r > height + 12) {
          drops.splice(i, 1);
          continue;
        }

        drawDrop(ctx, d);
      }

      rafId = requestAnimationFrame(frame);
    };

    const drawDrop = (ctx, d) => {
      const { x, y } = d;
      const r = d.r;
      const o = opacity;
      // Sliding drops stretch into a teardrop-ish vertical ellipse.
      const stretch = d.sliding ? Math.min(1 + d.vy * 0.22, 1.6) : 1;
      const rx = r;
      const ry = r * stretch;

      // --- Track left behind while sliding (tapered streak with a bright
      //     core, like the cleared path of a sliding drop). ---
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
        // Bright waterline core along the track.
        ctx.beginPath();
        ctx.moveTo(x - wBot * 0.3, y);
        ctx.lineTo(x - wTop * 0.3, y - len * 0.92);
        ctx.lineTo(x + wTop * 0.3, y - len * 0.92);
        ctx.lineTo(x + wBot * 0.3, y);
        ctx.closePath();
        ctx.fillStyle = rgba({ r: 255, g: 255, b: 255 }, 0.1 * o);
        ctx.fill();
      }

      // --- Soft ground shadow / pool beneath the drop (water sits on the
      //     glass and catches a little shadow at its base). ---
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

      // --- The drop itself: a tiny lens. Clip so all internal details stay
      //     inside the droplet silhouette. ---
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.clip();

      // Water body — light bends through the lens: faint tint centre, a touch
      // darker toward the rim where the curve refracts most.
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

      // Internal caustic — light focuses through the lens into a bright
      // crescent near the base of the drop.
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

      // Dark contact rim — the bottom-right edge where the lens meets the
      // glass reads slightly darker in macro rain shots.
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, Math.PI * 0.02, Math.PI * 0.62);
      ctx.strokeStyle = rgba(deep, 0.5 * o);
      ctx.lineWidth = Math.max(rx * 0.09, 0.7);
      ctx.stroke();

      // Bright rim light — the lit top-left arc.
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, Math.PI * 0.98, Math.PI * 1.62);
      ctx.strokeStyle = rgba({ r: 255, g: 255, b: 255 }, 0.42 * o);
      ctx.lineWidth = Math.max(rx * 0.12, 0.8);
      ctx.stroke();
      // Crisp bright core line on the lit edge.
      ctx.beginPath();
      ctx.ellipse(x, y, rx * 0.96, ry * 0.96, 0, Math.PI * 1.02, Math.PI * 1.58);
      ctx.strokeStyle = rgba({ r: 255, g: 255, b: 255 }, 0.55 * o);
      ctx.lineWidth = Math.max(rx * 0.05, 0.5);
      ctx.stroke();

      // Specular glint — the point reflection of the light source.
      ctx.beginPath();
      ctx.arc(x - rx * 0.32, y - ry * 0.42, rx * 0.14, 0, Math.PI * 2);
      ctx.fillStyle = rgba({ r: 255, g: 255, b: 255 }, 0.75 * o);
      ctx.fill();
      // Soft halo around the glint so it reads as a glow, not a dot.
      ctx.beginPath();
      ctx.arc(x - rx * 0.32, y - ry * 0.42, rx * 0.24, 0, Math.PI * 2);
      ctx.fillStyle = rgba({ r: 255, g: 255, b: 255 }, 0.14 * o);
      ctx.fill();

      // Window-frame reflection — the thin curved streak below the glint.
      ctx.beginPath();
      ctx.arc(x - rx * 0.3, y + ry * 0.08, rx * 0.42, Math.PI * 0.35, Math.PI * 1.15);
      ctx.strokeStyle = rgba({ r: 255, g: 255, b: 255 }, 0.28 * o);
      ctx.lineWidth = Math.max(rx * 0.05, 0.5);
      ctx.stroke();

      ctx.restore();
    };

    rafId = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [density, color, opacity, size, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`rain-glass${className ? " " + className : ""}`}
      aria-hidden="true"
      {...rest}
    />
  );
}
