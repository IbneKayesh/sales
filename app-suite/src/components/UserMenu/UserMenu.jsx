import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useToast } from '../../context/ToastContext';
import Avatar from '../Avatar/Avatar';
import styles from './UserMenu.module.css';

const formatDate = (iso) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return '—'; }
};

const UserMenu = () => {
  const { currentUser, logout, defaultAvatarImg } = useAuth();
  const { resetWindows } = useWindowManager();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  const close = useCallback(() => setIsOpen(false), []);

  const handleTriggerClick = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    close();
    resetWindows();
    logout();
    addToast({ message: 'You have been signed out successfully', type: 'info' });
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { close(); triggerRef.current?.focus(); }
    };
    const handlePointerDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) close();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen, close]);

  if (!currentUser) return null;

  const avatarSrc = currentUser.avatar || defaultAvatarImg;

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        ref={triggerRef}
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''}`}
        onClick={handleTriggerClick}
        aria-label="User profile options"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Avatar src={avatarSrc} alt={currentUser.displayName} size="small" />
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="menu" aria-label="User menu">
          {/* User header */}
          <div className={styles.userHeader}>
            <Avatar src={avatarSrc} alt={currentUser.displayName} size="large" />
            <div className={styles.userMeta}>
              <span className={styles.displayName}>{currentUser.displayName}</span>
              <span className={styles.username}>@{currentUser.username}</span>
              <span className={styles.email}>{currentUser.email}</span>
            </div>
          </div>

          <div className={styles.roleBadge}>{currentUser.role}</div>

          {currentUser.createdAt && (
            <div className={styles.memberSince}>
              Member since {formatDate(currentUser.createdAt)}
            </div>
          )}

          <div className={styles.divider} />

          <ul className={styles.menuList}>
            <li role="none">
              <button className={styles.menuItem} onClick={close}>
                Profile Settings
              </button>
            </li>
            <li role="none">
              <button className={styles.menuItem} onClick={close}>
                Preferences
              </button>
            </li>
            <li role="none">
              <button className={styles.menuItem} onClick={close}>
                Lock Screen
              </button>
            </li>
            <div className={styles.divider} />
            <li role="none">
              <button
                className={`${styles.menuItem} ${styles.menuItemDanger}`}
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
  );
};

export default UserMenu;
