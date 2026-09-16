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
import "./Taskbar.css";

/**
 * Taskbar strip pinned to the bottom of the viewport listing every open menu
 * window — like a window taskbar. Click a window to toggle it: a minimized one
 * is restored (and brought to the front), a visible one is minimized. Bulk
 * actions on the right: Close all, Show all (restore minimized), Hide all
 * (minimize everything). Collapses to the slim status strip while no windows
 * are open. Styling lives in Taskbar.css.
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
      className={`taskbar-root${hasPopups ? " taskbar-root--with-windows" : ""}`}
    >
      {/* Status strip — company + currency (classic desktop ERP left status).
          Clicking the company name opens the modules page, same as the
          topbar bSuite brand. */}
      <button
        type="button"
        className="taskbar__status-btn"
        onClick={() => navigate("/bsuite/modules")}
        title="Open modules"
        aria-label="Open modules"
      >
        <span className="taskbar__status-dot" />
        <strong className="taskbar__status-name">
          {business?.bsins_cname || "bSuite"}
        </strong>
      </button>

      {/* Pinned menu quick-launch shortcuts */}
      {pinnedMenus.length > 0 && (
        <span className="taskbar__pinned">
          {pinnedMenus.map((m) => (
            <button
              key={m.id}
              type="button"
              className="taskbar__pin-btn"
              onClick={() => navigate(m.menus_mlink)}
              title={m.menus_mname}
              aria-label={`Open ${m.menus_mname}`}
              style={{ color: moduleShade(m.id) }}
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

      <div className="taskbar-right">
        {hasPopups && (
          <>
            <FullscreenButton
              className="taskbar__icon-btn"
              activeClassName="taskbar__icon-btn--active"
              iconSize={14}
            />
            <button
              type="button"
              className="taskbar__icon-btn"
              onClick={showAllPopups}
              title="Restore all minimized windows"
              aria-label="Show all windows"
            >
              <IconEye size={14} />
            </button>
            <button
              type="button"
              className="taskbar__icon-btn"
              onClick={hideAllPopups}
              title="Minimize all open windows"
              aria-label="Hide all windows"
            >
              <IconChevronDown size={14} />
            </button>
            <button
              type="button"
              className="taskbar__icon-btn"
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
            className="taskbar__avatar"
            src={user.avatar}
            alt={user.name || "User"}
            title={user?.name || "User"}
          />
        ) : (
          <span
            className="taskbar__avatar taskbar__avatar--initials"
            title={user?.name || "User"}
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
    <div ref={wrapRef} className="taskbar-clock">
      <button
        ref={btnRef}
        type="button"
        className="taskbar-clock__btn"
        onClick={toggle}
        title={`${date} · ${time}`}
        aria-label="Open calendar"
      >
        <span className="taskbar-clock__time">{time}</span>
        <span className="taskbar-clock__date">{date}</span>
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
    <div className="taskbar-preview" style={{ left, width: W }}>
      <div className="taskbar-preview__header">
        <span
          className="taskbar-preview__icon"
          style={{ color: moduleShade(popup.menu.id) }}
        >
          {popup.menu.menus_micon}
        </span>
        <span className="taskbar-preview__title">
          {popup.menu.menus_mname}
        </span>
      </div>
      {/* Scaled snapshot of the real window body — scale window-width → 320px,
          cropped to the top 184px like a peeking thumbnail. */}
      <div className="taskbar-preview__body">
        {shot ? (
          <WindowBodyShot node={shot.node} width={shot.width} />
        ) : (
          <div className="taskbar-preview__empty">Preview unavailable</div>
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
    <div className="taskbar-preview__shot">
      <div
        ref={ref}
        className="taskbar-preview__shot-inner"
        style={{ width, transform: `scale(${scale})` }}
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
      <div ref={measureStripRef} className="taskbar-measure">
        {popups.map((p) => (
          <div key={`m-${p.key}`} className="taskbar-measure__item">
            <span>{p.menu.menus_micon}</span>
            <span className="taskbar-measure__label">
              {p.menu.menus_mname}
            </span>
          </div>
        ))}
      </div>

      {/* Visible items */}
      <span className="taskbar-items">
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
        <div ref={overflowRef} className="taskbar-overflow">
          <button
            ref={btnRef}
            type="button"
            className={`taskbar-overflow__btn${
              overflowOpen ? " taskbar-overflow__btn--open" : ""
            }`}
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
          >
            <IconMore size={16} />
            <span className="taskbar-overflow__badge">
              {overflowItems.length}
            </span>
          </button>
          {overflowOpen && btnAnchor && createPortal(
            <div
              ref={panelRef}
              className="taskbar-overflow-portal"
              style={{
                position: "fixed",
                bottom: `${window.innerHeight - btnAnchor.top + 6}px`,
                right: `${window.innerWidth - btnAnchor.left - btnAnchor.width}px`,
                zIndex: "var(--z-toast, 2000)",
              }}
            >
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
  // Hover styling (background + close badge) is pure CSS (:hover); only the
  // preview anchor needs JS, so it can line up with the button's live rect.
  const [anchor, setAnchor] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const wrapRef = useRef(null);
  const menuRef = useRef(null);
  const hidden = popup.hidden;

  const showPreview = () => {
    if (menuOpen) return;
    const r = wrapRef.current?.getBoundingClientRect();
    if (r) setAnchor({ left: r.left, width: r.width });
  };

  const hidePreview = () => setAnchor(null);

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
    setAnchor(null);
    const r = wrapRef.current?.getBoundingClientRect();
    if (r) setMenuAnchor({ left: r.left, width: r.width, top: r.top });
    setMenuOpen(true);
  };

  return (
    <div
      ref={wrapRef}
      className="taskbar-item"
      onMouseEnter={showPreview}
      onMouseLeave={hidePreview}
    >
      <button
        type="button"
        className={`taskbar-item__btn${
          hidden ? " taskbar-item__btn--hidden" : ""
        }`}
        onClick={onToggle}
        onContextMenu={openMenu}
        title={
          hidden
            ? `Open ${popup.menu.menus_mname}`
            : `Minimize ${popup.menu.menus_mname}`
        }
      >
        <span
          className="taskbar-item__icon"
          style={{ color: moduleShade(popup.menu.id) }}
        >
          {popup.menu.menus_micon}
        </span>
        <span className="taskbar-item__label">
          {popup.menu.menus_mname}
        </span>
      </button>
      {!menuOpen && (
        <button
          type="button"
          className="taskbar-item__close"
          onClick={onClose}
          aria-label={`Close ${popup.menu.menus_mname}`}
          title={`Close ${popup.menu.menus_mname}`}
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
  // Width matches --taskbar-menu width in Taskbar.css; kept here to clamp the
  // menu inside the viewport.
  const W = 200;
  const left = Math.min(Math.max(anchor.left, 8), window.innerWidth - W - 8);
  return createPortal(
    <div
      ref={innerRef}
      role="menu"
      className="taskbar-menu"
      style={{
        left,
        bottom: `${window.innerHeight - anchor.top + 8}px`,
      }}
    >
      <div className="taskbar-menu__header">
        <span
          className="taskbar-menu__icon"
          style={{ color: moduleShade(popup.menu.id) }}
        >
          {popup.menu.menus_micon}
        </span>
        <span className="taskbar-menu__title">
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
      <div className="taskbar-menu__divider" />
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
  return (
    <button
      type="button"
      role="menuitem"
      className={`taskbar-menu__item${
        danger ? " taskbar-menu__item--danger" : ""
      }`}
      onClick={onClick}
    >
      <span className="taskbar-menu__item-icon">{icon}</span>
      <span className="taskbar-menu__item-label">{label}</span>
    </button>
  );
}
