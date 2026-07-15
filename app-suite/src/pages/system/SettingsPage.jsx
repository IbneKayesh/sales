import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDesktop } from '../../context/DesktopContext';
import { useToast, useConfirm } from '@/context/FeedbackContext';
import { IconCheck, IconColorWheel, IconFileImage, IconUpload, IconDelete, IconMonitor, IconSettings, IconProfile, IconUser } from '@/assets/icons';
import ButtonGroup from '@/components/ButtonGroup/ButtonGroup';
import styles from './SettingsPage.module.css';

const sections = [
  { id: 'appearance', label: 'Appearance', icon: <IconMonitor /> },
  { id: 'system', label: 'System', icon: <IconSettings /> },
  { id: 'account', label: 'Account', icon: <IconProfile /> },
  { id: 'users', label: 'Users', icon: <IconUser /> },
];

const SettingsPage = () => {
  const { currentUser, users, deleteUser } = useAuth();
  const {
    wallpapers,
    activeWallpaper,
    setActiveWallpaper,
    customWallpaper,
    setCustomWallpaper,
    darkMode,
    setDarkMode,
    animations,
    setAnimations,
    showIcons,
    setShowIcons,
    showRecentApps,
    setShowRecentApps,
  } = useDesktop();
  const { addToast, addActionToast } = useToast();
  const { confirmWithAction } = useConfirm();

  const [deletingUserId, setDeletingUserId] = useState(null);
  const [activeSection, setActiveSection] = useState('appearance');
  const [hostname, setHostname] = useState('Sarah-OS-Workstation');

  const handleDeleteUser = async (targetUser) => {
    if (targetUser.id === currentUser?.id) {
      addToast({ message: 'You cannot delete your own account from here', type: 'warning' });
      return;
    }

    await confirmWithAction(
      'Delete User',
      `Are you sure you want to permanently delete the user "${targetUser.displayName}" (@${targetUser.username})? All data associated with this account will be removed.`,
      async () => {
        setDeletingUserId(targetUser.id);
        await new Promise((resolve) => setTimeout(resolve, 500));
        const success = deleteUser(targetUser.id);
        setDeletingUserId(null);
        if (success) {
          addToast({ message: `User "${targetUser.displayName}" has been deleted`, type: 'success' });
        }
      },
      { confirmLabel: 'Delete User', danger: true, windowId: 'settings' }
    );
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  const fileInputRef = React.useRef(null);
  const [customColor, setCustomColor] = useState('#1a1a2e');
  const [customPreview, setCustomPreview] = useState(null);

  const handleWallpaperChange = (id) => {
    if (id === activeWallpaper) return;
    setActiveWallpaper(id);
  };

  const handleColorApply = () => {
    setCustomWallpaper(customColor);
    addToast({ message: 'Custom color applied as desktop background', type: 'success' });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result;
      if (typeof dataUrl === 'string') {
        setCustomPreview(dataUrl);
        setCustomWallpaper(`url('${dataUrl}')`);
        addToast({ message: 'Custom image applied as desktop background', type: 'success' });
      }
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>System Settings</h1>
        <p className={styles.subtitle}>Configure preferences and user customization options</p>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <ButtonGroup
            buttons={sections.map((s) => ({ id: s.id, label: s.label, icon: s.icon }))}
            activeId={activeSection}
            onChange={setActiveSection}
            size="md"
            variant="ghost"
            direction="vertical"
            ariaLabel="Settings Categories"
          />
        </aside>

        <main className={styles.contentPane}>
          {/* ── Appearance ─────────────────────────────────────────────── */}
          {activeSection === 'appearance' && (
            <div className={styles.sectionBody}>
              <h2 className={styles.sectionTitle}>Desktop Wallpaper</h2>
              <div className={styles.wallpaperGrid}>
                {wallpapers.map((wp) => (
                  <button
                    key={wp.id}
                    className={`${styles.wallpaperCard} ${activeWallpaper === wp.id ? styles.wallpaperActive : ''}`}
                    onClick={() => handleWallpaperChange(wp.id)}
                    title={wp.name}
                  >
                    <div
                      className={`${styles.wallpaperPreview} ${wp.id === 'default' ? styles.wallpaperPreviewDefault : ''}`}
                      style={wp.id !== 'default' ? { background: wp.value } : undefined}
                    />
                    <div className={styles.wallpaperName}>
                      {activeWallpaper === wp.id && (
                        <IconCheck className={styles.wallpaperCheck} />
                      )}
                      <span>{wp.name}</span>
                    </div>
                  </button>
                ))}
              </div>

              <h2 className={styles.sectionTitle}>Custom Background</h2>
              <div className={styles.customBgSection}>
                <div className={styles.customBgRow}>
                  <div className={styles.customBgLabel}>
                    <IconColorWheel className={styles.customBgIcon} />
                    <span>Solid Color</span>
                  </div>
                  <div className={styles.colorPickerRow}>
                    <div className={styles.colorPreviewWrap}>
                      <div
                        className={styles.colorPreviewBox}
                        style={{ backgroundColor: customColor }}
                      />
                      <input
                        type="color"
                        className={styles.colorInput}
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        aria-label="Pick a desktop background color"
                      />
                    </div>
                    <button
                      className={styles.applyBtn}
                      onClick={handleColorApply}
                    >
                      Apply Color
                    </button>
                  </div>
                </div>

                <div className={styles.dividerLine} />

                <div className={styles.customBgRow}>
                  <div className={styles.customBgLabel}>
                    <IconFileImage className={styles.customBgIcon} />
                    <span>Upload Image</span>
                  </div>
                  <div className={styles.uploadRow}>
                    <button
                      className={styles.uploadBtn}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <IconUpload className={styles.uploadBtnIcon} />
                      {customPreview ? 'Change Image' : 'Choose Image'}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className={styles.fileInput}
                      onChange={handleImageUpload}
                      aria-label="Upload an image for desktop background"
                    />
                    {customPreview && (
                      <div className={styles.uploadPreview}>
                        <img src={customPreview} alt="Custom desktop background preview" className={styles.uploadPreviewImg} />
                      </div>
                    )}
                  </div>
                </div>

                {activeWallpaper === 'custom' && (
                  <div className={styles.customActiveBadge}>
                    <IconCheck className={styles.customActiveBadgeIcon} />
                    Custom background is active
                  </div>
                )}
              </div>

              <h2 className={styles.sectionTitle}>Display Preferences</h2>
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

                <div className={styles.settingRow}>
                  <div className={styles.settingText}>
                    <div className={styles.settingLabel}>Show Desktop Icons</div>
                    <div className={styles.settingDesc}>Display recently opened app icons on the desktop.</div>
                  </div>
                  <button
                    className={`${styles.toggle} ${showIcons ? styles.toggleOn : ''}`}
                    onClick={() => setShowIcons(!showIcons)}
                    aria-label="Toggle Desktop Icons"
                  >
                    <span className={styles.toggleKnob} />
                  </button>
                </div>

                <div className={styles.settingRow}>
                  <div className={styles.settingText}>
                    <div className={styles.settingLabel}>Show Recent Apps</div>
                    <div className={styles.settingDesc}>Show recently used applications in the menu bar.</div>
                  </div>
                  <button
                    className={`${styles.toggle} ${showRecentApps ? styles.toggleOn : ''}`}
                    onClick={() => setShowRecentApps(!showRecentApps)}
                    aria-label="Toggle Recent Apps"
                  >
                    <span className={styles.toggleKnob} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── System ─────────────────────────────────────────────────── */}
          {activeSection === 'system' && (
            <div className={styles.sectionBody}>
              <h2 className={styles.sectionTitle}>System Details</h2>
              <div className={styles.settingGroup}>
                <div className={styles.settingCol}>
                  <label htmlFor="hostname-input" className={styles.inputLabel}>Device Hostname</label>
                  <div className={styles.hostnameRow}>
                    <input
                      id="hostname-input"
                      type="text"
                      value={hostname}
                      onChange={(e) => setHostname(e.target.value)}
                      className={styles.textField}
                    />
                    <button
                      className={styles.applySmallBtn}
                      onClick={async () => {
                        await addActionToast(`Hostname changed to "${hostname}"`, 'info', 'settings');
                        addToast({ message: 'Hostname updated', type: 'success' });
                      }}
                    >
                      Update
                    </button>
                  </div>
                  <span className={styles.inputHelp}>This hostname identifies your device on local networks.</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Account ────────────────────────────────────────────────── */}
          {activeSection === 'account' && (
            <div className={styles.sectionBody}>
              <h2 className={styles.sectionTitle}>User Account</h2>
              <div className={styles.settingGroup}>
                <div className={styles.profileDetails}>
                  <div className={styles.profileItem}>
                    <span className={styles.profileLabel}>Profile Name</span>
                    <span className={styles.profileVal}>{currentUser?.displayName || '—'}</span>
                  </div>
                  <div className={styles.profileItem}>
                    <span className={styles.profileLabel}>Username</span>
                    <span className={styles.profileVal}>@{currentUser?.username || '—'}</span>
                  </div>
                  <div className={styles.profileItem}>
                    <span className={styles.profileLabel}>Email</span>
                    <span className={styles.profileVal}>{currentUser?.email || '—'}</span>
                  </div>
                  <div className={styles.profileItem}>
                    <span className={styles.profileLabel}>Account Privilege</span>
                    <span className={styles.profileVal}>{currentUser?.role || '—'}</span>
                  </div>
                  <div className={styles.profileItem}>
                    <span className={styles.profileLabel}>Member Since</span>
                    <span className={styles.profileVal}>{currentUser?.createdAt ? formatDate(currentUser.createdAt) : '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Users ──────────────────────────────────────────────────── */}
          {activeSection === 'users' && (
            <div className={styles.sectionBody}>
              <div className={styles.usersHeader}>
                <h2 className={styles.sectionTitle}>User Management</h2>
                <span className={styles.userCount}>{users.length} registered user{users.length !== 1 ? 's' : ''}</span>
              </div>
              <div className={styles.userTable}>
                <div className={styles.userTableHead}>
                  <span className={styles.userColUser}>User</span>
                  <span className={styles.userColRole}>Role</span>
                  <span className={styles.userColDate}>Created</span>
                  <span className={styles.userColAction}>Action</span>
                </div>
                {users.map((user) => {
                  const isCurrentUser = user.id === currentUser?.id;
                  return (
                    <div key={user.id} className={`${styles.userRow} ${isCurrentUser ? styles.userRowCurrent : ''}`}>
                      <div className={styles.userCellUser}>
                        <div className={styles.userAvatar}>
                          {user.displayName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className={styles.userInfo}>
                          <div className={styles.userDisplayName}>
                            {user.displayName}
                            {isCurrentUser && <span className={styles.youBadge}>You</span>}
                          </div>
                          <div className={styles.userUsername}>@{user.username}</div>
                        </div>
                      </div>
                      <div className={styles.userCellRole}>
                        <span className={`${styles.roleBadge} ${user.role === 'System Administrator' ? styles.roleAdmin : styles.roleStandard}`}>
                          {user.role}
                        </span>
                      </div>
                      <div className={styles.userCellDate}>{formatDate(user.createdAt)}</div>
                      <div className={styles.userCellAction}>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDeleteUser(user)}
                          disabled={isCurrentUser || deletingUserId === user.id}
                          title={isCurrentUser ? 'Cannot delete your own account' : `Delete ${user.displayName}`}
                        >
                          {deletingUserId === user.id ? (
                            <span className={styles.deleteSpinner} />
                          ) : (
                            <IconDelete className={styles.deleteIcon} />
                          )}
                          {deletingUserId === user.id ? 'Deleting' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
