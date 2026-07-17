import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDesktop } from '../../context/DesktopContext';
import { useToast, useConfirm } from '@/context/FeedbackContext';
import { IconCheck, IconColorWheel, IconFileImage, IconUpload, IconDelete, IconMonitor, IconSettings, IconProfile, IconUser } from '@/assets/icons';
import ButtonGroup from '@/components/ButtonGroup/ButtonGroup';
import './SettingsPage.css';
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
    <div className="container">
      <header className="header">
        <h1 className="title">System Settings</h1>
        <p className="subtitle">Configure preferences and user customization options</p>
      </header>

      <div className="layout">
        <aside className="sidebar">
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

        <main className="contentPane">
          {/* ── Appearance ─────────────────────────────────────────────── */}
          {activeSection === 'appearance' && (
            <div className="sectionBody">
              <h2 className="sectionTitle">Desktop Wallpaper</h2>
              <div className="wallpaperGrid">
                {wallpapers.map((wp) => (
                  <button
                    key={wp.id}
                    className={`wallpaperCard ${activeWallpaper === wp.id ? 'wallpaperActive' : ''}`}
                    onClick={() => handleWallpaperChange(wp.id)}
                    title={wp.name}
                  >
                    <div
                      className={`wallpaperPreview ${wp.id === 'default' ? 'wallpaperPreviewDefault' : ''}`}
                      style={wp.id !== 'default' ? { background: wp.value } : undefined}
                    />
                    <div className="wallpaperName">
                      {activeWallpaper === wp.id && (
                        <IconCheck className="wallpaperCheck" />
                      )}
                      <span>{wp.name}</span>
                    </div>
                  </button>
                ))}
              </div>

              <h2 className="sectionTitle">Custom Background</h2>
              <div className="customBgSection">
                <div className="customBgRow">
                  <div className="customBgLabel">
                    <IconColorWheel className="customBgIcon" />
                    <span>Solid Color</span>
                  </div>
                  <div className="colorPickerRow">
                    <div className="colorPreviewWrap">
                      <div
                        className="colorPreviewBox"
                        style={{ backgroundColor: customColor }}
                      />
                      <input
                        type="color"
                        className="colorInput"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        aria-label="Pick a desktop background color"
                      />
                    </div>
                    <button
                      className="applyBtn"
                      onClick={handleColorApply}
                    >
                      Apply Color
                    </button>
                  </div>
                </div>

                <div className="dividerLine" />

                <div className="customBgRow">
                  <div className="customBgLabel">
                    <IconFileImage className="customBgIcon" />
                    <span>Upload Image</span>
                  </div>
                  <div className="uploadRow">
                    <button
                      className="uploadBtn"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <IconUpload className="uploadBtnIcon" />
                      {customPreview ? 'Change Image' : 'Choose Image'}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="fileInput"
                      onChange={handleImageUpload}
                      aria-label="Upload an image for desktop background"
                    />
                    {customPreview && (
                      <div className="uploadPreview">
                        <img src={customPreview} alt="Custom desktop background preview" className="uploadPreviewImg" />
                      </div>
                    )}
                  </div>
                </div>

                {activeWallpaper === 'custom' && (
                  <div className="customActiveBadge">
                    <IconCheck className="customActiveBadgeIcon" />
                    Custom background is active
                  </div>
                )}
              </div>

              <h2 className="sectionTitle">Display Preferences</h2>
              <div className="settingGroup">
                <div className="settingRow">
                  <div className="settingText">
                    <div className="settingLabel">Dark Mode</div>
                    <div className="settingDesc">Use dark styles across all system UI.</div>
                  </div>
                  <button
                    className={`toggle ${darkMode ? 'toggleOn' : ''}`}
                    onClick={() => setDarkMode(!darkMode)}
                    aria-label="Toggle Dark Mode"
                  >
                    <span className="toggleKnob" />
                  </button>
                </div>

                <div className="settingRow">
                  <div className="settingText">
                    <div className="settingLabel">System Animations</div>
                    <div className="settingDesc">Enable transitions and active micro-animations.</div>
                  </div>
                  <button
                    className={`toggle ${animations ? 'toggleOn' : ''}`}
                    onClick={() => setAnimations(!animations)}
                    aria-label="Toggle Animations"
                  >
                    <span className="toggleKnob" />
                  </button>
                </div>

                <div className="settingRow">
                  <div className="settingText">
                    <div className="settingLabel">Show Desktop Icons</div>
                    <div className="settingDesc">Display recently opened app icons on the desktop.</div>
                  </div>
                  <button
                    className={`toggle ${showIcons ? 'toggleOn' : ''}`}
                    onClick={() => setShowIcons(!showIcons)}
                    aria-label="Toggle Desktop Icons"
                  >
                    <span className="toggleKnob" />
                  </button>
                </div>

                <div className="settingRow">
                  <div className="settingText">
                    <div className="settingLabel">Show Recent Apps</div>
                    <div className="settingDesc">Show recently used applications in the menu bar.</div>
                  </div>
                  <button
                    className={`toggle ${showRecentApps ? 'toggleOn' : ''}`}
                    onClick={() => setShowRecentApps(!showRecentApps)}
                    aria-label="Toggle Recent Apps"
                  >
                    <span className="toggleKnob" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── System ─────────────────────────────────────────────────── */}
          {activeSection === 'system' && (
            <div className="sectionBody">
              <h2 className="sectionTitle">System Details</h2>
              <div className="settingGroup">
                <div className="settingCol">
                  <label htmlFor="hostname-input" className="inputLabel">Device Hostname</label>
                  <div className="hostnameRow">
                    <input
                      id="hostname-input"
                      type="text"
                      value={hostname}
                      onChange={(e) => setHostname(e.target.value)}
                      className="textField"
                    />
                    <button
                      className="applySmallBtn"
                      onClick={async () => {
                        await addActionToast(`Hostname changed to "${hostname}"`, 'info', 'settings');
                        addToast({ message: 'Hostname updated', type: 'success' });
                      }}
                    >
                      Update
                    </button>
                  </div>
                  <span className="inputHelp">This hostname identifies your device on local networks.</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Account ────────────────────────────────────────────────── */}
          {activeSection === 'account' && (
            <div className="sectionBody">
              <h2 className="sectionTitle">User Account</h2>
              <div className="settingGroup">
                <div className="profileDetails">
                  <div className="profileItem">
                    <span className="profileLabel">Profile Name</span>
                    <span className="profileVal">{currentUser?.displayName || '—'}</span>
                  </div>
                  <div className="profileItem">
                    <span className="profileLabel">Username</span>
                    <span className="profileVal">@{currentUser?.username || '—'}</span>
                  </div>
                  <div className="profileItem">
                    <span className="profileLabel">Email</span>
                    <span className="profileVal">{currentUser?.email || '—'}</span>
                  </div>
                  <div className="profileItem">
                    <span className="profileLabel">Account Privilege</span>
                    <span className="profileVal">{currentUser?.role || '—'}</span>
                  </div>
                  <div className="profileItem">
                    <span className="profileLabel">Member Since</span>
                    <span className="profileVal">{currentUser?.createdAt ? formatDate(currentUser.createdAt) : '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Users ──────────────────────────────────────────────────── */}
          {activeSection === 'users' && (
            <div className="sectionBody">
              <div className="usersHeader">
                <h2 className="sectionTitle">User Management</h2>
                <span className="userCount">{users.length} registered user{users.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="userTable">
                <div className="userTableHead">
                  <span className="userColUser">User</span>
                  <span className="userColRole">Role</span>
                  <span className="userColDate">Created</span>
                  <span className="userColAction">Action</span>
                </div>
                {users.map((user) => {
                  const isCurrentUser = user.id === currentUser?.id;
                  return (
                    <div key={user.id} className={`userRow ${isCurrentUser ? 'userRowCurrent' : ''}`}>
                      <div className="userCellUser">
                        <div className="userAvatar">
                          {user.displayName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="userInfo">
                          <div className="userDisplayName">
                            {user.displayName}
                            {isCurrentUser && <span className="youBadge">You</span>}
                          </div>
                          <div className="userUsername">@{user.username}</div>
                        </div>
                      </div>
                      <div className="userCellRole">
                        <span className={`roleBadge ${user.role === 'System Administrator' ? 'roleAdmin' : 'roleStandard'}`}>
                          {user.role}
                        </span>
                      </div>
                      <div className="userCellDate">{formatDate(user.createdAt)}</div>
                      <div className="userCellAction">
                        <button
                          className="deleteBtn"
                          onClick={() => handleDeleteUser(user)}
                          disabled={isCurrentUser || deletingUserId === user.id}
                          title={isCurrentUser ? 'Cannot delete your own account' : `Delete ${user.displayName}`}
                        >
                          {deletingUserId === user.id ? (
                            <span className="deleteSpinner" />
                          ) : (
                            <IconDelete className="deleteIcon" />
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
