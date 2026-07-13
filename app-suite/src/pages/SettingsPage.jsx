import React, { useState } from 'react';
import styles from './SettingsPage.module.css';

const sections = [
  { id: 'appearance', label: 'Appearance' },
  { id: 'system', label: 'System' },
  { id: 'account', label: 'Account' },
];

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('appearance');
  const [darkMode, setDarkMode] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [hostname, setHostname] = useState('Sarah-OS-Workstation');

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>System Settings</h1>
        <p className={styles.subtitle}>Configure preferences and user customization options</p>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <nav className={styles.sideNav} aria-label="Settings Categories">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`${styles.navBtn} ${activeSection === section.id ? styles.navBtnActive : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className={styles.contentPane}>
          {activeSection === 'appearance' && (
            <div className={styles.sectionBody}>
              <h2 className={styles.sectionTitle}>Appearance Preferences</h2>
              <div className={styles.settingGroup}>
                <div className={styles.settingRow}>
                  <div className={styles.settingText}>
                    <div className={styles.settingLabel}>Dark Mode</div>
                    <div className={styles.settingDesc}>Use dark styles across all system UI.</div>
                  </div>
                  <button
                    className={`${styles.toggle} ${darkMode ? styles.toggleOn : ''}`}
                    onClick={() => setDarkMode(!darkMode)}
                    aria-label="Toggle Dark Mode"
                  >
                    <span className={styles.toggleKnob} />
                  </button>
                </div>

                <div className={styles.settingRow}>
                  <div className={styles.settingText}>
                    <div className={styles.settingLabel}>System Animations</div>
                    <div className={styles.settingDesc}>Enable transitions and active micro-animations.</div>
                  </div>
                  <button
                    className={`${styles.toggle} ${animations ? styles.toggleOn : ''}`}
                    onClick={() => setAnimations(!animations)}
                    aria-label="Toggle Animations"
                  >
                    <span className={styles.toggleKnob} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'system' && (
            <div className={styles.sectionBody}>
              <h2 className={styles.sectionTitle}>System Details</h2>
              <div className={styles.settingGroup}>
                <div className={styles.settingCol}>
                  <label htmlFor="hostname-input" className={styles.inputLabel}>Device Hostname</label>
                  <input
                    id="hostname-input"
                    type="text"
                    value={hostname}
                    onChange={(e) => setHostname(e.target.value)}
                    className={styles.textField}
                  />
                  <span className={styles.inputHelp}>This hostname identifies your device on local networks.</span>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'account' && (
            <div className={styles.sectionBody}>
              <h2 className={styles.sectionTitle}>User Account</h2>
              <div className={styles.settingGroup}>
                <div className={styles.profileDetails}>
                  <div className={styles.profileItem}>
                    <span className={styles.profileLabel}>Profile Name</span>
                    <span className={styles.profileVal}>Sarah Jenkins</span>
                  </div>
                  <div className={styles.profileItem}>
                    <span className={styles.profileLabel}>Account Privilege</span>
                    <span className={styles.profileVal}>System Administrator</span>
                  </div>
                  <div className={styles.profileItem}>
                    <span className={styles.profileLabel}>Primary Directory</span>
                    <span className={styles.profileVal}>/users/sarah/</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
