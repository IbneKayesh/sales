import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import styles from './ProtectedRoute.module.css';

const ProtectedRoute = () => {
  const { isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/home');
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.accessDenied}>
        <div className={styles.deniedCard}>
          <div className={styles.iconContainer}>
            <svg className={styles.lockIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <line x1="12" y1="15" x2="12" y2="18" />
              <line x1="9" y1="18" x2="15" y2="18" />
            </svg>
          </div>
          <h1 className={styles.deniedTitle}>Access Denied</h1>
          <p className={styles.deniedDescription}>
            You need to be signed in to access this area. Please log in or return to the home page.
          </p>
          <div className={styles.deniedActions}>
            <button className={styles.homeBtn} onClick={handleBackToHome}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Back to Home
            </button>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
