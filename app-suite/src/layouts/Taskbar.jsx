import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Routes, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { IconClose, IconChevronDown, IconEye } from "@/icons";
import FullscreenButton from "@/components/FullscreenButton";
import Calendar from "@/components/Calendar";
import getRoutes from "@/routes";
import { moduleShade } from "@/utils/theme";
import { menus as allMenus } from "@/utils/appModules";

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
 * window — like a window taskbar. Click a window to toggle it: a minimized one
 * is restored (and brought to the front), a visible one is minimized. Bulk
 * actions on the right: Close all, Show all (restore minimized), Hide all
 * (minimize everything). Renders nothing while no windows are open.
 */
export default function Taskbar() {
  const {
    popups,
    restorePopup,
    hidePopup,
    closePopup,
    closeAllPopups,
    showAllPopups,
    hideAllPopups,
    user,
    business,
    pinnedMenuIds,
  } = useApp();
  const navigate = useNavigate();

  const hasPopups = popups.length > 0;

  // Pinned favorite menus — quick-launch shortcuts (same list as the Modules
  // page Pinned section, shared via context so pinning in one updates both).
  const pinnedMenus = allMenus.filter((m) => pinnedMenuIds.includes(m.id));

  // Avatar mirrors the topbar: initials chip, or the image when it's a URL.
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((s) => s[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";
  const hasAvatar = !!(
    user?.avatar &&
    (user.avatar.startsWith("http") || user.avatar.startsWith("data:"))
  );

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
        // Adaptive: a touch slimmer when only the status strip is showing.
        padding: hasPopups ? "4px 10px" : "3px 10px",
        background:
          "linear-gradient(to top, color-mix(in srgb, var(--surface, #ffffff) 92%, var(--primary, #7c3aed)) 0%, color-mix(in srgb, var(--surface, #ffffff) 97%, var(--primary, #7c3aed)) 100%)",
        WebkitBackdropFilter: "blur(10px) saturate(140%)",
        backdropFilter: "blur(10px) saturate(140%)",
        boxShadow: "0 -2px 12px rgba(0,0,0,0.10)",
        borderTop: "1px solid var(--border, #e0e0e0)",
        fontFamily: "var(--font-sans)",
        fontSize: 11,
        color: "var(--text-secondary, #4b5563)",
        overflowX: "auto",
        whiteSpace: "nowrap",
        userSelect: "none",
      }}
    >
      {/* Status strip — company + currency (classic desktop ERP left status).
          Clicking the company name opens the modules page, same as the
          topbar bSuite brand. */}
      <button
        type="button"
        onClick={() => navigate("/bsuite/modules")}
        title="Open modules"
        aria-label="Open modules"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
          padding: "3px 8px",
          marginLeft: -8,
          border: "none",
          borderRadius: 8,
          background: "transparent",
          color: "inherit",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: "inherit",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--surface-alt, #f1f3f5)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "var(--success, #16a34a)",
            display: "inline-block",
          }}
        />
        <strong style={{ fontWeight: 600, color: "var(--text-primary, #111)" }}>
          {business?.bsins_cname || "bSuite"}
        </strong>
      </button>
      {business?.bsins_crncy && (
        <span style={{ flexShrink: 0 }}>{business.bsins_crncy}</span>
      )}

      {/* Pinned menu quick-launch shortcuts */}
      {pinnedMenus.length > 0 && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 2,
            marginLeft: 6,
            paddingLeft: 8,
            borderLeft: "1px solid var(--border, #e0e0e0)",
          }}
        >
          {pinnedMenus.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => navigate(m.menus_mlink)}
              title={m.menus_mname}
              aria-label={`Open ${m.menus_mname}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 26,
                height: 26,
                padding: 0,
                borderRadius: 6,
                border: "none",
                background: "transparent",
                color: moduleShade(m.id),
                cursor: "pointer",
                flexShrink: 0,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--surface-alt, #f1f3f5)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {m.menus_micon}
            </button>
          ))}
        </span>
      )}

      {/* Open windows (window-taskbar style) */}
      {hasPopups && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            paddingLeft: 8,
            marginLeft: 4,
            borderLeft: "1px solid var(--border, #e0e0e0)",
          }}
        >
          {popups.map((p) => (
            <TaskbarItem
              key={p.key}
              popup={p}
              onToggle={() =>
                p.hidden ? restorePopup(p.key) : hidePopup(p.key)
              }
              onClose={() => closePopup(p.key)}
            />
          ))}
        </span>
      )}

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
        {hasPopups && (
          <>
            <FullscreenButton style={actionStyle} iconSize={14} />
            <button
              type="button"
              style={actionStyle}
              onClick={showAllPopups}
              title="Restore all minimized windows"
              aria-label="Show all windows"
            >
              <IconEye size={14} />
            </button>
            <button
              type="button"
              style={actionStyle}
              onClick={hideAllPopups}
              title="Minimize all open windows"
              aria-label="Hide all windows"
            >
              <IconChevronDown size={14} />
            </button>
            <button
              type="button"
              style={actionStyle}
              onClick={closeAllPopups}
              title="Close all open windows"
              aria-label="Close all windows"
            >
              <IconClose size={14} />
            </button>
          </>
        )}
        {hasAvatar ? (
          <img
            src={user.avatar}
            alt={user.name || "User"}
            title={user?.name || "User"}
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid var(--border, #e0e0e0)",
              flexShrink: 0,
            }}
          />
        ) : (
          <span
            title={user?.name || "User"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "var(--primary-bg, rgba(124, 58, 237, 0.10))",
              color: "var(--primary, #7c3aed)",
              fontSize: 9,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {initials}
          </span>
        )}
      </div>
      <TaskbarClock />
    </div>
  );
}

/** Live clock, styled after the Windows 11 taskbar clock: line 1 is the time
 * (with seconds), line 2 is the date. Clicking it opens a calendar popup
 * (reusing the input-calendar styles) anchored above the taskbar. The popup
 * is portaled to <body> with fixed positioning so the taskbar's overflow-x
 * (which forces overflow-y to auto) cannot clip it. */
function TaskbarClock() {
  const [now, setNow] = useState(() => new Date());
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(() => new Date());
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Close the calendar when clicking outside the clock block or the popup.
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      const inWrap = wrapRef.current && wrapRef.current.contains(e.target);
      const inPopup = popupRef.current && popupRef.current.contains(e.target);
      if (!inWrap && !inPopup) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const time = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
  const date = now.toLocaleDateString([], {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  const toggle = () => setOpen((prev) => !prev);

  // Anchor the popup to the clock button, above the taskbar.
  let popupStyle = null;
  if (open) {
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) {
      popupStyle = {
        position: "fixed",
        top: "auto",
        left: "auto",
        right: `${window.innerWidth - rect.right}px`,
        bottom: `${window.innerHeight - rect.top + 8}px`,
        zIndex: "var(--z-toast, 2000)",
      };
    }
  }

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        flexShrink: 0,
        paddingLeft: 12,
        marginLeft: 4,
        borderLeft: "1px solid var(--border, #e0e0e0)",
        whiteSpace: "nowrap",
      }}
    >
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        title={`${date} · ${time}`}
        aria-label="Open calendar"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 0,
          padding: "1px 6px",
          border: "none",
          borderRadius: 8,
          background: "transparent",
          color: "var(--text-primary, #111)",
          cursor: "pointer",
          fontFamily: "var(--font-sans)",
          lineHeight: 1.15,
          transition: "background 0.15s",
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
            color: "var(--text-primary, #111)",
            lineHeight: 1.15,
          }}
        >
          {time}
        </span>
        <span
          style={{
            fontSize: 10,
            color: "var(--text-muted, #888)",
            lineHeight: 1.15,
          }}
        >
          {date}
        </span>
      </button>
      {open &&
        popupStyle &&
        createPortal(
          <div
            ref={popupRef}
            className="input-calendar__popup"
            style={popupStyle}
          >
            <Calendar
              value={selected}
              onSelect={(dateStr) =>
                setSelected(new Date(`${dateStr}T00:00:00`))
              }
            />
          </div>,
          document.body,
        )}
    </div>
  );
}

// Taskbar hover preview — a live scaled thumbnail of the window's content,
// like OS taskbar window previews. Portaled to <body> with fixed positioning
// so the taskbar's overflow-x (which forces overflow-y to auto) cannot clip it.
function TaskbarPreview({ popup, anchor }) {
  if (!anchor) return null;
  const W = 320; // preview window width
  const left = Math.min(
    Math.max(anchor.left + anchor.width / 2 - W / 2, 8),
    window.innerWidth - W - 8,
  );
  return createPortal(
    <div
      style={{
        position: "fixed",
        left,
        bottom: 54,
        width: W,
        background: "var(--surface, #fff)",
        border: "1px solid var(--border, #e0e0e0)",
        borderRadius: 12,
        boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
        overflow: "hidden",
        zIndex: "var(--z-toast, 2000)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 10px",
          fontSize: 11,
          fontWeight: 600,
          color: "var(--text-primary, #111)",
          borderBottom: "1px solid var(--border, #e0e0e0)",
          background: "var(--surface-alt, #f1f3f5)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <span style={{ color: moduleShade(popup.menu.id), flexShrink: 0 }}>
          {popup.menu.menus_micon}
        </span>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          {popup.menu.menus_mname}
        </span>
      </div>
      {/* Live scaled-down content — 1600x920 at scale(0.2) → 320x184 */}
      <div
        style={{
          width: W,
          height: 184,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            width: 1600,
            height: 920,
            transform: "scale(0.2)",
            transformOrigin: "top left",
          }}
        >
          <Routes location={popup.menu.menus_mlink}>{getRoutes()}</Routes>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function TaskbarItem({ popup, onToggle, onClose }) {
  const [hovered, setHovered] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const wrapRef = useRef(null);
  const hidden = popup.hidden;

  const showPreview = () => {
    setHovered(true);
    const r = wrapRef.current?.getBoundingClientRect();
    if (r) setAnchor({ left: r.left, width: r.width });
  };

  const hidePreview = () => {
    setHovered(false);
    setAnchor(null);
  };

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        display: "inline-flex",
        flexShrink: 0,
      }}
      onMouseEnter={showPreview}
      onMouseLeave={hidePreview}
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
            color: moduleShade(popup.menu.id),
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
      {/* Live window preview on hover (OS taskbar style) */}
      <TaskbarPreview popup={popup} anchor={anchor} />
    </div>
  );
}
