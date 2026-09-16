import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { Routes } from "react-router-dom";
import Modal, { ModalBody, ModalHeader } from "@/components/Modal";
import {
  IconClose,
  IconChevronDown,
  IconExpand,
  IconRestore,
  IconColumns,
  IconCheck,
} from "@/icons";
import getRoutes from "@/routes";
import { useApp } from "@/context/AppContext";
import { moduleShade } from "@/utils/theme";
import { PREFERENCE_KEYS, readStored, writeStored } from "@/utils/storage";
import "./Window.css";

const POPUP_MIN_WIDTH = 480;
const POPUP_MIN_HEIGHT = 200;
const POPUP_DEFAULT_WIDTH = 860;

// Preset sizes as a percentage of the viewport width.
// "Default" uses the window's standard width; "100%" is fullscreen.
const POPUP_SIZES = [
  { id: "default", label: "Default" },
  { id: "20", label: "20%" },
  { id: "40", label: "40%" },
  { id: "60", label: "60%" },
  { id: "80", label: "80%" },
  { id: "100", label: "100%" },
];

// ── Window geometry persistence ──────────────────────────────────────────
// Each user's window position/size is stored per menu id, so reopening a menu
// restores exactly where the user left it (minimized windows restored from
// localStorage keep their layout too). Stored as
// { [userId]: { [menuId]: { x, y, width, height } } }.
const readGeometryMap = () => {
  const parsed = readStored(PREFERENCE_KEYS.windowGeometry, {});
  return parsed && typeof parsed === "object" ? parsed : {};
};

const loadGeometry = (userId, menuId) => {
  if (!userId || !menuId) return null;
  const g = readGeometryMap()[userId]?.[menuId];
  if (!g) return null;
  return {
    x: Number.isFinite(g.x) ? g.x : null,
    y: Number.isFinite(g.y) ? g.y : null,
    width: Number.isFinite(g.width) ? g.width : null,
    height: Number.isFinite(g.height) ? g.height : null,
  };
};

const saveGeometry = (userId, menuId, geom) => {
  if (!userId || !menuId) return;
  const map = readGeometryMap();
  map[userId] = { ...map[userId], [menuId]: geom };
  writeStored(PREFERENCE_KEYS.windowGeometry, map);
};

// ── Cascade placement for new windows ────────────────────────────────────
// Each new window opens 26px down-right of the previous one so stacked windows
// fan out diagonally; the offset wraps once it would push a window off screen.
const CASCADE_STEP = 26;
const cascadeOffset = (i) => {
  const maxX = Math.max(
    CASCADE_STEP,
    Math.floor((window.innerWidth - POPUP_DEFAULT_WIDTH) / 2) - 40,
  );
  const maxY = Math.max(
    CASCADE_STEP,
    Math.floor((window.innerHeight - 300) / 2) - 40,
  );
  return {
    x: (i * CASCADE_STEP) % (maxX + CASCADE_STEP),
    y: (i * CASCADE_STEP) % (maxY + CASCADE_STEP),
  };
};

// Keep a restored position fully on screen. The overlay centers the modal and
// translates it by pos, so clamp pos so the window's edges stay inside the
// viewport with a small margin (in case the screen is smaller than when saved).
const clampRestoredPos = (x, y, w) => {
  const maxX = Math.max(0, (window.innerWidth - w) / 2 - 10);
  const maxY = Math.max(0, (window.innerHeight - 260) / 2 - 10);
  return {
    x: Math.min(Math.max(x, -maxX), maxX),
    y: Math.min(Math.max(y, -maxY), maxY),
  };
};

// How close (px) a dragged window must be to a screen edge to trigger a snap.
const SNAP_THRESHOLD = 12;

// How close (px) a dragged window's edge must be to another window's facing
// edge to snap to it (window-to-window snapping).
const WINDOW_SNAP_THRESHOLD = 10;

/**
 * Find window-to-window snap targets while dragging: align the dragged
 * window's facing edges with another open window's edges (dragged-left against
 * other-right, dragged-right against other-left, and vertically the same).
 * Returns { x, y } — the desired screen-space top-left for the dragged
 * window, null per axis when nothing is near — or null when no edge matches.
 */
const detectWindowSnap = (left, top, w, h, others) => {
  const right = left + w;
  const bottom = top + h;
  let sx = null;
  let sxDist = Infinity;
  let sy = null;
  let syDist = Infinity;
  for (const o of others) {
    // Horizontal facing edges
    const dL = Math.abs(left - o.right);
    if (dL <= WINDOW_SNAP_THRESHOLD && dL < sxDist) {
      sx = o.right;
      sxDist = dL;
    }
    const dR = Math.abs(right - o.left);
    if (dR <= WINDOW_SNAP_THRESHOLD && dR < sxDist) {
      sx = o.left - w;
      sxDist = dR;
    }
    // Vertical facing edges
    const dT = Math.abs(top - o.bottom);
    if (dT <= WINDOW_SNAP_THRESHOLD && dT < syDist) {
      sy = o.bottom;
      syDist = dT;
    }
    const dB = Math.abs(bottom - o.top);
    if (dB <= WINDOW_SNAP_THRESHOLD && dB < syDist) {
      sy = o.top - h;
      syDist = dB;
    }
  }
  return sx !== null || sy !== null ? { x: sx, y: sy } : null;
};

/**
 * Renders every open menu window as a non-blocking floating window (no
 * dimming overlay, page stays clickable and scrollable behind them). Must be
 * placed OUTSIDE the app's main <Routes> (see App.jsx) so each window can
 * render its own <Routes location={menuLink}> without the parent-match
 * pathname restriction. Drag the header to move a window (snapping to screen
 * edges and to other open windows); drag the right edge, bottom edge or
 * bottom-right corner to resize (or use the size buttons); close via the X
 * button or Escape.
 */
export default function Windows() {
  const { popups, closePopup, bringPopupToFront, hidePopup, user } = useApp();

  // Live screen rects of every open window, shared through a ref so a dragged
  // window can snap to its siblings without re-rendering them. Each window
  // reports its own rect via reportRect (or removes it when hidden/closed).
  const rectsRef = useRef({});
  const reportRect = useCallback((key, rect) => {
    if (rect) rectsRef.current[key] = rect;
    else delete rectsRef.current[key];
  }, []);
  const getRects = useCallback(() => rectsRef.current, []);

  return popups.map((p, i) => (
    <WindowItem
      key={p.key}
      winKey={p.key}
      menu={p.menu}
      hidden={p.hidden}
      active={i === popups.length - 1}
      userId={user?.id}
      index={i}
      reportRect={reportRect}
      getRects={getRects}
      onClose={() => closePopup(p.key)}
      onHide={() => hidePopup(p.key)}
      onActivate={() => bringPopupToFront(p.key)}
    />
  ));
}

function WindowItem({
  menu,
  onClose,
  onHide,
  onActivate,
  hidden,
  index,
  active,
  userId,
  winKey,
  reportRect,
  getRects,
}) {
  // Restore the user's saved geometry for this menu when reopening it;
  // otherwise cascade the new window from its stack position.
  const savedGeom = useMemo(() => loadGeometry(userId, menu.id), [userId, menu.id]);
  const [pos, setPos] = useState(() =>
    savedGeom && savedGeom.x != null && savedGeom.y != null
      ? clampRestoredPos(
          savedGeom.x,
          savedGeom.y,
          savedGeom.width ?? POPUP_DEFAULT_WIDTH,
        )
      : cascadeOffset(index),
  );
  const [width, setWidth] = useState(() => {
    if (savedGeom && savedGeom.width != null) {
      return Math.min(
        Math.max(savedGeom.width, POPUP_MIN_WIDTH),
        Math.max(POPUP_MIN_WIDTH, window.innerWidth - 48),
      );
    }
    return Math.min(
      POPUP_DEFAULT_WIDTH,
      Math.max(POPUP_MIN_WIDTH, window.innerWidth - 48),
    );
  });
  const [height, setHeight] = useState(() => {
    if (savedGeom && savedGeom.height != null) {
      return Math.min(
        Math.max(savedGeom.height, POPUP_MIN_HEIGHT),
        window.innerHeight - 48,
      );
    }
    return null;
  });
  // A restored custom width means the size dropdown has no preset selected.
  const [size, setSize] = useState(() =>
    savedGeom?.width != null ? null : "default",
  );
  const [fullscreen, setFullscreen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  // Active Aero-snap zone while dragging: "maximize" | "left" | "right" | null.
  const [snapTarget, setSnapTarget] = useState(null);
  // Active window-to-window snap target: { x, y } screen coords or null.
  const [winSnapTarget, setWinSnapTarget] = useState(null);
  const dragRef = useRef(null);
  const modalRef = useRef(null);
  const sizeRef = useRef(null);

  // Ctrl+M minimizes the active (topmost) window.
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "m") {
        e.preventDefault();
        onHide();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, onHide]);

  // Close the size dropdown when clicking outside it.
  useEffect(() => {
    if (!sizeOpen) return;
    const onDown = (e) => {
      if (sizeRef.current && !sizeRef.current.contains(e.target)) {
        setSizeOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [sizeOpen]);

  // Report this window's live screen rect so other windows can snap to it.
  // Hidden and fullscreen windows are not valid snap targets; the entry is
  // removed on unmount. Runs whenever the window moves or resizes.
  useEffect(() => {
    if (hidden || fullscreen) {
      reportRect(winKey, null);
      return;
    }
    const el = modalRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    reportRect(winKey, {
      left: r.left,
      top: r.top,
      right: r.right,
      bottom: r.bottom,
    });
    return () => reportRect(winKey, null);
  }, [winKey, hidden, fullscreen, pos, width, height, reportRect]);

  // Size clamps keep the window's edges on screen. The overlay is a flex
  // container that centers the modal and translates it by pos, so the modal
  // center sits at (innerWidth/2 + pos.x, innerHeight/2 + pos.y). A size is
  // only allowed when both edges stay inside the viewport with a 24px margin
  // (matching the overlay padding). The Math.max(min, …) floor guarantees the
  // clamp never inverts when the window sits near an edge.
  const clampWidth = (w) => {
    const maxW = window.innerWidth - 2 * Math.abs(pos.x) - 48;
    return Math.min(
      Math.max(w, POPUP_MIN_WIDTH),
      Math.max(POPUP_MIN_WIDTH, maxW),
    );
  };
  const clampHeight = (h) => {
    const maxH = window.innerHeight - 2 * Math.abs(pos.y) - 48;
    return Math.min(
      Math.max(h, POPUP_MIN_HEIGHT),
      Math.max(POPUP_MIN_HEIGHT, maxH),
    );
  };

  const selectSize = (id) => {
    if (!POPUP_SIZES.some((s) => s.id === id)) return;
    setSize(id);
    const isFull = id === "100";
    setFullscreen(isFull);
    if (!isFull) {
      const pct = id === "default" ? null : parseInt(id, 10) / 100;
      const w = clampWidth(
        pct ? Math.round(window.innerWidth * pct) : POPUP_DEFAULT_WIDTH,
      );
      setWidth(w);
      saveGeometry(userId, menu.id, { x: pos.x, y: pos.y, width: w, height });
    }
  };

  const attachDrag = () => {
    const onMove = (ev) => {
      const d = dragRef.current;
      if (!d) return;
      const dx = ev.clientX - d.startX;
      const dy = ev.clientY - d.startY;
      if (d.mode === "move") {
        // The overlay is a flex container that centers the modal, so pos is
        // an offset relative to the centered position — not an absolute
        // screen coordinate. Clamp in real screen space using the window's
        // bounding rect captured at drag start, then convert back to pos.
        const r = d.rect;
        // Keep the window fully on screen horizontally (10px margin) so it can
        // be dragged all the way to the left or right edge.
        const left = Math.min(
          Math.max(r.left + dx, 10),
          window.innerWidth - r.width - 10,
        );
        // Keep the header (and its close button) reachable vertically: never
        // above the top edge, and never so far down the header goes below the
        // viewport. No bottom boundary for the window body — tall windows may
        // extend below the screen.
        const top = Math.min(
          Math.max(r.top + dy, 10),
          window.innerHeight - r.headerH - 10,
        );
        const freePos = {
          x: d.startPos.x + (left - r.left),
          y: d.startPos.y + (top - r.top),
        };

        // Aero-snap: drag to the top edge to maximize, or to the left/right
        // edges to snap into a half-screen layout. The live snap target is
        // previewed while dragging and applied on release.
        const snap =
          top <= SNAP_THRESHOLD
            ? "maximize"
            : left <= SNAP_THRESHOLD
              ? "left"
              : left + r.width >= window.innerWidth - SNAP_THRESHOLD
                ? "right"
                : null;
        d.snap = snap;
        setSnapTarget(snap);

        // Window-to-window snapping: when no screen zone applies, align the
        // dragged window's facing edges with another open window's edges. The
        // position locks live onto the target while it is held.
        let winSnap = null;
        if (!snap) {
          const others = Object.entries(getRects())
            .filter(([k]) => k !== winKey)
            .map(([, v]) => v);
          winSnap = detectWindowSnap(
            left,
            top,
            r.width,
            r.height || 200,
            others,
          );
        }
        d.winSnap = winSnap;
        setWinSnapTarget(winSnap);

        let nextPos = freePos;
        if (winSnap) {
          const sx =
            winSnap.x != null
              ? Math.min(
                  Math.max(winSnap.x, 10),
                  window.innerWidth - r.width - 10,
                )
              : left;
          const sy =
            winSnap.y != null
              ? Math.min(
                  Math.max(winSnap.y, 10),
                  window.innerHeight - r.headerH - 10,
                )
              : top;
          nextPos = {
            x: sx - (window.innerWidth - r.width) / 2,
            y: sy - (window.innerHeight - (r.height || 200)) / 2,
          };
        }
        d.finalPos = nextPos;
        setPos(nextPos);
      } else {
        if (d.mode === "resize-w" || d.mode === "resize-wh") {
          const w = clampWidth(d.startW + dx);
          d.finalW = w;
          setWidth(w);
        }
        if (d.mode === "resize-h" || d.mode === "resize-wh") {
          const h = clampHeight(d.startH + dy);
          d.finalH = h;
          setHeight(h);
        }
      }
    };
    const onUp = () => {
      const d = dragRef.current;
      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      setSnapTarget(null);
      setWinSnapTarget(null);
      if (!d) return;
      if (d.mode === "move") {
        if (d.snap) {
          // Apply the snap; applySnap persists the resulting geometry.
          applySnap(d.snap, d.finalPos?.y ?? pos.y);
        } else {
          // Persist the final dragged position for this user + menu.
          saveGeometry(userId, menu.id, {
            x: d.finalPos?.x ?? pos.x,
            y: d.finalPos?.y ?? pos.y,
            width,
            height,
          });
        }
      } else {
        // Persist the final resized size (and current position).
        saveGeometry(userId, menu.id, {
          x: pos.x,
          y: pos.y,
          width: d.finalW ?? width,
          height: d.finalH ?? height,
        });
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    document.body.style.cursor = dragRef.current?.cursor || "";
    document.body.style.userSelect = "none";
  };

  // Drag the header to move the window around the screen.
  const startMove = (e) => {
    if (fullscreen) return;
    if (e.target.closest("button")) return; // keep size/close buttons clickable
    e.preventDefault();
    const rect = modalRef.current?.getBoundingClientRect();
    dragRef.current = {
      mode: "move",
      startX: e.clientX,
      startY: e.clientY,
      startPos: pos,
      rect: {
        left: rect?.left ?? pos.x,
        top: rect?.top ?? pos.y,
        width: rect?.width ?? width,
        height: rect?.height ?? 0,
        headerH:
          modalRef.current?.querySelector(".modal__header")?.offsetHeight ?? 64,
      },
      cursor: "grabbing",
    };
    attachDrag();
  };

  // Drag the right edge to resize the width.
  const startWidthResize = (e) => {
    e.preventDefault();
    setFullscreen(false);
    setSize(null);
    dragRef.current = {
      mode: "resize-w",
      startX: e.clientX,
      startY: e.clientY,
      startW: width,
      cursor: "col-resize",
    };
    attachDrag();
  };

  // Drag the bottom edge to resize the height.
  const startHeightResize = (e) => {
    e.preventDefault();
    setFullscreen(false);
    setSize(null);
    const startH =
      height ??
      modalRef.current?.offsetHeight ??
      Math.round(window.innerHeight * 0.6);
    dragRef.current = {
      mode: "resize-h",
      startX: e.clientX,
      startY: e.clientY,
      startH,
      cursor: "row-resize",
    };
    attachDrag();
  };

  // Drag the bottom-right corner to resize width and height together.
  const startCornerResize = (e) => {
    e.preventDefault();
    setFullscreen(false);
    setSize(null);
    const startH =
      height ??
      modalRef.current?.offsetHeight ??
      Math.round(window.innerHeight * 0.6);
    dragRef.current = {
      mode: "resize-wh",
      startX: e.clientX,
      startY: e.clientY,
      startW: width,
      startH,
      cursor: "nwse-resize",
    };
    attachDrag();
  };

  const resetSize = () => {
    setFullscreen(false);
    setSize("default");
    const w = clampWidth(POPUP_DEFAULT_WIDTH);
    setWidth(w);
    setHeight(null);
    saveGeometry(userId, menu.id, { x: pos.x, y: pos.y, width: w, height: null });
  };

  // Apply an Aero-snap target reached while dragging: "maximize" reuses the
  // existing fullscreen state; "left"/"right" resize to half the viewport and
  // flush the window against that edge, keeping the vertical position.
  const applySnap = (snap, y) => {
    if (snap === "maximize") {
      selectSize("100");
      return;
    }
    const half = Math.max(POPUP_MIN_WIDTH, Math.round(window.innerWidth / 2));
    const x =
      snap === "left"
        ? -(window.innerWidth - half) / 2
        : (window.innerWidth - half) / 2;
    setFullscreen(false);
    setSize(null);
    setWidth(half);
    setPos({ x, y });
    saveGeometry(userId, menu.id, { x, y, width: half, height });
  };

  return (
    <>
      {/* Snap previews, portaled to <body> so the modal's transform can't
          offset them: the Aero-snap zone outline, plus thin edge highlights
          for window-to-window snaps. */}
      {(snapTarget || winSnapTarget) &&
        createPortal(
          <>
            {snapTarget && (
              // Half the viewport (never below the window minimum) so a
              // left/right snap lands side by side; maximize needs no width.
              <div
                className={`win-snap-zone win-snap-zone--${snapTarget}`}
                style={
                  snapTarget === "maximize"
                    ? undefined
                    : {
                        width: Math.max(
                          POPUP_MIN_WIDTH,
                          Math.round(window.innerWidth / 2),
                        ),
                      }
                }
              />
            )}
            {winSnapTarget?.x != null && (
              <div
                className="win-snap-guide win-snap-guide--v"
                style={{ left: winSnapTarget.x - 1.5 }}
              />
            )}
            {winSnapTarget?.y != null && (
              <div
                className="win-snap-guide win-snap-guide--h"
                style={{ top: winSnapTarget.y - 1.5 }}
              />
            )}
          </>,
          document.body,
        )}
      <Modal
        open
        size={fullscreen ? "full" : "xl"}
        onClose={onClose}
        onMouseDown={onActivate}
        closeOnBackdrop={false}
        blockScroll={false}
        modalRef={modalRef}
        // The frame's chrome (transparent, click-through overlay; relative,
        // auto-pointer frame) lives in Window.css — only the live size stays
        // inline.
        overlayClassName={`win-overlay${hidden ? " win-overlay--hidden" : ""}${
          fullscreen ? " win-overlay--fullscreen" : ""
        }`}
        className={`win-modal${fullscreen ? " win-modal--fullscreen" : ""}`}
        modalStyle={{
          ...(fullscreen ? {} : { width: `${width}px` }),
          ...(height != null ? { height: `${height}px`, maxHeight: "none" } : {}),
        }}
        style={{
          transform: fullscreen
            ? undefined
            : `translate(${pos.x}px, ${pos.y}px)`,
        }}
      >
      <ModalHeader
        className={`modal__header--window${
          fullscreen ? " modal__header--window--fullscreen" : ""
        }`}
        onMouseDown={startMove}
        onDoubleClick={(e) => {
          // Double-click the title bar to toggle maximize (D12).
          if (e.target.closest("button")) return;
          if (fullscreen) resetSize();
          else selectSize("100");
        }}
      >
        {/* Compact menu chip — size and glyph live in Window.css
            (.modal__header--window); only the module tint is dynamic. */}
        <div
          className="modal__header-icon"
          style={{ background: moduleShade(menu.id) }}
        >
          {menu.menus_micon}
        </div>
        <div className="modal__title-wrap">
          <div className="modal__title-text">
            <h3 className="modal__title">{menu.menus_mname}</h3>
            <p className="modal__subtitle">{menu.menus_mdesc}</p>
          </div>
        </div>
        <div ref={sizeRef} className="win-actions">
          {/* Window size dropdown */}
          <div className="win-size">
            <BarButton
              onClick={() => setSizeOpen((v) => !v)}
              title="Window size"
              aria-label="Window size"
              aria-expanded={sizeOpen}
            >
              <IconColumns size={16} />
            </BarButton>
            {sizeOpen && (
              <div
                className="win-size__menu"
                onMouseDown={(e) => e.stopPropagation()}
              >
                {POPUP_SIZES.map((s) => {
                  const activeSize = s.id === size;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className={`win-size__option${
                        activeSize ? " win-size__option--active" : ""
                      }`}
                      onClick={() => {
                        selectSize(s.id);
                        setSizeOpen(false);
                      }}
                    >
                      <span>{s.label}</span>
                      {activeSize && <IconCheck size={12} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {/* Maximize / restore toggle */}
          <BarButton
            onClick={() => (fullscreen ? resetSize() : selectSize("100"))}
            title={
              fullscreen
                ? "Restore (or double-click title bar)"
                : "Maximize (or double-click title bar)"
            }
            aria-label={fullscreen ? "Restore window" : "Maximize window"}
            aria-pressed={fullscreen}
          >
            {fullscreen ? <IconRestore size={16} /> : <IconExpand size={16} />}
          </BarButton>
          <BarButton
            onClick={onHide}
            title="Minimize (Ctrl+M)"
            aria-label="Minimize window"
          >
            <IconChevronDown size={16} />
          </BarButton>
          <BarButton onClick={onClose} title="Close" aria-label="Close window">
            <IconClose size={16} />
          </BarButton>
        </div>
      </ModalHeader>
      {/* data-win-body / data-win-w let the taskbar hover preview snapshot
          this already-mounted window's content (no second page mount = no
          duplicate API calls) and know its live width to scale it. */}
      <ModalBody data-win-body={winKey} data-win-w={Math.round(fullscreen ? window.innerWidth : width)}>
        <Routes location={menu.menus_mlink}>{getRoutes()}</Routes>
      </ModalBody>
      {/* Resize handles: right edge (width), bottom edge (height), corner (both) */}
      <div
        onMouseDown={startWidthResize}
        onDoubleClick={resetSize}
        title="Drag to resize width · double-click to reset"
        aria-label="Resize width"
        className={`win-resize win-resize--w${fullscreen ? " win-resize--off" : ""}`}
      />
      <div
        onMouseDown={startHeightResize}
        title="Drag to resize height"
        aria-label="Resize height"
        className={`win-resize win-resize--h${fullscreen ? " win-resize--off" : ""}`}
      />
      <div
        onMouseDown={startCornerResize}
        onDoubleClick={resetSize}
        title="Drag to resize width and height · double-click to reset"
        aria-label="Resize width and height"
        className={`win-resize win-resize--corner${fullscreen ? " win-resize--off" : ""}`}
      />
      </Modal>
    </>
  );
}

/** Small icon button for the window title bar. Styling — including the hover
 * state — lives in Window.css (.win-bar-btn). */
function BarButton({ children, ...rest }) {
  return (
    <button type="button" className="win-bar-btn" {...rest}>
      {children}
    </button>
  );
}
