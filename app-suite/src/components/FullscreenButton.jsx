import { useState, useEffect } from "react";
import { IconExpand, IconCollapse } from "@/icons";

/**
 * Fullscreen toggle button (like F11). Tracks the browser fullscreen state —
 * including changes made outside this component (e.g. the F11 key) — and
 * toggles fullscreen on click.
 *
 * Styling is provided by the caller via `className` / `activeClassName`
 * (CSS classes) or `style` (inline styles); the two call sites render it
 * differently, so no styles are baked in here.
 */
export default function FullscreenButton({
  className = "",
  activeClassName = "",
  style,
  iconSize = 16,
}) {
  const [fullscreen, setFullscreen] = useState(
    () => !!document.fullscreenElement,
  );

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    } else {
      document.documentElement.requestFullscreen?.().catch(() => {});
    }
  };

  return (
    <button
      type="button"
      className={`${className}${fullscreen && activeClassName ? ` ${activeClassName}` : ""}`}
      style={style}
      onClick={toggleFullscreen}
      aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      aria-pressed={fullscreen}
      title={fullscreen ? "Exit fullscreen (F11)" : "Enter fullscreen (F11)"}
    >
      {fullscreen ? <IconCollapse size={iconSize} /> : <IconExpand size={iconSize} />}
    </button>
  );
}
