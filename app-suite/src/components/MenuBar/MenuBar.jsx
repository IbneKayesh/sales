// ═══════════════════════════════════════════════════════════════════════════
// ── MenuBar — Top System Bar ─────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
// Consolidated component that merges: AppBar, SystemStatus, UserMenu,
// Clock, FullscreenToggle, WindowMenu, and HelpMenu into one file.
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';

import { useNavigate } from 'react-router-dom';
import { useWindowManager } from '@/context/WindowManagerContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/FeedbackContext';

import RunningApps from '../RunningApps/RunningApps';
import WindowTabs from '../WindowTabs/WindowTabs';
import NotificationPanel from '../NotificationPanel/NotificationPanel';
import Avatar from '../Avatar/Avatar';
import { fmtDate } from '@/utils/dataFormat';
import {
  IconGrid, IconSearch, IconSettings, IconProfile,
  IconFullscreenEnter, IconFullscreenExit,
  IconMonitor, IconDelete, IconInfo, IconFile,
  IconSend, IconCheck, IconClose,
} from '@/assets/icons';
import './MenuBar.css';
// ═══════════════════════════════════════════════════════════════════════════
// ── Constants & Helpers ───────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const menuItems = ['File', 'Edit', 'View'];

// ═══════════════════════════════════════════════════════════════════════════
// ── MenuBar Component ────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

const MenuBar = ({ toggleLauncher, isLauncherOpen }) => {
  // ── Hooks ───────────────────────────────────────────────────────────────
  const { activeWindowId, windows, openWindow, resetWindows, closeAllWindows, minimizeAllWindows, restoreAllWindows } = useWindowManager();
  const { currentUser, logout, defaultAvatarImg } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // ── Derived state ───────────────────────────────────────────────────────
  const activeWindow = windows.find(
    (win) => win.id === activeWindowId && win.isOpen && !win.isMinimized
  );
  const activeAppName = activeWindow ? activeWindow.title : 'Desktop';

  const openCount = windows.filter((w) => w.isOpen && !w.isMinimized).length;
  const minimizedCount = windows.filter((w) => w.isMinimized).length;
  const hasOpen = openCount > 0 || minimizedCount > 0;
  const avatarSrc = currentUser?.avatar || defaultAvatarImg;

  // ═══════════════════════════════════════════════════════════════════════
  // ── Feature: Clock ──────────────────────────────────────────────────────
  // ═════════════════════════════════════════════════════════════════════════

  const [clockTime, setClockTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setClockTime(new Date()), 5000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    const options = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    return date.toLocaleDateString('en-US', options).replace(/,/g, '');
  };

  // ═══════════════════════════════════════════════════════════════════════
  // ── Feature: Fullscreen Toggle ──────────────────────────────────────────
  // ═════════════════════════════════════════════════════════════════════════

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // ── Feature: Window Menu (Show/Hide/Close All) ──────────────────────────
  // ═════════════════════════════════════════════════════════════════════════

  const [windowMenuOpen, setWindowMenuOpen] = useState(false);
  const windowContainerRef = useRef(null);
  const windowTriggerRef = useRef(null);

  const closeWindowMenu = useCallback(() => setWindowMenuOpen(false), []);

  const toggleWindowMenu = (e) => {
    e.stopPropagation();
    setWindowMenuOpen((prev) => !prev);
  };

  const handleWindowAction = (action) => {
    action();
    closeWindowMenu();
  };

  useEffect(() => {
    if (!windowMenuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { closeWindowMenu(); windowTriggerRef.current?.focus(); }
    };
    const handlePointerDown = (e) => {
      if (windowContainerRef.current && !windowContainerRef.current.contains(e.target)) closeWindowMenu();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [windowMenuOpen, closeWindowMenu]);

  // ═══════════════════════════════════════════════════════════════════════
  // ── Feature: Help Menu (Guidelines, Support, Version) ───────────────────
  // ═════════════════════════════════════════════════════════════════════════

  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const [helpModal, setHelpModal] = useState(null); // 'support' | 'version' | null
  const helpContainerRef = useRef(null);
  const helpTriggerRef = useRef(null);

  const closeHelpMenu = useCallback(() => setHelpMenuOpen(false), []);

  const toggleHelpMenu = (e) => {
    e.stopPropagation();
    setHelpMenuOpen((prev) => !prev);
  };

  const handleHelpAction = (modalType) => {
    setHelpModal(modalType);
    closeHelpMenu();
  };

  const handleHelpModalClose = () => {
    setHelpModal(null);
    helpTriggerRef.current?.focus();
  };

  useEffect(() => {
    if (!helpMenuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { closeHelpMenu(); helpTriggerRef.current?.focus(); }
    };
    const handlePointerDown = (e) => {
      if (helpContainerRef.current && !helpContainerRef.current.contains(e.target)) closeHelpMenu();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [helpMenuOpen, closeHelpMenu]);

  // ═══════════════════════════════════════════════════════════════════════
  // ── Feature: User Menu (Profile, Settings, Logout) ──────────────────────
  // ═════════════════════════════════════════════════════════════════════════

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userContainerRef = useRef(null);
  const userTriggerRef = useRef(null);

  const closeUserMenu = useCallback(() => setUserMenuOpen(false), []);

  const handleUserTriggerClick = (e) => {
    e.stopPropagation();
    setUserMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    closeUserMenu();
    resetWindows();
    logout();
    addToast({ message: 'You have been signed out successfully', type: 'info' });
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    if (!userMenuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { closeUserMenu(); userTriggerRef.current?.focus(); }
    };
    const handlePointerDown = (e) => {
      if (userContainerRef.current && !userContainerRef.current.contains(e.target)) closeUserMenu();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [userMenuOpen, closeUserMenu]);

  // ═══════════════════════════════════════════════════════════════════════
  // ── Render: Help Modals ─────────────────────────────────────────────────
  // ═════════════════════════════════════════════════════════════════════════

  const renderHelpModals = () => (
    <>
      {helpModal === 'support' && (
        <Modal title="Support Request" onClose={handleHelpModalClose}>
          <SupportRequestForm onClose={handleHelpModalClose} />
        </Modal>
      )}
      {helpModal === 'version' && (
        <Modal title="About App Suite" onClose={handleHelpModalClose}>
          <VersionInfo />
        </Modal>
      )}
    </>
  );

  // ═══════════════════════════════════════════════════════════════════════
  // ── Render: Window Menu Dropdown ────────────────────────────────────────
  // ═════════════════════════════════════════════════════════════════════════

  const renderWindowMenu = () => (
    <div className="windowContainer" ref={windowContainerRef}>
      <button
        ref={windowTriggerRef}
        className={`windowTrigger ${windowMenuOpen ? 'windowTriggerOpen' : ''}`}
        onClick={toggleWindowMenu}
        aria-label="Window menu"
        aria-expanded={windowMenuOpen}
        aria-haspopup="menu"
      >
        Window
      </button>
      {windowMenuOpen && (
        <div className="windowDropdown" role="menu" aria-label="Window menu">
          <div className="windowDropdownHeader">
            <span className="windowDropdownTitle">Window Actions</span>
            {hasOpen && (
              <span className="windowCount">
                {openCount} open{minimizedCount > 0 ? `, ${minimizedCount} hidden` : ''}
              </span>
            )}
          </div>
          <div className="windowMenuList">
            <button
              className="windowMenuItem"
              onClick={() => handleWindowAction(restoreAllWindows)}
              disabled={minimizedCount === 0}
              role="menuitem"
            >
              <IconMonitor className="windowMenuIcon" />
              <span className="windowMenuLabel">Show All Windows</span>
              {minimizedCount === 0 && <span className="windowMenuHint">No hidden windows</span>}
            </button>
            <button
              className="windowMenuItem"
              onClick={() => handleWindowAction(minimizeAllWindows)}
              disabled={openCount === 0}
              role="menuitem"
            >
              <IconMonitor className="windowMenuIcon" />
              <span className="windowMenuLabel">Hide All Windows</span>
              {openCount === 0 && <span className="windowMenuHint">No open windows</span>}
            </button>
            <div className="windowDivider" />
            <button
              className={`windowMenuItem windowMenuItemDanger`}
              onClick={() => handleWindowAction(closeAllWindows)}
              disabled={!hasOpen}
              role="menuitem"
            >
              <IconDelete className="windowMenuIcon" />
              <span className="windowMenuLabel">Close All Windows</span>
              {!hasOpen && <span className="windowMenuHint">No windows open</span>}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════
  // ── Render: Help Menu Dropdown ──────────────────────────────────────────
  // ═════════════════════════════════════════════════════════════════════════

  const renderHelpMenu = () => (
    <div className="helpContainer" ref={helpContainerRef}>
      <button
        ref={helpTriggerRef}
        className={`helpTrigger ${helpMenuOpen ? 'helpTriggerOpen' : ''}`}
        onClick={toggleHelpMenu}
        aria-label="Help menu"
        aria-expanded={helpMenuOpen}
        aria-haspopup="menu"
      >
        Help
      </button>
      {helpMenuOpen && (
        <div className="helpDropdown" role="menu" aria-label="Help menu">
          <div className="helpDropdownHeader">
            <span className="helpDropdownTitle">Help & Support</span>
          </div>
          <div className="helpMenuList">
            <button
              className="helpMenuItem"
              onClick={() => {
                window.open('https://docs.example.com/app-suite', '_blank', 'noopener,noreferrer');
                closeHelpMenu();
              }}
              role="menuitem"
            >
              <IconFile className="helpMenuIcon" />
              <span className="helpMenuLabel">Online Guideline</span>
              <span className="helpMenuHint">Open documentation</span>
            </button>
            <button
              className="helpMenuItem"
              onClick={() => handleHelpAction('support')}
              role="menuitem"
            >
              <IconSend className="helpMenuIcon" />
              <span className="helpMenuLabel">Support Request</span>
              <span className="helpMenuHint">Submit a ticket</span>
            </button>
            <div className="helpDivider" />
            <button
              className="helpMenuItem"
              onClick={() => handleHelpAction('version')}
              role="menuitem"
            >
              <IconInfo className="helpMenuIcon" />
              <span className="helpMenuLabel">Version</span>
              <span className="helpMenuHint">App information</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════
  // ── Render: User Menu Dropdown ──────────────────────────────────────────
  // ═════════════════════════════════════════════════════════════════════════

  const renderUserMenu = () => (
    currentUser && (
      <div className="userContainer" ref={userContainerRef}>
        <button
          ref={userTriggerRef}
          className={`userTrigger ${userMenuOpen ? 'userTriggerOpen' : ''}`}
          onClick={handleUserTriggerClick}
          aria-label="User profile options"
          aria-expanded={userMenuOpen}
          aria-haspopup="menu"
        >
          <Avatar src={avatarSrc} alt={currentUser.displayName} size="small" />
        </button>

        {userMenuOpen && (
          <div className="userDropdown" role="menu" aria-label="User menu">
            <div className="userHeader">
              <Avatar src={avatarSrc} alt={currentUser.displayName} size="large" />
              <div className="userMeta">
                <span className="displayName">{currentUser.displayName}</span>
                <span className="username">@{currentUser.username}</span>
                <span className="email">{currentUser.email}</span>
              </div>
            </div>

            <div className="roleBadge">{currentUser.role}</div>

            {currentUser.createdAt && (
              <div className="memberSince">
                Member since {fmtDate(currentUser.createdAt) || '—'}
              </div>
            )}

            <div className="userDivider" />

            <ul className="menuList">
              <li role="none">
                <button className="menuItem" onClick={() => { openWindow('profile'); closeUserMenu(); }}>
                  <IconProfile className="menuItemIcon" />
                  Profile Settings
                </button>
              </li>
              <li role="none">
                <button className="menuItem" onClick={() => { openWindow('settings'); closeUserMenu(); }}>
                  <IconSettings className="menuItemIcon" />
                  Preferences
                </button>
              </li>
              <li role="none">
                <button className="menuItem" onClick={closeUserMenu}>
                  Lock Screen
                </button>
              </li>
              <div className="userDivider" />
              <li role="none">
                <button
                  className={`menuItem menuItemDanger`}
                  role="menuitem"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    )
  );

  // ═══════════════════════════════════════════════════════════════════════
  // ── Main Render ─────────────────────────────────────────────────────────
  // ═════════════════════════════════════════════════════════════════════════

  return (
    <>
      <header className="menuBar" aria-label="System Menu Bar">
        {/* ── Left: Launcher, App Name, Static Menus ───────────────────── */}
        <div className="leftSection">
          <button
            className={`launcherBtn ${isLauncherOpen ? 'launcherBtnActive' : ''}`}
            onClick={toggleLauncher}
            aria-label="Open App Launcher"
            aria-expanded={isLauncherOpen}
          >
            <IconGrid className="launcherIcon" />
          </button>

          <span className="activeAppName">{activeAppName}</span>

          <nav className="staticMenu" aria-label="Application Menu">
            {menuItems.map((item) => (
              <button key={item} className="menuItemBtn">
                {item}
              </button>
            ))}
            {renderWindowMenu()}
            {renderHelpMenu()}
          </nav>
        </div>

        {/* ── Center: Window Tabs + Running Apps ──────────────────────── */}
        <div className="centerSection">
          <WindowTabs />
          <RunningApps />
        </div>

        {/* ── Right: System Status, Clock, Fullscreen, User Menu ──────── */}
        <div className="rightSection">
          {/* ── Status Icons ──────────────────────────────────────────── */}
          <div className="statusIcons">
            <button className="iconBtn" aria-label="Search">
              <IconSearch className="svgIcon" />
            </button>
            <NotificationPanel />
            <button
              className="iconBtn"
              aria-label="Settings"
              title="Settings"
              onClick={() => openWindow('settings')}
            >
              <IconSettings className="svgIcon" />
            </button>
          </div>

          <span className="divider" />

          {/* ── Clock ─────────────────────────────────────────────────── */}
          <div className="clock" aria-label="System Clock">
            {formatDateTime(clockTime)}
          </div>

          <span className="divider" />

          {/* ── Fullscreen Toggle ─────────────────────────────────────── */}
          <button
            className="fullscreenBtn"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <IconFullscreenExit className="fullscreenIcon" />
            ) : (
              <IconFullscreenEnter className="fullscreenIcon" />
            )}
          </button>

          <span className="divider" />

          {/* ── User Menu ─────────────────────────────────────────────── */}
          {renderUserMenu()}
        </div>
      </header>

      {/* ── Help Modals (rendered outside the header) ──────────────────── */}
      {renderHelpModals()}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ── Inline Components ─────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// ── Component: Modal (overlay dialog with exit animation) ─────────────────
const Modal = ({ title, children, onClose }) => {
  const modalRef = useRef(null);
  const [exiting, setExiting] = useState(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const handleClose = useCallback(() => {
    setExiting(true);
    setTimeout(() => onCloseRef.current?.(), 150);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  const handleOverlayClick = useCallback((e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  }, [handleClose]);

  return (
    <div
      className={`modalOverlay ${exiting ? 'modalOverlayExiting' : ''}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`modalDialog ${exiting ? 'modalDialogExiting' : ''}`}
      >
        <div className="modalHeader">
          <h2 id="help-modal-title" className="modalTitle">{title}</h2>
          <button
            className="modalCloseBtn"
            onClick={handleClose}
            aria-label="Close dialog"
          >
            <IconClose size={16} />
          </button>
        </div>
        <div className="modalBody">
          {children}
        </div>
      </div>
    </div>
  );
};

// ── Component: Support Request Form ───────────────────────────────────────
const SupportRequestForm = ({ onClose }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const subjectRef = useRef(null);

  useEffect(() => {
    subjectRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="successState">
        <div className="successIcon">
          <IconCheck size={32} />
        </div>
        <p className="successText">Support request sent successfully!</p>
        <p className="successSubtext">We'll get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form className="supportForm" onSubmit={handleSubmit}>
      <div className="formGroup">
        <label className="formLabel" htmlFor="support-subject">Subject</label>
        <input
          ref={subjectRef}
          id="support-subject"
          type="text"
          className="formInput"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Brief description of your issue…"
          maxLength={100}
          required
        />
      </div>
      <div className="formGroup">
        <label className="formLabel" htmlFor="support-message">Message</label>
        <textarea
          id="support-message"
          className="formTextarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your issue in detail…"
          rows={5}
          maxLength={1000}
          required
        />
        <span className="charCount">{message.length}/1000</span>
      </div>
      <div className="formFooter">
        <button type="button" className="formCancelBtn" onClick={onClose}>
          Cancel
        </button>
        <button
          type="submit"
          className="formSubmitBtn"
          disabled={!subject.trim() || !message.trim()}
        >
          <IconSend size={14} />
          Send Request
        </button>
      </div>
    </form>
  );
};

// ── Component: Version Info Display ───────────────────────────────────────
const VersionInfo = () => {
  const appVersion = '1.0.0';
  const buildDate = 'July 14, 2026';
  const appName = 'App Suite';

  return (
    <div className="versionInfo">
      <div className="versionLogo">
        <div className="versionLogoIcon">
          <IconInfo size={28} />
        </div>
      </div>
      <h3 className="versionAppName">{appName}</h3>
      <div className="versionDetails">
        <div className="versionRow">
          <span className="versionLabel">Version</span>
          <span className="versionValue">{appVersion}</span>
        </div>
        <div className="versionRow">
          <span className="versionLabel">Build Date</span>
          <span className="versionValue">{buildDate}</span>
        </div>
        <div className="versionRow">
          <span className="versionLabel">Environment</span>
          <span className="versionValue">{import.meta.env.MODE || 'production'}</span>
        </div>
      </div>
      <p className="versionCopyright">
        &copy; {new Date().getFullYear()} {appName}. All rights reserved.
      </p>
    </div>
  );
};

export default MenuBar;
