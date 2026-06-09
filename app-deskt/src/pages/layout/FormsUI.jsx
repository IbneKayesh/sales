import { useCallback, useEffect, useRef, useState } from "react";

import InventoryPage from "../inventory/InventoryPage";
import PurchasePage from "../purchase/PurchasePage";
import SalesPage from "../sales/SalesPage";
import SetupDesktopPage from "../syspage/SetupDesktopPage";
import ProfilePage from "../auth/ProfilePage";
import NotificationPage from "../syspage/NotificationPage";
import LeftbarKit from "./forms/LeftbarKit";
import TopbarKit from "./forms/TopbarKit";
import "./FormsUI.css";
//accounts
import JournalPage from "../accounts/journal/JournalPage";

const pageByModule = {
  sales: SalesPage,
  purchase: PurchasePage,
  inventory: InventoryPage,
  settings: SalesPage,
  setup: "SetupPage",
  profile: ProfilePage,
  notifications: NotificationPage,
};

const pageByForms = { JournalPage, SetupDesktopPage };

const FormsUI = ({
  formItem,
  onClose,
  onMinimize,
  onFocus,
  onToggleMaximize,
  onDock,
  desktopBackground,
  onSetDesktopBackground,
  onSetTopbarBackground,
  topbarBackground,
  onSignOut,
  notifications,
  onReadNotification,
  onMarkAllNotificationsRead,
  callFunction1,
  callFunction2,
}) => {
  const [position, setPosition] = useState({ x: 80, y: 56 });
  const [size, setSize] = useState({ width: 900, height: 600 });
  const dragRef = useRef(null);
  const resizeRef = useRef(null);
  const windowRef = useRef(null);
  const lastDragPos = useRef({ x: 0, y: 0 });
  const Page = pageByModule[formItem.module] || SalesPage;
  const RenderPage = pageByForms[formItem.forms];

  // Handle smooth drag + wobbly skew feel (ported conceptually from ERP PagesUI)
  const handleDragStart = useCallback(
    (event) => {
      if (formItem.isMaximized) return;

      onFocus(formItem);

      dragRef.current = {
        x: event.clientX - position.x,
        y: event.clientY - position.y,
      };

      lastDragPos.current = { x: event.clientX, y: event.clientY };

      const handleMove = (moveEvent) => {
        const nextX = Math.max(8, moveEvent.clientX - dragRef.current.x);
        const nextY = Math.max(8, moveEvent.clientY - dragRef.current.y);
        setPosition({ x: nextX, y: nextY });

        const dx = moveEvent.clientX - lastDragPos.current.x;
        const dy = moveEvent.clientY - lastDragPos.current.y;
        lastDragPos.current = { x: moveEvent.clientX, y: moveEvent.clientY };

        const skewX = Math.max(-6, Math.min(6, dy * 0.25));
        const skewY = Math.max(-6, Math.min(6, dx * 0.15));

        if (windowRef.current) {
          windowRef.current.style.transform = `skewX(${skewX}deg) skewY(${skewY}deg)`;
          windowRef.current.style.transition = "none";
        }
      };

      const handleUp = () => {
        if (windowRef.current) {
          windowRef.current.style.transform = "skewX(0deg) skewY(0deg)";
          windowRef.current.style.transition =
            "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)";
        }
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

        // Stretch effect (ported conceptually from ERP PagesUI)
        const stretchX =
          resizeCorner.includes("e") || resizeCorner.includes("right")
            ? 1 + Math.min(0.04, Math.abs(deltaX) * 0.0005)
            : 1;
        const stretchY =
          resizeCorner.includes("s") || resizeCorner.includes("bottom")
            ? 1 + Math.min(0.04, Math.abs(deltaY) * 0.0005)
            : 1;

        if (windowRef.current) {
          windowRef.current.style.transform = `scale(${stretchX}, ${stretchY})`;
          windowRef.current.style.transition = "none";
        }
      };

      const handleUp = () => {
        if (windowRef.current) {
          windowRef.current.style.transform = "scale(1, 1)";
          windowRef.current.style.transition =
            "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)";
        }
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
    const tileWidth = `calc(100% / ${formItem.tileCols} - 8px)`;
    const tileHeight = `calc(100% / ${formItem.tileRows} - 8px)`;
    const tileLeft = `calc((100% / ${formItem.tileCols}) * ${formItem.tileCol})`;
    const tileTop = `calc((100% / ${formItem.tileRows}) * ${formItem.tileRow})`;
    layoutStyle = {
      left: `calc(${tileLeft} + 12px + ${formItem.tileCol * 4}px)`,
      top: `calc(${tileTop} + 12px + ${formItem.tileRow * 4}px)`,
      width: tileWidth,
      height: tileHeight,
      right: "auto",
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
      ref={windowRef}
      className={`forms-container forms-size-${formItem.size || "medium"} ${
        formItem.isMaximized ? "is-maximized" : ""
      } ${formItem.layout ? `layout-${formItem.layout}` : ""}`}
      style={style}
      onMouseDown={() => onFocus(formItem)}
    >
      <TopbarKit
        icon={formItem.icon}
        title={formItem.name}
        breadcrumb={formItem.path}
        isMaximized={formItem.isMaximized}
        onDragStart={handleDragStart}
        onClose={() => onClose(formItem)}
        onMinimize={() => onMinimize(formItem)}
        onToggleMaximize={() => onToggleMaximize(formItem)}
        background={topbarBackground}
        actions={formItem.actions}
      />
      <LeftbarKit activeModule={formItem.module} />
      <main className="forms-container-body">
        {/* <Page
          formItem={formItem}
          desktopBackground={desktopBackground}
          onSetDesktopBackground={onSetDesktopBackground}
          onSetTopbarBackground={onSetTopbarBackground}
          notifications={notifications}
          onRead={onReadNotification}
          onMarkAllRead={onMarkAllNotificationsRead}
          onSignOut={onSignOut}
        /> */}
        <RenderPage
          callFunction1={callFunction1}
          callFunction2={callFunction2}
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
