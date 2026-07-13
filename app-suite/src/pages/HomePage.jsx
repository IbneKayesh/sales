import React, { useState, useEffect } from 'react';
import styles from './HomePage.module.css';

const HomePage = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className={styles.container}>
      <div className={styles.heroSection}>
        <div className={styles.timeWidget}>
          <h1 className={styles.clock}>{formatTime(time)}</h1>
          <p className={styles.date}>{formatDate(time)}</p>
        </div>

        <div className={styles.welcomeWidget}>
          <h2 className={styles.greeting}>{getGreeting()}, Sarah</h2>
          <p className={styles.subtitle}>Welcome back to your workspace. All systems are fully operational.</p>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>System Status</h3>
          <div className={styles.statusList}>
            <div className={styles.statusItem}>
              <div className={styles.statusLabel}>
                <span>CPU Usage</span>
                <span>28%</span>
              </div>
              <div className={styles.progressBar}>
                <div className={`${styles.progressFill} ${styles.progressCpu}`} />
              </div>
            </div>
            
            <div className={styles.statusItem}>
              <div className={styles.statusLabel}>
                <span>Memory</span>
                <span>4.2 GB / 16 GB</span>
              </div>
              <div className={styles.progressBar}>
                <div className={`${styles.progressFill} ${styles.progressMem}`} />
              </div>
            </div>

            <div className={styles.statusItem}>
              <div className={styles.statusLabel}>
                <span>Storage</span>
                <span>124 GB / 512 GB</span>
              </div>
              <div className={styles.progressBar}>
                <div className={`${styles.progressFill} ${styles.progressStorage}`} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Quick Access</h3>
          <div className={styles.shortcutsList}>
            <div className={styles.shortcutItem}>
              <div className={`${styles.iconCircle} ${styles.blueIcon}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div className={styles.shortcutText}>
                <div className={styles.shortcutName}>Project_Proposal.pdf</div>
                <div className={styles.shortcutMeta}>Modified 2 hours ago • 4.2 MB</div>
              </div>
            </div>

            <div className={styles.shortcutItem}>
              <div className={`${styles.iconCircle} ${styles.pinkIcon}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div className={styles.shortcutText}>
                <div className={styles.shortcutName}>Hero_Banner_Dark.png</div>
                <div className={styles.shortcutMeta}>Modified Yesterday • 12.8 MB</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
