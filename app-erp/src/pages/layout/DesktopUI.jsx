import React, { useState, useEffect, useRef } from 'react';

const wallpaperPresets = [
  { name: 'Abstract Silk (Default)', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop' },
  { name: 'Deep Nebula', url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1920&auto=format&fit=crop' },
  { name: 'Alpine Forest', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1920&auto=format&fit=crop' },
  { name: 'Obsidian Flow', url: 'https://images.unsplash.com/photo-1618005198143-d3667c376f9d?q=80&w=1920&auto=format&fit=crop' }
];

export default function DesktopUI({
  desktopIcons = [],
  onOpenIcon,
  onSetWallpaper,
  onOpenSettings
}) {
  const [contextMenu, setContextMenu] = useState(null); // { x, y }
  const menuRef = useRef(null);

  // Sort desktop icons alphabetically (ascending order)
  const sortedIcons = [...desktopIcons].sort((a, b) => a.title.localeCompare(b.title));

  const handleContextMenu = (e) => {
    // Only trigger if clicked directly on the desktop background container or grid background
    if (e.target.closest('.desktop-icon') || e.target.closest('.wfe-window')) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY
    });
  };

  // Close context menu on left-click outside or window blur
  useEffect(() => {
    if (!contextMenu) return;
    const closeMenu = (e) => {
      // Don't close if clicking inside the menu itself
      if (menuRef.current && menuRef.current.contains(e.target)) {
        return;
      }
      setContextMenu(null);
    };
    document.addEventListener('mousedown', closeMenu);
    return () => {
      document.removeEventListener('mousedown', closeMenu);
    };
  }, [contextMenu]);

  const handleSelectPreset = (url) => {
    onSetWallpaper(url);
    setContextMenu(null);
  };

  const handleResetWallpaper = () => {
    onSetWallpaper('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop');
    setContextMenu(null);
  };

  const handleOpenSettingsClick = () => {
    onOpenSettings();
    setContextMenu(null);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: '16px',
        overflow: 'hidden',
      }}
      onContextMenu={handleContextMenu}
    >
      <div className="desktop-grid">
        {sortedIcons.map((iconData) => (
          <div
            key={iconData.id}
            className="desktop-icon"
            onDoubleClick={() => onOpenIcon(iconData)}
            onClick={() => onOpenIcon(iconData)} // Easy access click
            title={`Double click to open ${iconData.title}`}
          >
            <div className="desktop-icon-img" style={{ fontSize: '32px' }}>
              {iconData.icon || '📁'}
            </div>
            <span className="desktop-icon-text">{iconData.title}</span>
          </div>
        ))}
      </div>

      {/* Custom Context Menu */}
      {contextMenu && (
        <div
          ref={menuRef}
          className="desktop-context-menu"
          style={{
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
          }}
        >
          {/* Submenu container for wallpapers */}
          <div className="context-submenu-container">
            <button className="context-menu-item">
              <span>🖼️</span>
              <span>Change Wallpaper</span>
              <span style={{ marginLeft: 'auto', fontSize: '10px', opacity: 0.7 }}>▶</span>
            </button>
            <div className="context-submenu">
              {wallpaperPresets.map((wp) => (
                <button
                  key={wp.name}
                  className="context-menu-item"
                  onClick={() => handleSelectPreset(wp.url)}
                >
                  <span>🌅</span>
                  <span>{wp.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button className="context-menu-item" onClick={handleResetWallpaper}>
            <span>🔄</span>
            <span>Reset Wallpaper</span>
          </button>

          <div className="context-menu-divider" />

          <button className="context-menu-item" onClick={handleOpenSettingsClick}>
            <span>⚙️</span>
            <span>System Settings</span>
          </button>
        </div>
      )}
    </div>
  );
}