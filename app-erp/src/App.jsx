import React, { useState, useEffect } from 'react';
import DesktopUI from './pages/layout/DesktopUI';
import AppsDrawerUI from './pages/layout/desktop/AppsDrawerUI';
import PagesUI from './pages/layout/PagesUI';
import TaskbarUI from './pages/layout/TaskbarUI';
import LoggedUserUI from './pages/layout/taskbar/LoggedUserUI';
import WindowsOverview from './pages/layout/taskbar/WindowsOverview';
import NotificationPopup from './pages/layout/taskbar/NotificationPopup';
import './App.css';

// Default mock logged-in user
const defaultUser = {
  name: 'Jane Doe',
  role: 'Finance & Sales Admin',
  avatarText: 'JD',
  loggedIn: true
};

export default function App() {
  const [user, setUser] = useState(defaultUser);
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [showProfileFlyout, setShowProfileFlyout] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  
  // Enhancement states
  const [desktopIcons, setDesktopIcons] = useState([]); // List of opened pages shortcuts
  const [showAwe, setShowAwe] = useState(false); // App Window Explore start popup visibility
  const [wallpaperUrl, setWallpaperUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop');
  const [winWallpaperUrl, setWinWallpaperUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop');
  const [lockWallpaperUrl, setLockWallpaperUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop');
  const [isFullscreen, setIsFullscreen] = useState(false);


  // Notifications and Overview states
  const [showOverview, setShowOverview] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      icon: '📦',
      title: 'Low Stock Warning',
      body: 'Safety threshold breached for item SKU-7748. Current stock: 4 units.',
      timestamp: 'Just now',
      read: false,
    },
    {
      id: 'notif-2',
      icon: '📝',
      title: 'New Sales Order',
      body: 'Sales Order SO-1093 has been created by Jane Doe for $1,280.00.',
      timestamp: '10 mins ago',
      read: false,
    },
    {
      id: 'notif-3',
      icon: '👤',
      title: 'User Profile Updated',
      body: 'Your workspace preferences were successfully synchronized.',
      timestamp: '2 hours ago',
      read: true,
    },
    {
      id: 'notif-4',
      icon: '🔒',
      title: 'Security Alert',
      body: 'Login detected from a new browser footprint.',
      timestamp: 'Yesterday',
      read: false,
    },
  ]);

  const handleMarkRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Sync isFullscreen state with browser fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error("Error entering fullscreen:", err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch(err => console.error("Error exiting fullscreen:", err));
      }
    }
  };

  // Disable mouse right click browser context menus globally
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // Lock screen date/time
  const [lockTime, setLockTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setLockTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Show Desktop state: null means not in 'show-desktop mode';
  // when active, stores an array of window IDs that were visible before minimizing all
  const [showDesktopActive, setShowDesktopActive] = useState(false);
  const [preDesktopWindowIds, setPreDesktopWindowIds] = useState([]);

  // Window Management Actions
  // Atomic focusWindow: un-minimizes + raises z-index in a single setState call
  const focusWindow = (id) => {
    setActiveWindowId(id);
    setMaxZIndex(prev => {
      const newZ = prev + 1;
      setWindows(wins =>
        wins.map(win =>
          win.id === id
            ? { ...win, zIndex: newZ, minimized: false }
            : win
        )
      );
      return newZ;
    });
  };

  // Show Desktop toggle: minimize all visible windows or restore previous state
  const handleToggleShowDesktop = () => {
    if (!showDesktopActive) {
      // Save IDs of currently visible windows, then minimize all
      const visibleIds = windows.filter(w => !w.minimized).map(w => w.id);
      setPreDesktopWindowIds(visibleIds);
      setWindows(prev => prev.map(win => ({ ...win, minimized: true })));
      setActiveWindowId(null);
      setShowDesktopActive(true);
    } else {
      // Restore previously visible windows
      setWindows(prev =>
        prev.map(win =>
          preDesktopWindowIds.includes(win.id)
            ? { ...win, minimized: false }
            : win
        )
      );
      if (preDesktopWindowIds.length > 0) {
        setActiveWindowId(preDesktopWindowIds[preDesktopWindowIds.length - 1]);
      }
      setShowDesktopActive(false);
    }
  };

  // Open a specific page window (form) with custom size constraints
  const handleOpenPage = (id, title, icon, path, children, pageKey, defaultSize) => {
    // If a window for this page is already open, focus and restore it
    const existing = windows.find(win => win.id === id);
    if (existing) {
      setWindows(prev => prev.map(win => win.id === id ? { ...win, minimized: false } : win));
      focusWindow(id);
      return;
    }

    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);

    // Stagger window spawn position slightly
    const offsetCount = windows.length * 25;
    
    // Default size calculations: small, medium, fullscreen
    let size = { w: 760, h: 480 }; // Default medium
    let maximized = false;
    
    if (defaultSize === 'small') {
      size = { w: 480, h: 360 };
    } else if (defaultSize === 'medium') {
      size = { w: 760, h: 480 };
    } else if (defaultSize === 'fullscreen') {
      maximized = true;
    }

    const newWindow = {
      id,
      title,
      icon,
      type: pageKey ? 'page' : 'folder',
      path,
      children,
      pageKey,
      position: { x: 150 + offsetCount, y: 120 + offsetCount },
      size,
      maximized,
      minimized: false,
      zIndex: newZIndex,
      defaultSize
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(id);
    setShowDesktopActive(false); // Exit show-desktop mode when a new window is opened

    // Add to Desktop Icons (shortcuts) if not already present (no duplicates)
    setDesktopIcons(prev => {
      const exists = prev.find(item => item.id === id);
      if (!exists) {
        return [...prev, { id, title, icon, pageKey, defaultSize }];
      }
      return prev;
    });
  };

  const handleOpenDesktopIcon = (iconData) => {
    const existing = windows.find(win => win.id === iconData.id);
    if (existing) {
      setWindows(prev => prev.map(win => win.id === iconData.id ? { ...win, minimized: false } : win));
      focusWindow(iconData.id);
    } else {
      // Re-launch closed page WFE using desktop shortcut
      handleOpenPage(
        iconData.id,
        iconData.title,
        iconData.icon,
        `System Root > Shortcuts > ${iconData.title}`,
        null,
        iconData.pageKey,
        iconData.defaultSize
      );
    }
  };

  const handleOpenSettings = () => {
    handleOpenPage(
      'system-settings-win',
      'System Settings',
      '⚙️',
      'System Root > Control Panel > Settings',
      null,
      'SettingsPage',
      'medium'
    );
  };

  const handleOpenNotificationsPage = () => {
    handleOpenPage(
      'notification-log-win',
      'Notifications Log',
      '🔔',
      'System Root > System Services > Notifications',
      null,
      'NotificationPage',
      'medium'
    );
  };

  const handleCloseWindow = (id) => {
    setWindows(prev => prev.filter(win => win.id !== id));
    if (activeWindowId === id) {
      const remaining = windows.filter(win => win.id !== id);
      if (remaining.length > 0) {
        const sorted = [...remaining].sort((a, b) => b.zIndex - a.zIndex);
        setActiveWindowId(sorted[0].id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const handleToggleMinimize = (id) => {
    setWindows(prev => prev.map(win => {
      if (win.id === id) {
        const newMinimized = !win.minimized;
        return { ...win, minimized: newMinimized };
      }
      return win;
    }));

    const targetWin = windows.find(win => win.id === id);
    if (targetWin && !targetWin.minimized && activeWindowId === id) {
      const remaining = windows.filter(win => win.id !== id && !win.minimized);
      if (remaining.length > 0) {
        const sorted = [...remaining].sort((a, b) => b.zIndex - a.zIndex);
        setActiveWindowId(sorted[0].id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const handleToggleMaximize = (id) => {
    setWindows(prev => prev.map(win => win.id === id ? { ...win, maximized: !win.maximized } : win));
    focusWindow(id);
  };

  const handleUpdatePosition = (id, newPos) => {
    setWindows(prev => prev.map(win => win.id === id ? { ...win, position: newPos } : win));
  };

  const handleUpdateSize = (id, newSize) => {
    setWindows(prev => prev.map(win => win.id === id ? { ...win, size: newSize } : win));
  };

  // Bulk window management actions for Taskbar menu
  const handleCloseAll = () => {
    setWindows([]);
    setActiveWindowId(null);
  };

  const handleMinimizeAll = () => {
    setWindows(prev => prev.map(win => ({ ...win, minimized: true })));
    setActiveWindowId(null);
  };

  const handleMaximizeAll = () => {
    setWindows(prev => prev.map(win => ({ ...win, maximized: true, minimized: false })));
  };

  // Tile windows in a simple responsive grid across the desktop viewport
  const handleTileAll = () => {
    const visible = windows.filter(w => !w.minimized);
    if (visible.length === 0) return;
    const cols = Math.ceil(Math.sqrt(visible.length));
    const rows = Math.ceil(visible.length / cols);
    const vw = window.innerWidth;
    const vh = window.innerHeight - 48; // subtract taskbar
    const tileW = Math.floor(vw / cols);
    const tileH = Math.floor(vh / rows);
    setWindows(prev =>
      prev.map(win => {
        if (win.minimized) return win;
        const idx = visible.findIndex(v => v.id === win.id);
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        return {
          ...win,
          maximized: false,
          position: { x: col * tileW, y: row * tileH },
          size: { w: tileW, h: tileH },
        };
      })
    );
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({ ...defaultUser, loggedIn: true });
    setPasswordInput('');
    // Auto request fullscreen on login
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.log("Fullscreen request deferred or denied:", err));
    }
  };

  const handleLogout = () => {
    setUser({ ...user, loggedIn: false });
    setWindows([]);
    setDesktopIcons([]); // Clear shortcuts on logout
    setActiveWindowId(null);
    setShowProfileFlyout(false);
    setShowAwe(false);
    // Exit fullscreen on logout
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.log("Error exiting fullscreen on logout:", err));
    }
  };

  // Lock Screen rendering
  if (!user.loggedIn) {
    const formattedLockTime = lockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const formattedLockDate = lockTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
    
    return (
      <div
        className="lockscreen-container"
        style={{ '--wallpaper-url': '', '--lockscreen-wallpaper-opacity': 0 }}
        onContextMenu={(e) => e.preventDefault()}
      >

        {/* Top Clock */}
        <div className="lockscreen-clock-container">
          <h1 className="lockscreen-time">{formattedLockTime}</h1>
          <h2 className="lockscreen-date">{formattedLockDate}</h2>
        </div>

        {/* Login Form Box */}
        <form className="lockscreen-login-box acrylic-container" onSubmit={handleLogin}>
          <div className="profile-avatar-large lockscreen-form-avatar">JD</div>
          <h3 className="lockscreen-form-name">Jane Doe</h3>
          <p className="lockscreen-form-role">Finance & Sales Admin</p>

          <input 
            type="password" 
            placeholder="Enter password (any value)" 
            className="lockscreen-input"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            autoFocus
          />

          <button type="submit" className="lockscreen-btn">
            Sign In
          </button>
        </form>

        <div className="lockscreen-footer">
          ⚡ Connected to ERP Enterprise Cloud Services
        </div>
      </div>
    );
  }

  // Main Desktop Environment rendering
  return (
    <div

      className="desktop-wrapper"
      style={{ backgroundImage: `url(${wallpaperUrl})` }}
      onContextMenu={(e) => e.preventDefault()}
    >

      {/* Dynamic desktop icons layout (shortcuts of opened pages, sorted) */}
      <DesktopUI
        desktopIcons={desktopIcons}
        onOpenIcon={handleOpenDesktopIcon}
        onSetWallpaper={setWallpaperUrl}
        onOpenSettings={handleOpenSettings}
      />


      {/* Render open Windows Explorer popup containers */}
      {windows.map((win) => (
        <PagesUI
          key={win.id}
          windowData={win}
          activeWindowId={activeWindowId}
          windows={windows}
          onClose={handleCloseWindow}
          onMinimize={handleToggleMinimize}
          onMaximize={handleToggleMaximize}
          onFocus={focusWindow}
          onUpdatePosition={handleUpdatePosition}
          onUpdateSize={handleUpdateSize}
          onOpenPage={handleOpenPage}
          wallpaperUrl={wallpaperUrl}          /* desktop wallpaper */
          winWallpaperUrl={winWallpaperUrl}    /* explorer wallpaper setting */
          lockWallpaperUrl={lockWallpaperUrl}  /* lock wallpaper setting */
          onSetWallpaper={setWallpaperUrl}
          onSetWinWallpaper={setWinWallpaperUrl}
          onSetLockWallpaper={setLockWallpaperUrl}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          notifications={notifications}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
          onDismiss={handleDismissNotification}
        />
      ))}


      {/* Bottom Taskbar */}
      <TaskbarUI
        windows={windows}
        activeWindowId={activeWindowId}
        onToggleMinimize={handleToggleMinimize}
        onFocus={focusWindow}
        user={user}
        onProfileClick={() => setShowProfileFlyout(!showProfileFlyout)}
        onStartClick={() => setShowAwe(!showAwe)}
        onCloseAll={handleCloseAll}
        onMinimizeAll={handleMinimizeAll}
        onMaximizeAll={handleMaximizeAll}
        onTileAll={handleTileAll}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        showDesktopActive={showDesktopActive}
        onToggleShowDesktop={handleToggleShowDesktop}
        onToggleOverview={() => setShowOverview(prev => !prev)}
        unreadNotifCount={notifications.filter(n => !n.read).length}
        onToggleNotifications={() => setShowNotifications(prev => !prev)}
      />

      {/* App Window Explore (AWE) Start Popup Menu */}
      {showAwe && (
        <AppsDrawerUI
          user={user}
          onOpenPage={handleOpenPage}
          onClose={() => setShowAwe(false)}
        />
      )}


      {/* Profile settings card overlay */}
      {showProfileFlyout && (
        <LoggedUserUI
          user={user}
          onLogout={handleLogout}
          onClose={() => setShowProfileFlyout(false)}
        />
      )}

      {/* Notification popup flyout */}
      {showNotifications && (
        <NotificationPopup
          notifications={notifications}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
          onDismiss={handleDismissNotification}
          onOpenPage={handleOpenNotificationsPage}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {/* Windows Overview overlay */}
      {showOverview && (
        <WindowsOverview
          windows={windows}
          onFocusWindow={focusWindow}
          onClose={() => setShowOverview(false)}
        />
      )}
    </div>
  );
}
