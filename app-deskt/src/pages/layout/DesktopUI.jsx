import { useCallback, useEffect, useRef, useState } from "react";
import AnalogClock from "./desktop/AnalogClock";
import ContextMenu from "./desktop/ContextMenu";
import DigitalClock from "./desktop/DigitalClock";
import "./DesktopUI.css";

const widgetMap = {
  analogClock: AnalogClock,
  digitalClock: DigitalClock,
};

const DesktopUI = ({
  recentForms = [],
  onRestore,
  onOpenSetup,
  desktopBackground,
  onRefreshDesktop,
  onResetDesktop,
}) => {
  const [menu, setMenu] = useState(null);
  const [closing, setClosing] = useState(false);
  const [dragging, setDragging] = useState(null);
  const [visibleWidgets, setVisibleWidgets] = useState({
    analogClock: true,
    digitalClock: true,
  });
  const [pos, setPos] = useState({
    analogClock: { x: 24, y: 18 },
    digitalClock: { x: 24, y: 210 },
  });
  const menuRef = useRef(null);

  const close = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => setMenu(null), 100);
  }, []);

  const handleContextMenu = useCallback(
    (event) => {
      event.preventDefault();
      if (dragging) return;
      setMenu({ x: event.clientX, y: event.clientY });
      setClosing(false);
    },
    [dragging],
  );

  useEffect(() => {
    if (!menu) return undefined;

    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menu, close]);

  const startDrag = useCallback(
    (name, event) => {
      event.preventDefault();
      event.stopPropagation();
      if (dragging) return;

      const start = pos[name] || { x: 0, y: 0 };
      const offset = {
        x: event.clientX - start.x,
        y: event.clientY - start.y,
      };

      setDragging(name);

      const handleMove = (moveEvent) => {
        const rect = document
          .querySelector(".desktopCanvas")
          ?.getBoundingClientRect();
        const maxX = rect ? rect.width - 80 : window.innerWidth - 80;
        const maxY = rect ? rect.height - 80 : window.innerHeight - 80;
        const nextX = Math.min(Math.max(8, moveEvent.clientX - offset.x), maxX);
        const nextY = Math.min(Math.max(8, moveEvent.clientY - offset.y), maxY);

        setPos((current) => ({
          ...current,
          [name]: { x: nextX, y: nextY },
        }));
      };

      const handleUp = () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
        setDragging(null);
      };

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    },
    [dragging, pos],
  );

  const handleToggleWidget = (name) => {
    setVisibleWidgets((current) => ({
      ...current,
      [name]: !current[name],
    }));
    close();
  };

  const handleProperties = () => {
    close();
    onOpenSetup();
  };

  return (
    <div
      className="desktopRoot"
      onContextMenu={handleContextMenu}
      style={{ "--desktop-background": desktopBackground }}
    >
      <div className="desktopCanvas">
        <div className="desktopBackground" />
        <div className="desktopGrid" />
        {Object.entries(widgetMap).map(([name, Component]) => {
          if (!visibleWidgets[name]) return null;

          return (
            <Component
              key={name}
              style={{
                left: pos[name].x,
                top: pos[name].y,
                cursor: dragging === name ? "grabbing" : "grab",
              }}
              onMouseDown={(event) => startDrag(name, event)}
            />
          );
        })}
        <div className="desktopIcons">
          {recentForms.map((item) => (
            <DesktopIcon
              key={item.id}
              name={item.name}
              icon={item.icon}
              onClick={() => onRestore(item)}
            />
          ))}
        </div>
      </div>
      {menu && (
        <div ref={menuRef}>
          <ContextMenu
            x={menu.x}
            y={menu.y}
            closing={closing}
            visibleWidgets={visibleWidgets}
            onToggleWidget={handleToggleWidget}
            onProperties={handleProperties}
            onClose={close}
            onRefresh={onRefreshDesktop}
            onResetDesktop={onResetDesktop}
          />
        </div>
      )}
    </div>
  );
};

const DesktopIcon = ({ name, icon, onClick }) => (
  <button className="desktopIconItem" onClick={onClick} type="button">
    <div className="desktopIconSymbol">{icon}</div>
    <div className="desktopIconLabel">{name}</div>
  </button>
);

export default DesktopUI;
