import React from 'react';
import { NavLink } from 'react-router-dom';
import { getNavBarApps } from '@/routes/appConfig';
import styles from './RunningApps.module.css';

const RunningApps = () => {
  const apps = getNavBarApps();

  return (
    <nav className={styles.nav} aria-label="Running Applications">
      {apps.map((app) => (
        <NavLink
          key={app.id}
          to={app.url}
          className={({ isActive }) =>
            `${styles.appItem} ${isActive ? styles.appItemActive : ''}`
          }
          end={app.url === '/'}
        >
          <span className={styles.indicator} />
          <span className={styles.appName}>{app.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default RunningApps;
