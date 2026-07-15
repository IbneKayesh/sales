import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast, useConfirm } from '@/context/FeedbackContext';
import { fmtDateLong } from '@/utils/dataFormat';
import { IconEyeOpen, IconEyeOff, IconCamera, IconSave, IconUnlock } from '@/assets/icons';
import Avatar from '../../components/Avatar/Avatar';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const { currentUser, updateProfile, changePassword, defaultAvatarImg } = useAuth();
  const { addToast } = useToast();
  const { confirmWithAction } = useConfirm();

  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const fileInputRef = useRef(null);

  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      addToast({ message: 'Display name cannot be empty', type: 'warning' });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    updateProfile({ displayName: displayName.trim(), email: email.trim(), bio: bio.trim() });
    setSaving(false);
    addToast({ message: 'Profile updated successfully', type: 'success' });
  };

  const handleChangePassword = async () => {
    if (!currentPw || !newPw || !confirmPw) {
      addToast({ message: 'Please fill in all password fields', type: 'warning' });
      return;
    }
    if (newPw.length < 6) {
      addToast({ message: 'New password must be at least 6 characters', type: 'warning' });
      return;
    }
    if (newPw !== confirmPw) {
      addToast({ message: 'New passwords do not match', type: 'error' });
      return;
    }

    await confirmWithAction(
      'Change Password',
      'Are you sure you want to change your password? You will be logged out of all active sessions.',
      async () => {
        setChangingPw(true);
        try {
          await changePassword(currentPw, newPw);
          addToast({ message: 'Password changed successfully', type: 'success' });
          setCurrentPw('');
          setNewPw('');
          setConfirmPw('');
        } catch (err) {
          addToast({ message: err.message, type: 'error' });
        }
        setChangingPw(false);
      },
      { confirmLabel: 'Change Password', windowId: 'profile' }
    );
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result;
      if (typeof dataUrl === 'string') {
        setAvatarPreview(dataUrl);
        updateProfile({ avatar: dataUrl });
        addToast({ message: 'Avatar updated', type: 'success' });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const avatarSrc = avatarPreview || currentUser?.avatar || defaultAvatarImg;

  const PwToggle = ({ field }) => (
    <button
      type="button"
      className={styles.pwToggle}
      onClick={() => setShowPw((p) => ({ ...p, [field]: !p[field] }))}
      tabIndex={-1}
    >
      {showPw[field] ? <IconEyeOff className={styles.pwToggleIcon} /> : <IconEyeOpen className={styles.pwToggleIcon} />}
    </button>
  );

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        {/* ── Avatar Column ───────────────────────────────────────── */}
        <div className={styles.avatarColumn}>
          <div className={styles.avatarWrap}>
            <Avatar src={avatarSrc} alt={currentUser?.displayName || 'User'} size="xlarge" />
            <button className={styles.avatarOverlay} onClick={() => fileInputRef.current?.click()} title="Change avatar">
              <IconCamera className={styles.cameraIcon} />
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className={styles.fileInput} onChange={handleAvatarChange} />
          <span className={styles.avatarHint}>Click to change photo</span>
          <div className={styles.roleBadge}>
            {currentUser?.role || 'User'}
          </div>
        </div>

        {/* ── Profile Fields ──────────────────────────────────────── */}
        <div className={styles.fieldsColumn}>
          <h1 className={styles.title}>Profile Settings</h1>
          <p className={styles.subtitle}>Manage your personal information and security</p>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Personal Information</h2>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Display Name</label>
                <input
                  type="text"
                  className={styles.fieldInput}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your display name"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Username</label>
                <input
                  type="text"
                  className={`${styles.fieldInput} ${styles.fieldDisabled}`}
                  value={`@${currentUser?.username || ''}`}
                  disabled
                />
                <span className={styles.fieldHint}>Username cannot be changed</span>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Email Address</label>
                <input
                  type="email"
                  className={styles.fieldInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label className={styles.fieldLabel}>Bio</label>
                <textarea
                  className={styles.fieldTextarea}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a short bio..."
                  rows={3}
                />
              </div>
            </div>

            <button
              className={styles.saveBtn}
              onClick={handleSaveProfile}
              disabled={saving}
            >
              {saving ? (
                <><span className={styles.btnSpinner} /> Saving...</>
              ) : (
                <><IconSave className={styles.saveIcon} /> Save Changes</>
              )}
            </button>
          </div>

          {/* ── Change Password ───────────────────────────────────── */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Change Password</h2>
            <p className={styles.sectionDesc}>Enter your current password and a new password.</p>

            <div className={styles.pwFields}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Current Password</label>
                <div className={styles.pwInputWrap}>
                  <input
                    type={showPw.current ? 'text' : 'password'}
                    className={styles.fieldInput}
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    placeholder="Enter current password"
                    autoComplete="current-password"
                  />
                  <PwToggle field="current" />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>New Password</label>
                <div className={styles.pwInputWrap}>
                  <input
                    type={showPw.new ? 'text' : 'password'}
                    className={styles.fieldInput}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="Min 6 characters"
                    autoComplete="new-password"
                  />
                  <PwToggle field="new" />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Confirm New Password</label>
                <div className={styles.pwInputWrap}>
                  <input
                    type={showPw.confirm ? 'text' : 'password'}
                    className={styles.fieldInput}
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    placeholder="Re-enter new password"
                    autoComplete="new-password"
                  />
                  <PwToggle field="confirm" />
                </div>
              </div>
            </div>

            <button
              className={`${styles.saveBtn} ${styles.pwBtn}`}
              onClick={handleChangePassword}
              disabled={changingPw}
            >
              {changingPw ? (
                <><span className={styles.btnSpinner} /> Changing...</>
              ) : (
                <><IconUnlock className={styles.saveIcon} /> Change Password</>
              )}
            </button>
          </div>

          {/* ── Account Info ──────────────────────────────────────── */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Account Info</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Role</span>
                <span className={styles.infoValue}>{currentUser?.role || '—'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Member Since</span>
                <span className={styles.infoValue}>
                  {fmtDateLong(currentUser.createdAt) || '—'}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>User ID</span>
                <span className={`${styles.infoValue} ${styles.infoMono}`}>{currentUser?.id || '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
