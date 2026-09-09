import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { IconClose, IconChevronDown, IconEye, IconPin, IconRestore, IconMore } from "@/icons";
import FullscreenButton from "@/components/FullscreenButton";
import Calendar from "@/components/Calendar";
import PopupList from "@/components/PopupList";
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
    togglePinMenu,
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
      className="taskbar-root"
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

      {/* Open windows (window-taskbar style) with overflow grouping */}
      {hasPopups && (
        <TaskbarOverflowGroup
          popups={popups}
          pinnedMenuIds={pinnedMenuIds}
          togglePinMenu={togglePinMenu}
          restorePopup={restorePopup}
          hidePopup={hidePopup}
          closePopup={closePopup}
          hideAllPopups={hideAllPopups}
          closeAllPopups={closeAllPopups}
        />
      )}

      <div
        className="taskbar-right"
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

// Taskbar hover preview — a scaled thumbnail of the window's REAL content,
// like OS taskbar window previews. The content is not re-mounted (which would
// fire every page's useEffects/API calls on hover); instead the already
// rendered DOM of the open window (layouts/Window.jsx tags its body with
// data-win-body) is cloned and scaled into the preview. Restoring / opening
// the window keeps running its normal effects on the real instance.
// Portaled to <body> with fixed positioning so the taskbar's overflow-x
// (which forces overflow-y to auto) cannot clip it.
function TaskbarPreview({ popup, anchor }) {
  const [shot, setShot] = useState(null); // { node, width } cloned window body

  // Take the snapshot only while hovered: clone the live window body DOM (no
  // React remount → no effects/API calls), sized with the window's real width.
  useEffect(() => {
    if (!anchor) {
      setShot(null);
      return;
    }
    const raf = requestAnimationFrame(() => {
      const src = document.querySelector(
        `[data-win-body="${popup.key}"]`,
      );
      if (!src) {
        setShot(null);
        return;
      }
      const w = Number(src.getAttribute("data-win-w")) || 860;
      setShot({ node: src.cloneNode(true), width: w });
    });
    return () => {
      cancelAnimationFrame(raf);
      setShot(null);
    };
  }, [anchor, popup.key]);

  const W = 320; // preview window width
  const left = anchor
    ? Math.min(
        Math.max(anchor.left + anchor.width / 2 - W / 2, 8),
        window.innerWidth - W - 8,
      )
    : 0;
  if (!anchor) return null;
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
      {/* Scaled snapshot of the real window body — scale window-width → 320px,
          cropped to the top 184px like a peeking thumbnail. */}
      <div
        style={{
          width: W,
          height: 184,
          overflow: "hidden",
          position: "relative",
          background: "var(--surface-alt, #f1f3f5)",
        }}
      >
        {shot ? (
          <WindowBodyShot node={shot.node} width={shot.width} />
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              color: "var(--text-muted, #888)",
            }}
          >
            Preview unavailable
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

/** Render a cloned DOM node scaled down: the node keeps the width it had in
 * the live window and is shrunk by transform so the final box is 320px wide.
 * No React is involved, so no effects or data fetching fire for the preview.
 */
function WindowBodyShot({ node, width }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = "";
    el.appendChild(node);
  }, [node]);
  const scale = width > 0 ? 320 / width : 1;
  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <div
        ref={ref}
        style={{
          width,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      />
    </div>
  );
}

/**
 * Measures the right side of the taskbar (action buttons + clock) and the
 * available width, then splits popup items into visible (shown inline) and
 * overflow (hidden in a dropdown). When the visible items + overflow button
 * still exceed the available width, more items are pushed into overflow.
 */
function TaskbarOverflowGroup({
  popups,
  pinnedMenuIds,
  togglePinMenu,
  restorePopup,
  hidePopup,
  closePopup,
  hideAllPopups,
  closeAllPopups,
}) {
  const [overflowOpen, setOverflowOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(popups.length);
  const [btnAnchor, setBtnAnchor] = useState(null);
  const overflowRef = useRef(null);
  const btnRef = useRef(null);
  const panelRef = useRef(null);
  const measureStripRef = useRef(null);

  // Measure available space and determine how many items fit.
  // Uses a hidden measurement strip rendered in the same flex row to get
  // accurate widths for each popup item, and queries the actual taskbar
  // right-side DOM for the right width.
  const recalc = useCallback(() => {
    const taskbar = document.querySelector('.taskbar-root');
    const right = document.querySelector('.taskbar-right');
    const strip = measureStripRef.current;
    if (!taskbar || !right || !strip) return;

    const taskbarWidth = taskbar.offsetWidth;
    const rightWidth = right.offsetWidth;
    // Left side: status button (~90px) + pinned section (~40px max) + borders
    const leftWidth = 170;
    const available = taskbarWidth - rightWidth - leftWidth;

    // Measure each popup item width from the hidden strip
    const widths = Array.from(strip.children).map((el) => el.offsetWidth + 6);
    const overflowBtnWidth = 36; // approximate overflow button width

    // Greedily fit items from left to right
    let count = 0;
    let used = 0;
    for (let i = 0; i < widths.length; i++) {
      const needed = used + widths[i] + (i < widths.length - 1 ? overflowBtnWidth : 0);
      if (needed <= available) {
        count++;
        used += widths[i];
      } else {
        break;
      }
    }
    setVisibleCount(Math.max(count, 0));
  }, [popups.length]);

  useEffect(() => {
    // Defer measurement to after layout
    const raf = requestAnimationFrame(() => {
      recalc();
      const tid = setTimeout(recalc, 150);
      return () => clearTimeout(tid);
    });
    return () => cancelAnimationFrame(raf);
  }, [popups.length, recalc]);

  // ResizeObserver on the taskbar root to recalc on window resize
  useEffect(() => {
    const el = document.querySelector('.taskbar-root');
    if (!el) return;
    const ro = new ResizeObserver(recalc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [recalc]);

  const overflowItems = popups.slice(visibleCount);
  const hasOverflow = overflowItems.length > 0;

  // Close overflow on outside click (panel is portaled, so check both refs)
  useEffect(() => {
    if (!overflowOpen) return;
    const onDown = (e) => {
      const inTrigger = overflowRef.current && overflowRef.current.contains(e.target);
      const inPanel = panelRef.current && panelRef.current.contains(e.target);
      if (!inTrigger && !inPanel) {
        setOverflowOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [overflowOpen]);

  return (
    <>
      {/* Hidden measurement strip — renders all items invisibly in the same
          flex row so their widths match the real layout. */}
      <div
        ref={measureStripRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
          display: "inline-flex",
          gap: 6,
          zIndex: -1,
        }}
      >
        {popups.map((p) => (
          <div
            key={`m-${p.key}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              maxWidth: 220,
              padding: "4px 8px",
              borderRadius: 8,
              border: "1px solid var(--border, #e0e0e0)",
              fontSize: 13,
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            <span>{p.menu.menus_micon}</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {p.menu.menus_mname}
            </span>
          </div>
        ))}
      </div>

      {/* Visible items */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          paddingLeft: 8,
          marginLeft: 4,
          borderLeft: "1px solid var(--border, #e0e0e0)",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        {popups.slice(0, visibleCount).map((p) => (
          <TaskbarItem
            key={p.key}
            popup={p}
            isPinned={pinnedMenuIds.includes(p.menu.id)}
            onTogglePin={() => togglePinMenu(p.menu.id)}
            onToggle={() =>
              p.hidden ? restorePopup(p.key) : hidePopup(p.key)
            }
            onClose={() => closePopup(p.key)}
          />
        ))}
      </span>
      {/* Overflow dropdown button + panel (portaled to body to escape overflow) */}
      {hasOverflow && (
        <div ref={overflowRef} style={{ position: "relative", flexShrink: 0 }}>
          <button
            ref={btnRef}
            type="button"
            onClick={() => {
              if (!overflowOpen) {
                const r = btnRef.current?.getBoundingClientRect();
                if (r) setBtnAnchor({ left: r.left, top: r.top, width: r.width });
              }
              setOverflowOpen((o) => !o);
            }}
            title={`${overflowItems.length} more open window${overflowItems.length > 1 ? "s" : ""}`}
            aria-label="Show more open windows"
            aria-expanded={overflowOpen}
            style={{
              position: "relative",
              width: 36,
              height: 36,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              borderRadius: 8,
              border: "1px solid var(--border, #e0e0e0)",
              background: overflowOpen
                ? "var(--primary, #7c3aed)"
                : "var(--surface, #fff)",
              color: overflowOpen
                ? "var(--primary-on, #fff)"
                : "var(--text-muted, #888)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <IconMore size={16} />
            <span
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                minWidth: 16,
                height: 16,
                padding: "0 4px",
                borderRadius: 8,
                background: "var(--primary, #7c3aed)",
                color: "var(--primary-on, #fff)",
                fontSize: 10,
                fontWeight: 700,
                lineHeight: "16px",
                textAlign: "center",
              }}
            >
              {overflowItems.length}
            </span>
          </button>
          {overflowOpen && btnAnchor && createPortal(
            <div ref={panelRef} style={{
              position: "fixed",
              bottom: `${window.innerHeight - btnAnchor.top + 6}px`,
              right: `${window.innerWidth - btnAnchor.left - btnAnchor.width}px`,
              zIndex: "var(--z-toast, 2000)",
            }}>
              <PopupList
                popups={overflowItems}
                open
                title="More Windows"
                panelClassName="popup-list__panel--taskbar"
                onToggle={() => setOverflowOpen(false)}
                onRestore={(key) => {
                  restorePopup(key);
                  setOverflowOpen(false);
                }}
                onHide={hidePopup}
                onClose={closePopup}
                onHideAll={hideAllPopups}
                onCloseAll={closeAllPopups}
              />
            </div>,
            document.body,
          )}
        </div>
      )}
    </>
  );
}

function TaskbarItem({ popup, onToggle, onClose, isPinned, onTogglePin }) {
  const [hovered, setHovered] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const wrapRef = useRef(null);
  const menuRef = useRef(null);
  const hidden = popup.hidden;

  const showPreview = () => {
    if (menuOpen) return;
    setHovered(true);
    const r = wrapRef.current?.getBoundingClientRect();
    if (r) setAnchor({ left: r.left, width: r.width });
  };

  const hidePreview = () => {
    setHovered(false);
    setAnchor(null);
  };

  // Close the right-click menu on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Right-click a window button for its taskbar menu (close/minimize/pin).
  const openMenu = (e) => {
    e.preventDefault();
    setHovered(false);
    const r = wrapRef.current?.getBoundingClientRect();
    if (r) setMenuAnchor({ left: r.left, width: r.width, top: r.top });
    setMenuOpen(true);
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
        onContextMenu={openMenu}
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
      {!menuOpen && hovered && (
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
      {/* Live window preview on hover (OS taskbar style); hidden while the
          context menu is open so they don't overlap. */}
      {!menuOpen && <TaskbarPreview popup={popup} anchor={anchor} />}
      {/* Right-click taskbar menu: restore/minimize, pin/unpin, close. */}
      {menuOpen && menuAnchor && (
        <TaskbarContextMenu
          popup={popup}
          hidden={hidden}
          anchor={menuAnchor}
          isPinned={isPinned}
          onToggle={onToggle}
          onClose={onClose}
          onTogglePin={onTogglePin}
          onDone={() => setMenuOpen(false)}
          innerRef={menuRef}
        />
      )}
    </div>
  );
}

/**
 * Right-click context menu for a taskbar window button: restore/minimize,
 * pin/unpin to the taskbar quick-launch, and close. Portaled to <body> (fixed
 * positioning) so the taskbar's overflow-x cannot clip it; anchored just above
 * the button, like the clock's calendar popup.
 */
function TaskbarContextMenu({
  popup,
  hidden,
  anchor,
  isPinned,
  onToggle,
  onClose,
  onTogglePin,
  onDone,
  innerRef,
}) {
  const W = 200;
  const left = Math.min(Math.max(anchor.left, 8), window.innerWidth - W - 8);
  return createPortal(
    <div
      ref={innerRef}
      role="menu"
      style={{
        position: "fixed",
        left,
        bottom: `${window.innerHeight - anchor.top + 8}px`,
        width: W,
        padding: 4,
        background: "var(--surface, #fff)",
        border: "1px solid var(--border, #e0e0e0)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg)",
        animation: "fade-in-down var(--transition-fast)",
        fontFamily: "var(--font-sans)",
        fontSize: 12,
        color: "var(--text-primary, #111)",
        userSelect: "none",
        zIndex: "var(--z-toast, 2000)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 10px 8px",
          borderBottom: "1px solid var(--border, #e0e0e0)",
          marginBottom: 4,
          whiteSpace: "nowrap",
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
            fontWeight: 600,
            color: "var(--text-primary, #111)",
          }}
        >
          {popup.menu.menus_mname}
        </span>
      </div>
      <TaskbarMenuItem
        icon={
          hidden ? <IconRestore size={14} /> : <IconChevronDown size={14} />
        }
        label={hidden ? "Restore" : "Minimize"}
        onClick={() => {
          onToggle();
          onDone();
        }}
      />
      <TaskbarMenuItem
        icon={<IconPin size={14} />}
        label={isPinned ? "Unpin from taskbar" : "Pin to taskbar"}
        onClick={() => {
          onTogglePin();
          onDone();
        }}
      />
      <div
        style={{
          height: 1,
          background: "var(--border, #e0e0e0)",
          margin: "4px 6px",
        }}
      />
      <TaskbarMenuItem
        icon={<IconClose size={14} />}
        label="Close window"
        danger
        onClick={() => {
          onClose();
          onDone();
        }}
      />
    </div>,
    document.body,
  );
}

/** Single action row inside the taskbar context menu. */
function TaskbarMenuItem({ icon, label, onClick, danger }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      role="menuitem"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        gap: 8,
        padding: "7px 10px",
        fontSize: 12,
        borderRadius: 6,
        border: "none",
        background: hov
          ? danger
            ? "var(--danger-bg, rgba(239,68,68,0.12))"
            : "var(--surface-alt, #f1f3f5)"
          : "transparent",
        color:
          hov && danger ? "var(--danger, #ef4444)" : "var(--text-primary, #111)",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          flexShrink: 0,
          color:
            hov && danger
              ? "var(--danger, #ef4444)"
              : "var(--text-secondary, #4b5563)",
        }}
      >
        {icon}
      </span>
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </button>
  );
}
