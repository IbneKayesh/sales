import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './RunningApps.module.css';

const apps = [
  { name: 'Home', path: '/' },
  { name: 'Files', path: '/files' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Settings', path: '/settings' }
];

const RunningApps = () => {
  return (
    <nav className={styles.nav} aria-label="Running Applications">
      {apps.map((app) => (
        <NavLink
          key={app.path}
          to={app.path}
          className={({ isActive }) =>
            `${styles.appItem} ${isActive ? styles.appItemActive : ''}`
          }
          end={app.path === '/'}
        >
          <span className={styles.indicator} />
          <span className={styles.appName}>{app.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default RunningApps;
