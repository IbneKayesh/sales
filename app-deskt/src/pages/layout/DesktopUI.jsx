import "./DesktopUI.css";
import AnalogClock from "./desktop/AnalogClock";
import DigitalClock from "./desktop/DigitalClock";
import ContextMenu from "./desktop/ContextMenu";
import { useState, useCallback, useEffect, useRef } from "react";

const DesktopUI = () => {
  const [menu, setMenu] = useState(null);
  const [closing, setClosing] = useState(false);
  const menuRef = useRef(null);
  const [pos, setPos] = useState({
    // default position: right top
    analogClock: { x: 20, y: 18 },
    digitalClock: { x: 20, y: 210 },
  });
  const posRef = useRef(pos);
  posRef.current = pos;
  const [dragging, setDragging] = useState(null);

  const handleContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      // prevent menu from opening while dragging clocks
      if (dragging) return;
      setMenu({ x: e.clientX, y: e.clientY });
      setClosing(false);
    },
    [dragging],
  );

  const close = useCallback(() => {
    setClosing(true);
    setTimeout(() => setMenu(null), 100);
  }, []);

  useEffect(() => {
    if (!menu) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menu, close]);

  const startDrag = useCallback(
    (name, e) => {
      e.preventDefault();
      e.stopPropagation();

      // If a drag is already running, ignore new starts
      if (dragging) return;

      const start = posRef.current[name] || { x: 0, y: 0 };
      const offsetX = e.clientX - start.x;
      const offsetY = e.clientY - start.y;

      setDragging(name);

      const handleMove = (event) => {
        setPos((current) => {
          const container = document.querySelector(".desktopCanvas");
          const rect = container?.getBoundingClientRect();
          const relX = rect ? event.clientX - rect.left : event.clientX;
          const relY = rect ? event.clientY - rect.top : event.clientY;

          const next = {
            ...current,
            [name]: {
              // we store left offsets, but UI uses `right:`; convert so drag feels natural
              x: (rect ? rect.width : window.innerWidth) - (relX - 0),
              y: relY,
            },
          };
          posRef.current = next;
          return next;
        });
      };

      const handleUp = () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
        window.removeEventListener("mouseleave", handleUp);
        setDragging(null);
      };

      // Capture mouse even if pointer leaves the clock element
      window.addEventListener("mousemove", handleMove, { passive: true });
      window.addEventListener("mouseup", handleUp, { passive: true });
      window.addEventListener("mouseleave", handleUp);
    },
    [dragging],
  );

  const analogStyle = {
    right: pos.analogClock.x,
    top: pos.analogClock.y,
    cursor: dragging === "analogClock" ? "grabbing" : "grab",
  };
  const digitalStyle = {
    right: pos.digitalClock.x,
    top: pos.digitalClock.y,
    cursor: dragging === "digitalClock" ? "grabbing" : "grab",
  };

  return (
    <div className="desktopRoot" onContextMenu={handleContextMenu}>
      <div className="desktopCanvas">
        <div className="desktopGrid" />
        <AnalogClock
          style={analogStyle}
          onMouseDown={(e) => startDrag("analogClock", e)}
        />
        <DigitalClock
          style={digitalStyle}
          onMouseDown={(e) => startDrag("digitalClock", e)}
        />
        <div className="desktopIcons">
          <DesktopIcon name="This PC" icon="💻" />
          <DesktopIcon name="Documents" icon="📁" />
          <DesktopIcon name="Downloads" icon="⬇" />
          <DesktopIcon name="Recycle Bin" icon="🗑" />
        </div>
      </div>
      {menu && (
        <div ref={menuRef}>
          <ContextMenu
            x={menu.x}
            y={menu.y}
            closing={closing}
            onClose={close}
          />
        </div>
      )}
    </div>
  );
};

const DesktopIcon = ({ name, icon }) => (
  <div className="desktopIconItem">
    <div className="desktopIconSymbol">{icon}</div>
    <div className="desktopIconLabel">{name}</div>
  </div>
);

export default DesktopUI;
