import React, { useState, useRef, useEffect, useCallback } from "react";
import SOPage from "../sales/SOPage";
import CustomersPage from "../sales/CustomersPage";
import POPage from "../purchase/POPage";
import VendorsPage from "../purchase/VendorsPage";
import StockPage from "../inventory/StockPage";
import SettingsPage from "../SettingsPage";
import NotificationPage from "../NotificationPage";
import desktopImage from "../../assets/desktop.png";
import searchImage from "../../assets/search.png";
import addImage from "../../assets/add.png";
import saveImage from "../../assets/save.png";

// Map string keys to component objects for easy rendering
const pageMap = {
  SOPage,
  CustomersPage,
  POPage,
  VendorsPage,
  StockPage,
  SettingsPage,
  NotificationPage: (props) => <NotificationPage {...props} />,
  ProfileSettings: () => (
    <div className="page-section-center">
      <h2>👤 User Account Settings</h2>
      <p className="page-section-desc">
        Configure ERP accessibility preferences, notification logs, and profile
        details.
      </p>
    </div>
  ),
  PromotionsSetup: () => (
    <div className="page-section">
      <h2 className="page-section-title">🎟️ Promotions Setup</h2>
      <p className="page-section-desc">
        Create and manage promotional campaigns, discount coupons, and seasonal
        offers.
      </p>
      <div className="page-grid-200">
        <div className="page-card">
          <h4 className="text-accent">Summer Blowout 15%</h4>
          <p className="page-card-meta">Status: Active | Expires: Jun 30</p>
        </div>
        <div className="page-card">
          <h4 className="text-accent">First-Time Buyer Code</h4>
          <p className="page-card-meta">Status: Active | Permanent</p>
        </div>
      </div>
    </div>
  ),
  PriceLists: () => (
    <div className="page-section">
      <h2 className="page-section-title">💲 Price Lists</h2>
      <p className="page-section-desc">
        Define customer-specific price lists, tier structures, and custom
        catalog mappings.
      </p>
      <div className="page-table-container">
        <table className="page-table">
          <thead>
            <tr className="page-table-header">
              <th>List Name</th>
              <th>Currency</th>
              <th>Markup/Discount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="page-table-row">
              <td>Wholesale Catalog</td>
              <td>USD</td>
              <td className="text-accent">-20% Tier</td>
            </tr>
            <tr>
              <td>VIP Direct Retail</td>
              <td>USD</td>
              <td className="text-accent">-10% Flat</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ),
  SalesReport: () => (
    <div className="page-section">
      <h2 className="page-section-title">📊 Sales Performance Report</h2>
      <p className="page-section-desc">
        Real-time analytics on sales quotas, historical volume, and team
        performance metrics.
      </p>
      <div className="page-chart-container">
        <div className="page-chart-bar">
          <div className="bar-primary" style={{ height: "140px" }} />
          <span className="bar-label">Q1</span>
        </div>
        <div className="page-chart-bar">
          <div className="bar-light" style={{ height: "180px" }} />
          <span className="bar-label">Q2</span>
        </div>
        <div className="page-chart-bar">
          <div className="bar-secondary" style={{ height: "110px" }} />
          <span className="bar-label">Q3 (Proj)</span>
        </div>
      </div>
    </div>
  ),
  PurchaseReport: () => (
    <div className="page-section">
      <h2 className="page-section-title">📈 Purchase Analysis Report</h2>
      <p className="page-section-desc">
        Review supply chain cost structures, vendor fulfillment logs, and
        average lead times.
      </p>
      <div className="page-chart-container">
        <div className="page-chart-bar">
          <div className="bar-success" style={{ height: "90px" }} />
          <span className="bar-label">Raw Materials</span>
        </div>
        <div className="page-chart-bar">
          <div className="bar-success-light" style={{ height: "150px" }} />
          <span className="bar-label">Packaging</span>
        </div>
      </div>
    </div>
  ),
  InventoryReport: () => (
    <div className="page-section">
      <h2 className="page-section-title">📉 Stock Turning & Aging Report</h2>
      <p className="page-section-desc">
        Analyze stock flow-through ratios, warehouse utilization coefficients,
        and safety stock flags.
      </p>
      <div className="page-chart-container">
        <div className="page-chart-bar">
          <div className="bar-danger" style={{ height: "130px" }} />
          <span className="bar-label">Aisle A (Fast)</span>
        </div>
        <div className="page-chart-bar">
          <div className="bar-danger-light" style={{ height: "60px" }} />
          <span className="bar-label">Aisle B (Slow)</span>
        </div>
      </div>
    </div>
  ),
};

export default function PagesUI({
  windowData,
  activeWindowId,
  windows,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onUpdatePosition,
  onUpdateSize,
  onOpenPage,
  wallpaperUrl, // desktop wallpaper
  winWallpaperUrl, // explorer wallpaper
  lockWallpaperUrl, // lock screen wallpaper
  onSetWallpaper, // desktop setter
  onSetWinWallpaper, // explorer setter
  onSetLockWallpaper, // lock setter
  isFullscreen,
  onToggleFullscreen,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDismiss,
}) {
  const {
    id,
    title,
    type,
    path,
    icon,
    children,
    pageKey,
    position,
    size,
    maximized,
    minimized,
    zIndex,
  } = windowData;
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Animation state: 'idle' | 'minimizing' | 'restoring'
  const [animState, setAnimState] = useState("idle");

  const prevMinimizedRef = useRef(minimized);

  // Dock animation helper

  const applyDockVars = useCallback(() => {
    const el = windowRef.current;
    const taskbar = document.querySelector(".taskbar-container");
    if (!el || !taskbar) return;

    const elRect = el.getBoundingClientRect();

    const tbRect = taskbar.getBoundingClientRect();

    // Target: center of taskbar
    const targetX = tbRect.left + tbRect.width * 0.5;
    const targetY = tbRect.top + 8; // slightly above the bar for a nicer feel

    const startX = elRect.left + elRect.width * 0.5;
    const startY = elRect.top + elRect.height * 0.5;

    const dx = targetX - startX;
    const dy = targetY - startY;

    el.style.setProperty("--wfe-dock-dx", `${dx}px`);
    el.style.setProperty("--wfe-dock-dy", `${dy}px`);

    // a little tilt while traveling
    const rot = Math.max(-10, Math.min(10, dx * 0.02));
    el.style.setProperty("--wfe-dock-rot", `${rot}deg`);

    // scale: proportional to distance (cap for stability)
    const dist = Math.hypot(dx, dy);
    const scale = Math.max(0.12, Math.min(0.24, 700 / (dist + 1)));
    el.style.setProperty("--wfe-dock-scale", `${scale}`);
  }, []);

  const windowRef = useRef(null);
  const dragStart = useRef(null);
  const resizeStart = useRef(null);
  const lastDragPos = useRef({ x: 0, y: 0 });

  // Detect minimized/restore transitions and play animations.
  useEffect(() => {
    const wasMin = prevMinimizedRef.current;
    if (wasMin && minimized === false) {
      applyDockVars();
      setAnimState("restoring");
    }
    prevMinimizedRef.current = minimized;
  }, [minimized, applyDockVars]);

  // Set window focus on click anywhere inside WFE (NOT triggered by controls)
  const handleWindowClick = () => {
    onFocus(id);
  };

  // Control button pulse animation on mousedown
  const handleCtrlMouseDown = useCallback((e) => {
    const btn = e.currentTarget;
    btn.classList.add("wfe-ctrl-clicked");
    btn.addEventListener(
      "animationend",
      () => btn.classList.remove("wfe-ctrl-clicked"),
      { once: true },
    );
  }, []);

  // Minimize with dock animation; keep mounted until animation end
  const handleMinimizeClick = useCallback(
    (e) => {
      e.stopPropagation();
      // Prepare CSS vars for transform distance/scale
      applyDockVars();
      setAnimState("minimizing");
    },
    [applyDockVars],
  );

  // Maximize/Restore with shake animation
  const handleMaximizeClick = useCallback(
    (e) => {
      e.stopPropagation();
      onMaximize(id);
      const el = windowRef.current;
      if (el) {
        el.classList.add("wfe-animate-shake");
        el.addEventListener(
          "animationend",
          () => el.classList.remove("wfe-animate-shake"),
          { once: true },
        );
      }
    },
    [id, onMaximize],
  );

  // Handle animation end
  const handleAnimationEnd = useCallback(() => {
    if (animState === "minimizing") {
      // Now actually mark minimized in React state.
      // Keep mounted during animation (handled by CSS), then let the re-render hide it.
      onMinimize(id);
      setAnimState("idle");
      return;
    }

    if (animState === "restoring") {
      setAnimState("idle");
      return;
    }
  }, [animState, id, onMinimize]);

  // Dragging Implementation (with wobbly effect)
  const handleHeaderMouseDown = (e) => {
    if (maximized) return;
    onFocus(id);
    if (
      e.target.closest(".wfe-control-btn") ||
      e.target.closest(".wfe-controls")
    )
      return;

    lastDragPos.current = { x: e.clientX, y: e.clientY };
    dragStart.current = {
      offsetX: e.clientX - position.x,
      offsetY: e.clientY - position.y,
    };

    const handleMouseMove = (moveEvent) => {
      const newX = moveEvent.clientX - dragStart.current.offsetX;
      const newY = Math.max(0, moveEvent.clientY - dragStart.current.offsetY);
      onUpdatePosition(id, { x: newX, y: newY });

      // Wobbly skew effect based on velocity
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

    const handleMouseUp = () => {
      // Spring back
      if (windowRef.current) {
        windowRef.current.style.transform = "skewX(0deg) skewY(0deg)";
        windowRef.current.style.transition =
          "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)";
      }
      dragStart.current = null;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Resizing Implementation (with stretch effect)
  const handleResizeMouseDown = (e, direction) => {
    e.stopPropagation();
    e.preventDefault();
    onFocus(id);

    resizeStart.current = {
      w: size.w,
      h: size.h,
      x: e.clientX,
      y: e.clientY,
      direction,
    };

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - resizeStart.current.x;
      const deltaY = moveEvent.clientY - resizeStart.current.y;
      let newW = resizeStart.current.w;
      let newH = resizeStart.current.h;
      if (resizeStart.current.direction.includes("e"))
        newW = Math.max(420, resizeStart.current.w + deltaX);
      if (resizeStart.current.direction.includes("s"))
        newH = Math.max(280, resizeStart.current.h + deltaY);
      onUpdateSize(id, { w: newW, h: newH });

      // Stretch effect
      const stretchX = resizeStart.current.direction.includes("e")
        ? 1 + Math.min(0.04, Math.abs(deltaX) * 0.0005)
        : 1;
      const stretchY = resizeStart.current.direction.includes("s")
        ? 1 + Math.min(0.04, Math.abs(deltaY) * 0.0005)
        : 1;
      if (windowRef.current) {
        windowRef.current.style.transform = `scale(${stretchX}, ${stretchY})`;
        windowRef.current.style.transition = "none";
      }
    };

    const handleMouseUp = () => {
      // Spring back from stretch
      if (windowRef.current) {
        windowRef.current.style.transform = "scale(1, 1)";
        windowRef.current.style.transition =
          "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)";
      }
      resizeStart.current = null;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const filteredChildren = children
    ? children.filter(
        (child) =>
          child.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          child.desc.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  const PageComponent = pageKey ? pageMap[pageKey] : null;
  const otherWindows = (windows || []).filter((win) => win.id !== id);

  return (
    <div
      ref={windowRef}
      className={`wfe-window acrylic-container ${maximized ? "maximized" : ""} ${animState === "minimizing" ? "wfe-animate-out" : ""} ${animState === "restoring" ? "wfe-animate-in" : ""} ${minimized ? "minimized" : ""} ${minimized && animState === "idle" ? "is-fully-minimized" : ""}`}
      style={{
        left: maximized ? 0 : `${position.x}px`,
        top: maximized ? 0 : `${position.y}px`,
        width: maximized ? "100vw" : `${size.w}px`,
        height: maximized
          ? "calc(100vh - var(--taskbar-height))"
          : `${size.h}px`,
        zIndex,
        border: maximized ? "none" : "1px solid var(--border-acrylic-focus)",
        // Allow explorer to have its own distinct background from the desktop
        backgroundImage: `url(${wallpaperUrl})`,
      }}
      onClick={handleWindowClick}
      onAnimationEnd={handleAnimationEnd}
    >
      {/* Title Bar 
        '--wfe-wallpaper-url': wallpaperUrl, */}
      <div className="wfe-header" onMouseDown={handleHeaderMouseDown}>
        <div className="wfe-header-title">
          <span className="wfe-header-icon">{icon}</span>
          <span>{title}</span>
        </div>
        {/* wfe-controls stops all clicks from bubbling to parent window div */}
        <div className="wfe-controls" onClick={(e) => e.stopPropagation()}>
          <button
            className="wfe-control-btn"
            onMouseDown={handleCtrlMouseDown}
            onClick={handleMinimizeClick}
            title="Minimize"
          >
            {"\uD83D\uDDD5"}
          </button>
          <button
            className="wfe-control-btn"
            onMouseDown={handleCtrlMouseDown}
            onClick={handleMaximizeClick}
            title={maximized ? "Restore Down" : "Maximize"}
          >
            {maximized ? "\uD83D\uDDD7" : "\uD83D\uDDD6"}
          </button>
          <button
            className="wfe-control-btn close-btn"
            onMouseDown={handleCtrlMouseDown}
            onClick={(e) => {
              e.stopPropagation();
              onClose(id);
            }}
            title="Close"
          >
            {"\uD83D\uDDD9"}
          </button>
        </div>
      </div>

      {/* Toolbar: action icon buttons left | breadcrumb bar right */}
      <div className="wfe-toolbar wfe-toolbar-custom">
        <div className="wfe-toolbar-actions">
          <button className="wfe-nav-btn wfe-toolbar-btn-sm" title="New">
            <img
              src={addImage}
              alt="Add Action"
              width="16"
              height="16"
              style={{ color: "var(--accent-light)" }}
            />
          </button>
          <button className="wfe-nav-btn wfe-toolbar-btn-sm save" title="Save">
            <img
              src={saveImage}
              alt="Save Action"
              width="16"
              height="16"
              style={{ color: "var(--accent-light)" }}
            />
          </button>
          <button
            className="wfe-nav-btn wfe-toolbar-btn-sm search"
            title="Search"
          >
            <img
              src={searchImage}
              alt="Search Action"
              width="16"
              height="16"
              style={{ color: "var(--accent-light)" }}
            />
          </button>
          {type === "folder" && (
            <>
              <div className="wfe-toolbar-divider" />
              <input
                type="text"
                className="wfe-search-input wfe-filter-input"
                placeholder={`Filter ${title}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </>
          )}
        </div>

        <div className="wfe-address-bar wfe-address-bar-left">
          <span className="wfe-address-bar-pc-icon">
            <img
              src={desktopImage}
              alt="Address Bar Image"
              width={14}
              height={14}
              style={{ color: "var(--accent-light)" }}
            />
          </span>
          <input
            type="text"
            className="wfe-address-input wfe-address-input-left"
            value={path}
            readOnly
          />
        </div>
      </div>

      {/* Inner Explorer Layout */}
      <div className="wfe-body">
        <div className={`wfe-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
          <button
            className={`wfe-sidebar-toggle ${sidebarCollapsed ? "collapsed" : ""}`}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setSidebarCollapsed((prev) => !prev)}
          >
            {!sidebarCollapsed && (
              <span className="wfe-sidebar-label">Opened Pages</span>
            )}
            <span className="wfe-sidebar-chevron">‹</span>
          </button>

          {!sidebarCollapsed && (
            <div className="wfe-sidebar-content">
              {otherWindows.map((win) => (
                <div
                  key={win.id}
                  className={`wfe-sidebar-item ${win.id === activeWindowId ? "active" : ""}`}
                  onClick={() => onFocus(win.id)}
                  title={win.title}
                >
                  <span className="wfe-sidebar-icon">{win.icon || "📂"}</span>
                  <span className="wfe-sidebar-title">{win.title}</span>
                </div>
              ))}
              {otherWindows.length === 0 && (
                <div className="wfe-sidebar-empty">No other open windows</div>
              )}
            </div>
          )}
        </div>

        {/* Main Work Area */}
        <div className="wfe-content">
          {type === "folder" ? (
            <div className="wfe-tiles-grid">
              {filteredChildren.map((child) => (
                <div
                  key={child.id}
                  className="wfe-tile-item"
                  onClick={() =>
                    onOpenPage(
                      child.id,
                      child.title,
                      child.icon,
                      `${path} > ${child.title}`,
                      null,
                      child.pageKey,
                      child.defaultSize,
                    )
                  }
                >
                  <div className="wfe-tile-icon wfe-tile-icon-lg">
                    {child.icon}
                  </div>
                  <span className="wfe-tile-title">{child.title}</span>
                  <span className="wfe-tile-desc">{child.desc}</span>
                </div>
              ))}
              {filteredChildren.length === 0 && (
                <div className="wfe-empty-folder">This folder is empty.</div>
              )}
            </div>
          ) : PageComponent ? (
            <PageComponent
              wallpaperUrl={wallpaperUrl}
              winWallpaperUrl={winWallpaperUrl}
              lockWallpaperUrl={lockWallpaperUrl}
              onSetWallpaper={onSetWallpaper}
              onSetWinWallpaper={onSetWinWallpaper}
              onSetLockWallpaper={onSetLockWallpaper}
              isFullscreen={isFullscreen}
              onToggleFullscreen={onToggleFullscreen}
              notifications={notifications}
              onMarkRead={onMarkRead}
              onMarkAllRead={onMarkAllRead}
              onDismiss={onDismiss}
            />
          ) : (
            <div className="wfe-page-not-found">
              <h3>Page Not Found</h3>
              <p>Page Key: {pageKey}</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="wfe-statusbar">
        <div>
          {type === "folder"
            ? `${filteredChildren.length} item(s) available`
            : "Operational Status: Ready"}
        </div>
        <div>User: Admin</div>
      </div>

      {/* Resize Zones */}
      {!maximized && (
        <>
          <div
            className="wfe-resize-handle wfe-resize-e"
            onMouseDown={(e) => handleResizeMouseDown(e, "e")}
          />
          <div
            className="wfe-resize-handle wfe-resize-s"
            onMouseDown={(e) => handleResizeMouseDown(e, "s")}
          />
          <div
            className="wfe-resize-handle wfe-resize-se"
            onMouseDown={(e) => handleResizeMouseDown(e, "se")}
          />
        </>
      )}
    </div>
  );
}
