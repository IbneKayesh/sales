import React from 'react';

const presetWallpapers = [
  {
    name: 'Abstract Silk (Default)',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=150&auto=format&fit=crop',
  },
  {
    name: 'Deep Nebula',
    url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1920&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=150&auto=format&fit=crop',
  },
  {
    name: 'Alpine Forest',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1920&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=150&auto=format&fit=crop',
  },
  {
    name: 'Obsidian Flow',
    url: 'https://images.unsplash.com/photo-1618005198143-d3667c376f9d?q=80&w=1920&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1618005198143-d3667c376f9d?q=80&w=150&auto=format&fit=crop',
  }
];

export default function SettingsPage({
  wallpaperUrl,
  winWallpaperUrl,
  lockWallpaperUrl,
  onSetWallpaper,
  onSetWinWallpaper,
  onSetLockWallpaper,
  isFullscreen,
  onToggleFullscreen
}) {
  const handleWallpaperSelect = (url) => {
    onSetWallpaper(url);
  };

  const defaultWallpaperUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop';

  const handleResetWallpaper = () => {
    onSetWallpaper(defaultWallpaperUrl);
  };


  const handleWinWallpaperSelect = (url) => {
    onSetWinWallpaper(url);
  };

  const handleResetWinWallpaper = () => {
    onSetWinWallpaper(defaultWallpaperUrl);
  };


  const handleLockWallpaperSelect = (url) => {
    onSetLockWallpaper(url);
  };

  const handleResetLockWallpaper = () => {
    onSetLockWallpaper(defaultWallpaperUrl);
  };



  return (
    <div style={{ padding: '20px', fontFamily: 'var(--font-family)', color: 'var(--text-primary)', animation: 'windowOpen 0.2s ease' }}>
      
      {/* Page Title */}
      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ⚙️ System Settings
      </h2>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Manage desktop display preferences, window size specifications, and personalization options.
      </p>

      {/* Grid of Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Desktop Wallpaper Personalization Card */}
        <div className="erp-card" style={{ display: 'block', padding: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>🎨 Desktop Personalization</h3>

          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Choose a premium high-definition background or restore the default system artwork.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            {presetWallpapers.map((wp) => {
              const isActive = wallpaperUrl === wp.url;
              return (
                <div
                  key={wp.name}
                  onClick={() => handleWallpaperSelect(wp.url)}
                  style={{
                    position: 'relative',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: isActive ? '2px solid var(--accent-light)' : '1px solid var(--border-acrylic)',
                    boxShadow: isActive ? 'var(--accent-glow) 0px 0px 8px' : 'none',
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img
                    src={wp.thumbnail}
                    alt={wp.name}
                    style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{
                    padding: '6px',
                    fontSize: '10.5px',
                    textAlign: 'center',
                    background: 'rgba(0, 0, 0, 0.4)',
                    color: isActive ? 'var(--accent-light)' : 'var(--text-primary)',
                    fontWeight: isActive ? '600' : '400',
                  }}>
                    {wp.name}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleResetWallpaper}
            className="erp-search-btn"
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              borderRadius: '4px',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-acrylic)',
              color: 'var(--text-primary)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          >
            Reset Wallpaper to Default
          </button>
        </div>

        {/* WinFileExplore Wallpaper Personalization Card */}
        <div className="erp-card" style={{ display: 'block', padding: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>🗂️ File Explorer Personalization</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Choose a premium background for WinFileExplore windows.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            {presetWallpapers.map((wp) => {
              const isActive = winWallpaperUrl === wp.url;
              return (
                <div
                  key={wp.name}
                  onClick={() => handleWinWallpaperSelect(wp.url)}
                  style={{
                    position: 'relative',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: isActive ? '2px solid var(--accent-light)' : '1px solid var(--border-acrylic)',
                    boxShadow: isActive ? 'var(--accent-glow) 0px 0px 8px' : 'none',
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img
                    src={wp.thumbnail}
                    alt={wp.name}
                    style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block' }}
                  />
                  <div
                    style={{
                      padding: '6px',
                      fontSize: '10.5px',
                      textAlign: 'center',
                      background: 'rgba(0, 0, 0, 0.4)',
                      color: isActive ? 'var(--accent-light)' : 'var(--text-primary)',
                      fontWeight: isActive ? '600' : '400',
                    }}
                  >
                    {wp.name}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleResetWinWallpaper}
            className="erp-search-btn"
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              borderRadius: '4px',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-acrylic)',
              color: 'var(--text-primary)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          >
            Reset Explorer Wallpaper to Default
          </button>
        </div>

        {/* Locked Screen Wallpaper Personalization Card */}
        <div className="erp-card" style={{ display: 'block', padding: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>🔒 Locked Screen Personalization</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Choose a premium background for the lock screen.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            {presetWallpapers.map((wp) => {
              const isActive = lockWallpaperUrl === wp.url;
              return (
                <div
                  key={wp.name}
                  onClick={() => handleLockWallpaperSelect(wp.url)}
                  style={{
                    position: 'relative',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: isActive ? '2px solid var(--accent-light)' : '1px solid var(--border-acrylic)',
                    boxShadow: isActive ? 'var(--accent-glow) 0px 0px 8px' : 'none',
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img
                    src={wp.thumbnail}
                    alt={wp.name}
                    style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block' }}
                  />
                  <div
                    style={{
                      padding: '6px',
                      fontSize: '10.5px',
                      textAlign: 'center',
                      background: 'rgba(0, 0, 0, 0.4)',
                      color: isActive ? 'var(--accent-light)' : 'var(--text-primary)',
                      fontWeight: isActive ? '600' : '400',
                    }}
                  >
                    {wp.name}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleResetLockWallpaper}
            className="erp-search-btn"
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              borderRadius: '4px',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-acrylic)',
              color: 'var(--text-primary)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          >
            Reset Lock Wallpaper to Default
          </button>
        </div>

        {/* Display and Screen Mode */}
        <div className="erp-card" style={{ display: 'block', padding: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>🖥️ Screen & Display Settings</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Toggle full-screen environment view mode. Useful for production-grade desktop emulation.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '4px', border: '1px solid var(--border-acrylic)' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '500' }}>Browser Fullscreen Mode (F11 Equivalent)</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Currently: {isFullscreen ? 'Enabled' : 'Disabled'}</div>
            </div>
            <button
              onClick={onToggleFullscreen}
              style={{
                padding: '8px 16px',
                fontSize: '12.5px',
                borderRadius: '4px',
                cursor: 'pointer',
                background: isFullscreen ? 'var(--accent-dark)' : 'var(--accent-color)',
                border: 'none',
                color: 'white',
                fontWeight: '500',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {isFullscreen ? 'Exit Full Screen' : 'Go Full Screen'}
            </button>
          </div>
        </div>

        {/* Default Window Sizes Specifications */}
        <div className="erp-card" style={{ display: 'block', padding: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>📐 Window Form Specifications</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Overview of standard sizes allocated to specific windows within this ERP system:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
              <span>📏 Small Layout Form</span>
              <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>480px × 360px</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
              <span>📏 Medium Layout Form</span>
              <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>760px × 480px</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', paddingBottom: '4px' }}>
              <span>🗖 Full Screen (Pre-maximized)</span>
              <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>Viewport-adjusted</span>
            </div>
          </div>
        </div>

        {/* System Details Info */}
        <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
          🚀 Antigravity ERP Desktop System v1.2.0 • Running React 18+ • Secured Session
        </div>
      </div>
    </div>
  );
}
