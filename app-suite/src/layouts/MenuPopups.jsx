import { useRef, useState } from "react";
import { Routes } from "react-router-dom";
import Modal, { ModalBody, ModalHeader, ModalTitle } from "@/components/Modal";
import { IconClose, IconChevronDown } from "@/icons";
import getRoutes from "@/routes";
import { useApp } from "@/context/AppContext";

const POPUP_MIN_WIDTH = 480;
const POPUP_MIN_HEIGHT = 200;
const POPUP_DEFAULT_WIDTH = 860;

// Preset sizes as a percentage of the viewport width.
// "Default" uses the popup's standard width; "100%" is fullscreen.
const POPUP_SIZES = [
  { id: "default", label: "Default" },
  { id: "20", label: "20%" },
  { id: "40", label: "40%" },
  { id: "60", label: "60%" },
  { id: "80", label: "80%" },
  { id: "100", label: "100%" },
];

/**
 * Renders every open menu popup as a non-blocking floating window (no dimming
 * overlay, page stays clickable and scrollable behind them). Must be placed
 * OUTSIDE the app's main <Routes> (see App.jsx) so each popup can render its
 * own <Routes location={menuLink}> without the parent-match pathname
 * restriction. Drag the header to move a popup; drag the right edge, bottom
 * edge or bottom-right corner to resize (or use the size buttons); close via
 * the X button or Escape.
 */
export default function MenuPopups() {
  const { popups, closePopup, bringPopupToFront, hidePopup } = useApp();

  return popups.map((p, i) => (
    <MenuPopup
      key={p.key}
      menu={p.menu}
      hidden={p.hidden}
      onClose={() => closePopup(p.key)}
      onHide={() => hidePopup(p.key)}
      onActivate={() => bringPopupToFront(p.key)}
      offset={i * 24}
    />
  ));
}

function MenuPopup({ menu, onClose, onHide, onActivate, hidden, offset }) {
  const [pos, setPos] = useState(() => ({ x: offset, y: offset }));
  const [width, setWidth] = useState(POPUP_DEFAULT_WIDTH);
  const [height, setHeight] = useState(null);
  const [size, setSize] = useState("default");
  const [fullscreen, setFullscreen] = useState(false);
  const dragRef = useRef(null);
  const modalRef = useRef(null);

  const clampWidth = (w) =>
    Math.min(Math.max(w, POPUP_MIN_WIDTH), window.innerWidth - 48);
  const clampHeight = (h) =>
    Math.min(Math.max(h, POPUP_MIN_HEIGHT), window.innerHeight - 48);

  const selectSize = (id) => {
    if (!POPUP_SIZES.some((s) => s.id === id)) return;
    setSize(id);
    const isFull = id === "100";
    setFullscreen(isFull);
    if (!isFull) {
      const pct = id === "default" ? null : parseInt(id, 10) / 100;
      setWidth(pct ? Math.round(window.innerWidth * pct) : POPUP_DEFAULT_WIDTH);
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
        // screen coordinate. Clamp in real screen space using the popup's
        // bounding rect captured at drag start, then convert back to pos.
        const r = d.rect;
        // Keep the popup fully on screen horizontally (10px margin) so it can
        // be dragged all the way to the left or right edge.
        const left = Math.min(
          Math.max(r.left + dx, 10),
          window.innerWidth - r.width - 10,
        );
        // Keep the header (and its close button) reachable vertically: never
        // above the top edge, and never so far down the header goes below the
        // viewport. No bottom boundary for the popup body — tall popups may
        // extend below the screen.
        const top = Math.min(
          Math.max(r.top + dy, 10),
          window.innerHeight - r.headerH - 10,
        );
        setPos({
          x: d.startPos.x + (left - r.left),
          y: d.startPos.y + (top - r.top),
        });
      } else {
        if (d.mode === "resize-w" || d.mode === "resize-wh") {
          setWidth(clampWidth(d.startW + dx));
        }
        if (d.mode === "resize-h" || d.mode === "resize-wh") {
          setHeight(clampHeight(d.startH + dy));
        }
      }
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    document.body.style.cursor = dragRef.current?.cursor || "";
    document.body.style.userSelect = "none";
  };

  // Drag the header to move the popup around the screen.
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
    setWidth(POPUP_DEFAULT_WIDTH);
    setHeight(null);
  };

  const handleStyle = {
    position: "absolute",
    zIndex: 1,
    display: fullscreen ? "none" : undefined,
  };

  return (
    <Modal
      open
      size={fullscreen ? "full" : "xl"}
      onClose={onClose}
      onMouseDown={onActivate}
      closeOnBackdrop={false}
      blockScroll={false}
      modalRef={modalRef}
      modalStyle={{
        ...(fullscreen ? {} : { maxWidth: "none", width: `${width}px` }),
        ...(height != null ? { height: `${height}px`, maxHeight: "none" } : {}),
        position: "relative",
        pointerEvents: "auto",
        borderRadius: fullscreen ? 0 : undefined,
      }}
      style={{
        display: hidden ? "none" : undefined,
        background: "transparent",
        backdropFilter: "none",
        pointerEvents: "none",
        padding: fullscreen ? 0 : undefined,
        transform: fullscreen
          ? undefined
          : `translate(${pos.x}px, ${pos.y}px)`,
      }}
    >
      <ModalHeader
        onMouseDown={startMove}
        style={{ cursor: fullscreen ? undefined : "grab" }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "var(--radius-lg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            background: `${menu.menus_color}18`,
            color: menu.menus_color,
            fontSize: 17,
          }}
        >
          {menu.menus_micon}
        </div>
        <ModalTitle title={menu.menus_mname} subtitle={menu.menus_mdesc} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            flexShrink: 0,
          }}
        >
          {POPUP_SIZES.map((s) => {
            const active = s.id === size;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => selectSize(s.id)}
                title={s.id === "100" ? "Fullscreen" : `${s.label} of screen width`}
                aria-pressed={active}
                style={{
                  minWidth: 26,
                  padding: "3px 6px",
                  fontSize: 10,
                  fontWeight: 600,
                  lineHeight: 1,
                  borderRadius: 6,
                  border: "1px solid var(--border-light)",
                  background: active ? "var(--primary)" : "transparent",
                  color: active ? "var(--primary-on)" : "var(--text-secondary)",
                  cursor: "pointer",
                }}
              >
                {s.label}
              </button>
            );
          })}
          <button
            type="button"
            className="modal__close"
            onClick={onHide}
            aria-label="Minimize popup"
            title="Minimize"
          >
            <IconChevronDown size={16} />
          </button>
          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Close popup"
            title="Close"
          >
            <IconClose size={16} />
          </button>
        </div>
      </ModalHeader>
      <ModalBody>
        <Routes location={menu.menus_mlink}>{getRoutes()}</Routes>
      </ModalBody>
      {/* Resize handles: right edge (width), bottom edge (height), corner (both) */}
      <div
        onMouseDown={startWidthResize}
        onDoubleClick={resetSize}
        title="Drag to resize width · double-click to reset"
        aria-label="Resize width"
        style={{ ...handleStyle, top: 0, bottom: 0, right: -4, width: 8, cursor: "col-resize" }}
      />
      <div
        onMouseDown={startHeightResize}
        title="Drag to resize height"
        aria-label="Resize height"
        style={{ ...handleStyle, left: 0, right: 0, bottom: -4, height: 8, cursor: "row-resize" }}
      />
      <div
        onMouseDown={startCornerResize}
        onDoubleClick={resetSize}
        title="Drag to resize width and height · double-click to reset"
        aria-label="Resize width and height"
        style={{ ...handleStyle, zIndex: 2, right: -6, bottom: -6, width: 14, height: 14, cursor: "nwse-resize" }}
      />
    </Modal>
  );
}
