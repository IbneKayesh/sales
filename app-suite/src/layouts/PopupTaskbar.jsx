import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { IconClose, IconChevronDown, IconEye, IconExpand, IconCollapse } from "@/icons";

const actionStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 26,
  height: 26,
  borderRadius: 6,
  border: "1px solid var(--border, #e0e0e0)",
  background: "var(--surface, #fff)",
  color: "var(--text-muted, #888)",
  cursor: "pointer",
  flexShrink: 0,
};

/**
 * Taskbar strip pinned to the bottom of the viewport listing every open menu
 * popup — like a window taskbar. Click a popup to toggle it: a minimized one
 * is restored (and brought to the front), a visible one is minimized. Bulk
 * actions on the right: Close all, Show all (restore minimized), Hide all
 * (minimize everything). Renders nothing while no popups are open.
 */
export default function PopupTaskbar() {
  const {
    popups,
    restorePopup,
    hidePopup,
    closePopup,
    closeAllPopups,
    showAllPopups,
    hideAllPopups,
  } = useApp();

  if (popups.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: "var(--z-toast, 2000)",
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        background: "var(--surface, #fff)",
        borderTop: "1px solid var(--border, #e0e0e0)",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.08)",
        fontFamily: "var(--font-sans)",
        overflowX: "auto",
        whiteSpace: "nowrap",
      }}
    >
      {popups.map((p) => (
        <TaskbarItem
          key={p.key}
          popup={p}
          onToggle={() => (p.hidden ? restorePopup(p.key) : hidePopup(p.key))}
          onClose={() => closePopup(p.key)}
        />
      ))}
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
          paddingLeft: 8,
        }}
      >
        <FullscreenButton />
        <button
          type="button"
          style={actionStyle}
          onClick={closeAllPopups}
          title="Close all open popups"
          aria-label="Close all popups"
        >
          <IconClose size={14} />
        </button>
        <button
          type="button"
          style={actionStyle}
          onClick={showAllPopups}
          title="Restore all minimized popups"
          aria-label="Show all popups"
        >
          <IconEye size={14} />
        </button>
        <button
          type="button"
          style={actionStyle}
          onClick={hideAllPopups}
          title="Minimize all open popups"
          aria-label="Hide all popups"
        >
          <IconChevronDown size={14} />
        </button>
      </div>
      <TaskbarClock />
    </div>
  );
}

/** Fullscreen toggle (like F11) pinned at the left of the taskbar. */
function FullscreenButton() {
  const [fullscreen, setFullscreen] = useState(!!document.fullscreenElement);

  useEffect(() => {
    const onChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      document.documentElement.requestFullscreen?.().catch(() => {});
    }
  };

  return (
    <button
      type="button"
      style={actionStyle}
      onClick={toggleFullscreen}
      title={fullscreen ? "Exit fullscreen (F11)" : "Enter fullscreen (F11)"}
      aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {fullscreen ? <IconCollapse size={14} /> : <IconExpand size={14} />}
    </button>
  );
}

/** Live clock, styled after the Windows 11 taskbar clock. */
function TaskbarClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const date = now.toLocaleDateString([], {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 8,
        flexShrink: 0,
        paddingLeft: 12,
        marginLeft: 4,
        borderLeft: "1px solid var(--border, #e0e0e0)",
        whiteSpace: "nowrap",
      }}
      title={`${date} · ${time}`}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          color: "var(--text-primary, #111)",
        }}
      >
        {time}
      </span>
      <span
        style={{
          fontSize: 11,
          color: "var(--text-muted, #888)",
        }}
      >
        {date}
      </span>
    </div>
  );
}

function TaskbarItem({ popup, onToggle, onClose }) {
  const [hovered, setHovered] = useState(false);
  const hidden = popup.hidden;

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        flexShrink: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        onClick={onToggle}
        title={
          hidden
            ? `Open ${popup.menu.menus_mname}`
            : `Minimize ${popup.menu.menus_mname}`
        }
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          maxWidth: 220,
          padding: "4px 8px",
          borderRadius: 8,
          border: "1px solid var(--border, #e0e0e0)",
          background: hovered ? "var(--surface-alt, #f1f3f5)" : "transparent",
          color: "var(--text-primary, #111)",
          opacity: hidden ? 0.55 : 1,
          cursor: "pointer",
          fontSize: 13,
          transition: "background 0.15s, opacity 0.15s",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            flexShrink: 0,
            color: popup.menu.menus_color,
          }}
        >
          {popup.menu.menus_micon}
        </span>
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {popup.menu.menus_mname}
        </span>
      </button>
      {hovered && (
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${popup.menu.menus_mname}`}
          title={`Close ${popup.menu.menus_mname}`}
          style={{
            position: "absolute",
            top: -6,
            right: -6,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: "1px solid var(--border, #e0e0e0)",
            background: "var(--surface, #fff)",
            color: "var(--text-muted, #888)",
            cursor: "pointer",
            padding: 0,
            boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
          }}
        >
          <IconClose size={11} />
        </button>
      )}
    </div>
  );
}
