import React, { useState } from "react";
import { rootMenus } from "../../../config/menuConfig";

export default function AppsDrawerUI({ user, onOpenPage, onClose }) {
  const [currentView, setCurrentView] = useState("roots");
  const [searchQuery, setSearchQuery] = useState("");

  const handleRootTileClick = (menu) => {
    setCurrentView(menu);
    setSearchQuery("");
  };

  const handleBackClick = () => {
    setCurrentView("roots");
    setSearchQuery("");
  };

  const handleChildTileClick = (child) => {
    const parentPath = currentView.path;
    onOpenPage(
      child.id,
      child.title,
      child.icon,
      `${parentPath} > ${child.title}`,
      null,
      child.pageKey,
      child.defaultSize,
    );
    onClose();
  };

  let displayedTiles = [];
  if (currentView === "roots") {
    displayedTiles = rootMenus.filter((menu) =>
      menu.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  } else {
    displayedTiles = currentView.children.filter(
      (child) =>
        child.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        child.desc.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  const groupNames = [];
  const groups = {};
  if (currentView !== "roots") {
    displayedTiles.forEach((child) => {
      const g = child.group || "General";
      if (!groups[g]) {
        groups[g] = [];
        groupNames.push(g);
      }
      groups[g].push(child);
    });
  }

  return (
    <>
      <div className="awe-backdrop" onClick={onClose} />

      <div
        className="awe-container acrylic-container"
        style={{ zIndex: 9999 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="awe-title-header">
          {currentView === "roots"
            ? "Application Suites"
            : currentView.title}
        </div>

        <div className="awe-search-bar">
          <div className="awe-search-box">
            {currentView !== "roots" && (
              <button
                className="awe-back-btn awb-back-trigger"
                onClick={handleBackClick}
                title="Back to All Apps"
                aria-label="Back to All Apps"
              >
                ←
              </button>
            )}

            <span className="awe-search-icon" aria-hidden="true">
              🔍
            </span>

            <input
              type="text"
              className="awe-search-input"
              placeholder={
                currentView === "roots"
                  ? "Search app suites…"
                  : `Search in ${currentView.title}…`
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              aria-label="Search"
            />

            {searchQuery.trim().length > 0 && (
              <button
                type="button"
                className="awe-clear-btn"
                onClick={() => setSearchQuery("")}
                title="Clear"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="awe-body">
          {currentView === "roots" ? (
            <div className="awe-grid" role="list">
              {displayedTiles.map((menu) => (
                <button
                  key={menu.id}
                  type="button"
                  className="awe-tile"
                  onClick={() => handleRootTileClick(menu)}
                  role="listitem"
                  aria-label={menu.title}
                >
                  <div className="awe-tile-icon" data-accent-color={menu.color}>
                    {menu.icon}
                  </div>
                  <span className="awe-tile-title">{menu.title}</span>
                  <span className="awe-tile-desc">
                    {menu.children.length} app(s)
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="awe-grouped-view" role="list">
              {groupNames.map((groupName) => (
                <div className="awe-group-section" key={groupName}>
                  <div className="awe-group-header">
                    <span>{groupName}</span>
                    <div className="awe-group-line" />
                  </div>
                  <div className="awe-group-tiles" role="list">
                    {groups[groupName].map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        className="awe-tile"
                        onClick={() => handleChildTileClick(child)}
                        role="listitem"
                        aria-label={child.title}
                      >
                        <div className="awe-tile-icon">{child.icon}</div>
                        <span className="awe-tile-title">{child.title}</span>
                        <span className="awe-tile-desc">{child.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {displayedTiles.length === 0 && (
            <div className="awe-empty-state">
              <div className="awe-empty-icon">😕</div>
              <div>No matches found for “{searchQuery}”</div>
              <div className="awe-empty-hint">Try a shorter keyword.</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
