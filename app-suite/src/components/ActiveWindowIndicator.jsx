import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";

/**
 * ActiveWindowIndicator — shows the currently focused popup window's title
 * and subtitle in the Topbar, alongside the bSuite brand.
 *
 * Features:
 * - Fade+slide animation when the active window changes.
 * - Click to cycle through open windows (each click brings the next one to
 *   front and re-renders it on top of the stack).
 * - Small pill badge showing the total number of open windows when > 1.
 * - Rich tooltip with position info (e.g. "Active: BOM (2/3)").
 *
 * Renders nothing when no popup windows are open.
 */
export default function ActiveWindowIndicator() {
  const { popups, bringPopupToFront } = useApp();

  // Visible (non-hidden) popups — ordered by stack position.
  const visiblePopups = popups.filter((p) => !p.hidden);
  const openCount = visiblePopups.length;

  // Index into visiblePopups for the "active" window.  Starts at -1 (none)
  // and is kept in range whenever the visible set changes.
  const [activeIdx, setActiveIdx] = useState(-1);
  const [animKey, setAnimKey] = useState(0);

  // When the set of visible popups changes, reset the index so it always
  // points at a valid item (or -1 if none).
  useEffect(() => {
    if (visiblePopups.length === 0) {
      setActiveIdx(-1);
      return;
    }
    setActiveIdx((prev) =>
      prev >= 0 && prev < visiblePopups.length
        ? prev
        : visiblePopups.length - 1,
    );
  }, [visiblePopups.length]);

  const activePopup = activeIdx >= 0 ? visiblePopups[activeIdx] : null;

  // Click handler: cycle through open windows.  Each click advances to the
  // next window and brings it to the front of the render stack.
  const cycleActiveWindow = () => {
    if (openCount === 0) return;
    if (openCount === 1) {
      bringPopupToFront(visiblePopups[0].key);
      return;
    }
    setActiveIdx((prev) => {
      const next = (prev + 1) % visiblePopups.length;
      bringPopupToFront(visiblePopups[next].key);
      return next;
    });
    // Re-key the component to trigger the CSS fade+slide animation.
    setAnimKey((k) => k + 1);
  };

  if (!activePopup) return null;

  return (
    <button
      type="button"
      className="topbar__active-window topbar__active-window--animating"
      key={`aw-${animKey}`}
      onClick={cycleActiveWindow}
      title={
        openCount > 1
          ? `Active: ${activePopup.menu.menus_mname} (${activeIdx + 1}/${openCount}) — click to cycle`
          : activePopup.menu.menus_mname
      }
      aria-label={`Active window: ${activePopup.menu.menus_mname}. Click to cycle through ${openCount} open windows.`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        marginLeft: 12,
        paddingLeft: 12,
        paddingRight: 4,
        border: "none",
        borderLeft: "1px solid var(--border)",
        borderRadius: 0,
        background: "transparent",
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          flexShrink: 0,
          color: "var(--primary, #7c3aed)",
        }}
      >
        {activePopup.menu.menus_micon}
      </span>
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <span
          className="topbar__active-window-title"
          style={{
            fontWeight: 600,
            fontSize: 13,
            lineHeight: 1.2,
            color: "var(--text-primary, #111)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            transition: "color var(--transition-fast)",
          }}
        >
          {activePopup.menu.menus_mname}
        </span>
        {activePopup.menu.menus_mdesc && (
          <span
            className="topbar__active-window-subtitle"
            style={{
              fontSize: 11,
              lineHeight: 1.2,
              color: "var(--text-muted, #888)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {activePopup.menu.menus_mdesc}
          </span>
        )}
      </span>
      {openCount > 1 && (
        <span
          className="topbar__active-window-count"
          title={`${openCount} windows open`}
        >
          {openCount}
        </span>
      )}
    </button>
  );
}
