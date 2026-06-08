import { useCallback, useRef, useState } from "react";
import InventoryPage from "../inventory/InventoryPage";
import PurchasePage from "../purchase/PurchasePage";
import SalesPage from "../sales/SalesPage";
import SetupPage from "../syspage/SetupPage";
import ProfilePage from "../auth/ProfilePage";
import NotificationPage from "../syspage/NotificationPage";
import LeftbarKit from "./forms/LeftbarKit";
import TopbarKit from "./forms/TopbarKit";
import "./FormsUI.css";

const pageByModule = {
  sales: SalesPage,
  purchase: PurchasePage,
  inventory: InventoryPage,
  settings: SalesPage,
  setup: SetupPage,
  profile: ProfilePage,
  notifications: NotificationPage,
};

const FormsUI = ({
  formItem,
  onClose,
  onMinimize,
  onFocus,
  onToggleMaximize,
  desktopBackground,
  onSetDesktopBackground,
  onSetTopbarBackground,
  topbarBackground,
  onSignOut,
  notifications,
  onReadNotification,
  onMarkAllNotificationsRead,
}) => {
  const [position, setPosition] = useState({ x: 80, y: 56 });
  const [size, setSize] = useState({ width: 900, height: 600 });
  const dragRef = useRef(null);
  const resizeRef = useRef(null);
  const Page = pageByModule[formItem.module] || SalesPage;

  // Handle smooth drag
  const handleDragStart = useCallback(
    (event) => {
      if (formItem.isMaximized) return;

      onFocus(formItem);
      dragRef.current = {
        x: event.clientX - position.x,
        y: event.clientY - position.y,
      };

      const handleMove = (moveEvent) => {
        const nextX = Math.max(8, moveEvent.clientX - dragRef.current.x);
        const nextY = Math.max(8, moveEvent.clientY - dragRef.current.y);
        setPosition({ x: nextX, y: nextY });
      };

      const handleUp = () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    },
    [formItem, onFocus, position],
  );

  // Handle resize from corners
  const handleResizeStart = useCallback(
    (event, corner) => {
      event.preventDefault();
      if (formItem.isMaximized) return;

      onFocus(formItem);
      resizeRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        startWidth: size.width,
        startHeight: size.height,
        corner,
      };

      const handleMove = (moveEvent) => {
        if (!resizeRef.current) return;

        const deltaX = moveEvent.clientX - resizeRef.current.startX;
        const deltaY = moveEvent.clientY - resizeRef.current.startY;
        const { corner: resizeCorner } = resizeRef.current;

        let newWidth = resizeRef.current.startWidth;
        let newHeight = resizeRef.current.startHeight;
        let newX = position.x;
        let newY = position.y;

        // Handle different corners
        if (
          resizeCorner.includes("right") ||
          resizeCorner === "e" ||
          resizeCorner === "se" ||
          resizeCorner === "ne"
        ) {
          newWidth = Math.max(320, resizeRef.current.startWidth + deltaX);
        }
        if (
          resizeCorner.includes("left") ||
          resizeCorner === "w" ||
          resizeCorner === "sw" ||
          resizeCorner === "nw"
        ) {
          newWidth = Math.max(320, resizeRef.current.startWidth - deltaX);
          newX = position.x + deltaX;
        }
        if (
          resizeCorner.includes("bottom") ||
          resizeCorner === "s" ||
          resizeCorner === "se" ||
          resizeCorner === "sw"
        ) {
          newHeight = Math.max(240, resizeRef.current.startHeight + deltaY);
        }
        if (
          resizeCorner.includes("top") ||
          resizeCorner === "n" ||
          resizeCorner === "ne" ||
          resizeCorner === "nw"
        ) {
          newHeight = Math.max(240, resizeRef.current.startHeight - deltaY);
          newY = position.y + deltaY;
        }

        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: Math.max(8, newX), y: Math.max(8, newY) });
      };

      const handleUp = () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
        resizeRef.current = null;
      };

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    },
    [formItem, onFocus, position, size],
  );

  if (formItem.isMinimized) {
    return null;
  }

  // Calculate layout-specific styles
  let layoutStyle = {};
  if (formItem.layout === "dock-left") {
    layoutStyle = {
      left: 12,
      top: 12,
      right: "calc(50% + 6px)",
      width: "auto",
      zIndex: formItem.zIndex,
    };
  } else if (formItem.layout === "dock-right") {
    layoutStyle = {
      left: "calc(50% + 6px)",
      top: 12,
      right: 12,
      width: "auto",
      zIndex: formItem.zIndex,
    };
  } else if (formItem.layout === "tile") {
    const tileWidth = `calc(100% / ${formItem.tileCount} - 8px)`;
    const tileLeft = `calc((100% / ${formItem.tileCount}) * ${formItem.tileIndex})`;
    layoutStyle = {
      left: `calc(${tileLeft} + 12px + ${formItem.tileIndex * 4}px)`,
      top: 12,
      width: tileWidth,
      right: "auto",
      bottom: 58,
      height: "auto",
      zIndex: formItem.zIndex,
    };
  }

  const style = formItem.isMaximized
    ? { zIndex: formItem.zIndex }
    : formItem.layout
      ? { ...layoutStyle, bottom: 58 }
      : {
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
          zIndex: formItem.zIndex,
        };

  return (
    <div
      className={`forms-container forms-size-${formItem.size || "medium"} ${
        formItem.isMaximized ? "is-maximized" : ""
      } ${formItem.layout ? `layout-${formItem.layout}` : ""}`}
      style={style}
      onMouseDown={() => onFocus(formItem)}
    >
      <TopbarKit
        icon={formItem.icon}
        title={formItem.name}
        isMaximized={formItem.isMaximized}
        onDragStart={handleDragStart}
        onClose={() => onClose(formItem)}
        onMinimize={() => onMinimize(formItem)}
        onToggleMaximize={() => onToggleMaximize(formItem)}
        background={topbarBackground}
      />
      <LeftbarKit activeModule={formItem.module} />
      <main className="forms-container-body">
        <Page
          formItem={formItem}
          desktopBackground={desktopBackground}
          onSetDesktopBackground={onSetDesktopBackground}
          onSetTopbarBackground={onSetTopbarBackground}
          notifications={notifications}
          onRead={onReadNotification}
          onMarkAllRead={onMarkAllNotificationsRead}
          onSignOut={onSignOut}
        />
      </main>

      {/* Resize handles */}
      {!formItem.isMaximized && !formItem.layout && (
        <>
          <div
            className="resize-handle resize-handle-nw"
            onMouseDown={(e) => handleResizeStart(e, "nw")}
          />
          <div
            className="resize-handle resize-handle-ne"
            onMouseDown={(e) => handleResizeStart(e, "ne")}
          />
          <div
            className="resize-handle resize-handle-sw"
            onMouseDown={(e) => handleResizeStart(e, "sw")}
          />
          <div
            className="resize-handle resize-handle-se"
            onMouseDown={(e) => handleResizeStart(e, "se")}
          />
          <div
            className="resize-handle resize-handle-n"
            onMouseDown={(e) => handleResizeStart(e, "n")}
          />
          <div
            className="resize-handle resize-handle-s"
            onMouseDown={(e) => handleResizeStart(e, "s")}
          />
          <div
            className="resize-handle resize-handle-e"
            onMouseDown={(e) => handleResizeStart(e, "e")}
          />
          <div
            className="resize-handle resize-handle-w"
            onMouseDown={(e) => handleResizeStart(e, "w")}
          />
        </>
      )}
    </div>
  );
};

export default FormsUI;
