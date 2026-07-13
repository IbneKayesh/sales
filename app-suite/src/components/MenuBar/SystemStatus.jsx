import React from 'react';
import styles from './SystemStatus.module.css';

const SystemStatus = () => {
  return (
    <div className={styles.statusIcons} aria-label="System status information">
      <button className={styles.iconBtn} aria-label="Search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.svgIcon}>
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>

      <button className={styles.iconBtn} aria-label="Wi-Fi Signal Strength">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.svgIcon}>
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
        </svg>
      </button>

      <button className={styles.iconBtn} aria-label="Battery Status">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.svgIconBattery}>
          <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
          <line x1="22" y1="11" x2="22" y2="13" strokeWidth="3" />
          <rect x="5" y="10" width="8" height="4" fill="currentColor" stroke="none" />
        </svg>
      </button>
    </div>
  );
};

export default SystemStatus;
