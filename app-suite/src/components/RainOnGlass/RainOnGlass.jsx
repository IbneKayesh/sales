import { useEffect, useRef, useMemo } from "react";
import { hexToRgb, darkenRgb } from "./components/RainDrop";
import { RainSimulation } from "./components/RainLayer";
import { SnowSimulation } from "./components/SnowLayer";
import "./RainOnGlass.css";

/**
 * RainOnGlass - High performance realistic weather effect on glass.
 * Renders live physics-based water droplets, contact shadows, lens refraction,
 * specular highlights, dynamic merging, wet trails, and a drifting snowfall layer.
 *
 * Props:
 *   density   - 0–2 multiplier for particle density (default 1)
 *   color     - droplet/flake color tint as hex (default "#dbeafe")
 *   opacity   - 0–1 overall alpha strength (default 1)
 *   size      - 0.5–1.5 scaling for droplet/crystal radius (default 1)
 *   speed     - 0.5–2 velocity multiplier (default 1)
 *   snowRatio - 0–1 fraction of particles that are snowflakes (default 0.25)
 *   className - additional CSS class names
 *   style     - inline style overrides
 */
export default function RainOnGlass({
  density = 1,
  color = "#dbeafe",
  opacity = 1,
  size = 1,
  speed = 1,
  snowRatio = 0.25,
  className = "",
  style = {},
  ...rest
}) {
  const canvasRef = useRef(null);

  // Precompute theme color stops and highlight colors
  const colorPalette = useMemo(() => {
    const base = hexToRgb(color);
    const edge = darkenRgb(base, 0.52);
    const deep = darkenRgb(base, 0.30);
    const white = { r: 255, g: 255, b: 255 };
    return { base, edge, deep, white };
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let rafId = 0;
    let lastTime = performance.now();

    const rainSim = new RainSimulation();
    const snowSim = new SnowSimulation();

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

    // Animation Loop
    const frame = (now) => {
      // Clamp delta time to prevent physics explosions on background tab sleep
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Clear frame
      ctx.clearRect(0, 0, width, height);

      // Update simulations
      rainSim.update({
        width,
        height,
        dt,
        now,
        density,
        size,
        speed,
      });

      snowSim.update({
        width,
        height,
        dt,
        now,
        density,
        size,
        speed,
        snowRatio,
      });

      // Render layers
      rainSim.render(ctx, colorPalette, opacity);
      snowSim.render(ctx, colorPalette, opacity);

      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      rainSim.reset();
      snowSim.reset();
    };
  }, [density, colorPalette, opacity, size, speed, snowRatio]);

  return (
    <canvas
      ref={canvasRef}
      className={`rain-on-glass${className ? ` ${className}` : ""}`}
      style={style}
      aria-hidden="true"
      {...rest}
    />
  );
}
