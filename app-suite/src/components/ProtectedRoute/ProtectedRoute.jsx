import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { IconLock, IconHomeArrow, IconLogout } from '@/assets/icons';
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
            <IconLock className={styles.lockIcon} />
          </div>
          <h1 className={styles.deniedTitle}>Access Denied</h1>
          <p className={styles.deniedDescription}>
            You need to be signed in to access this area. Please log in or return to the home page.
          </p>
          <div className={styles.deniedActions}>
            <button className={styles.homeBtn} onClick={handleBackToHome}>
              <IconHomeArrow width="16" height="16" />
              Back to Home
            </button>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <IconLogout width="16" height="16" />
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
